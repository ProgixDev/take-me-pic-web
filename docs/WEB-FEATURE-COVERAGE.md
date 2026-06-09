# Take Me Pic Web Feature Coverage

Checked on: 2026-06-09

## Current state

The web repo implements the public website and admin console as a complete
clickable mock. It mirrors the product modules documented in the mobile repo but
does not yet read or write Supabase data.

## Public website coverage

| Web area | Current routes | Product purpose | Backend dependency |
| --- | --- | --- | --- |
| Home and overview | `/`, `/how-it-works`, `/features` | Explain the trusted photo-help loop | None for MVP |
| Feature education | `/features/discover`, `/features/spots`, `/features/community`, `/features/karma`, `/features/safety`, `/features/premium`, `/features/ai-helper`, `/features/itinerary`, `/features/family` | Map public copy to the PRD feature modules | None initially; later CMS/content |
| Conversion | `/pricing`, `/download`, `/login` | Drive mobile installs/admin entry | Auth only for admin entry |
| Trust and support | `/help`, `/help/[category]`, `/help/article/[slug]`, `/community-guidelines`, `/status`, `/contact` | User support and policy education | Later support ticket/contact persistence |
| Company and growth | `/about`, `/about/story`, `/about/team`, `/about/values`, `/careers`, `/partners`, `/ambassadors`, `/press`, `/stories`, `/blog` | Brand, recruiting, press, content | Later CMS/content workflow |
| Legal | `/legal/privacy`, `/legal/terms`, `/legal/cookies`, `/legal/gdpr` | GDPR/RGPD and platform terms | Content governance only |
| Spots showcase | `/spots-vitrine` | Public discovery teaser for photo spots | Later read-only `spots` data |

## Admin coverage

| Admin area | Representative routes | Schema/modules behind it | Live readiness |
| --- | --- | --- | --- |
| Dashboard and analytics | `/admin`, `/admin/analytics/*` | Cross-module metrics, `profiles`, `help_requests`, `bookings`, `subscriptions` | Mock only |
| Users and identity | `/admin/users`, `/admin/users/[id]`, `/admin/users/verification`, `/admin/family/*` | `profiles`, `user_roles`, `families`, `family_members` | Schema ready |
| Sessions and requests | `/admin/sessions`, `/admin/requests`, `/admin/bookings` | `help_requests`, `conversations`, `messages`, `session_photos`, `bookings` | Schema ready; realtime/storage needs follow-up |
| Community and spots | `/admin/community/*`, `/admin/spots/*` | `posts`, `comments`, `post_likes`, `follows`, `spots`, `spot_photos`, `spot_tips` | Schema ready |
| Moderation | `/admin/moderation/*`, `/admin/karma`, `/admin/badges`, `/admin/leaderboard` | `reports`, `blocks`, `bans`, `karma_ledger`, `leaderboard`, `admin_audit_log` | First recommended live slice |
| Premium and payments | `/admin/premium/*`, `/admin/payments/*` | `subscriptions`, `bookings`, `businesses`, `sponsored_campaigns` | Defer until Phase 2+ business rules |
| Content and notifications | `/admin/content/*`, `/admin/notifications/*` | `notifications`, `framing_tips`, eventual CMS tables | Partial schema |
| Support and audit | `/admin/support`, `/admin/audit-log` | `reports`, `admin_audit_log`, future support tickets | Audit schema ready |
| Settings | `/admin/settings/*`, `/admin/profile` | Staff profile, roles, integrations, localization, security | Requires staff auth/RBAC |

## Backend module mapping

The mobile schema documentation maps PRD modules to Supabase objects. For the
web app, the admin console consumes the same objects from an operational
perspective:

| PRD module | Web/admin use |
| --- | --- |
| Proximity and Presence | Monitor availability, diagnose stale presence, review safety filtering |
| Help Request and Matching | Review request lifecycle, cancellations, disputed sessions |
| Realtime Session and Chat | Support/moderation review where policy allows |
| Karma and Reputation | Audit karma ledger, leaderboard, badges, abusive behavior |
| Identity and Trust/Safety | Verify users, process reports, blocks, bans, and audit logs |
| Subscriptions | Review premium status and RevenueCat entitlement state |
| Payments and Bookings | Manage bookings, refunds, payouts, B2B campaigns |
| Community Feed and Spots | Moderate posts/comments/spots and approve suggested locations |
| Notifications | Manage templates and delivery outcomes |
| Admin auth and ops | Staff roles, permissions, security settings, auditability |
| AI PhotoHelper | Manage guide/manual/framing content |
| Itineraries | Future operational support for planned routes |
| Family mode | Support guardians/family safety workflows |
| Localization | Manage FR-first content and verify EN/AR/RTL coverage |

## Recommended migration order

1. Staff auth and `user_roles` checks.
2. Read-only reports, users, bans, and audit log views.
3. Moderation mutations: report status, ban/unban, role assignment, audit writes.
4. Request/session inspection for support workflows.
5. Community/spots moderation and approval flows.
6. Notifications/content publishing workflows.
7. Premium/payments/bookings operational flows.
8. Analytics from database views or RPCs.

## Acceptance checks before a route is considered live

- Route no longer depends on the relevant mock data for persisted state.
- Empty, loading, error, and unauthorized states are visible and tested.
- Staff-only actions are enforced server-side.
- Mutations write `admin_audit_log` where the handoff requires it.
- RLS and RPC policies prevent non-staff access.
- Browser code uses only publishable frontend-safe Supabase configuration.
