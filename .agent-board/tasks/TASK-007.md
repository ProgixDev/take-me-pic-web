# TASK-007 - Wire Community and Spots Moderation

Status: Done
Priority: P1
Project: Take Me Pic Web/Admin
Milestone: Web Phase 1 - Admin trust and safety foundation
Owner: Agent

## Purpose

Connect community post, comment, and photo spot moderation screens to Supabase.

## Scope

- Wire `/admin/community/posts`, `/admin/community/comments`, and related
  detail routes.
- Wire `/admin/spots`, `/admin/spots/pending`, and spot detail/edit reads.
- Add moderation state updates through staff-only audited boundaries.
- Preserve existing filters/search where practical.

## Acceptance Criteria

- [x] Community lists read live post/comment data.
- [x] Spots lists read live spot/tip/photo data.
- [x] Pending spot approval flow is staff-only.
- [x] Moderation updates write audit entries where required.
- [x] `npx tsc --noEmit` passes.
- [x] `npm run build` passes.

## Technical Notes

- Related tables: `posts`, `comments`, `post_likes`, `spots`,
  `spot_photos`, `spot_tips`.

## Dependencies

- TASK-004 completed.

## Verification

- Rollback-wrapped SQL checks on the three RPCs: non-staff rejected (42501),
  staff hide/restore/review succeed, 3 audit rows written, double-hide and
  invalid decisions rejected.
- TypeScript, production build, and Playwright
  (`tests/e2e/admin-community-spots.spec.ts`) all pass.

## Outcome notes

- Moderation state is stored as soft-hide columns on posts/comments
  (ADR-0005) and a pending/approved/rejected lifecycle on spots (ADR-0006);
  "flagged" is derived from open reports, never stored.
- Stories screen stays mock: there is no stories table in the backend.
- Spot field editing and `/admin/spots/new` writes are content operations,
  deferred to TASK-008; the edit screen reads live data with saving disabled.
