# TASK-009 - Add Admin Analytics from Supabase Views or RPCs

Status: Backlog
Priority: P2
Project: Take Me Pic Web/Admin
Milestone: Web Phase 2 - Operational analytics
Owner: Agent

## Purpose

Replace mock admin analytics with safe database-backed aggregate views or RPCs.

## Scope

- Define analytics queries for users, engagement, retention, geography, and
  revenue screens.
- Prefer views/RPCs over broad raw client queries.
- Ensure views do not bypass RLS unexpectedly.
- Add loading, empty, and error states to analytics pages.

## Acceptance Criteria

- [ ] Analytics pages read live aggregate data.
- [ ] Staff-only access is enforced server-side.
- [ ] Views use `security_invoker` or equivalent protection.
- [ ] Expensive queries are indexed or materialized where needed.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run build` passes.

## Technical Notes

- Related routes: `/admin/analytics/*`.
- Related data: profiles, sessions, requests, subscriptions, bookings, reports.

## Dependencies

- TASK-003 completed.
- TASK-005 completed.
- TASK-006 completed.

## Verification

- Manual analytics checks.
- Query plan review for expensive aggregates.
- TypeScript and production build.
