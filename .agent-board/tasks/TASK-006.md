# TASK-006 - Wire Request and Session Support Inspection

Status: Backlog
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

- [ ] Request list/detail use live Supabase data.
- [ ] Session list/detail use live Supabase data.
- [ ] Staff-only access is enforced server-side.
- [ ] Sensitive chat/photo data is not exposed without an explicit policy.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run build` passes.

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
