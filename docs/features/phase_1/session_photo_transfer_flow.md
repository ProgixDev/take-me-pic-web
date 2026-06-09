## Feature Information

- Feature Name: Session Photo Transfer Admin Support
- Description / Goal: Let staff verify photo transfer status without leaking private media.
- Screens Involved: `/admin/sessions/[id]`, future media support panel
- Backend/API Interactions: `session_photos`, Supabase Storage `session-photos`

# Session Photo Transfer Admin Support

## Purpose

Staff can confirm whether a session produced/transferred photos while storage
access stays policy-controlled.

## Main Flow

1. Staff opens session detail.
2. System reads photo transfer metadata.
3. Staff sees count/status, not public media URLs by default.

## Edge Cases

- Upload record exists but storage object is missing.
- Storage bucket policy is not verified.
- Privileged image review is requested.

## Success State

Photo transfer issues are diagnosable without making private photos public.
