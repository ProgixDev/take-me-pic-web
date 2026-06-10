# TASK-007 - Wire Community and Spots Moderation

Status: Backlog
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

- [ ] Community lists read live post/comment data.
- [ ] Spots lists read live spot/tip/photo data.
- [ ] Pending spot approval flow is staff-only.
- [ ] Moderation updates write audit entries where required.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run build` passes.

## Technical Notes

- Related tables: `posts`, `comments`, `post_likes`, `spots`,
  `spot_photos`, `spot_tips`.

## Dependencies

- TASK-004 completed.

## Verification

- Manual read and moderation checks.
- TypeScript and production build.
