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
  -- Resolve by the request's participant pair, NOT
  -- conversations.help_request_id: mobile migration 0015 made conversations
  -- per-pair and re-points that column at the latest accepted request, so it no
  -- longer marks the per-session link (ADR-0009). Legacy pre-0015 rows left
  -- several conversations per pair; merge activity across all of them to match
  -- the mobile merged-history view, and return the latest as the canonical id.
  pair_conversations as (
    select cp1.conversation_id as id
    from target_request tr
    join public.conversation_participants cp1 on cp1.user_id = tr.requester_id
    join public.conversation_participants cp2
      on cp2.conversation_id = cp1.conversation_id
     and cp2.user_id = tr.helper_id
  ),
  canonical_conversation as (
    select max(id) as id from pair_conversations
  ),
  message_activity as (
    select
      count(m.id)::integer as message_count,
      min(m.created_at) as first_message_at,
      max(m.created_at) as last_message_at
    from public.messages m
    where m.conversation_id in (select id from pair_conversations)
  ),
  participant_activity as (
    select count(distinct cp.user_id)::integer as participant_count
    from public.conversation_participants cp
    where cp.conversation_id in (select id from pair_conversations)
  ),
  report_signal as (
    select count(distinct r.id)::integer as report_count
    from public.reports r
    where r.help_request_id = target_help_request_id
       or r.conversation_id in (select id from pair_conversations)
       or exists (
         select 1
         from public.messages reported_message
         where reported_message.id = r.message_id
           and reported_message.conversation_id in (select id from pair_conversations)
       )
  )
  select
    tr.id as help_request_id,
    cc.id as conversation_id,
    case when cc.id is null then 'not_started' else 'active' end as status,
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
  left join canonical_conversation cc on true
  left join message_activity ma on true
  left join participant_activity pa on true
  left join report_signal rs on true;
end;
$$;

revoke execute on function public.get_session_conversation_summary(bigint) from public, anon;
grant execute on function public.get_session_conversation_summary(bigint) to authenticated;
