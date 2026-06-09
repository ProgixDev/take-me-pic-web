## Feature Information

- Feature Name: Presence and Nearby Operations
- Description / Goal: Give staff safe operational visibility into helper availability and stale presence.
- Screens Involved: future diagnostics, `/admin/analytics/geography`, request/session support routes
- Backend/API Interactions: `presence`, `profiles`, `find_available_helpers`, `bans`, `blocks`

# Presence and Nearby Operations

## Purpose

Support the mobile app's core nearby-helper loop without exposing precise
location unnecessarily in the admin console.

## Entry Points

- Geography analytics
- Request/session support detail
- Future operational diagnostics

## Main Flow

1. Staff opens a presence-aware admin view.
2. System reads aggregate or redacted presence data.
3. Staff sees stale/active availability and safety-filter status.

## Edge Cases

- Presence row is stale.
- User is banned after presence is broadcast.
- Exact location access is requested without policy.

## Success State

Ops can diagnose availability issues while location privacy remains protected.
