# Spec: Community Feed Admin Moderation

**Flow Doc**: `docs/features/phase_2/community_feed_flow.md`
**Priority**: P1

## User Story

As moderation staff, I need to review posts, comments, and community reports.

## Independent Test

Open `/admin/community/posts` and `/admin/community/comments` as staff and verify
live data with staff-only access.

## Acceptance Criteria

1. Posts/comments lists read Supabase data.
2. Flagged/removed states are visible.
3. Moderation actions are audited.
4. Non-staff access is denied.

## Minimal Data Contract

- `posts`
- `comments`
- `post_likes`
- `follows`
- `reports`
- `admin_audit_log`

## Execution Tasks

- [ ] Add community read models.
- [ ] Wire list/detail routes.
- [ ] Add audited moderation mutations.
- [ ] Test staff/non-staff access.
