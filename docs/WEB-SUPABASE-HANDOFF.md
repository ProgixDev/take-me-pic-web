# Web Supabase Handoff

Checked on: 2026-06-09

## Backend status inherited from mobile

Source: `/Users/macbookpro/Documents/Progix/take-my-pic/docs/SUPABASE-INTEGRATION-STATUS.md`
and `/Users/macbookpro/Documents/Progix/take-my-pic/handoff/nextjs-admin`.

The remote Supabase project `oxexcljzzemfenzogcnz` has been bootstrapped:

- `public` schema has 33 tables.
- RLS is enabled on all tables.
- Initial schema migrations are recorded remotely.
- `find_available_helpers` exists.
- `accept_help_request` exists and is executable by `authenticated`.

Still pending for full product integration:

- Supabase Auth/profile flow is not fully wired in mobile.
- Storage buckets/policies for `session-photos`, `avatars`, and `posts` need
  explicit verification.
- Realtime subscriptions and push delivery are not wired end-to-end.
- Mobile and web screens are still mostly mock-backed.

## Web app status

This repo currently uses mock data for all public and admin surfaces.

Important local files:

- `lib/data.ts` - mock domain data and TypeScript shapes.
- `lib/auth.ts` - localStorage-only admin auth stub.
- `app/admin/**` - admin console routes.
- `app/(marketing)/**` - public site routes.

## Environment expectations

The mobile project documents the publishable Supabase configuration as:

```bash
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_KEY=...
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

The web app should map these to frontend-safe Next.js variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Do not expose service-role or secret keys through `NEXT_PUBLIC_*`. Admin write
operations must run through server-side code, RPCs, or edge/server functions with
explicit staff authorization.

## First live admin slice

The handoff package recommends starting with trust/safety and operations:

- `user_roles`
- `reports`
- `bans`
- `admin_audit_log`

Why this slice first:

- It is the operational safety layer for a stranger-to-stranger marketplace.
- The schema is already present.
- Admin actions have clear acceptance rules: staff-only access and audit writes.
- It avoids payment, storage, and realtime complexity while proving the web
  backend path.

## Required service boundaries

Use narrow server-side service functions or RPCs for privileged actions:

| Operation | Boundary |
| --- | --- |
| List reports | Server query with staff session check |
| Resolve/dismiss report | Server action/RPC, writes `admin_audit_log` |
| Ban/unban user | Server action/RPC, writes `bans` and `admin_audit_log` |
| Assign staff role | Server action/RPC, validates current staff permissions |
| Read audit log | Server query with staff role check |

Avoid client-side direct writes to moderation tables.

## Security rules carried from mobile docs

- Never use `user_metadata` for authorization.
- Keep service-role/secret keys out of browser bundles.
- Prefer `TO authenticated` plus ownership or staff predicates in RLS policies.
- Staff checks should come from server-verified roles, not client-local state.
- Views should be `security_invoker` or otherwise protected so they do not bypass
  RLS.
- UPDATE policies need both `USING` and `WITH CHECK`.
- Every admin mutation should produce an audit trail.

## Open backend questions for web

- What staff role names and hierarchy should `user_roles` enforce?
- Should admin login use email/password, SSO, magic link, or invite-only accounts?
- Which report fields are safe to expose to all staff levels?
- What retention/redaction policy applies to chat and session photo review?
- Are support tickets stored in existing tables or a new support-specific table?
- Which admin analytics should be materialized views/RPCs instead of raw queries?

## Verification checklist for first integration PR

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are
  configured locally.
- `.env.local` is ignored; `.env.example` contains placeholders only.
- Supabase browser client uses only publishable configuration.
- Server client can read the current session securely.
- Admin route access fails closed for anonymous/non-staff users.
- Report read path returns real rows or a documented empty state.
- Moderation mutation writes an audit entry in the same transaction.
- TypeScript/build verification passes.
