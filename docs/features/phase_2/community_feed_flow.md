## Feature Information

- Feature Name: Community Feed Admin Moderation
- Description / Goal: Moderate posts, comments, stories, and reported community content.
- Screens Involved: `/admin/community/*`, public `/stories`, `/blog`
- Backend/API Interactions: `posts`, `comments`, `post_likes`, `follows`, `reports`

# Community Feed Admin Moderation

## Purpose

Staff can keep the community feed safe and aligned with policy.

## Main Flow

1. Staff opens community moderation routes.
2. System loads live posts/comments.
3. Staff reviews, removes, restores, or escalates content through audited actions.

## Success State

Community content can be moderated without exposing tools to non-staff users.
