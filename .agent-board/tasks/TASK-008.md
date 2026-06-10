# TASK-008 - Wire Notifications and Content Operations

Status: Backlog
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

- [ ] Notification list reads live `notifications` data where appropriate.
- [ ] Template/new notification routes have a documented backend boundary.
- [ ] Content routes identify live tables versus CMS gaps.
- [ ] Staff-only access is enforced server-side.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run build` passes.

## Technical Notes

- Related tables: `notifications`, `push_tokens`, `framing_tips`.
- Marketing content may require new CMS tables or a separate content system.

## Dependencies

- TASK-002 completed.

## Verification

- Manual notification/content route checks.
- TypeScript and production build.
