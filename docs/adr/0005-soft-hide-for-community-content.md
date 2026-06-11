# Soft-hide columns and RLS visibility for community content moderation

`posts` and `comments` had no moderation state at all — the mock admin UI implied
delete/approve actions, and the only existing write path was a staff `DELETE` RLS
policy that produces no audit entry. We decided to add `hidden_at`/`hidden_by`
columns, exclude hidden rows from non-author, non-staff reads via the existing
read policies, and route hide/restore through SECURITY DEFINER RPCs that write
`admin_audit_log` in the same transaction (per ADR-0003).

## Considered options

- **Hard delete** (the staff DELETE policy already allows it): destroys evidence
  that trust-and-safety review depends on, and the direct-policy path bypasses
  the audit log. Rejected; the policy stays for the mobile repo to reconsider,
  but the web admin never uses it.
- **Stored status enum** (`published | flagged | removed`): conflates two
  orthogonal facts. "Flagged" is derived from open reports (like **Account
  status** derives from the **Active ban**), while visibility is a stored staff
  decision. Storing "flagged" would drift from `reports` immediately.

## Consequences

- Authors still see their own hidden content (`hidden_at is null OR author OR
  staff`), which keeps "where did my post go" support load down; the mobile app
  can later badge own-hidden content.
- Denormalized `hearts_count`/`comments_count` are not adjusted on hide.
- Comments of a hidden post remain individually readable by direct query;
  acceptable because the mobile app only fetches comments for posts it can see,
  and a per-row join in the comments policy is not worth the cost today.
