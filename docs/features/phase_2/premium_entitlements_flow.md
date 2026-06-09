## Feature Information

- Feature Name: Premium Entitlements Admin
- Description / Goal: Inspect premium entitlement state safely.
- Screens Involved: `/admin/premium/*`, `/features/premium`, `/pricing`
- Backend/API Interactions: `subscriptions`, entitlement provider data

# Premium Entitlements Admin

## Purpose

Support can understand premium status without mixing App Store/RevenueCat
entitlements with Stripe business payments.

## Main Flow

1. Staff opens premium user or plan route.
2. System reads subscription/entitlement mirror.
3. Staff can inspect state; mutations wait for provider-safe boundaries.

## Success State

Premium support is read-only and accurate until provider operations are wired.
