# Condensed Web/Admin Feature Specs

Source structure mirrors the mobile app specs in
`/Users/macbookpro/Documents/Progix/take-my-pic/docs/specs`.

## Execution Baseline

The web app is a Next.js public site and admin console. Supabase is reachable
through frontend-safe env values and a health endpoint, but most routes still use
`lib/data.ts` mock data. The first live vertical slice is staff auth plus
trust/safety operations.

## Specs

| Spec | Web priority | First live route family |
| --- | --- | --- |
| `001-take-me-pic-platform` | P0 | `/status`, `/admin` |
| `004-auth-onboarding` | P0 | `/login`, `/admin/*` gate |
| `017-trust-safety-admin` | P0 | `/admin/moderation/*`, `/admin/audit-log` |
| `009-notifications-push` | P1 | `/admin/notifications/*` |
| `010-community-feed` | P1 | `/admin/community/*` |
| `011-photo-spots` | P1 | `/admin/spots/*`, `/spots-vitrine` |
| `006-help-request-matching` | P1 | `/admin/requests/*` |
| `002-realtime-session-chat` | P1 | `/admin/sessions/*`, support review |
| `008-rating-karma` | P1 | `/admin/karma`, `/admin/leaderboard` |
| `012-premium-entitlements` | P2 | `/admin/premium/*` |
| `013-bookings-sponsored` | P2 | `/admin/bookings/*`, `/admin/payments/*` |
| `014-ai-photohelper` | P2 | `/admin/content/guides`, `/admin/content/manual` |
| `015-itinerary` | P3 | future admin/support |
| `016-family-mode` | P3 | `/admin/family/*` |
| `018-localization-settings` | P1 | `/admin/settings/localization`, public copy |

## First Build Order

1. Replace localStorage admin auth with Supabase session and staff role gate.
2. Wire read-only `reports`, `bans`, and `admin_audit_log`.
3. Add audited moderation mutations.
4. Wire users/roles/verification.
5. Expand into sessions, requests, community, spots, notifications, and analytics.

## Non-Negotiables

- Read `node_modules/next/dist/docs/` before Next.js code changes.
- Browser code uses only publishable Supabase config.
- Staff authorization is server-verified.
- `admin_audit_log` records privileged actions.
- Mock data is replaced behind service/query boundaries, not scattered in pages.
