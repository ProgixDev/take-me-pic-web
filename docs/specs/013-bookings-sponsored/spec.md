# Spec: Bookings, Payments, and Sponsored Operations

**Flow Doc**: `docs/features/phase_2/bookings_sponsored_monetization_flow.md`
**Priority**: P2

## User Story

As ops staff, I need to inspect bookings, payments, payouts, refunds, businesses,
and sponsored campaigns.

## Independent Test

Open `/admin/bookings`, `/admin/payments`, and related detail routes as staff.

## Acceptance Criteria

1. Booking/payment routes read live operational rows.
2. Refund/payout actions are disabled or server-protected until provider
   integration is explicit.
3. Stripe/provider secrets never enter browser code.
4. Staff access is enforced.

## Minimal Data Contract

- `bookings`
- `businesses`
- `sponsored_campaigns`
- payment provider records

## Execution Tasks

- [ ] Wire read-only booking/payment routes.
- [ ] Define provider-safe mutation boundaries.
- [ ] Add audit logs for financial operations.
- [ ] Test staff-only access.
