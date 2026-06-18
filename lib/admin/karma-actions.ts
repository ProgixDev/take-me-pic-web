"use server";

import { refresh } from "next/cache";

import { getStaffSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type KarmaActionResult =
  | { kind: "ok" }
  | { kind: "unauthenticated" }
  | { kind: "unauthorized" }
  | { kind: "error"; message: string };

type RpcError = { code?: string; message?: string };

const RARITIES = ["commun", "rare", "légendaire"];

function mapError(error: RpcError, fallback: string): KarmaActionResult {
  console.error("[admin/karma-actions]", fallback, error.code ?? "", error.message ?? "");
  if (error.code === "42501") return { kind: "unauthorized" };
  return { kind: "error", message: fallback };
}

async function requireStaff(): Promise<KarmaActionResult | null> {
  const session = await getStaffSession();
  if (session.kind === "unauthenticated") return { kind: "unauthenticated" };
  if (session.kind !== "staff") return { kind: "unauthorized" };
  return null;
}

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);
}

// Edit a karma rule's point value / active flag. For the wired 'rating' rule
// `points` is the live per-star multiplier consumed by submit_rating.
export async function updateKarmaRule(
  code: string,
  patch: { points?: number; active?: boolean },
): Promise<KarmaActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.points !== undefined) {
    if (!Number.isInteger(patch.points) || patch.points < 0) {
      return { kind: "error", message: "Valeur de points invalide." };
    }
    update.points = patch.points;
  }
  if (patch.active !== undefined) update.active = patch.active;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("karma_rules").update(update).eq("code", code);
  if (error) return mapError(error, "Impossible de mettre à jour la règle.");

  refresh();
  return { kind: "ok" };
}

// Create a badge (cosmetic fields only). Inserted inactive with no criteria so
// it holds zero members until a threshold is configured — never a match-all.
export async function createBadge(form: {
  name: string;
  emoji: string;
  description: string;
  rarity: string;
}): Promise<KarmaActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const name = form.name.trim();
  if (!name) return { kind: "error", message: "Le nom du badge est obligatoire." };
  if (!RARITIES.includes(form.rarity)) return { kind: "error", message: "Rareté invalide." };

  const code = slugify(name);
  if (!code) return { kind: "error", message: "Nom de badge invalide." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("badges").insert({
    code,
    name,
    emoji: form.emoji || "🏅",
    description: form.description ?? "",
    rarity: form.rarity,
    active: false,
    sort: 99,
  });
  if (error) return mapError(error, "Impossible de créer le badge.");

  refresh();
  return { kind: "ok" };
}

export async function updateBadge(
  code: string,
  form: { name: string; emoji: string; description: string; rarity: string },
): Promise<KarmaActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  if (!form.name.trim()) return { kind: "error", message: "Le nom du badge est obligatoire." };
  if (!RARITIES.includes(form.rarity)) return { kind: "error", message: "Rareté invalide." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("badges")
    .update({
      name: form.name.trim(),
      emoji: form.emoji || "🏅",
      description: form.description ?? "",
      rarity: form.rarity,
    })
    .eq("code", code);
  if (error) return mapError(error, "Impossible de mettre à jour le badge.");

  refresh();
  return { kind: "ok" };
}
