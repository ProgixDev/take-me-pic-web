# Spec: Notifications and Push Operations

**Flow Doc**: `docs/features/cross_cutting/notifications_flow.md`
**Priority**: P1

## User Story

As ops staff, I need to inspect notification records and manage templates without
directly exposing push provider credentials.

## Independent Test

Open `/admin/notifications` as staff and verify notification records are read
from Supabase or documented as empty.

## Acceptance Criteria

1. Notification list uses live `notifications` where appropriate.
2. Push token data is protected.
3. Template/send actions are server-protected.
4. Provider secrets are never exposed to browser code.

## Minimal Data Contract

- `notifications`
- `push_tokens`
- future template/content source

## Execution Tasks

- [ ] Wire notification read model.
- [ ] Define template persistence.
- [ ] Add protected send/test boundary.
- [ ] Test staff-only routes.
