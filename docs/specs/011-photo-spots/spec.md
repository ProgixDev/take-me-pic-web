# Spec: Photo Spots Admin and Showcase

**Flow Doc**: `docs/features/phase_2/photo_spots_flow.md`
**Priority**: P1

## User Story

As ops staff, I need to approve and manage photo spots, while public visitors can
see a safe showcase.

## Independent Test

Open `/admin/spots/pending` as staff and `/spots-vitrine` publicly.

## Acceptance Criteria

1. Staff spot lists read live `spots`.
2. Pending approval flow is staff-only.
3. Public showcase exposes approved spots only.
4. Spot moderation actions are audited.

## Minimal Data Contract

- `spots`
- `spot_photos`
- `spot_tips`
- `profiles`
- `admin_audit_log`

## Execution Tasks

- [ ] Wire admin spots read models.
- [ ] Wire approved-only public showcase when ready.
- [ ] Add audited approve/reject actions.
- [ ] Test public/staff boundaries.
