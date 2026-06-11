# TASK-005 - Wire Users, Roles, and Verification Admin Views

Status: Done
Priority: P1
Project: Take Me Pic Web/Admin
Milestone: Web Phase 1 - Admin trust and safety foundation
Owner: Agent

## Purpose

Connect user operations screens to Supabase profiles and staff role data.

## Scope

- Wire `/admin/users`, `/admin/users/[id]`, and `/admin/users/verification`.
- Add staff role management reads for `/admin/settings/roles` and team views.
- Model profile verification state from Supabase fields.
- Add server-side access checks for all user and role reads.
- Keep edits or role mutations out of scope unless they are safely audited.

## Acceptance Criteria

- [x] Users list reads `profiles`.
- [x] User detail reads a live profile row.
- [x] Verification screen reflects live verification fields.
- [x] Roles/settings views read staff role state.
- [x] Unauthorized users cannot inspect profile/admin role data.
- [x] `npx tsc --noEmit` passes.
- [x] `npm run build` passes.

## Technical Notes

- `profiles.id` references `auth.users(id)` in the shared schema.
- Role authorization must not use `user_metadata`.

## Dependencies

- TASK-002 completed.

## Verification

- Manual user list/detail checks.
- Manual role visibility checks.
- TypeScript and production build.
- Playwright: anonymous fail-closed + staff access on `/admin/users`,
  `/admin/users/verification`, `/admin/settings/roles`,
  `/admin/settings/team`, plus a live user-detail drill-down
  (`tests/e2e/admin-views.spec.ts`).

## Hardening notes (grill session 2026-06-11)

- Account e-mails live in Supabase Auth, not `profiles` — the mock e-mail
  column was dropped from admin reads (PII minimization, no auth.users
  exposure).
- Account status derives from active bans (permanent → banned, temporary
  → suspended), never from the unmaintained `profiles.is_banned` flag.
- Verification state derives from `verified` / `email_verified` /
  `phone_verified`; the queue is read-only until an audited verification
  mutation exists.
- The roles screen no longer fakes an editable permission matrix: it
  reflects the real `user_roles` roster and the shared phase-1 staff
  capabilities, read-only.
- User detail wires the existing audited ban/ban-lift actions; mock-only
  actions (message, verify, delete, edit) were removed. `/admin/users/new`
  and `/admin/users/[id]/edit` remain unmigrated mock routes.
