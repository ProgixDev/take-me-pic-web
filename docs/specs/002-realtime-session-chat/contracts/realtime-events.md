# Contract: Realtime Events for Web Admin

## Purpose

Document the events the admin console may eventually observe for support and
operations. MVP web work should not subscribe broadly until staff auth and
privacy boundaries are finished.

## Events

| Event | Payload | Web use |
| --- | --- | --- |
| `help_request.updated` | request id, status, requester id, helper id | Update support/session dashboards |
| `conversation.message.created` | conversation id, sender id, message type, timestamp | Increment unread/activity counters |
| `session_photo.created` | request id, uploader id, storage path, timestamp | Show photo transfer status, not image content by default |
| `report.created` | report id, target type, severity | Update moderation queue |
| `moderation.action.created` | audit id, actor id, action, target | Update audit log |

## Rules

- Staff auth is required before subscribing.
- Message bodies and media URLs are not broadcast to admin dashboards by default.
- Reconnect must not duplicate visible activity rows.
