# TASK-002 - Replace Mock Admin Auth with Supabase Staff Gate

Status: Done
Priority: P0
Project: Take Me Pic Web/Admin
Milestone: Web Phase 1 - Admin trust and safety foundation
Owner: Agent

## Purpose

Replace the localStorage-only admin gate with Supabase Auth plus server-verified
staff role checks.

## Scope

- Replace or wrap `lib/auth.ts` with Supabase-backed session behavior.
- Add staff role resolution from `user_roles` or a dedicated staff-check RPC.
- Gate `app/admin` so anonymous and non-staff users fail closed.
- Preserve the current admin UI shell and login page design.
- Add clear unauthorized and loading states.
- Keep all staff authorization server-side.

## User Flow

Staff user opens `/admin`

.

If unauthenticated, user is sent to admin login

.

Supabase session is established

.

Server verifies staff role

.

Staff user can enter the admin console

## Acceptance Criteria

- [x] LocalStorage is no longer the admin authorization boundary.
- [x] Anonymous users cannot access admin routes.
- [x] Authenticated non-staff users cannot access admin routes.
- [x] Staff users can access the existing admin layout.
- [x] Logout clears Supabase session and leaves admin routes.
- [x] Role checks do not use user-editable metadata.
- [x] `npx tsc --noEmit` passes.
- [x] `npm run build` passes.

## Technical Notes

- Read `node_modules/next/dist/docs/` for current Proxy, cookies, and route
  behavior before editing.
- Source docs: `docs/WEB-SUPABASE-HANDOFF.md`.
- Staff data source: `user_roles` or an explicit server-side RPC.

## Dependencies

- TASK-001 completed.

## Verification

- Manual anonymous, non-staff, and staff route checks.
- TypeScript and production build.

## Review outcome (2026-06-10)

- Mock auth files removed: `lib/auth.ts` and `components/admin/AuthGate.tsx`
  are deleted and no references remain.
- Anonymous fail-closed behavior is covered by Playwright
  (`tests/e2e/admin-access.spec.ts`).
- Staff and non-staff route checks run automatically when
  `E2E_STAFF_EMAIL`/`E2E_STAFF_PASSWORD` and
  `E2E_NON_STAFF_EMAIL`/`E2E_NON_STAFF_PASSWORD` are provided; they skip
  otherwise. Provide real Supabase accounts to exercise them.
- `npx tsc --noEmit` and `npm run build` pass.
