# TASK-006 - Wire Request and Session Support Inspection

Status: Done
Priority: P1
Project: Take Me Pic Web/Admin
Milestone: Web Phase 1 - Admin trust and safety foundation
Owner: Agent

## Purpose

Move support-facing request, session, and booking inspection routes from mock
data to live Supabase reads.

## Scope

- Wire `/admin/requests`, `/admin/requests/[id]`.
- Wire `/admin/sessions`, `/admin/sessions/[id]`.
- Add read-only support queries for help request lifecycle, participants, and
  related session metadata.
- Keep chat/photo visibility constrained by policy decisions.
- Add empty, loading, unauthorized, and error states.

## Acceptance Criteria

- [x] Request list/detail use live Supabase data.
- [x] Session list/detail use live Supabase data.
- [x] Staff-only access is enforced server-side.
- [x] Sensitive chat/photo data is not exposed without an explicit policy.
- [x] `npx tsc --noEmit` passes.
- [x] `npm run build` passes.

## Technical Notes

- Related tables: `help_requests`, `conversations`,
  `conversation_participants`, `messages`, `session_photos`.
- Storage bucket policies still need explicit verification before exposing
  session photos.

## Dependencies

- TASK-002 completed.

## Verification

- Manual request/session route checks.
- TypeScript and production build.
- Playwright: anonymous fail-closed + staff access on `/admin/requests`
  and `/admin/sessions` (`tests/e2e/admin-views.spec.ts`).

## Hardening notes (grill session 2026-06-11)

- Critical RLS finding: the party-scoped policy on `help_requests` meant
  staff silently saw only publicly-visible `requested` rows. Fixed with
  the `help_requests_staff_read` policy applied remotely as a migration
  (ADR-0004); chat, messages, and session photos stay participant-only.
- Requests and sessions are one entity: both views read `help_requests`;
  the sessions view filters helper-engaged states (accepted, in_session,
  completed, rated).
- Request/session detail shares one client anchored by the help request,
  with the metadata-only conversation summary (ADR-0001 RPC) and a report
  signal count; no chat content or photos are rendered.
- The PostGIS `location` column is intentionally not selected or decoded.
- Mock-only force-expire and contact actions were removed; lifecycle
  mutations need their own audited boundary.
