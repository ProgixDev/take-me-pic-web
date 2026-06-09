# Spec: Rating, Karma, and Leaderboard Admin

**Flow Doc**: `docs/features/phase_1/rating_karma_leaderboard_flow.md`
**Priority**: P1

## User Story

As ops staff, I need to inspect reputation signals and karma rules so abuse or
incorrect scoring can be investigated.

## Independent Test

Open `/admin/karma` and `/admin/leaderboard` as staff and verify live reputation
data or a clear empty state.

## Acceptance Criteria

1. Karma and leaderboard routes read Supabase data.
2. Staff can inspect ledger-backed reputation.
3. Mutations to karma rules are staff-only and audited.
4. Public leaderboard exposure remains policy-controlled.

## Minimal Data Contract

- `ratings`
- `karma_ledger`
- `leaderboard`
- `profiles`

## Execution Tasks

- [ ] Wire leaderboard view.
- [ ] Wire karma ledger summaries.
- [ ] Define audited karma rule update path.
- [ ] Test staff-only access.
