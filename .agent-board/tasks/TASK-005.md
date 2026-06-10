# TASK-005 - Wire Users, Roles, and Verification Admin Views

Status: Backlog
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

- [ ] Users list reads `profiles`.
- [ ] User detail reads a live profile row.
- [ ] Verification screen reflects live verification fields.
- [ ] Roles/settings views read staff role state.
- [ ] Unauthorized users cannot inspect profile/admin role data.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run build` passes.

## Technical Notes

- `profiles.id` references `auth.users(id)` in the shared schema.
- Role authorization must not use `user_metadata`.

## Dependencies

- TASK-002 completed.

## Verification

- Manual user list/detail checks.
- Manual role visibility checks.
- TypeScript and production build.
