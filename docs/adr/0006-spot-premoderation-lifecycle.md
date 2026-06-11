# Spot pre-moderation lifecycle via status column

`spots` had no approval state, but the trust-and-safety milestone requires a
staff-only pending-approval flow. We added a `public.spot_status` enum
(`pending | approved | rejected`), default `pending`, and changed the spots read
policy so the community sees only approved spots while creators and staff see
everything. Approve/reject goes through an audited SECURITY DEFINER RPC
(`admin_review_spot`), per ADR-0003.

## Considered options

- **Default `approved`**: no behavior change for mobile submissions, but the
  pending queue would always be empty — there would be no pre-moderation at all,
  which contradicts the milestone. Rejected.
- **Derive approval from reports**: approval is an editorial decision made
  before any report exists; it cannot be derived. Rejected.

## Consequences

- New mobile spot submissions are invisible to the community until staff
  approve them. The mobile app should surface a "pending review" state on the
  creator's own spots (flagged in MOBILE-SYNC-NOTES).
- The tables were empty at migration time, so no backfill decision was needed.
- Spot field editing (name, best time, …) is a content operation, not a
  moderation mutation — it stays out of scope until TASK-008 and must not reuse
  `admin_review_spot`.
