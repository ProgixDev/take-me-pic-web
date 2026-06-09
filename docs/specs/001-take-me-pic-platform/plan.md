# Implementation Plan: Take Me Pic Web Platform

## Phase 0 - Baseline

- [x] Add Supabase env and client helpers.
- [x] Add `/api/health/supabase`.
- [x] Add status-page Supabase reachability state.
- [x] Add web docs and agent board.

## Phase 1 - Staff Safety Foundation

- [x] Replace localStorage admin auth with Supabase session.
- [x] Add server-verified staff role gate.
- [ ] Wire `reports`, `bans`, and `admin_audit_log` read routes.
- [ ] Add audited moderation actions.
- [ ] Wire users, roles, and verification views.

## Phase 2 - Operational Coverage

- [ ] Wire requests and sessions for support inspection.
- [ ] Wire community and spots moderation.
- [ ] Wire notifications and content operations.
- [ ] Add analytics views/RPCs.

## Phase 3 - Monetization and Ecosystem

- [ ] Wire premium entitlement operations.
- [ ] Wire bookings/payments/refunds/payout support.
- [ ] Wire family mode, itinerary, and AI helper admin surfaces where needed.

## Risks

- Staff auth implemented only client-side.
- Admin queries bypass RLS through unsafe views.
- Payment/provider secrets leak into browser bundles.
- Live data routes miss empty/error states and regress current UI.
