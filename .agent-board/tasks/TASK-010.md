# TASK-010 - Prepare Premium, Payments, and Booking Operations

Status: Backlog
Priority: P2
Project: Take Me Pic Web/Admin
Milestone: Web Phase 2 - Monetization operations
Owner: Agent

## Purpose

Prepare admin operations for subscriptions, payments, payouts, refunds, bookings,
and sponsored campaigns.

## Scope

- Wire read-only premium and subscription views.
- Wire booking/payment operational screens where backend data is ready.
- Keep payment mutations behind provider-verified server boundaries.
- Document Stripe versus RevenueCat/App Store ownership before writes.

## Acceptance Criteria

- [ ] Premium screens can read live subscription state.
- [ ] Payment and booking screens can read live operational rows.
- [ ] Refund/payout actions remain disabled or server-protected until provider
  integration is explicit.
- [ ] No payment provider secret is exposed to browser code.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run build` passes.

## Technical Notes

- Related tables: `subscriptions`, `bookings`, `businesses`,
  `sponsored_campaigns`.
- Mobile premium entitlements should follow RevenueCat/App Store rules for iOS;
  do not model digital premium as a direct Stripe-only state.

## Dependencies

- TASK-002 completed.

## Verification

- Manual premium/payment/booking route checks.
- TypeScript and production build.
