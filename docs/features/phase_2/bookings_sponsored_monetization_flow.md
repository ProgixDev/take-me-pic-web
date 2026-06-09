## Feature Information

- Feature Name: Bookings, Payments, and Sponsored Monetization Operations
- Description / Goal: Support real-world bookings, refunds, payouts, businesses, and campaigns.
- Screens Involved: `/admin/bookings/*`, `/admin/payments/*`, `/admin/settings/billing`
- Backend/API Interactions: `bookings`, `businesses`, `sponsored_campaigns`, payment provider APIs

# Bookings, Payments, and Sponsored Monetization Operations

## Purpose

Ops can inspect and eventually act on real-world monetization workflows.

## Main Flow

1. Staff opens booking/payment routes.
2. System reads live operational data.
3. Financial mutations remain disabled or provider-protected until explicitly implemented.

## Success State

Operations can investigate monetization state without leaking provider secrets.
