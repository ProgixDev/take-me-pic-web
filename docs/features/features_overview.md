# Take Me Pic Web Feature Overview

Sources: mobile `docs/features/features_overview.md`, mobile
`docs/SUPABASE-INTEGRATION-STATUS.md`, `handoff/nextjs-admin`, and this web
repo's current routes.

## Current Product State

The web app is a complete public marketing site plus admin console. Supabase
clients and a health endpoint exist, but admin/product routes still render from
mock data. The web migration should start with staff auth and trust/safety
operations.

## Feature Inventory

| Phase | Feature area | Web routes | Current UI state | Backend state |
| --- | --- | --- | --- | --- |
| Phase 1 | Admin auth and staff gate | `/login`, `/admin/*` | Mock localStorage gate | Supabase clients ready; staff gate not wired |
| Phase 1 | Trust/safety admin | `/admin/moderation/*`, `/admin/audit-log` | Mock queues | `reports`, `bans`, `blocks`, `user_roles`, `admin_audit_log` ready |
| Phase 1 | Users and verification | `/admin/users/*`, `/admin/settings/roles`, `/admin/settings/team` | Mock users | `profiles`, `user_roles` ready |
| Phase 1 | Requests and sessions | `/admin/requests/*`, `/admin/sessions/*` | Mock support data | `help_requests`, chat/session tables ready |
| Phase 1 | Karma and ratings | `/admin/karma`, `/admin/leaderboard` | Mock reputation | `ratings`, `karma_ledger`, `leaderboard` ready |
| Phase 2 | Community feed | `/admin/community/*`, public `/stories`, `/blog` | Mock/community copy | `posts`, `comments`, `post_likes`, `follows` ready |
| Phase 2 | Photo spots | `/admin/spots/*`, `/spots-vitrine` | Mock spots | `spots`, `spot_photos`, `spot_tips` ready |
| Phase 2 | Notifications/content | `/admin/notifications/*`, `/admin/content/*` | Mock operations | `notifications`, `push_tokens`, `framing_tips` partial |
| Phase 2 | Premium and payments | `/admin/premium/*`, `/admin/payments/*` | Mock operations | `subscriptions`, `bookings`, B2B tables ready |
| Phase 3 | AI helper/manual | `/features/ai-helper`, `/admin/content/guides` | Static guide content | `ai_suggestions`, `framing_tips` ready |
| Phase 3 | Itinerary | `/features/itinerary` | Marketing only | `itineraries`, `itinerary_steps` ready |
| Phase 3 | Family mode | `/features/family`, `/admin/family/*` | Mock admin family views | `families`, `family_members` ready |
| Cross-cutting | Localization/settings | `/admin/settings/localization`, public pages | FR-first UI | Client/content workflow |

## Feature Flow Docs

### Phase 1

- `docs/features/phase_1/onboarding_profile_verification_flow.md`
- `docs/features/phase_1/proximity_presence_flow.md`
- `docs/features/phase_1/help_request_matching_flow.md`
- `docs/features/phase_1/realtime_session_chat_flow.md`
- `docs/features/phase_1/session_photo_transfer_flow.md`
- `docs/features/phase_1/rating_karma_leaderboard_flow.md`

### Phase 2

- `docs/features/phase_2/community_feed_flow.md`
- `docs/features/phase_2/photo_spots_flow.md`
- `docs/features/phase_2/premium_entitlements_flow.md`
- `docs/features/phase_2/bookings_sponsored_monetization_flow.md`

### Phase 3

- `docs/features/phase_3/ai_photohelper_flow.md`
- `docs/features/phase_3/itinerary_flow.md`
- `docs/features/phase_3/family_mode_flow.md`

### Cross-Cutting

- `docs/features/cross_cutting/notifications_flow.md`
- `docs/features/cross_cutting/trust_safety_admin_flow.md`
- `docs/features/cross_cutting/localization_settings_flow.md`

## Backend Integration Principle

Keep the named mock-data seam while migrating route families. Add typed
server-side services per route family, then switch pages from mock imports to
live fetchers only after staff access, empty states, error states, and build
verification are in place.
