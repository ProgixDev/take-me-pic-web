# TASK-008 - Wire Notifications and Content Operations

Status: Done
Priority: P1
Project: Take Me Pic Web/Admin
Milestone: Web Phase 1 - Admin trust and safety foundation
Owner: Agent

## Purpose

Move notification and admin content workflows toward live persistence.

## Scope

- Wire `/admin/notifications`, `/admin/notifications/templates`, and
  `/admin/notifications/new` where backend support exists.
- Wire manual/guide content reads where schema support exists.
- Identify CMS gaps for marketing/help/blog/press content.
- Keep push delivery actions behind explicit backend/service boundaries.

## Acceptance Criteria

- [x] Notification list reads live `notifications` data where appropriate.
- [x] Template/new notification routes have a documented backend boundary.
- [x] Content routes identify live tables versus CMS gaps.
- [x] Staff-only access is enforced server-side.
- [x] `npx tsc --noEmit` passes.
- [x] `npm run build` passes.

## Technical Notes

- Related tables: `notifications`, `push_tokens`, `framing_tips`.
- Marketing content may require new CMS tables or a separate content system.

## Dependencies

- TASK-002 completed.

## Verification

- Rollback-wrapped SQL checks on `admin_send_notification` /
  `admin_push_token_stats`: non-staff rejected (42501), staff send writes the
  system notification + audit row in one transaction, staff read of foreign
  notifications works, empty/oversized message and missing target rejected.
- TypeScript, production build, and Playwright
  (`tests/e2e/admin-notifications-content.spec.ts`) all pass.

## Outcome notes

- Migration `notifications_admin` (2026-06-12): `notifications_staff_read`
  policy, `admin_send_notification` (single-target, kind `system`,
  `data.type='admin_message'`, reuses mobile 0009's `private.notify_user` so
  in-app row + push stay one code path — ADR-0007), and aggregate-only
  `admin_push_token_stats` (raw push tokens never reach the admin).
- Documented backend gaps: audience segments + e-mail channel (compose),
  notification templates (no table), help/blog/marketing pages (no CMS
  tables — Next.js routes + i18n). Each screen carries an "Aperçu local"
  banner.
- `/admin/content/manual` reads the live `framing_tips` table (no draft
  state or view counters exist — those mock concepts were dropped); editing
  and creation wait for content writes.
