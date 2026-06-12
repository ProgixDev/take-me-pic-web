# One staff-checked jsonb RPC for admin analytics

The analytics screens need cross-table aggregates (profiles, help_requests,
posts, bookings, subscriptions, ratings, messages). Instead of a set of
`security_invoker` views — each needing its own RLS reasoning and migration
surface, and several impossible under invoker rights (staff have no read
policy on `messages`, `bookings`, or `subscriptions`, by design) — we expose
one SECURITY DEFINER RPC, `admin_analytics_overview()`, that verifies
`private.is_staff()` and returns every aggregate as a single jsonb document.
One round trip, one gate, an evolvable shape, and only counts/sums cross the
boundary (the sole row-level data is the recent-bookings list: operational
payment rows, no message content).

## Consequences

- Adding a metric = `create or replace` of one function; the web read model
  validates the shape.
- Indexing deferred deliberately: every series is bounded (6 months / 90
  days) and the tables are near-empty; add `created_at` indexes when row
  counts justify them.
- Not computed, by data reality rather than choice: retention/cohorts (no
  activity-event log exists) and MRR/ARPU (subscription pricing lives in
  RevenueCat, not the database). The screens document both gaps.
