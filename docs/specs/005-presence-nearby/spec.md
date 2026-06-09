# Spec: Presence and Nearby Operations

**Flow Doc**: `docs/features/phase_1/proximity_presence_flow.md`
**Priority**: P1

## User Story

As ops staff, I need visibility into nearby-helper availability and stale
presence issues so the core mobile matching loop can be supported.

## Independent Test

Open an admin diagnostics view or support route that reads presence summary data
without exposing unnecessary GPS detail.

## Acceptance Criteria

1. Staff can inspect aggregate availability by area/status.
2. Exact location visibility is minimized and policy controlled.
3. Stale presence is detectable.
4. Banned/blocked users are excluded from operational matching views.

## Minimal Data Contract

- `presence`
- `profiles`
- RPC `find_available_helpers`
- `bans`
- `blocks`

## Execution Tasks

- [ ] Define web-safe presence summary read model.
- [ ] Add staff-only diagnostics route or analytics panel.
- [ ] Document exact-location access policy.
- [ ] Verify RLS and safety filters.
