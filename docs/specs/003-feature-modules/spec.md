# Spec: Web Feature Modules

**Flow Doc**: `docs/features/features_overview.md`
**Priority**: P1

## User Story

As an engineer or agent, I need a clear map from web route families to product
modules so backend migration can proceed vertically.

## Acceptance Criteria

1. Each route family has an owning product module.
2. Mock-to-live migration order is documented.
3. Shared backend tables are mapped to admin routes.
4. Route components stay presentation-focused.

## Module Boundaries

- Public marketing: static/content-first pages.
- Admin auth: Supabase session and staff RBAC.
- Moderation: reports, bans, blocks, audit logs.
- User ops: profiles, verification, roles.
- Support ops: requests, sessions, bookings.
- Community/spots ops: feed and location moderation.
- Monetization ops: subscriptions, payments, sponsored campaigns.
- Settings/content: notifications, localization, integrations.

## Execution Tasks

- [ ] Keep module docs updated when a route becomes live.
- [ ] Add service/query modules per live route family.
- [ ] Avoid direct Supabase calls in deeply nested UI components.
