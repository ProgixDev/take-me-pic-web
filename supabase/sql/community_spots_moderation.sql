-- Web admin SQL artifact: community content soft-hide and spot review
-- lifecycle (TASK-007, ADR-0005, ADR-0006). Applied remotely as migration
-- `community_spots_moderation` on 2026-06-11.
--
-- 1. posts/comments gain hidden_at/hidden_by; read policies exclude hidden
--    rows for everyone except the author and staff.
-- 2. spots gain a pending|approved|rejected review lifecycle; read policy
--    shows only approved spots to the community.
-- 3. All staff writes go through SECURITY DEFINER RPCs that verify
--    private.is_staff() and write public.admin_audit_log in the same
--    transaction (per ADR-0003).
--
-- Tables were empty at apply time, so no backfill was needed; if rows exist
-- when re-applying elsewhere, approve pre-existing spots first.

-- 1. Community content soft-hide (ADR-0005) ---------------------------------

alter table public.posts
  add column if not exists hidden_at timestamptz,
  add column if not exists hidden_by uuid references public.profiles(id) on delete set null;

alter table public.comments
  add column if not exists hidden_at timestamptz,
  add column if not exists hidden_by uuid references public.profiles(id) on delete set null;

drop policy if exists posts_read on public.posts;
create policy posts_read
  on public.posts
  for select
  to authenticated
  using (
    hidden_at is null
    or author_id = (select auth.uid())
    or (select private.is_staff())
  );

drop policy if exists comments_read on public.comments;
create policy comments_read
  on public.comments
  for select
  to authenticated
  using (
    hidden_at is null
    or author_id = (select auth.uid())
    or (select private.is_staff())
  );

-- 2. Spot review lifecycle (ADR-0006) ----------------------------------------

do $$
begin
  if not exists (select 1 from pg_type where typname = 'spot_status') then
    create type public.spot_status as enum ('pending', 'approved', 'rejected');
  end if;
end;
$$;

alter table public.spots
  add column if not exists status public.spot_status not null default 'pending',
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references public.profiles(id) on delete set null;

drop policy if exists spots_read on public.spots;
create policy spots_read
  on public.spots
  for select
  to authenticated
  using (
    status = 'approved'
    or created_by = (select auth.uid())
    or (select private.is_staff())
  );

-- 3. Staff-only audited RPCs --------------------------------------------------

create or replace function public.admin_set_post_visibility(
  target_post_id bigint,
  hide boolean,
  reason text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_hidden_at timestamptz;
  post_exists boolean;
begin
  if not (select private.is_staff()) then
    raise exception 'unauthorized moderation mutation'
      using errcode = '42501';
  end if;

  select true, p.hidden_at into post_exists, current_hidden_at
  from public.posts p
  where p.id = target_post_id
  for update;

  if post_exists is null then
    raise exception 'post not found'
      using errcode = 'P0002';
  end if;

  if hide and current_hidden_at is not null then
    raise exception 'post is already hidden'
      using errcode = 'P0001';
  end if;

  if not hide and current_hidden_at is null then
    raise exception 'post is already visible'
      using errcode = 'P0001';
  end if;

  update public.posts
  set
    hidden_at = case when hide then now() else null end,
    hidden_by = case when hide then (select auth.uid()) else null end
  where id = target_post_id;

  insert into public.admin_audit_log (admin_id, action, target_type, target_id, detail)
  values (
    (select auth.uid()),
    'post_visibility_update',
    'post',
    target_post_id::text,
    jsonb_build_object(
      'to', case when hide then 'hidden' else 'visible' end,
      'reason', nullif(btrim(coalesce(reason, '')), '')
    )
  );
end;
$$;

revoke execute on function public.admin_set_post_visibility(bigint, boolean, text) from public, anon;
grant execute on function public.admin_set_post_visibility(bigint, boolean, text) to authenticated;

create or replace function public.admin_set_comment_visibility(
  target_comment_id bigint,
  hide boolean,
  reason text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_hidden_at timestamptz;
  comment_exists boolean;
begin
  if not (select private.is_staff()) then
    raise exception 'unauthorized moderation mutation'
      using errcode = '42501';
  end if;

  select true, c.hidden_at into comment_exists, current_hidden_at
  from public.comments c
  where c.id = target_comment_id
  for update;

  if comment_exists is null then
    raise exception 'comment not found'
      using errcode = 'P0002';
  end if;

  if hide and current_hidden_at is not null then
    raise exception 'comment is already hidden'
      using errcode = 'P0001';
  end if;

  if not hide and current_hidden_at is null then
    raise exception 'comment is already visible'
      using errcode = 'P0001';
  end if;

  update public.comments
  set
    hidden_at = case when hide then now() else null end,
    hidden_by = case when hide then (select auth.uid()) else null end
  where id = target_comment_id;

  insert into public.admin_audit_log (admin_id, action, target_type, target_id, detail)
  values (
    (select auth.uid()),
    'comment_visibility_update',
    'comment',
    target_comment_id::text,
    jsonb_build_object(
      'to', case when hide then 'hidden' else 'visible' end,
      'reason', nullif(btrim(coalesce(reason, '')), '')
    )
  );
end;
$$;

revoke execute on function public.admin_set_comment_visibility(bigint, boolean, text) from public, anon;
grant execute on function public.admin_set_comment_visibility(bigint, boolean, text) to authenticated;

create or replace function public.admin_review_spot(
  target_spot_id bigint,
  decision text,
  reason text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_status text;
begin
  if not (select private.is_staff()) then
    raise exception 'unauthorized moderation mutation'
      using errcode = '42501';
  end if;

  if decision not in ('approved', 'rejected') then
    raise exception 'invalid spot decision %', decision
      using errcode = '22023';
  end if;

  select s.status into current_status
  from public.spots s
  where s.id = target_spot_id
  for update;

  if current_status is null then
    raise exception 'spot not found'
      using errcode = 'P0002';
  end if;

  if current_status = decision then
    raise exception 'spot is already %', decision
      using errcode = 'P0001';
  end if;

  update public.spots
  set
    status = decision::public.spot_status,
    reviewed_at = now(),
    reviewed_by = (select auth.uid())
  where id = target_spot_id;

  insert into public.admin_audit_log (admin_id, action, target_type, target_id, detail)
  values (
    (select auth.uid()),
    'spot_review',
    'spot',
    target_spot_id::text,
    jsonb_build_object(
      'from', current_status,
      'to', decision,
      'reason', nullif(btrim(coalesce(reason, '')), '')
    )
  );
end;
$$;

revoke execute on function public.admin_review_spot(bigint, text, text) from public, anon;
grant execute on function public.admin_review_spot(bigint, text, text) to authenticated;
