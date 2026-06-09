# Spec: Itinerary Admin Support

**Flow Doc**: `docs/features/phase_3/itinerary_flow.md`
**Priority**: P3

## User Story

As support staff, I may need to inspect itinerary records when the itinerary
module becomes live.

## Independent Test

Future route or support panel reads itinerary metadata for a staff user only.

## Acceptance Criteria

1. Public itinerary marketing remains static.
2. Staff reads are server-gated.
3. User-owned itinerary details follow privacy policy.

## Minimal Data Contract

- `itineraries`
- `itinerary_steps`
- `profiles`

## Execution Tasks

- [ ] Define if web admin needs itinerary support routes.
- [ ] Add read-only staff query when product scope requires it.
- [ ] Test privacy boundaries.
