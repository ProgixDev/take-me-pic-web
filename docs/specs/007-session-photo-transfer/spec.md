# Spec: Session Photo Transfer Admin Support

**Flow Doc**: `docs/features/phase_1/session_photo_transfer_flow.md`
**Priority**: P1

## User Story

As support staff, I need to verify whether session photos were transferred while
keeping private media protected.

## Independent Test

Open a session detail and view photo transfer metadata without receiving public
media URLs unless policy allows it.

## Acceptance Criteria

1. Staff can see transfer status/counts.
2. Storage bucket policies are verified before exposing image previews.
3. Privileged media review is audited if enabled.
4. Non-staff cannot read session photo metadata.

## Minimal Data Contract

- `session_photos`
- `help_requests`
- Supabase Storage `session-photos`

## Execution Tasks

- [ ] Verify storage bucket and policies.
- [ ] Add staff-only photo transfer metadata query.
- [ ] Decide if/when previews are allowed.
- [ ] Add audit logging for privileged media access if required.
