# Use Transactional RPCs for Moderation Mutations

Every staff moderation mutation must produce a matching `admin_audit_log` entry, and a mutation that lands without its audit row is a trust-and-safety defect. We will expose report status updates, bans, and unbans through SECURITY DEFINER RPCs (`admin_update_report_status`, `admin_ban_user`, `admin_unban_user`) that verify `private.is_staff()`, apply the change, and write the audit row in one transaction, instead of letting the web app write moderation tables directly.

**Considered Options**

- Direct table writes from Next.js server actions with broadened staff RLS policies, writing the audit row as a second statement.
- A database trigger that writes audit rows on moderation table changes.
- SECURITY DEFINER RPCs that check staff role, mutate, and audit atomically.

Direct writes leave a window where the mutation commits but the audit insert fails, and require staff UPDATE/INSERT policies on `reports`, `bans`, and `admin_audit_log`. Triggers audit the row change but lose the actor's intent (for example, unban versus natural expiry). The RPC keeps the staff check, the mutation, the intent, and the audit row in a single transaction, matching the precedent set by ADR-0001.

**Consequences**

The RPCs are the only supported moderation write path; the Next.js server actions are thin authenticated wrappers around them. Unban expires the ban (`expires_at = now()`) rather than deleting the row, so ban history remains auditable. New moderation mutations must follow the same shape: staff check, mutation, and audit insert inside one RPC.
