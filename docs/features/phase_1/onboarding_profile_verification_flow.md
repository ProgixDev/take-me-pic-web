## Feature Information

- Feature Name: Admin Auth, Staff Profile, and Verification Gate
- Description / Goal: Replace mock admin access with Supabase session and staff role verification.
- Screens Involved: `/login`, `/admin`, `app/admin/layout.tsx`, settings/team/roles routes
- User Inputs: email, password or magic-link flow, logout action
- Backend/API Interactions: Supabase Auth, `profiles`, `user_roles`
- Special Conditions / Rules: localStorage must not authorize staff access

# Admin Auth, Staff Profile, and Verification Gate

## Purpose

This flow protects the web admin console before live product data is connected.

## Entry Points

- `/login`
- `/admin`
- Any deep admin route

## Preconditions

- Supabase env values are configured.
- Staff accounts exist in Supabase Auth.
- Staff roles exist in `user_roles` or an RPC.

## Main Flow

1. Staff opens an admin route.
2. System checks Supabase session server-side.
3. System resolves staff role.
4. Staff enters admin console or sees an unauthorized/login state.

## Edge Cases

- Session exists but staff role is missing.
- Staff role is revoked during a session.
- Supabase session refresh fails.

## Success State

Admin routes fail closed and only staff users can see operational data.

## Backend Notes

Do not use `user_metadata` for role decisions. Keep staff checks server-side.
