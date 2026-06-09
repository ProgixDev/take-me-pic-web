## Feature Information

- Feature Name: Notifications and Push Operations
- Description / Goal: Inspect notification records and manage templates safely.
- Screens Involved: `/admin/notifications/*`, `/admin/settings/notifications`
- Backend/API Interactions: `notifications`, `push_tokens`, provider APIs

# Notifications and Push Operations

## Purpose

Ops can understand notification state while push provider secrets stay server-side.

## Main Flow

1. Staff opens notifications route.
2. System reads notification records/templates.
3. Send/test actions use protected server/provider boundaries.

## Success State

Notification operations are visible and controlled.
