import "server-only";

import {
  mapQueryError,
  requireStaffSession,
  type ModerationQueryResult,
} from "@/lib/admin/moderation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// The "Manuel du voyageur" admin screen reads the mobile app's framing_tips
// table. There is no draft/published state and no view counter in the schema —
// every row is live content.
export type ManualTip = {
  id: number;
  position: number;
  color: string;
  title: string;
  body: string | null;
  thumbUrl: string | null;
  big: boolean;
};

type FramingTipRow = {
  id: number;
  position: number;
  color: string | null;
  title: string;
  body: string | null;
  thumb_url: string | null;
  big: boolean;
};

const TIP_COLUMNS = "id, position, color, title, body, thumb_url, big";

function toManualTip(row: FramingTipRow): ManualTip {
  return {
    id: row.id,
    position: row.position,
    color: row.color ?? "gold",
    title: row.title,
    body: row.body,
    thumbUrl: row.thumb_url,
    big: row.big,
  };
}

export async function getManualTipsReadModel(): Promise<ModerationQueryResult<ManualTip[]>> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("framing_tips")
    .select(TIP_COLUMNS)
    .order("position", { ascending: true });

  if (error) return mapQueryError(error, "Impossible de charger le manuel.");

  return { kind: "ok", data: ((data ?? []) as FramingTipRow[]).map(toManualTip) };
}

export async function getManualTipDetail(
  tipId: number,
): Promise<ModerationQueryResult<ManualTip> | { kind: "not_found" }> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  if (!Number.isInteger(tipId)) return { kind: "not_found" };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("framing_tips")
    .select(TIP_COLUMNS)
    .eq("id", tipId)
    .maybeSingle();

  if (error) return mapQueryError(error, "Impossible de charger ce secret.");
  if (!data) return { kind: "not_found" };

  return { kind: "ok", data: toManualTip(data as FramingTipRow) };
}
