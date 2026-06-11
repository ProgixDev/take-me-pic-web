# Staff RLS Policy for Help Request Lifecycle, RPC Boundary for Content

Support inspection needs the full help request lifecycle, but the existing RLS on `help_requests` is party-scoped, so staff queries silently returned only publicly-visible `requested` rows — a misleading subset rather than a denial. We will grant staff a plain `SELECT` policy (`help_requests_staff_read` via `private.is_staff()`) on `help_requests`, while keeping `conversations`, `messages`, and `session_photos` participant-only with staff access limited to the metadata RPC from ADR-0001, because lifecycle state is operational data while chat and photos are private content.

**Considered Options**

- A staff RPC for help request lists/details, mirroring ADR-0001.
- A staff `SELECT` policy on `help_requests` only.
- Staff `SELECT` policies across all session-related tables.

An RPC for plain lifecycle rows adds a contract layer with no privacy gain — unlike conversation summaries, there is nothing to aggregate or redact. Broadening policies across chat/photo tables would erase the Privileged content review boundary.

**Consequences**

Staff read `help_requests` directly under RLS, like `reports` and `bans`. Any future staff access to message bodies or session photos requires a new audited privileged-content boundary, not a policy broadening. Session photo exposure also stays blocked until storage bucket policies are verified.
