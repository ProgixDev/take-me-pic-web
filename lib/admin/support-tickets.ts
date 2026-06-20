import "server-only";

import {
  loadProfiles,
  mapQueryError,
  requireStaffSession,
  type ModerationQueryResult,
  type ProfileSummary,
} from "@/lib/admin/moderation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type TicketCategory = "compte" | "paiement" | "securite" | "technique" | "autre";
export type TicketPriority = "basse" | "normale" | "haute";
export type TicketStatus = "ouvert" | "en_cours" | "resolu";

export type SupportTicketListItem = {
  id: number;
  subject: string;
  user: ProfileSummary | null;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: ProfileSummary | null;
  createdAt: string;
  updatedAt: string;
};

export type SupportTicketReply = {
  id: number;
  author: ProfileSummary | null;
  isStaff: boolean;
  body: string;
  createdAt: string;
};

export type SupportTicketDetail = SupportTicketListItem & {
  body: string;
  replies: SupportTicketReply[];
};

type TicketRow = {
  id: number;
  user_id: string;
  subject: string;
  body: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
};

const TICKET_COLUMNS =
  "id, user_id, subject, body, category, priority, status, assigned_to, created_at, updated_at";

export async function getSupportTicketsReadModel(): Promise<
  ModerationQueryResult<SupportTicketListItem[]>
> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .select(TICKET_COLUMNS)
    .order("updated_at", { ascending: false })
    .limit(200);

  if (error) return mapQueryError(error, "Impossible de charger les tickets de support.");

  const rows = (data ?? []) as TicketRow[];

  let profiles: Map<string, ProfileSummary>;
  try {
    profiles = await loadProfiles(
      supabase,
      rows.flatMap((row) => [row.user_id, row.assigned_to].filter(Boolean) as string[]),
    );
  } catch (profileError) {
    return mapQueryError(profileError as { code?: string; message?: string }, "Impossible de charger les profils associés.");
  }

  return {
    kind: "ok",
    data: rows.map<SupportTicketListItem>((row) => ({
      id: row.id,
      subject: row.subject,
      user: profiles.get(row.user_id) ?? null,
      category: row.category,
      priority: row.priority,
      status: row.status,
      assignedTo: row.assigned_to ? profiles.get(row.assigned_to) ?? null : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })),
  };
}

export async function getSupportTicketDetailReadModel(
  ticketId: number,
): Promise<ModerationQueryResult<SupportTicketDetail> | { kind: "not_found" }> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  if (!Number.isInteger(ticketId)) return { kind: "not_found" };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .select(TICKET_COLUMNS)
    .eq("id", ticketId)
    .maybeSingle();

  if (error) return mapQueryError(error, "Impossible de charger ce ticket.");
  if (!data) return { kind: "not_found" };

  const row = data as TicketRow;

  const repliesResult = await supabase
    .from("support_ticket_replies")
    .select("id, ticket_id, author_id, is_staff, body, created_at")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  if (repliesResult.error) return mapQueryError(repliesResult.error, "Impossible de charger les réponses.");

  const replyRows = (repliesResult.data ?? []) as {
    id: number;
    author_id: string | null;
    is_staff: boolean;
    body: string;
    created_at: string;
  }[];

  let profiles: Map<string, ProfileSummary>;
  try {
    profiles = await loadProfiles(supabase, [
      row.user_id,
      ...(row.assigned_to ? [row.assigned_to] : []),
      ...replyRows.map((r) => r.author_id).filter(Boolean) as string[],
    ]);
  } catch (profileError) {
    return mapQueryError(profileError as { code?: string; message?: string }, "Impossible de charger les profils associés.");
  }

  return {
    kind: "ok",
    data: {
      id: row.id,
      subject: row.subject,
      body: row.body,
      user: profiles.get(row.user_id) ?? null,
      category: row.category,
      priority: row.priority,
      status: row.status,
      assignedTo: row.assigned_to ? profiles.get(row.assigned_to) ?? null : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      replies: replyRows.map<SupportTicketReply>((r) => ({
        id: r.id,
        author: r.author_id ? profiles.get(r.author_id) ?? null : null,
        isStaff: r.is_staff,
        body: r.body,
        createdAt: r.created_at,
      })),
    },
  };
}
