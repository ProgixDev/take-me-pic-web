import "server-only";

import { mapQueryError, requireStaffSession, type ModerationQueryResult } from "@/lib/admin/moderation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type RetentionPoint = { week: string; value: number };
export type RetentionCohort = { label: string; size: number; points: RetentionPoint[] };
export type RetentionModel = { curve: RetentionPoint[]; cohorts: RetentionCohort[] };

// round() in the RPC yields numeric, which serializes to a JSON string — coerce.
function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function parsePoints(raw: unknown): RetentionPoint[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((p) => ({ week: String((p as { week?: unknown }).week ?? ""), value: num((p as { value?: unknown }).value) }));
}

export async function getRetentionReadModel(): Promise<ModerationQueryResult<RetentionModel>> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("get_admin_retention");
  if (error) return mapQueryError(error, "Impossible de charger la rétention.");

  const raw = (data ?? {}) as { curve?: unknown; cohorts?: unknown };
  const cohorts = Array.isArray(raw.cohorts)
    ? raw.cohorts.map((c) => ({
        label: String((c as { label?: unknown }).label ?? ""),
        size: num((c as { size?: unknown }).size),
        points: parsePoints((c as { points?: unknown }).points),
      }))
    : [];

  return { kind: "ok", data: { curve: parsePoints(raw.curve), cohorts } };
}
