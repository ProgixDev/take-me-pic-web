## Feature Information

- Feature Name: Realtime Session Chat Admin Review
- Description / Goal: Provide controlled support visibility into session conversations.
- Screens Involved: `/admin/sessions`, `/admin/sessions/[id]`, support detail
- Backend/API Interactions: `conversations`, `conversation_participants`, `messages`, `reports`

# Realtime Session Chat Admin Review

## Purpose

Staff need enough context to resolve support/safety issues while chat privacy is
protected by default.

## Main Flow

1. Staff opens a session detail.
2. System reads conversation metadata and participant information.
3. Message body/media review remains hidden unless policy allows it.

## Edge Cases

- Report references a chat message.
- Staff role is revoked while reviewing.
- Message/media access requires audit logging.

## Success State

Support can diagnose session communication without broad private chat exposure.
