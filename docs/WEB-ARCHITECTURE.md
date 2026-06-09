# Take Me Pic Web Architecture

Checked on: 2026-06-09

## Scope

This repository is the Take Me Pic public web site and admin console. It is
separate from the Expo mobile app but targets the same Supabase backend and the
same product language.

Current stack from `package.json` and `README.md`:

- Next.js 16.2.6 App Router
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4
- `lucide-react`, `recharts`, and `leaflet`

Note: this repo's AGENTS.md requires checking `node_modules/next/dist/docs/`
before code changes because this is Next.js 16. Keep doing that for any route,
Proxy, server action, cookies, or caching work.

## Current layout

```text
app/
  (marketing)/        Public site routes
  admin/              Admin console routes
components/
  admin/              Admin shell components
  marketing/          Public site shell and blocks
  ui/                 Shared carnet-style component kit
i18n/                 FR-first translation provider and dictionaries
lib/
  auth.ts             Mock admin auth backed by localStorage
  data.ts             Mock domain data, types, and lookup helpers
  cn.ts               Classname helper
public/brand/         Take Me Pic logo/icon assets
```

The app currently has no live backend dependency. All public and admin pages are
clickable over deterministic seed data in `lib/data.ts`.

## Product alignment

The mobile PRD defines Take Me Pic as an iOS-first app for trusted nearby photo
help. The web repo serves two roles:

- Public marketing, support, legal, press, partner, and feature pages.
- Internal admin/ops console for moderation, support, content, analytics,
  payments, spots, premium, and settings workflows.

The admin handoff identifies trust/safety and operations as the first live web
integration track. That means the earliest backend-backed screens should center
on `user_roles`, `reports`, `bans`, and `admin_audit_log`.

## Data boundary

`lib/data.ts` is the intentional backend seam. Pages import named arrays,
entities, and getters from that module. Keep that boundary intact while moving
to live data.

Preferred migration shape:

1. Keep page components importing the same named data APIs where practical.
2. Move Supabase calls into typed server-side query/service modules.
3. Replace mock getters with async fetchers only when a route is ready to become
   live.
4. Use server-side code for privileged admin operations.
5. Keep browser code limited to publishable Supabase clients and non-privileged
   reads.

Do not put service-role keys or privileged moderation logic into client
components. The mobile docs explicitly call out that user-editable metadata must
not drive authorization decisions.

## Authentication state

`lib/auth.ts` is a front-end-only admin auth stub using `localStorage`. It is not
an authorization boundary.

Live admin auth should be introduced as a dedicated slice:

- Authenticate staff through Supabase Auth.
- Resolve staff access through `user_roles` or a server-side role RPC.
- Gate admin layouts/routes using server-verified session and staff role.
- Record privileged moderation actions in `admin_audit_log`.

## Route ownership

The current route split should remain:

| Area | Responsibility |
| --- | --- |
| `app/(marketing)` | Public pages, SEO copy, legal/support docs, non-authenticated feature education |
| `app/admin` | Internal operational workflows, staff-only data, moderation and support tooling |
| `components/ui` | Reusable visual primitives only |
| `components/admin` | Admin shell and shared admin layout behavior |
| `components/marketing` | Public site layout and content blocks |
| `lib` | Data/auth infrastructure and shared utilities |

## Integration principles from mobile

The mobile architecture uses feature-owned business logic and a single data seam
for incremental Supabase adoption. Apply the same principle here:

- Route files should stay mostly orchestration and presentation.
- Data access belongs in small typed services, not scattered throughout pages.
- Supabase Realtime, Storage, and RPC use should be introduced per workflow.
- Mock data can stay beside live fetchers until a route is migrated and tested.

## First technical milestones

1. Add safe Supabase environment variables for the web app.
2. Add browser/server Supabase clients with publishable-key-only browser usage.
3. Replace mock admin auth with staff session and role resolution.
4. Wire read-only moderation/report lists from Supabase.
5. Add server-side actions/RPCs for report resolution, bans, and audit log writes.
6. Add route-level loading/error/empty states for live data.
7. Add tests for staff-only access and moderation audit traces.
