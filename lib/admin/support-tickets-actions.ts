"use server";

import { refresh } from "next/cache";

import { getStaffSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TicketStatus } from "@/lib/admin/support-tickets";

type StaffDenial = { kind: "unauthenticated" } | { kind: "unauthorized" };

export type SupportActionResult = { kind: "ok" } | StaffDenial | { kind: "error"; message: string };

type DbError = { code?: string; message?: string };

function mapDbError(error: DbError, fallback: string): { kind: "unauthorized" } | { kind: "error"; message: string } {
  console.error("[admin/support-tickets-actions]", fallback, error.code ?? "", error.message ?? "");
  if (error.code === "42501") return { kind: "unauthorized" };
  return { kind: "error", message: fallback };
}

const STATUSES: TicketStatus[] = ["ouvert", "en_cours", "resolu"];

export async function updateTicketStatus(ticketId: number, status: TicketStatus): Promise<SupportActionResult> {
  const session = await getStaffSession();
  if (session.kind !== "staff") return session.kind === "unauthenticated" ? { kind: "unauthenticated" } : { kind: "unauthorized" };

  if (!Number.isInteger(ticketId) || !STATUSES.includes(status)) {
    return { kind: "error", message: "Requête de support invalide." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("support_tickets").update({ status }).eq("id", ticketId);
  if (error) return mapDbError(error, "Impossible de mettre à jour le ticket.");

  refresh();
  return { kind: "ok" };
}

// Claim a ticket for the current staff member (and move it off the open queue).
export async function assignTicketToMe(ticketId: number): Promise<SupportActionResult> {
  const session = await getStaffSession();
  if (session.kind !== "staff") return session.kind === "unauthenticated" ? { kind: "unauthenticated" } : { kind: "unauthorized" };

  if (!Number.isInteger(ticketId)) return { kind: "error", message: "Ticket introuvable." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("support_tickets")
    .update({ assigned_to: session.userId, status: "en_cours" })
    .eq("id", ticketId)
    .eq("status", "ouvert");
  if (error) return mapDbError(error, "Impossible d'assigner le ticket.");

  // Assign even if it was already en_cours (the status guard above only auto-moves
  // open tickets).
  const followUp = await supabase
    .from("support_tickets")
    .update({ assigned_to: session.userId })
    .eq("id", ticketId);
  if (followUp.error) return mapDbError(followUp.error, "Impossible d'assigner le ticket.");

  refresh();
  return { kind: "ok" };
}

// Post a staff reply. Inserts the message as the current staff member and moves
// an untouched (open) ticket into the en_cours state.
export async function replyToTicket(ticketId: number, body: string): Promise<SupportActionResult> {
  const session = await getStaffSession();
  if (session.kind !== "staff") return session.kind === "unauthenticated" ? { kind: "unauthenticated" } : { kind: "unauthorized" };

  const trimmed = body?.trim();
  if (!Number.isInteger(ticketId) || !trimmed) {
    return { kind: "error", message: "Le message ne peut pas être vide." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("support_ticket_replies").insert({
    ticket_id: ticketId,
    author_id: session.userId,
    is_staff: true,
    body: trimmed,
  });
  if (error) return mapDbError(error, "Impossible d'envoyer la réponse.");

  await supabase.from("support_tickets").update({ status: "en_cours" }).eq("id", ticketId).eq("status", "ouvert");

  refresh();
  return { kind: "ok" };
}
