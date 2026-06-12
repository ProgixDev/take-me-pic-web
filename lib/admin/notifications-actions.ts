"use server";

import { refresh } from "next/cache";

import { getStaffSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type NotificationActionResult =
  | { kind: "ok" }
  | { kind: "unauthenticated" }
  | { kind: "unauthorized" }
  | { kind: "error"; message: string };

type RpcError = { code?: string; message?: string };

const MAX_MESSAGE_LENGTH = 320;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function mapRpcError(error: RpcError, fallback: string): NotificationActionResult {
  console.error("[admin/notifications-actions]", fallback, error.code ?? "", error.message ?? "");

  if (error.code === "42501") {
    return { kind: "unauthorized" };
  }

  if (error.code === "P0002") {
    return { kind: "error", message: "Aucun profil ne correspond à ce destinataire." };
  }

  if (error.code === "22023") {
    return { kind: "error", message: "Le message doit faire entre 1 et 320 caractères." };
  }

  return { kind: "error", message: fallback };
}

async function requireStaff(): Promise<NotificationActionResult | null> {
  const session = await getStaffSession();

  if (session.kind === "unauthenticated") {
    return { kind: "unauthenticated" };
  }

  if (session.kind !== "staff") {
    return { kind: "unauthorized" };
  }

  return null;
}

// Sends a single-target system notification (in-app row + push) through the
// audited admin_send_notification RPC (ADR-0007). `target` accepts a profile
// UUID or a username.
export async function sendUserNotification(
  target: string,
  message: string,
  pushTitle?: string,
): Promise<NotificationActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const trimmedTarget = target.trim().replace(/^@/, "");
  const trimmedMessage = message.trim();

  if (trimmedTarget.length === 0) {
    return { kind: "error", message: "Un destinataire est requis." };
  }

  if (trimmedMessage.length === 0 || trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return { kind: "error", message: "Le message doit faire entre 1 et 320 caractères." };
  }

  const supabase = await createSupabaseServerClient();

  let targetUserId = trimmedTarget;
  if (!UUID_PATTERN.test(trimmedTarget)) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", trimmedTarget)
      .maybeSingle();

    if (error) {
      return mapRpcError(error, "Impossible de résoudre le destinataire.");
    }
    if (!data) {
      return { kind: "error", message: "Aucun profil ne correspond à ce destinataire." };
    }
    targetUserId = (data as { id: string }).id;
  }

  const { error } = await supabase.rpc("admin_send_notification", {
    target_user_id: targetUserId,
    message: trimmedMessage,
    push_title: pushTitle?.trim() || null,
  });

  if (error) {
    return mapRpcError(error, "Impossible d'envoyer la notification.");
  }

  refresh();
  return { kind: "ok" };
}
