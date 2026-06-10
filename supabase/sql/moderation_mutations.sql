-- Web admin SQL artifact: staff-only moderation mutations.
-- Supabase CLI is not available in this repo, so this file is intentionally
-- reviewable SQL to apply through the dashboard or convert into a migration.
--
-- Every mutation runs as a single transaction-safe RPC that:
--   1. verifies the caller is staff via private.is_staff(),
--   2. applies the mutation,
--   3. writes a matching public.admin_audit_log row.

create or replace function public.admin_update_report_status(
  target_report_id bigint,
  new_status text
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

  if new_status not in ('reviewing', 'resolved', 'dismissed') then
    raise exception 'invalid report status %', new_status
      using errcode = '22023';
  end if;

  select r.status into current_status
  from public.reports r
  where r.id = target_report_id
  for update;

  if current_status is null then
    raise exception 'report not found'
      using errcode = 'P0002';
  end if;

  update public.reports
  set
    -- reports.status is the enum public.report_status; the text parameter
    -- needs an explicit cast for the assignment.
    status = new_status::public.report_status,
    resolver_id = case when new_status in ('resolved', 'dismissed') then (select auth.uid()) else null end,
    resolved_at = case when new_status in ('resolved', 'dismissed') then now() else null end
  where id = target_report_id;

  insert into public.admin_audit_log (admin_id, action, target_type, target_id, detail)
  values (
    (select auth.uid()),
    'report_status_update',
    'report',
    target_report_id::text,
    jsonb_build_object('from', current_status, 'to', new_status)
  );
end;
$$;

revoke execute on function public.admin_update_report_status(bigint, text) from public, anon;
grant execute on function public.admin_update_report_status(bigint, text) to authenticated;

create or replace function public.admin_ban_user(
  target_user_id uuid,
  ban_reason text,
  ban_expires_at timestamptz default null,
  source_report_id bigint default null
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_ban_id bigint;
begin
  if not (select private.is_staff()) then
    raise exception 'unauthorized moderation mutation'
      using errcode = '42501';
  end if;

  if ban_reason is null or length(btrim(ban_reason)) = 0 then
    raise exception 'ban reason is required'
      using errcode = '22023';
  end if;

  if exists (
    select 1
    from public.bans b
    where b.user_id = target_user_id
      and (b.expires_at is null or b.expires_at > now())
  ) then
    raise exception 'user already has an active ban'
      using errcode = 'P0001';
  end if;

  insert into public.bans (user_id, reason, banned_by, expires_at)
  values (target_user_id, btrim(ban_reason), (select auth.uid()), ban_expires_at)
  returning id into new_ban_id;

  insert into public.admin_audit_log (admin_id, action, target_type, target_id, detail)
  values (
    (select auth.uid()),
    'user_ban',
    'user',
    target_user_id::text,
    jsonb_build_object(
      'ban_id', new_ban_id,
      'reason', btrim(ban_reason),
      'expires_at', ban_expires_at,
      'source_report_id', source_report_id
    )
  );

  return new_ban_id;
end;
$$;

revoke execute on function public.admin_ban_user(uuid, text, timestamptz, bigint) from public, anon;
grant execute on function public.admin_ban_user(uuid, text, timestamptz, bigint) to authenticated;

create or replace function public.admin_unban_user(target_ban_id bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  banned_user_id uuid;
  ban_expires_at timestamptz;
begin
  if not (select private.is_staff()) then
    raise exception 'unauthorized moderation mutation'
      using errcode = '42501';
  end if;

  select b.user_id, b.expires_at into banned_user_id, ban_expires_at
  from public.bans b
  where b.id = target_ban_id
  for update;

  if banned_user_id is null then
    raise exception 'ban not found'
      using errcode = 'P0002';
  end if;

  if ban_expires_at is not null and ban_expires_at <= now() then
    raise exception 'ban is already expired'
      using errcode = 'P0001';
  end if;

  -- Unban expires the ban instead of deleting it so moderation history stays
  -- auditable.
  update public.bans
  set expires_at = now()
  where id = target_ban_id;

  insert into public.admin_audit_log (admin_id, action, target_type, target_id, detail)
  values (
    (select auth.uid()),
    'user_unban',
    'user',
    banned_user_id::text,
    jsonb_build_object('ban_id', target_ban_id)
  );
end;
$$;

revoke execute on function public.admin_unban_user(bigint) from public, anon;
grant execute on function public.admin_unban_user(bigint) to authenticated;
