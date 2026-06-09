# Spec: Realtime Session Chat Admin Review

**Flow Doc**: `docs/features/phase_1/realtime_session_chat_flow.md`
**Priority**: P1

## User Story

As support staff, I need controlled visibility into session conversations so I
can help resolve safety or support incidents without broad chat exposure.

## Independent Test

Open a session detail as staff and verify conversation metadata is visible while
anonymous/non-staff users cannot access it.

## Acceptance Criteria

1. Staff-only session detail can read conversation metadata.
2. Message body/media review is hidden unless policy explicitly allows it.
3. Realtime event contracts are documented for future support tooling.
4. All accesses are server-side and role checked.

## Minimal Data Contract

- `conversations`
- `conversation_participants`
- `messages`
- `help_requests`
- `reports`

## Execution Tasks

- [ ] Add staff-only conversation metadata query.
- [ ] Decide chat content redaction/review policy.
- [ ] Add event contract docs for support/debug visibility.
- [ ] Test staff/non-staff boundaries.
