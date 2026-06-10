# TASK-004 - Add Staff-Only Moderation Mutations

Status: Done
Priority: P0
Project: Take Me Pic Web/Admin
Milestone: Web Phase 1 - Admin trust and safety foundation
Owner: Agent

## Purpose

Allow staff to resolve reports and ban or unban users through server-side
boundaries that write audit entries.

## Scope

- Add server action or RPC boundary for report status updates.
- Add server action or RPC boundary for ban/unban.
- Ensure every privileged mutation writes `admin_audit_log`.
- Validate staff role server-side before mutation.
- Add UI success/error handling without changing the visual direction.

## Acceptance Criteria

- [x] Staff can resolve or dismiss a report.
- [x] Staff can ban and unban a user.
- [x] Every moderation mutation writes an audit log entry.
- [x] Non-staff mutation attempts fail closed.
- [x] Mutations do not trust client-supplied role data.
- [x] `npx tsc --noEmit` passes.
- [x] `npm run build` passes.

## Technical Notes

- Prefer transaction-safe RPCs if multiple tables must change together.
- Follow Supabase security guidance from `docs/WEB-SUPABASE-HANDOFF.md`.

## Dependencies

- TASK-003 completed.

## Verification

- Manual report resolution.
- Manual ban/unban path.
- Confirm matching audit rows.
- TypeScript and production build.

## Implementation notes (grill session 2026-06-10)

- Boundary: SECURITY DEFINER RPCs in
  `supabase/sql/moderation_mutations.sql` (`admin_update_report_status`,
  `admin_ban_user`, `admin_unban_user`) — staff check via
  `private.is_staff()`, mutation, and `admin_audit_log` insert in one
  transaction. See `docs/adr/0003-transactional-rpcs-for-moderation-mutations.md`.
- Next.js boundary: `lib/admin/moderation-actions.ts` server actions guard
  with `getStaffSession()` (defense in depth), call the RPCs, and call
  `refresh()` after success.
- Unban is a ban lift: `expires_at = now()`, history preserved.
- Ban guards against duplicate active bans; report decisions validate the
  status set server-side; terminal decisions record resolver and timestamp.
- UI: report rows expose Examiner/Résoudre/Ignorer (+ Bannir for
  user-targeted reports); blocked list exposes "Lever le ban" on active
  bans; feedback via toasts.

## Deployment status (2026-06-10)

- Applied to the remote project via Supabase MCP as recorded migrations:
  `session_conversation_summary` (was never applied; adds ADR-0002 report
  target columns) and `moderation_mutations`.
- Verified remotely: all three `admin_*` functions exist as SECURITY
  DEFINER, and an unauthenticated caller is rejected with 42501.
- Also applied `revoke_rls_auto_enable_execute` (pre-existing advisor
  finding; see `supabase/sql/hardening_revokes.sql`).
- Verified end-to-end (2026-06-10) with the real staff account
  `admin-tmp@progix.com`: report resolve (resolver + timestamp recorded),
  ban (audit row), ban lift (expired, history kept, audit row); non-staff
  attempts rejected with 42501 on every RPC. Test rows cleaned up after.
- Fixes found during live verification, applied as migrations:
  `fix_report_status_enum_cast` (reports.status is the enum
  `public.report_status`) and `grant_private_is_staff_to_authenticated`
  (RLS policies calling `private.is_staff()` failed with 42501 for every
  authenticated user because the role lacked USAGE on schema `private`).
- Full Playwright matrix passes: anonymous redirect, staff access to
  reports + audit log, non-staff denial (7 passed).
