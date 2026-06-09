# Spec: Premium Entitlements Admin

**Flow Doc**: `docs/features/phase_2/premium_entitlements_flow.md`
**Priority**: P2

## User Story

As support staff, I need to inspect premium entitlement state without confusing
mobile IAP entitlements with Stripe payments.

## Independent Test

Open `/admin/premium/[id]` as staff and verify subscription/entitlement state.

## Acceptance Criteria

1. Premium routes read `subscriptions`.
2. RevenueCat/App Store entitlement state is treated as source for digital premium.
3. Staff-only access is enforced.
4. Payment/provider secrets stay server-side.

## Minimal Data Contract

- `subscriptions`
- `profiles`

## Execution Tasks

- [ ] Wire premium list/detail reads.
- [ ] Document entitlement source of truth.
- [ ] Add read-only support state before mutations.
- [ ] Test build and staff access.
