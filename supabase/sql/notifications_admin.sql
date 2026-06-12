-- Web admin SQL artifact: staff notification operations (TASK-008).
-- Applied remotely as migration `notifications_admin` on 2026-06-12.
--
-- 1. Staff read every user's notifications. Bodies are non-sensitive by
--    design — mobile migration 0009 guarantees generated text only (no
--    message content, no precise location), so this is operational data
--    under the ADR-0004 pattern (plain RLS policy, not an RPC).
-- 2. Staff sends reuse private.notify_user (mobile 0009) through an audited
--    SECURITY DEFINER RPC, so the canonical in-app row and the push fan-out
--    stay one code path (ADR-0007). Single-target, kind 'system'.
-- 3. Push token counts come from an aggregate-only RPC: raw tokens are
--    delivery credentials and never reach the admin.

-- 1. Staff read on notifications ---------------------------------------------

create policy notifications_staff_read
  on public.notifications
  for select
  to authenticated
  using ((select private.is_staff()));

-- 2. Audited staff send -------------------------------------------------------

create or replace function public.admin_send_notification(
  target_user_id uuid,
  message text,
  push_title text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  trimmed_message text := btrim(coalesce(message, ''));
  trimmed_title text := nullif(btrim(coalesce(push_title, '')), '');
begin
  if not (select private.is_staff()) then
    raise exception 'unauthorized moderation mutation'
      using errcode = '42501';
  end if;

  if length(trimmed_message) = 0 or length(trimmed_message) > 320 then
    raise exception 'message must be 1-320 characters'
      using errcode = '22023';
  end if;

  if not exists (select 1 from public.profiles p where p.id = target_user_id) then
    raise exception 'target profile not found'
      using errcode = 'P0002';
  end if;

  perform private.notify_user(
    target_user_id,
    'system'::public.notification_kind,
    trimmed_message,
    'normal',
    coalesce(trimmed_title, 'Take Me Pic'),
    trimmed_message,
    jsonb_build_object('type', 'admin_message')
  );

  insert into public.admin_audit_log (admin_id, action, target_type, target_id, detail)
  values (
    (select auth.uid()),
    'notification_send',
    'user',
    target_user_id::text,
    jsonb_build_object('message', trimmed_message, 'push_title', trimmed_title)
  );
end;
$$;

revoke execute on function public.admin_send_notification(uuid, text, text) from public, anon;
grant execute on function public.admin_send_notification(uuid, text, text) to authenticated;

-- 3. Aggregate-only push token stats ------------------------------------------

create or replace function public.admin_push_token_stats()
returns table(platform text, device_count bigint, user_count bigint)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not (select private.is_staff()) then
    raise exception 'unauthorized staff read'
      using errcode = '42501';
  end if;

  return query
  select t.platform::text, count(*)::bigint, count(distinct t.user_id)::bigint
  from public.push_tokens t
  group by t.platform;
end;
$$;

revoke execute on function public.admin_push_token_stats() from public, anon;
grant execute on function public.admin_push_token_stats() to authenticated;
