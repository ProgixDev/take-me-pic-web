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
