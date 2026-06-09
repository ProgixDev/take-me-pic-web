# Use an RPC for Session Conversation Summaries

The session conversation summary crosses private chat tables whose RLS is intentionally limited to conversation participants. We will expose metadata-only summaries to staff through a narrow backend RPC that performs the staff role check and returns only approved aggregate fields, instead of broadening table policies or aggregating private chat data in the web client.

**Considered Options**

- Broaden staff RLS access to `conversations` and `messages`.
- Query tables directly from the web app and redact in application code.
- Use a backend RPC that returns only safe summary metadata.

**Consequences**

The RPC becomes the contract for staff session conversation metadata. Any future message-body or media review must use a separate privileged content-review boundary with audit logging.
