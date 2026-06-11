-- Web admin SQL artifact: staff read access to help request lifecycles.
-- Applied remotely as migration `help_requests_staff_read` (2026-06-11).
--
-- Staff support inspection needs to list help requests across the full
-- lifecycle. The existing policy is party-scoped (requester/helper) plus
-- publicly-visible 'requested' rows, so staff would silently see a subset.
-- Lifecycle metadata is operational data, not private content; chat and
-- photos remain participant-only (staff get metadata via the
-- get_session_conversation_summary RPC, ADR-0001).

create policy help_requests_staff_read
  on public.help_requests
  for select
  to authenticated
  using ((select private.is_staff()));
