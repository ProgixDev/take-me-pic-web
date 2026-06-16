"use server";

import { refresh } from "next/cache";

import { getStaffSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SpotActionResult =
  | { kind: "ok" }
  | { kind: "unauthenticated" }
  | { kind: "unauthorized" }
  | { kind: "error"; message: string };

export type SpotDecision = "approved" | "rejected";

const SPOT_DECISIONS: SpotDecision[] = ["approved", "rejected"];

type RpcError = { code?: string; message?: string };

function mapRpcError(error: RpcError, fallback: string): SpotActionResult {
  console.error("[admin/spots-actions]", fallback, error.code ?? "", error.message ?? "");

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

async function requireStaff(): Promise<SpotActionResult | null> {
  const session = await getStaffSession();

  if (session.kind === "unauthenticated") {
    return { kind: "unauthenticated" };
  }

  if (session.kind !== "staff") {
    return { kind: "unauthorized" };
  }

  return null;
}

export type SpotCreateInput = {
  name: string;
  city?: string | null;
  bestTime?: string | null;
  heroUrl?: string | null;
  isSponsored?: boolean;
};

// Create a spot from the admin console. It lands in the moderation queue
// (status defaults to 'pending'); a staff member then approves it via
// reviewSpot before the community (and the mobile app) can see it. RLS
// (spots_insert) requires created_by = auth.uid(), so we stamp the staff uid.
export async function createSpot(input: SpotCreateInput): Promise<SpotActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const name = input.name?.trim();
  if (!name) {
    return { kind: "error", message: "Le nom du spot est obligatoire." };
  }

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData.user?.id;
  if (!uid) {
    return { kind: "unauthenticated" };
  }

  const { error } = await supabase.from("spots").insert({
    name,
    city: input.city?.trim() || null,
    best_time: input.bestTime?.trim() || null,
    hero_url: input.heroUrl?.trim() || null,
    is_sponsored: input.isSponsored ?? false,
    created_by: uid,
  });

  if (error) {
    return mapRpcError(error, "Impossible de créer ce spot.");
  }

  refresh();
  return { kind: "ok" };
}

export async function reviewSpot(
  spotId: number,
  decision: SpotDecision,
  reason?: string,
): Promise<SpotActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  if (!Number.isInteger(spotId) || !SPOT_DECISIONS.includes(decision)) {
    return { kind: "error", message: "Requête de modération invalide." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_review_spot", {
    target_spot_id: spotId,
    decision,
    reason: reason?.trim() || null,
  });

  if (error) {
    return mapRpcError(
      error,
      decision === "approved" ? "Impossible d'approuver ce spot." : "Impossible de rejeter ce spot.",
    );
  }

  refresh();
  return { kind: "ok" };
}
