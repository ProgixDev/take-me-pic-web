# Spec: Admin Auth and Staff Gate

**Flow Doc**: `docs/features/phase_1/onboarding_profile_verification_flow.md`
**Priority**: P0

## User Story

As staff, I want to sign in to the admin console with Supabase and be admitted
only if my account has a trusted staff role.

## Independent Test

Anonymous, non-staff, and staff users attempt to open `/admin`.

## Acceptance Criteria

1. LocalStorage is not the authorization boundary.
2. Supabase session is required for admin access.
3. Staff role is verified server-side through `user_roles` or an RPC.
4. Logout clears the session and blocks admin routes.
5. Login errors are visible without changing the visual design.

## Minimal Data Contract

- Supabase Auth session
- `profiles`
- `user_roles`

## Execution Tasks

- [ ] Replace `lib/auth.ts` mock behavior.
- [ ] Add server-side staff-check helper.
- [ ] Gate `app/admin` layout/routes.
- [ ] Preserve `/login` admin entry UI.
- [ ] Test anonymous/non-staff/staff states.
