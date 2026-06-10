# TASK-003 - Wire Reports, Bans, and Audit-Log Read Models

Status: Done
Priority: P0
Project: Take Me Pic Web/Admin
Milestone: Web Phase 1 - Admin trust and safety foundation
Owner: Agent

## Purpose

Move the first admin trust/safety screens from mock data to Supabase read models.

## Scope

- Add server-side query functions for `reports`, `bans`, and `admin_audit_log`.
- Wire `/admin/moderation/reports`, `/admin/moderation/blocked`, and
  `/admin/audit-log` to live reads.
- Preserve existing filtering/search UI where practical.
- Add empty, loading, unauthorized, and error states.
- Keep mock fallback only where a route is not yet migrated.

## Acceptance Criteria

- [x] Reports list reads live rows from Supabase.
- [x] Ban/blocked list reads live rows from Supabase.
- [x] Audit log reads live rows from Supabase.
- [x] Non-staff users cannot read moderation data.
- [x] Empty states are explicit when tables have no rows.
- [x] `npx tsc --noEmit` passes.
- [x] `npm run build` passes.

## Technical Notes

- Start with read-only server queries.
- Do not add client-side direct Supabase writes.
- Treat missing rows as a valid empty state, not as a mock fallback.

## Dependencies

- TASK-002 completed.

## Verification

- Manual staff read checks.
- Manual non-staff/anonymous denial checks.
- TypeScript and production build.

## Hardening notes (grill session 2026-06-10)

- Report read model now covers ADR-0002 direct report targets
  (`help_request_id`, `conversation_id`, `message_id`) with session,
  conversation, and message target types, labels, and filters.
- Raw backend error messages are no longer rendered to staff; queries log
  server-side and return generic French error states.
- Profile enrichment failures stay inside the typed
  `ModerationQueryResult` contract instead of throwing to the route error
  boundary.
- Known limitation: with RLS, a denied select returns zero rows, which is
  indistinguishable from a true empty table. The staff e2e check against
  real data is the guard for this.
- Reads are capped at the latest 50 rows (100 for audit log); pagination is
  deferred until volume requires it.
