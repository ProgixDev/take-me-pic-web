# Add Direct Report Targets for Session and Chat Context

Session conversation summaries need a report count that reflects the reviewed session or conversation only. We will add nullable report target references for help requests, conversations, and messages instead of inferring risk from reports against either participant, because participant-level reports would make unrelated history look like session-specific risk.

**Consequences**

Existing post, comment, and user reports remain valid. Session/chat reports can now be counted accurately by support tooling without exposing full report details in conversation summaries.
