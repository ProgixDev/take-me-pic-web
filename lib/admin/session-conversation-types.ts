export type ConversationSummaryStatus = "not_started" | "active";
export type ParticipantRole = "requester" | "helper";

export type SessionConversationSummary = {
  helpRequestId: number;
  conversationId: number | null;
  status: ConversationSummaryStatus;
  participantRoles: ParticipantRole[];
  participantCount: number;
  messageCount: number;
  firstMessageAt: string | null;
  lastMessageAt: string | null;
  reportCount: number;
};

export type SessionConversationSummaryResult =
  | { kind: "ok"; summary: SessionConversationSummary }
  | { kind: "unauthenticated" }
  | { kind: "unauthorized" }
  | { kind: "not_found" }
  | { kind: "error"; message: string };
