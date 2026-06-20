"use server";

import { refresh } from "next/cache";

import { getStaffSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ModerationActionResult =
  | { kind: "ok" }
  | { kind: "unauthenticated" }
  | { kind: "unauthorized" }
  | { kind: "error"; message: string };

export type ReportDecisionStatus = "reviewing" | "resolved" | "dismissed";

const REPORT_DECISION_STATUSES: ReportDecisionStatus[] = ["reviewing", "resolved", "dismissed"];

type RpcError = { code?: string; message?: string };

function mapRpcError(error: RpcError, fallback: string): ModerationActionResult {
  console.error("[admin/moderation-actions]", fallback, error.code ?? "", error.message ?? "");

  if (error.code === "42501") {
    return { kind: "unauthorized" };
  }

  if (error.code === "P0002") {
    return { kind: "error", message: "La cible de l'action est introuvable." };
  }

  if (error.code === "P0001") {
    return { kind: "error", message: "L'action est en conflit avec l'état actuel." };
  }

  return { kind: "error", message: fallback };
}

async function requireStaff(): Promise<ModerationActionResult | null> {
  const session = await getStaffSession();

  if (session.kind === "unauthenticated") {
    return { kind: "unauthenticated" };
  }

  if (session.kind !== "staff") {
    return { kind: "unauthorized" };
  }

  return null;
}

export async function updateReportStatus(
  reportId: number,
  status: ReportDecisionStatus,
): Promise<ModerationActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  if (!Number.isInteger(reportId) || !REPORT_DECISION_STATUSES.includes(status)) {
    return { kind: "error", message: "Requête de modération invalide." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_update_report_status", {
    target_report_id: reportId,
    new_status: status,
  });

  if (error) {
    return mapRpcError(error, "Impossible de mettre à jour le signalement.");
  }

  refresh();
  return { kind: "ok" };
}

export async function banUser(
  userId: string,
  reason: string,
  options?: { expiresAt?: string | null; sourceReportId?: number | null },
): Promise<ModerationActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const trimmedReason = reason.trim();
  if (!userId || trimmedReason.length === 0) {
    return { kind: "error", message: "Un utilisateur et un motif sont requis pour un ban." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_ban_user", {
    target_user_id: userId,
    ban_reason: trimmedReason,
    ban_expires_at: options?.expiresAt ?? null,
    source_report_id: options?.sourceReportId ?? null,
  });

  if (error) {
    return mapRpcError(error, "Impossible de bannir cet utilisateur.");
  }

  refresh();
  return { kind: "ok" };
}

export async function unbanUser(banId: number): Promise<ModerationActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  if (!Number.isInteger(banId)) {
    return { kind: "error", message: "Requête de modération invalide." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_unban_user", {
    target_ban_id: banId,
  });

  if (error) {
    return mapRpcError(error, "Impossible de lever ce ban.");
  }

  refresh();
  return { kind: "ok" };
}

export type AppealDecision = "accept" | "reject";

// Accept (lift the ban + mark resolved) or reject (mark dismissed) a ban appeal
// via the admin_resolve_appeal RPC.
export async function resolveAppeal(
  banId: number,
  decision: AppealDecision,
): Promise<ModerationActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  if (!Number.isInteger(banId) || (decision !== "accept" && decision !== "reject")) {
    return { kind: "error", message: "Requête d'appel invalide." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_resolve_appeal", {
    target_ban_id: banId,
    decision,
  });

  if (error) {
    return mapRpcError(error, "Impossible de traiter cet appel.");
  }

  refresh();
  return { kind: "ok" };
}
