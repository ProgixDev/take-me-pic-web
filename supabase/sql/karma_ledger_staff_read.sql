-- Web admin SQL artifact: staff read access to the karma ledger
-- (TASK-007-2). Applied remotely as migration `karma_ledger_staff_read`
-- on 2026-06-12.
--
-- karma_ledger previously had only karma_ledger_self_read
-- (auth.uid() = user_id). Staff fraud/abuse investigation needs to read any
-- user's ledger. Same pattern as help_requests_staff_read (ADR-0004):
-- lifecycle/operational data gets a plain RLS policy, not an RPC.
-- Regular users keep self-read; ratings already has a permissive read
-- policy, so no change there.

create policy karma_ledger_staff_read
  on public.karma_ledger
  for select
  to authenticated
  using ((select private.is_staff()));
