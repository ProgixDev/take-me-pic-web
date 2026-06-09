import "server-only";

import type {
  ConversationSummaryStatus,
  ParticipantRole,
  SessionConversationSummary,
  SessionConversationSummaryResult,
} from "@/lib/admin/session-conversation-types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type SessionConversationSummaryRpcRow = {
  help_request_id: number;
  conversation_id: number | null;
  status: string;
  participant_roles: string[] | null;
  participant_count: number | null;
  message_count: number | null;
  first_message_at: string | null;
  last_message_at: string | null;
  report_count: number | null;
};

function isParticipantRole(role: string): role is ParticipantRole {
  return role === "requester" || role === "helper";
}

function toSummary(row: SessionConversationSummaryRpcRow): SessionConversationSummary {
  const status: ConversationSummaryStatus =
    row.status === "active" ? "active" : "not_started";

  return {
    helpRequestId: row.help_request_id,
    conversationId: row.conversation_id,
    status,
    participantRoles: (row.participant_roles ?? []).filter(isParticipantRole),
    participantCount: row.participant_count ?? 0,
    messageCount: row.message_count ?? 0,
    firstMessageAt: row.first_message_at,
    lastMessageAt: row.last_message_at,
    reportCount: row.report_count ?? 0,
  };
}

function mapRpcError(error: { code?: string; message?: string }): SessionConversationSummaryResult {
  if (error.code === "42501") {
    return { kind: "unauthorized" };
  }

  if (error.code === "P0002") {
    return { kind: "not_found" };
  }

  return {
    kind: "error",
    message: error.message ?? "Unable to load session conversation summary.",
  };
}

export async function getSessionConversationSummary(
  helpRequestId: number,
): Promise<SessionConversationSummaryResult> {
  const supabase = await createSupabaseServerClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return { kind: "unauthenticated" };
  }

  const { data, error } = await supabase.rpc("get_session_conversation_summary", {
    target_help_request_id: helpRequestId,
  });

  if (error) {
    return mapRpcError(error);
  }

  const rows = (Array.isArray(data) ? data : []) as SessionConversationSummaryRpcRow[];
  const row = rows[0];

  if (!row) {
    return { kind: "not_found" };
  }

  return { kind: "ok", summary: toSummary(row) };
}
