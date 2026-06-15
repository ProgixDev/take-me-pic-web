# TASK-011 - Wire daily itinerary ("programme du jour") admin operations

Status: Backlog
Priority: P2
Project: Take Me Pic Web/Admin
Milestone: Web Phase 3 - Ecosystem operations

Owner: Agent

## Purpose

The dossier's **"Itinéraire du jour / Daily itinerary"** (mobile screen 23, the
day's *programme*, Phase 3) has **no admin surface** today — the admin console
has no `itinerary` / `programmes` route. Add the staff-side surface to view and
curate travellers' daily programmes, and define the shared `itineraries` /
`itinerary_steps` schema + RLS jointly with mobile.

## Source

- Dossier "Take-Me-Pic-Dossier.pdf" — écran 23 « Itinéraire du jour / Daily
  itinerary » (Phase 3). Confirmed with the client (2026-06-15) that this is the
  missing "partie programme".
- Pairs with mobile **TASK-019** (wire the itinerary backend slice in the app).
- Existing marketing page `app/(marketing)/features/itinerary` (presentation
  only — not the admin surface).

## Scope

- Add an admin route (e.g. `app/admin/itineraries`) to list/inspect itineraries
  and their steps (time / title / kind / place / optional booking link).
- Define ownership + read/write RLS for `itineraries` / `itinerary_steps`
  (curation may be staff-assisted or user-owned — decide with mobile).
- Read-only first; any staff curation mutation goes through a staff-verified RPC
  (mirror the `admin_*` pattern), never direct table writes from the browser.
- Record any shared schema/RLS change in `docs/MOBILE-SYNC-NOTES.md` (and the
  mobile repo's `docs/WEB-BACKEND-SYNC.md`).

## Acceptance Criteria

- [ ] Admin can list itineraries and open one to see its ordered steps (live data).
- [ ] `itineraries` / `itinerary_steps` have explicit RLS agreed with mobile.
- [ ] Any curation mutation is staff-gated server-side; no provider/secret in browser.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run build` passes.

## Technical Notes

- Related tables: `itineraries`, `itinerary_steps` (in the 0001 baseline, no
  RLS/RPC wiring yet). Coordinate with `ai_suggestions` if the dossier's
  "intelligent itineraries" generation lands later (separate task).
- Booking steps tie into the booking/payments operations (TASK-010).

## Dependencies

- TASK-002 completed.
- Joint schema/RLS agreement with the mobile repo (mobile TASK-019).

## Verification

- Manual admin itinerary list/detail route checks.
- TypeScript and production build.
