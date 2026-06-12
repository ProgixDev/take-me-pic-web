# Admin notification sends reuse private.notify_user via an audited RPC

The mobile repo's migration 0009 made `private.notify_user()` the single code
path that writes the canonical in-app `notifications` row and fans the push
out to the user's devices (pg_net → Expo). When the admin console gained a
"send notification" action (TASK-008), we decided its RPC
(`admin_send_notification`) must call `private.notify_user` rather than
insert into `notifications` directly — a direct insert would silently skip
the push, and duplicating the dispatch logic in a second function would
drift from the mobile-owned one. The RPC is staff-checked, validates the
message (1–320 chars), forces `kind = 'system'` with
`data.type = 'admin_message'`, and writes `admin_audit_log` in the same
transaction (ADR-0003 pattern).

## Scope boundaries

- **Single-target only.** The mock UI's audience segments (all users,
  premium, by-city, inactive) and the e-mail channel have no backend; a
  fan-out to thousands of users through per-row pg_net calls is also a
  rate-limiting problem the backend hasn't solved (flagged in the mobile
  repo's TASK-009 edge cases). Segments stay a documented gap, not a
  half-built path.
- **Push token reads stay aggregate-only** (`admin_push_token_stats`): raw
  Expo tokens are delivery credentials — anyone holding one can send pushes
  to that device — so the admin never reads the `push_tokens` rows
  themselves.
- Staff CAN read all `notifications` rows (`notifications_staff_read`
  policy): bodies are generated, non-sensitive text by 0009's design (no
  message content, no precise location), making this operational data under
  the ADR-0004 pattern.
