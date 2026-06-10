-- Web admin SQL artifact: security hardening revokes.
-- Applied remotely as migration `revoke_rls_auto_enable_execute` (2026-06-10).
--
-- rls_auto_enable() is an event-trigger function; PostgREST should never
-- expose it. Event triggers do not check EXECUTE for the calling role, so
-- revoking is safe.

revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
