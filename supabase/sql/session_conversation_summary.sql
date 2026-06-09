-- Web admin SQL artifact: session conversation summaries.
-- Supabase CLI is not available in this repo, so this file is intentionally
-- reviewable SQL to apply through the dashboard or convert into a migration.

alter table public.reports
  add column if not exists help_request_id bigint references public.help_requests(id) on delete set null,
  add column if not exists conversation_id bigint references public.conversations(id) on delete set null,
  add column if not exists message_id bigint references public.messages(id) on delete set null;

create index if not exists reports_help_request_idx
  on public.reports (help_request_id)
  where help_request_id is not null;

create index if not exists reports_conversation_idx
  on public.reports (conversation_id)
  where conversation_id is not null;

create index if not exists reports_message_idx
  on public.reports (message_id)
  where message_id is not null;

create or replace function public.get_session_conversation_summary(target_help_request_id bigint)
returns table (
  help_request_id bigint,
  conversation_id bigint,
  status text,
  participant_roles text[],
  participant_count integer,
  message_count integer,
  first_message_at timestamptz,
  last_message_at timestamptz,
  report_count integer
)
language plpgsql
security definer
set search_path = ''
stable
as $$
begin
  if not (select private.is_staff()) then
    raise exception 'unauthorized session conversation summary access'
      using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.help_requests hr
    where hr.id = target_help_request_id
  ) then
    raise exception 'help request not found'
      using errcode = 'P0002';
  end if;

  return query
  with target_request as (
    select
      hr.id,
      hr.requester_id,
      hr.helper_id
    from public.help_requests hr
    where hr.id = target_help_request_id
  ),
  target_conversation as (
    select c.id
    from public.conversations c
    where c.help_request_id = target_help_request_id
    order by c.created_at desc
    limit 1
  ),
  message_activity as (
    select
      count(m.id)::integer as message_count,
      min(m.created_at) as first_message_at,
      max(m.created_at) as last_message_at
    from target_conversation tc
    left join public.messages m on m.conversation_id = tc.id
  ),
  participant_activity as (
    select count(cp.user_id)::integer as participant_count
    from target_conversation tc
    left join public.conversation_participants cp on cp.conversation_id = tc.id
  ),
  report_signal as (
    select count(distinct r.id)::integer as report_count
    from public.reports r
    left join target_conversation tc on true
    where r.help_request_id = target_help_request_id
       or r.conversation_id = tc.id
       or exists (
         select 1
         from public.messages reported_message
         where reported_message.id = r.message_id
           and reported_message.conversation_id = tc.id
       )
  )
  select
    tr.id as help_request_id,
    tc.id as conversation_id,
    case when tc.id is null then 'not_started' else 'active' end as status,
    array_remove(array[
      'requester',
      case when tr.helper_id is null then null else 'helper' end
    ], null)::text[] as participant_roles,
    coalesce(pa.participant_count, 0) as participant_count,
    coalesce(ma.message_count, 0) as message_count,
    ma.first_message_at,
    ma.last_message_at,
    coalesce(rs.report_count, 0) as report_count
  from target_request tr
  left join target_conversation tc on true
  left join message_activity ma on true
  left join participant_activity pa on true
  left join report_signal rs on true;
end;
$$;

revoke execute on function public.get_session_conversation_summary(bigint) from public, anon;
grant execute on function public.get_session_conversation_summary(bigint) to authenticated;
