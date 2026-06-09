# Spec: Trust, Safety, and Admin Operations

**Flow Doc**: `docs/features/cross_cutting/trust_safety_admin_flow.md`
**Priority**: P0

## User Story

As staff, I need real moderation queues, bans, roles, and audit logs so Take Me
Pic can operate a real-world stranger-to-stranger marketplace safely.

## Independent Test

Triage a report as staff, ban a user, and verify non-staff cannot access the
queue or mutation path.

## Acceptance Criteria

1. Staff role is required for moderation data.
2. Report and ban routes read live Supabase data.
3. Report/ban updates write `admin_audit_log`.
4. Staff role changes are server-protected.
5. Banned/blocked users are excluded from relevant product surfaces.

## Minimal Data Contract

- `reports`
- `blocks`
- `bans`
- `user_roles`
- `admin_audit_log`
- `profiles`

## Execution Tasks

- [ ] Wire read-only moderation queues.
- [ ] Add staff-only audited mutation boundaries.
- [ ] Add roles/team admin gate.
- [ ] Test anonymous/non-staff/staff behavior.
