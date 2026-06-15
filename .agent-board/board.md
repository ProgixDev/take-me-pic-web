# Take Me Pic Web Agent Board

Project: Take Me Pic Web/Admin
Current focus: Supabase-connected admin operations and staff safety workflows
Current milestone: Web Phase 1 - Admin trust and safety foundation
Updated: 2026-06-15

Source board: `/Users/macbookpro/Documents/Progix/take-my-pic/.agent-board`
Adapted for this Next.js web/admin repo.

## Columns

- Backlog
- Ready
- In Progress
- Review
- Blocked
- Done

## Current Tasks

| Task | Title | Status | Owner | Priority |
| --- | --- | --- | --- | --- |
| TASK-001 | Establish Supabase web baseline and health check | Done | Agent | P0 |
| TASK-002 | Replace mock admin auth with Supabase staff gate | Done | Agent | P0 |
| TASK-003 | Wire reports, bans, and audit-log read models | Done | Agent | P0 |
| TASK-004 | Add staff-only moderation mutations | Done | Agent | P0 |
| TASK-005 | Wire users, roles, and verification admin views | Done | Agent | P1 |
| TASK-006 | Wire request/session support inspection | Done | Agent | P1 |
| TASK-007 | Wire community and spots moderation | Done | Agent | P1 |
| TASK-007-2 | Read-only karma ledger and ratings inspection | Done | Agent | P1 |
| TASK-008 | Wire notifications and content operations | Done | Agent | P1 |
| TASK-009 | Add admin analytics from Supabase views/RPCs | Done | Agent | P2 |
| TASK-010 | Prepare premium, payments, and booking operations | Backlog | Agent | P2 |
| TASK-011 | Wire daily itinerary ("programme du jour") admin operations | Backlog | Agent | P2 |

## Recommended Start

Start with TASK-010 (premium, payments, and booking operations) — the last
open task. TASK-009 is done: five analytics screens read live aggregates
from the single staff-checked `admin_analytics_overview()` RPC (ADR-0008);
retention/cohorts (no activity-event log) and MRR/ARPU (pricing lives in
RevenueCat) are documented gaps. Coordinate TASK-010 with the mobile repo's
TASK-014 (premium entitlements foundation). TASK-001 through TASK-007 are done: moderation reads
and mutations, users/roles/verification views, request/session support
inspection, and community/spots moderation all run live against Supabase.
Community content uses audited soft-hide (ADR-0005), spots have a
pending/approved/rejected review lifecycle (ADR-0006), and Playwright covers
anonymous/staff/non-staff access on every wired route. The stories screen
stays mock (no backend table); spot field editing is deferred to TASK-008.

## Web-First Implementation Steps

1. Confirm `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. Keep `.env.local` ignored and commit only `.env.example`.
3. Use server-side Supabase clients for admin reads and all privileged writes.
4. Replace `lib/auth.ts` localStorage auth with Supabase session plus staff role
   checks.
5. Start live data with trust/safety tables: `user_roles`, `reports`, `bans`,
   and `admin_audit_log`.
6. Preserve the existing admin UI and replace mock data behind narrow service
   boundaries.
7. Add empty, loading, unauthorized, and error states before marking any route
   live.
8. Verify TypeScript and production build after each vertical slice.

## Dependency Order

1. TASK-001 - Supabase web baseline and health check.
2. TASK-002 - Staff auth and route gate.
3. TASK-003 - Reports, bans, and audit-log reads.
4. TASK-004 - Staff-only moderation mutations.
5. TASK-005 - Users, roles, and verification.
6. TASK-006 - Request/session support inspection.
7. TASK-007 - Community and spots moderation.
8. TASK-007-2 - Karma ledger and ratings inspection (sync with mobile karma
   feature work).
9. TASK-008 - Notifications and content operations.
10. TASK-009 - Admin analytics.
11. TASK-010 - Premium, payments, and booking operations.

## Working Rules

- Read `node_modules/next/dist/docs/` before Next.js code changes.
- Do not expose service-role or secret keys in browser code.
- Do not trust user-editable metadata for authorization.
- Staff-only authorization must be enforced server-side.
- Moderation writes must produce `admin_audit_log` entries.
- Keep route components close to the existing UI; move backend behavior into
  typed services or RPC/server-action boundaries.
