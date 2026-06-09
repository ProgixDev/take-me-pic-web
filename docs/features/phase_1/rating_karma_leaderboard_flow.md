## Feature Information

- Feature Name: Rating, Karma, and Leaderboard Admin
- Description / Goal: Inspect reputation signals and karma integrity.
- Screens Involved: `/admin/karma`, `/admin/karma/rules`, `/admin/leaderboard`
- Backend/API Interactions: `ratings`, `karma_ledger`, `leaderboard`, `profiles`

# Rating, Karma, and Leaderboard Admin

## Purpose

Ops can review reputation outcomes, investigate abuse, and manage karma rules.

## Main Flow

1. Staff opens karma or leaderboard route.
2. System reads ledger-backed reputation data.
3. Staff reviews anomalies or rule configuration.

## Edge Cases

- Cached profile karma differs from ledger.
- User is banned but still appears in leaderboard.
- Rule update requires audit.

## Success State

Reputation is transparent to staff and grounded in backend records.
