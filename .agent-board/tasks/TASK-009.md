# TASK-009 - Add Admin Analytics from Supabase Views or RPCs

Status: Done
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

- [x] Analytics pages read live aggregate data.
- [x] Staff-only access is enforced server-side.
- [x] Views use `security_invoker` or equivalent protection. (one staff-checked
      SECURITY DEFINER RPC instead of views — ADR-0008)
- [x] Expensive queries are indexed or materialized where needed. (deferred
      deliberately: bounded series over near-empty tables; documented in the
      SQL artifact)
- [x] `npx tsc --noEmit` passes.
- [x] `npm run build` passes.

## Technical Notes

- Related routes: `/admin/analytics/*`.
- Related data: profiles, sessions, requests, subscriptions, bookings, reports.

## Dependencies

- TASK-003 completed.
- TASK-005 completed.
- TASK-006 completed.

## Verification

- Rollback-wrapped SQL checks on `admin_analytics_overview()`: non-staff
  rejected (42501), staff receives all seven sections with 6 monthly buckets.
- TypeScript, production build, and Playwright
  (`tests/e2e/admin-analytics.spec.ts`) all pass.

## Outcome notes

- Migration `admin_analytics` (2026-06-12): one staff-checked SECURITY
  DEFINER RPC returns totals, 6-month series, weekday/hourly activity (90 d),
  top cities, activity windows, and revenue aggregates as one jsonb document
  (ADR-0008). Aggregates only; the sole row-level data is the
  recent-bookings list.
- Wired live: overview, users, engagement, geography, revenue. Mock concepts
  without backing data were dropped (fake deltas, new-vs-returning, world
  map, DAU/WAU/MAU, payment methods).
- Documented gaps: retention/cohorts need a per-user activity-event log
  (screen keeps sample visuals behind an "Aperçu local" banner); MRR/ARPU
  need subscription pricing, which lives in RevenueCat.
