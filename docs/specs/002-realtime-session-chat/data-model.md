# Data Model: Realtime Session Chat Admin Review

## Existing Tables

- `conversations`: conversation container linked to a help request.
- `conversation_participants`: requester/helper membership.
- `messages`: durable message timeline.
- `help_requests`: request state and parties.
- `reports`: escalation records that may reference user/session behavior.

## Web Read Models

| Read model | Source | Purpose |
| --- | --- | --- |
| `sessionConversationSummary` | `conversations`, `conversation_participants`, `messages` aggregates | Show support context without full chat exposure |
| `sessionParticipants` | `profiles`, `conversation_participants` | Identify requester/helper |
| `reportedConversationContext` | `reports`, `help_requests`, conversation summary | Give moderators incident context |

## Privacy Defaults

- Hide message bodies until policy explicitly permits review.
- Hide storage paths/signed media unless staff action requires it.
- Log any privileged content review.
