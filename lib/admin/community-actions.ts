"use server";

import { refresh } from "next/cache";

import { getStaffSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CommunityActionResult =
  | { kind: "ok" }
  | { kind: "unauthenticated" }
  | { kind: "unauthorized" }
  | { kind: "error"; message: string };

type RpcError = { code?: string; message?: string };

function mapRpcError(error: RpcError, fallback: string): CommunityActionResult {
  console.error("[admin/community-actions]", fallback, error.code ?? "", error.message ?? "");

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

async function requireStaff(): Promise<CommunityActionResult | null> {
  const session = await getStaffSession();

  if (session.kind === "unauthenticated") {
    return { kind: "unauthenticated" };
  }

  if (session.kind !== "staff") {
    return { kind: "unauthorized" };
  }

  return null;
}

export async function setPostVisibility(
  postId: number,
  hide: boolean,
  reason?: string,
): Promise<CommunityActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  if (!Number.isInteger(postId)) {
    return { kind: "error", message: "Requête de modération invalide." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_set_post_visibility", {
    target_post_id: postId,
    hide,
    reason: reason?.trim() || null,
  });

  if (error) {
    return mapRpcError(
      error,
      hide ? "Impossible de masquer la publication." : "Impossible de rétablir la publication.",
    );
  }

  refresh();
  return { kind: "ok" };
}

export async function setCommentVisibility(
  commentId: number,
  hide: boolean,
  reason?: string,
): Promise<CommunityActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  if (!Number.isInteger(commentId)) {
    return { kind: "error", message: "Requête de modération invalide." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_set_comment_visibility", {
    target_comment_id: commentId,
    hide,
    reason: reason?.trim() || null,
  });

  if (error) {
    return mapRpcError(
      error,
      hide ? "Impossible de masquer le commentaire." : "Impossible de rétablir le commentaire.",
    );
  }

  refresh();
  return { kind: "ok" };
}
