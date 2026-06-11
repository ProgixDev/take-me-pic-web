import "server-only";

import {
  loadProfiles,
  mapQueryError,
  requireStaffSession,
  type ModerationQueryResult,
  type ProfileSummary,
} from "@/lib/admin/moderation";
import { getSessionConversationSummary } from "@/lib/admin/session-conversations";
import type { SessionConversationSummaryResult } from "@/lib/admin/session-conversation-types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type HelpRequestStatus =
  | "requested"
  | "accepted"
  | "in_session"
  | "completed"
  | "rated"
  | "cancelled"
  | "expired";

export const HELP_REQUEST_STATUSES: HelpRequestStatus[] = [
  "requested",
  "accepted",
  "in_session",
  "completed",
  "rated",
  "cancelled",
  "expired",
];

// Lifecycle states where a helper is engaged: what the admin "Sessions" view shows.
export const SESSION_STATUSES: HelpRequestStatus[] = ["accepted", "in_session", "completed", "rated"];

export type HelpRequestListItem = {
  id: number;
  requester: ProfileSummary | null;
  helper: ProfileSummary | null;
  status: HelpRequestStatus;
  peopleCount: number;
  note: string | null;
  createdAt: string;
  acceptedAt: string | null;
  sessionAt: string | null;
  completedAt: string | null;
  expiresAt: string | null;
};

export type HelpRequestDetail = HelpRequestListItem & {
  conversationSummary: SessionConversationSummaryResult;
  reportCount: number;
};

type HelpRequestRow = {
  id: number;
  requester_id: string;
  helper_id: string | null;
  status: HelpRequestStatus;
  people_count: number;
  note: string | null;
  created_at: string;
  accepted_at: string | null;
  session_at: string | null;
  completed_at: string | null;
  expires_at: string | null;
};

const REQUEST_COLUMNS =
  "id, requester_id, helper_id, status, people_count, note, created_at, accepted_at, session_at, completed_at, expires_at";

function toListItem(row: HelpRequestRow, profiles: Map<string, ProfileSummary>): HelpRequestListItem {
  return {
    id: row.id,
    requester: profiles.get(row.requester_id) ?? null,
    helper: row.helper_id ? profiles.get(row.helper_id) ?? null : null,
    status: row.status,
    peopleCount: row.people_count,
    note: row.note,
    createdAt: row.created_at,
    acceptedAt: row.accepted_at,
    sessionAt: row.session_at,
    completedAt: row.completed_at,
    expiresAt: row.expires_at,
  };
}

async function listHelpRequests(
  statuses: HelpRequestStatus[] | null,
): Promise<ModerationQueryResult<HelpRequestListItem[]>> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("help_requests")
    .select(REQUEST_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(100);

  if (statuses) {
    query = query.in("status", statuses);
  }

  const { data, error } = await query;

  if (error) return mapQueryError(error, "Impossible de charger les demandes.");

  const rows = (data ?? []) as unknown as HelpRequestRow[];

  try {
    const profiles = await loadProfiles(
      supabase,
      rows.flatMap((row) => [row.requester_id, row.helper_id].filter(Boolean) as string[]),
    );

    return { kind: "ok", data: rows.map((row) => toListItem(row, profiles)) };
  } catch (enrichError) {
    return mapQueryError(enrichError as { code?: string; message?: string }, "Impossible de charger les profils associés.");
  }
}

export async function getHelpRequestsReadModel() {
  return listHelpRequests(null);
}

export async function getSessionsReadModel() {
  return listHelpRequests(SESSION_STATUSES);
}

export async function getHelpRequestDetailReadModel(
  helpRequestId: number,
): Promise<ModerationQueryResult<HelpRequestDetail> | { kind: "not_found" }> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  if (!Number.isInteger(helpRequestId) || helpRequestId <= 0) {
    return { kind: "not_found" };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("help_requests")
    .select(REQUEST_COLUMNS)
    .eq("id", helpRequestId)
    .maybeSingle();

  if (error) return mapQueryError(error, "Impossible de charger cette demande.");
  if (!data) return { kind: "not_found" };

  const row = data as unknown as HelpRequestRow;

  try {
    const [profiles, conversationSummary, reportsResult] = await Promise.all([
      loadProfiles(supabase, [row.requester_id, row.helper_id].filter(Boolean) as string[]),
      getSessionConversationSummary(row.id),
      supabase
        .from("reports")
        .select("id", { count: "exact", head: true })
        .eq("help_request_id", row.id),
    ]);

    if (reportsResult.error) throw reportsResult.error;

    return {
      kind: "ok",
      data: {
        ...toListItem(row, profiles),
        conversationSummary,
        reportCount: reportsResult.count ?? 0,
      },
    };
  } catch (enrichError) {
    return mapQueryError(enrichError as { code?: string; message?: string }, "Impossible de charger le contexte de la demande.");
  }
}
