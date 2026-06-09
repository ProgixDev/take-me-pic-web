## Feature Information

- Feature Name: Trust, Safety, Moderation, and Admin Operations
- Description / Goal: Protect users through reports, blocks, bans, RBAC, and audit logs.
- Screens Involved: `/admin/moderation/*`, `/admin/audit-log`, `/admin/settings/roles`
- Backend/API Interactions: `reports`, `blocks`, `bans`, `user_roles`, `admin_audit_log`

# Trust, Safety, Moderation, and Admin Operations

## Purpose

This is the first live web/admin slice because Take Me Pic coordinates real
stranger interactions.

## Main Flow

1. Staff signs in and passes staff role gate.
2. Staff opens moderation queue.
3. Staff resolves/dismisses reports or bans/unbans users.
4. System writes audit log.

## Edge Cases

- Non-staff attempts moderation route.
- Audit write fails.
- Staff role is revoked during action.

## Success State

Moderation is live, staff-only, and auditable.
