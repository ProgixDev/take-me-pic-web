# Feature Specification: Take Me Pic Web Platform

**Feature Branch**: `001-take-me-pic-web-platform`
**Created**: 2026-06-09
**Status**: Draft
**Input**: mobile PRD/schema docs, Next.js admin handoff package, current web app.

## User Scenarios & Testing

### User Story 1 - Public Visitor Understands the Product (P1)

A traveller lands on the public site and understands the trusted nearby
photo-help loop, safety model, pricing direction, and mobile download path.

**Independent Test**: Visit `/`, `/how-it-works`, `/features`, `/safety`, and
`/download` without logging in.

### User Story 2 - Staff User Operates Trust and Safety (P1)

A staff user signs in, reviews reports, bans unsafe users, and sees audit logs.

**Independent Test**: With a staff Supabase account, open `/admin/moderation`,
resolve a report, and verify an `admin_audit_log` row.

### User Story 3 - Support Reviews Sessions and Users (P1)

Support staff inspect users, requests, sessions, and reputation signals without
exposing private data outside policy.

**Independent Test**: Open user, request, and session admin detail routes as
staff; verify anonymous/non-staff access is denied.

### User Story 4 - Ops Manages Growth Modules (P2)

Ops staff review spots, content, notifications, premium, payments, and bookings.

**Independent Test**: Open route families and verify live data or documented
empty states behind staff access.

## Requirements

- **FR-001**: Public marketing routes MUST remain accessible without auth.
- **FR-002**: Admin routes MUST require Supabase session plus server-verified staff role.
- **FR-003**: Staff actions MUST be audited.
- **FR-004**: Browser code MUST use only publishable Supabase configuration.
- **FR-005**: Live admin data MUST be introduced behind typed server-side query/action boundaries.
- **FR-006**: Empty/loading/error/unauthorized states MUST exist before a route is marked live.
- **FR-007**: Legal/GDPR routes MUST remain easy to update and consistent with data handling.

## Key Entities

- Staff session
- Staff role
- Profile
- Report
- Ban/block
- Audit log
- Request/session
- Community content
- Spot
- Notification
- Subscription/payment/booking

## Success Criteria

- Staff-only routes fail closed for anonymous and non-staff users.
- First moderation slice reads and writes Supabase data without mock state.
- Production build passes after each live route family.
- Public pages remain static/fast where they do not need live data.

## Assumptions

- Supabase remains the backend for Auth, Postgres, Storage, Realtime, and RLS.
- Web/admin owns operational workflows; mobile owns end-user interaction loops.
- The existing visual design should be preserved during backend migration.
