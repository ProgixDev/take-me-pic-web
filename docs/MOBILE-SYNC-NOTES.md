# Mobile Sync Notes — Trust & Safety Backend Changes

Date: 2026-06-10
Audience: the Take Me Pic mobile repo (`/Users/macbookpro/Documents/Progix/take-my-pic`)
Status of backend: all changes below are LIVE on the remote Supabase project
`oxexcljzzemfenzogcnz` as recorded migrations.

Mobile-side mirror: `docs/WEB-BACKEND-SYNC.md` in the mobile repo carries the
same information for that repo's agents, referenced from its board tasks.
Whoever changes the shared Supabase schema updates BOTH files — the database
is the only contract the two repos share.

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

## 6. Community and spots moderation (TASK-007, added 2026-06-11)

### `posts` and `comments` gained soft-hide columns (ADR-0005)

```
hidden_at  timestamptz null
hidden_by  uuid null references profiles(id) on delete set null
```

- Read policies now exclude hidden rows for everyone except the author and
  staff: `hidden_at is null OR author_id = auth.uid() OR private.is_staff()`.
- **Mobile action:** none required for feeds (hidden content simply stops
  appearing). Optionally badge own-hidden content ("masqué par la modération")
  since authors still see their own hidden posts/comments.
- Staff hide/restore goes through `admin_set_post_visibility(post_id, hide,
  reason)` and `admin_set_comment_visibility(comment_id, hide, reason)` —
  staff-only, audited, do NOT call from mobile.
- The pre-existing staff `DELETE` policies on `posts`/`comments` remain but are
  an unaudited write path; the web admin never uses them. Mobile repo should
  decide whether to drop staff from those policies.

### `spots` gained a review lifecycle (ADR-0006)

```
status       public.spot_status not null default 'pending'
             (pending | approved | rejected)
reviewed_at  timestamptz null
reviewed_by  uuid null references profiles(id) on delete set null
```

- `spots_read` policy now: `status = 'approved' OR created_by = auth.uid() OR
  private.is_staff()`.
- **Mobile action (behavior change):** newly submitted spots are invisible to
  other users until staff approve them. Show the creator a "pending review"
  state on their own spots; today the app likely assumes immediate visibility.
- Staff approve/reject goes through `admin_review_spot(spot_id, decision,
  reason)` — staff-only, audited, do NOT call from mobile.
- New audit actions: `post_visibility_update`, `comment_visibility_update`,
  `spot_review`.

## 7. Karma ledger staff read (TASK-007-2, added 2026-06-12)

Policy `karma_ledger_staff_read` grants staff `SELECT` on the full
`karma_ledger` (ADR-0004 pattern). Self-read for regular users is unchanged.

- **Mobile action:** none. Listed for awareness: staff now see every ledger
  entry (delta, reason, linked help request) in the admin console, so keep
  `karma_ledger.reason` values stable and machine-readable. The admin UI
  labels `rating` (written by mobile's `submit_rating`, migration 0008) and
  shows unknown reasons raw.
- Ratings (stars + comments) are displayed read-only on the admin user
  detail and session review screens. Rating comments are still NOT a report
  target — coordinate before exposing a "report this rating" flow.

## 8. Staff notification operations (web TASK-008, added 2026-06-12)

- Policy `notifications_staff_read`: staff read every user's `notifications`
  rows in the admin console (bodies are generated, non-sensitive text per
  mobile 0009's design). Self-access for regular users is unchanged.
- New RPC `admin_send_notification(target_user_id, message, push_title)` —
  staff-only, audited (`notification_send`), single-target. It calls
  `private.notify_user` (mobile 0009), so the recipient gets a normal
  in-app row with `kind = 'system'` and `data = {"type": "admin_message"}`
  plus a push on registered devices.
- **Mobile action:** make the notification tap handler tolerate the
  `admin_message` data type (no routing target — degrade to the
  notifications list, never crash). The current handler's "unknown type →
  list" fallback should already cover it; confirm.
- New RPC `admin_push_token_stats()` returns per-platform device/user counts
  only — raw Expo tokens are never exposed to the admin.

## 9. Admin analytics RPC (web TASK-009, added 2026-06-12)

`admin_analytics_overview()` — staff-only SECURITY DEFINER, returns
cross-table aggregates as one jsonb document (ADR-0008). It counts rows in
`messages`, `bookings`, and `subscriptions` (tables staff cannot read
directly) but exposes counts/sums only — no message content, no tokens.

- **Mobile action:** none. Listed so nobody mistakes it for a broadened read
  policy. If mobile ever adds an activity-event log (needed for real
  retention/DAU metrics) or moves subscription pricing into the DB, tell the
  web side — both are documented analytics gaps.

## 10. Inbound mobile changes affecting the admin (reviewed 2026-06-15)

Mobile shipped migrations 0010–0016. These were made by the mobile repo, not
the web side, but they touch shared behavior the admin depends on. There is no
dedicated mobile→web sync file, so they are recorded here from a review pass.

- **0010 `my_ban_status()` + `find_available_helpers` (SECURITY DEFINER).**
  Mobile now reads its own active ban from `bans` (expiry-based, not
  `profiles.is_banned`) and excludes blocked/banned users from matching. This
  partially closes open item 2 below.
- **0011 staff excluded from helper search.** `find_available_helpers` now
  skips any `user_roles` role `<> 'user'`, so staff/admin accounts never appear
  as bookable helpers. No admin impact; noted for awareness.
- **0014 / 0016 realtime publication populated** (`help_requests`, `messages`,
  `presence`, with `replica identity full`). No admin impact — the console
  doesn't subscribe to realtime.
- **0015 `accept_help_request` reuses ONE conversation per user-pair** and
  re-points `conversations.help_request_id` at the latest accepted request.
  This broke the anchor in the web `get_session_conversation_summary` RPC
  (TASK-006). **Fixed 2026-06-15 (ADR-0009):** the RPC now resolves the
  conversation by the request's participant pair and merges message/report
  activity across all of the pair's conversations, returning the latest as the
  canonical id. Forward-compatible with a future mobile legacy-conversation
  backfill.
- **0017 `submit_rating` now maintains `profiles.rating`** = `round(avg(stars),
  2)` over the ratee's `ratings` (was always 0.00 before; existing profiles
  backfilled). The admin user views and reputation tab read `profiles.rating`,
  so the ★ is now live. Treat it as derived from `ratings`; the web admin only
  reads it (no admin rating edit exists), so no action — awareness only.

## 11. Open items to coordinate (not yet done anywhere)

1. **`profiles.is_banned` is not maintained by the web ban RPCs**, yet mobile
   `accept_help_request` (0015) still gates banned helpers on
   `profiles.is_banned = true`. Consequence: a user banned via the web
   (`admin_ban_user` writes `bans` only) is correctly reported by
   `my_ban_status()` but is NOT blocked by `accept_help_request`'s stale-flag
   check. Decide: web RPCs also set `profiles.is_banned`, or
   `accept_help_request` switches to the expiry-based `bans` predicate. Until
   then the flag and `bans` disagree on web-issued bans.
2. **Banned-user enforcement on the mobile side** — partially done (0010
   excludes banned users from matching and adds `my_ban_status()`); still no
   RLS predicate blocking a banned user's own writes (posting, requesting).
3. **Report creation UI on mobile** should adopt the new target columns
   (session/conversation/message) so the web "Report signal" counts are
   accurate (ADR-0002).
4. **Appeals**: `bans.appeal_status` exists and the web shows it read-only;
   no flow writes it yet on either client.
5. ~~**Session conversation summary anchor (regression from 0015).**~~
   **RESOLVED 2026-06-15 (ADR-0009):** web RPC re-anchored by participant pair
   with activity merged across the pair's conversations. Optional follow-up
   still open on the mobile side: a backfill merging legacy per-pair
   conversations into one row (cosmetic — the web fix already handles the
   scattered rows correctly).

## Mobile-originated shared-schema change — 2026-06-16 (mobile TASK-011)

**Mobile added a partial unique index on `help_requests`** (mobile migration
`0018_one_active_request_per_requester.sql`):

```
create unique index help_requests_one_active_per_requester
  on public.help_requests (requester_id)
  where status in ('requested', 'accepted', 'in_session');
```

- Enforces **one active outgoing request per requester** so app resume is
  unambiguous. A concurrent duplicate insert now fails with `23505`; the mobile
  client catches it and surfaces the existing active request.
- **Implications for web/admin:** any admin tooling or seed/test fixture that
  creates `help_requests` for a user must not leave two rows in
  `requested|accepted|in_session` for the same `requester_id` — the insert will
  be rejected. Terminal states (`completed|rated|cancelled|expired`) are
  unconstrained, so history is unaffected.
- **Apply step (shared project `oxexcljzzemfenzogcnz`):** additive + reversible
  (`drop index if exists help_requests_one_active_per_requester`). Pre-check for
  existing violators before applying:
  `select requester_id, count(*) from help_requests
   where status in ('requested','accepted','in_session')
   group by 1 having count(*) > 1;`
- Expiry is intentionally NOT in the index predicate (`now()` isn't IMMUTABLE);
  the app treats an expired `requested` row as inactive.
