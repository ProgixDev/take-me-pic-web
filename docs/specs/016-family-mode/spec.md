# Spec: Family Mode Admin Support

**Flow Doc**: `docs/features/phase_3/family_mode_flow.md`
**Priority**: P3

## User Story

As support staff, I need to inspect family-mode records only when resolving
safety or account issues.

## Independent Test

Open `/admin/family/[id]` as staff and verify family metadata is protected.

## Acceptance Criteria

1. Family routes are staff-only.
2. Guardian/member data is minimized.
3. Location-sharing state is not overexposed.
4. Support actions are audited where sensitive.

## Minimal Data Contract

- `families`
- `family_members`
- `profiles`

## Execution Tasks

- [ ] Wire family list/detail reads.
- [ ] Define guardian privacy constraints.
- [ ] Add audit logging for sensitive support actions.
