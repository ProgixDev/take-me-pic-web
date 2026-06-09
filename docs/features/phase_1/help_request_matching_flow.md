## Feature Information

- Feature Name: Help Request Matching Admin Support
- Description / Goal: Let staff inspect help request state and matching outcomes.
- Screens Involved: `/admin/requests`, `/admin/requests/[id]`
- Backend/API Interactions: `help_requests`, `profiles`, `conversations`, `accept_help_request`

# Help Request Matching Admin Support

## Purpose

Support staff can understand failed, expired, cancelled, or disputed request
lifecycles.

## Main Flow

1. Staff opens request list.
2. System loads live request rows and summary state.
3. Staff opens detail to inspect requester, helper, timestamps, and linked session.

## Alternate Flows

- Request has no accepted helper.
- Request expired during matching.
- Request has linked report or ban.

## Success State

Staff can investigate request state without mutating it unless an audited support
action is added.
