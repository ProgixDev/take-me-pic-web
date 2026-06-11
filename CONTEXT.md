# Take Me Pic Web Context

This context describes the product language used by the Take Me Pic web and admin console.

## Language

**Staff-only**:
Access limited to authenticated admin users who hold the capability required for the operational task.
_Avoid_: Any admin, logged-in admin

**Live staff access**:
Staff access proven by a server-verified Supabase session and role capability.
_Avoid_: Mock admin access, local browser flag

**Staff account**:
A pre-created Supabase Auth account used by an internal team member to access admin workflows.
_Avoid_: Public signup account, mobile user account

**Effective capability**:
A permission granted to a staff account after resolving all of that account's staff roles.
_Avoid_: UI role label, single role name

**view_session_conversation_summary**:
The effective capability that allows staff to view metadata-only conversation summaries during session review.
_Avoid_: view_messages, view_chat, view_conversation

**Conversation metadata**:
Non-content facts about a session conversation, such as participant membership, message counts, timestamps, and review state.
_Avoid_: Chat content, message body, media preview

**Conversation summary**:
A metadata-only support view of a session conversation.
_Avoid_: Message preview, chat transcript, media preview

**Session review**:
An admin support view of a photo session and its operational context.
_Avoid_: Conversation review, database record review

**Help request**:
The backend record that represents a photo help session request and its assigned helper lifecycle.
_Avoid_: Mock session ID, conversation ID

**No conversation yet**:
A valid session state where no chat has been opened for the session.
_Avoid_: Missing conversation, broken chat

**Unauthorized session review**:
A blocked session review attempt by an authenticated admin who lacks the required capability.
_Avoid_: Missing session, hidden session

**Privileged content review**:
Staff access to private message bodies, media, or transcripts for support or safety handling.
_Avoid_: Conversation summary, metadata review

**Report signal**:
A minimal risk indicator that the reviewed session or conversation has directly related reports, expressed as a report count.
_Avoid_: Report detail, moderation case

**Participant role**:
The session-side role a person holds in a photo help interaction, such as requester or helper.
_Avoid_: User profile, participant identity

**Message activity**:
Metadata showing that messages were sent in a session conversation, such as counts and first or last sent times.
_Avoid_: Read receipt, delivery state, typing state, presence

**Moderation read access**:
The effective capability that allows staff to read reports, bans, and the audit log.
_Avoid_: Admin read, database access

**Report target**:
The single directly referenced subject of a report: a user, a post, a comment, a session, a conversation, or a message.
_Avoid_: Reported participant, implied target

**Moderation empty state**:
A valid moderation view state where the backend returned zero rows for an authorized staff read.
_Avoid_: Mock fallback, load failure

**Moderation mutation**:
A staff-only write that changes moderation state and always produces an audit entry.
_Avoid_: Direct table write, manual fix

**Report decision**:
A staff status change on a report to reviewing, resolved, or dismissed.
_Avoid_: Report edit, report deletion

**Active ban**:
A ban with no expiry or with an expiry in the future.
_Avoid_: Permanent ban, ban row

**Ban lift**:
Ending an active ban by expiring it immediately while keeping the ban history.
_Avoid_: Ban deletion, ban removal

**Account status**:
The operational state of a user account derived from its active ban: active, suspended for a temporary ban, banned for a permanent ban.
_Avoid_: Profile flag, pending account

**Verification state**:
The trust level of a profile derived from its verification fields: verified, partial when only e-mail or phone is confirmed, none otherwise.
_Avoid_: KYC status, identity check

**Staff roster**:
The list of accounts holding staff roles, read from server-side role grants.
_Avoid_: Team page list, invited members

**Support inspection**:
A read-only staff view of help request lifecycles and session metadata.
_Avoid_: Session moderation, chat review

**Session**:
A help request whose helper is engaged: accepted, in session, completed, or rated.
_Avoid_: Conversation, booking

## Relationships

- A **Staff-only** workflow requires a task-specific capability.
- **Staff-only** workflows require **Live staff access** once connected to Supabase-backed admin data.
- **Live staff access** starts from a **Staff account**.
- A **Staff account** may have one or more roles that resolve to **Effective capabilities**.
- **view_session_conversation_summary** grants access to **Conversation summaries** only.
- **Conversation metadata** excludes message bodies and media by default.
- A **Conversation summary** is made from **Conversation metadata** only.
- A **Session review** is anchored by a **Help request**.
- A **Session review** may include a **Conversation summary** without exposing chat content.
- A **Session review** can have **No conversation yet** without being an error.
- An **Unauthorized session review** is distinct from a missing session.
- A **Conversation summary** is not a **Privileged content review**.
- A **Conversation summary** may include a **Report signal** without exposing report details.
- A **Conversation summary** may include **Participant roles** without duplicating participant identities.
- A **Conversation summary** may include **Message activity** but not read, delivery, typing, or presence state.
- A **Conversation summary** can exist for any session status when staff have the required capability.
- **Moderation read access** is an **Effective capability** held by every staff role in the trust-and-safety foundation phase.
- A report has exactly one **Report target**.
- A **Report signal** counts reports whose **Report target** is the reviewed session or conversation.
- A **Moderation empty state** is distinct from a load failure, and a load failure never shows raw backend errors to staff.
- A **Moderation mutation** requires **Live staff access** and writes a matching audit entry in the same transaction.
- A terminal **Report decision** (resolved or dismissed) records which staff account decided it.
- A **Ban lift** ends an **Active ban** without deleting its history.
- An **Account status** is derived from the **Active ban** state, never from a stored flag.
- A **Session** is a **Help request** in a helper-engaged lifecycle state.
- **Support inspection** covers lifecycle metadata and never exposes chat content or session photos.
- A **Staff roster** reflects role grants; account e-mails stay in Supabase Auth and are not part of admin reads.

## Example dialogue

> **Dev:** "Can every admin open **Conversation metadata** on a session?"
> **Domain expert:** "No — it is **Staff-only**, meaning the admin must hold the specific review capability."
> **Dev:** "Can a local browser flag satisfy **Staff-only** access?"
> **Domain expert:** "No — Supabase-backed admin data requires **Live staff access**."
> **Dev:** "Can someone create their own admin account from the public site?"
> **Domain expert:** "No — admin access starts from a pre-created **Staff account**."
> **Dev:** "Should the UI role label decide whether staff can see a summary?"
> **Domain expert:** "No — access is based on the staff account's **Effective capabilities**."
> **Dev:** "Does **view_session_conversation_summary** allow staff to read messages?"
> **Domain expert:** "No — it only allows metadata-only **Conversation summaries**."
> **Dev:** "Should the **Conversation summary** include the latest message text?"
> **Domain expert:** "No — summaries are metadata-only unless a separate content review policy allows more."
> **Dev:** "Should the admin route open a conversation directly?"
> **Domain expert:** "No — staff open a **Session review** anchored by a **Help request**, and the system includes any available **Conversation summary**."
> **Dev:** "Should a pending session without chat fail?"
> **Domain expert:** "No — it is **No conversation yet**, which is a normal empty state."
> **Dev:** "Should a support screen say a session is missing when the admin lacks access?"
> **Domain expert:** "No — that is an **Unauthorized session review**."
> **Dev:** "Should opening a metadata-only **Conversation summary** be audited as protected content access?"
> **Domain expert:** "No — audit starts with **Privileged content review**, not metadata review."
> **Dev:** "Should the **Conversation summary** show full report details?"
> **Domain expert:** "No — it should show only a **Report signal** and link staff to the moderation workflow."
> **Dev:** "Should the **Report signal** include old reports against either participant?"
> **Domain expert:** "No — it only counts reports directly related to the reviewed session or conversation."
> **Dev:** "Should the **Conversation summary** return full user profiles?"
> **Domain expert:** "No — the **Session review** owns identity, while the summary can show **Participant roles**."
> **Dev:** "Should support see whether each participant read the messages?"
> **Domain expert:** "No — the summary shows **Message activity** only."
> **Dev:** "Should cancelled sessions hide their **Conversation summary**?"
> **Domain expert:** "No — session status does not change the staff capability requirement."

## Flagged ambiguities

- "staff-only" was ambiguous between any admin account and capability-based access — resolved: use capability-based access.
- "Supabase connected" was ambiguous between client plumbing and real authorization — resolved: admin data requires **Live staff access**.
- "admin login" was ambiguous between public signup and internal access — resolved: use pre-created **Staff accounts**.
- "role" was ambiguous between UI labels and authorization — resolved: staff access is decided by **Effective capabilities**.
- "view conversation" was too broad for the first capability — resolved: use **view_session_conversation_summary**.
- "summary" was ambiguous between metadata and redacted content — resolved: a **Conversation summary** contains metadata only.
- "session conversation" was ambiguous between a route identity and a conversation identity — resolved: staff review sessions, while conversations are supporting context.
- "session ID" was ambiguous between mock web IDs and backend records — resolved: the backend anchor is a **Help request**.
- "no conversation" was ambiguous between missing data and a valid empty state — resolved: **No conversation yet** is valid.
- "not found" was ambiguous between missing sessions and blocked access — resolved: blocked access is an **Unauthorized session review**.
- "chat review" was ambiguous between metadata and content access — resolved: **Privileged content review** means private body, media, or transcript access.
- "has reports" was too weak and "report details" was too broad — resolved: use a **Report signal** with a report count.
- "participant" was ambiguous between role and identity — resolved: summaries expose **Participant roles**, not profiles.
- "activity" was ambiguous between sent-message metadata and communication diagnostics — resolved: **Message activity** excludes read, delivery, typing, and presence state.
- "report target" was ambiguous between the reported participant and the directly referenced subject — resolved: a report points at one **Report target**, including session, conversation, and message targets.
- "no data" was ambiguous between empty tables and failed reads — resolved: zero rows is a **Moderation empty state**; failures are surfaced as generic error states without raw backend messages.
- "staff can read moderation" was ambiguous between per-role rules and a shared capability — resolved: **Moderation read access** is granted to all staff roles in the current phase.
- "unban" was ambiguous between deleting a ban and ending it — resolved: a **Ban lift** expires the **Active ban** and keeps history.
- "resolve a report" was ambiguous between any status change and a terminal decision — resolved: a **Report decision** covers reviewing, resolved, and dismissed, and terminal decisions record the resolver.
- "audit logging" was ambiguous between best-effort and guaranteed — resolved: a **Moderation mutation** and its audit entry succeed or fail together.
- "user status" was ambiguous between stored flags and ban-derived state — resolved: **Account status** derives from the **Active ban**; the `is_banned` profile flag is not an authority.
- "user email" was ambiguous between profile data and auth data — resolved: e-mails live in Supabase Auth and are not exposed in admin reads.
- "requests vs sessions" was ambiguous as two entities — resolved: both are **Help requests**; the sessions view filters helper-engaged states.
- "staff can see sessions" silently returned a partial list — resolved: staff hold a read policy on help request lifecycles, while chat stays behind the metadata RPC.
- "roles & permissions screen" implied an editable matrix — resolved: it reflects the real **Staff roster** read-only until differentiated capabilities exist server-side.
