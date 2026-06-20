"use server";

import { refresh } from "next/cache";

import { getStaffSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type StaffDenial = { kind: "unauthenticated" } | { kind: "unauthorized" };

export type StoryActionResult = { kind: "ok" } | StaffDenial | { kind: "error"; message: string };

type DbError = { code?: string; message?: string };

function mapDbError(error: DbError, fallback: string): { kind: "unauthorized" } | { kind: "error"; message: string } {
  console.error("[admin/stories-actions]", fallback, error.code ?? "", error.message ?? "");
  if (error.code === "42501") return { kind: "unauthorized" };
  return { kind: "error", message: fallback };
}

// Staff takedown of a story via the admin_remove_story RPC (soft-remove + audit).
export async function removeStory(storyId: number, reason?: string): Promise<StoryActionResult> {
  const session = await getStaffSession();
  if (session.kind !== "staff") return session.kind === "unauthenticated" ? { kind: "unauthenticated" } : { kind: "unauthorized" };

  if (!Number.isInteger(storyId)) return { kind: "error", message: "Story introuvable." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_remove_story", {
    target_story_id: storyId,
    reason: reason?.trim() || null,
  });
  if (error) return mapDbError(error, "Impossible de retirer cette story.");

  refresh();
  return { kind: "ok" };
}
