# Mobile Sync Notes — Trust & Safety Backend Changes

Date: 2026-06-10
Audience: the Take Me Pic mobile repo (`/Users/macbookpro/Documents/Progix/take-my-pic`)
Status of backend: all changes below are LIVE on the remote Supabase project
`oxexcljzzemfenzogcnz` as recorded migrations.

The web admin console now runs live moderation (reports, bans, audit log)
against the shared backend. The mobile app must align with the following
schema and behavior changes so both clients stay in sync.

## 1. Schema changes already applied remotely

### `reports` gained direct target columns (ADR-0002)

```
help_request_id  bigint null references help_requests(id) on delete set null
conversation_id  bigint null references conversations(id) on delete set null
message_id       bigint null references messages(id)      on delete set null
```

- A report has exactly ONE target: `reported_user_id`, `post_id`,
  `comment_id`, `help_request_id`, `conversation_id`, or `message_id`.
- **Mobile action:** when users report a session, a conversation, or a
  specific message, set the matching new column instead of (or in addition
  to falling back on) `reported_user_id`. Participant-level reports make
  unrelated history look like session risk — that is exactly what these
  columns fix.
- `reports.status` is the Postgres enum `public.report_status`
  (`open | reviewing | resolved | dismissed`). Inserts from mobile should
  only ever create `open`.

### `help_requests` staff read policy (added 2026-06-11)

`help_requests_staff_read` grants staff `SELECT` on the full help request
lifecycle (ADR-0004). Party-scoped access for regular users is unchanged.
`conversations`, `messages`, and `session_photos` remain participant-only.

- **Mobile action:** none; listed for awareness. Do not rely on the
  pre-existing "status = requested is publicly readable" behavior changing
  — it is still in place.

### `private` schema grant

`authenticated` now has `USAGE` on schema `private` plus `EXECUTE` on
`private.is_staff()`. This was required for ALL RLS policies that call
`is_staff()` (`reports`, `bans`, `admin_audit_log`, `user_roles`) — before
this fix, any authenticated query touching those tables errored with 42501
instead of evaluating the policy.

- **Mobile action:** none, but be aware reads of `reports` now work for the
  reporter (`reporter_id = auth.uid()`) and that a previously-broken policy
  path is now live. Re-test any mobile feature that reads its own reports.

## 2. New staff-only RPCs (do NOT call from mobile)

`admin_update_report_status(target_report_id, new_status)`,
`admin_ban_user(target_user_id, ban_reason, ban_expires_at, source_report_id)`,
`admin_unban_user(target_ban_id)`.

All three are SECURITY DEFINER, verify `private.is_staff()` internally, and
write `admin_audit_log` in the same transaction. Non-staff callers get
SQLSTATE 42501. Mobile should never call these; they are listed so mobile
devs don't duplicate ban/resolve logic client-side.

## 3. Ban semantics the mobile app must mirror

- **Active ban** = a `bans` row with `expires_at IS NULL` (permanent) or
  `expires_at > now()` (temporary).
- **Unban is a "ban lift", not a delete**: staff set `expires_at = now()`
  and the row stays for history. Mobile must therefore check
  active-ban status by expiry, never by row existence.
- Only one active ban per user is allowed (enforced in the RPC).
- **Mobile action:** wherever the app gates a banned user (login, posting,
  requesting sessions), use the active-ban predicate above. If mobile
  currently reads `profiles.is_banned`, note that the web RPCs do NOT set
  that flag yet — see "Open items" below.

## 4. Account/profile invariants discovered

- `user_roles.user_id`, `reports.reported_user_id`, and `bans.user_id` all
  FK to `public.profiles`, NOT `auth.users`. Any auth user created outside
  the normal mobile signup flow (dashboard, scripts) needs a `profiles` row
  before it can be a report target, ban target, or role holder.
- **Mobile action:** confirm the mobile signup flow always creates the
  `profiles` row at first sign-in (there is no DB trigger doing it — the
  dashboard-created accounts had none).

## 5. Staff/role model (shared language)

- Staff roles in `user_roles.role`: `moderator`, `admin`, `super_admin`.
- Authorization is server-side only (`private.is_staff()` / RLS); no client
  may trust local role labels or `user_metadata`.
- Audit actions written by the web console: `report_status_update`,
  `user_ban`, `user_unban` (target_type `report` or `user`).

## 6. Open items to coordinate (not yet done anywhere)

1. **`profiles.is_banned` is not maintained by the new RPCs.** Decide: either
   the RPCs also flip it (one more statement in the same transaction), or
   mobile derives ban state from `bans` directly. Until decided, the flag
   and the `bans` table can disagree.
2. **Banned-user enforcement on the mobile side** (block session requests /
   posting for users with an active ban) — needs an RLS predicate or app
   check in mobile; nothing enforces it today besides UI.
3. **Report creation UI on mobile** should adopt the new target columns
   (session/conversation/message) so the web "Report signal" counts are
   accurate (ADR-0002).
4. **Appeals**: `bans.appeal_status` exists and the web shows it read-only;
   no flow writes it yet on either client.
