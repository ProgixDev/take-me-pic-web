# Spec: Help Request Matching Admin Support

**Flow Doc**: `docs/features/phase_1/help_request_matching_flow.md`
**Priority**: P1

## User Story

As support staff, I need to inspect help request state transitions and acceptance
outcomes to resolve failed or disputed sessions.

## Independent Test

Open `/admin/requests/[id]` as staff and verify request state, requester/helper,
and linked conversation/session metadata.

## Acceptance Criteria

1. Staff can read request list/detail from Supabase.
2. Illegal or conflicting transition states are visible for support.
3. Non-staff access is denied.
4. Mutation paths are deferred or audited.

## Minimal Data Contract

- `help_requests`
- `profiles`
- `conversations`
- RPC `accept_help_request`

## Execution Tasks

- [ ] Add request list/detail server queries.
- [ ] Add request state badges and empty/error states.
- [ ] Link request detail to session/conversation support context.
- [ ] Test staff-only reads.
