import "server-only";

import {
  loadProfiles,
  mapQueryError,
  requireStaffSession,
  type ModerationQueryResult,
  type ProfileSummary,
} from "@/lib/admin/moderation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type QueryError = { code?: string; message?: string };

export type SpotStatus = "pending" | "approved" | "rejected";

export type SpotListItem = {
  id: number;
  name: string;
  city: string | null;
  rating: number;
  reviewsCount: number;
  bestTime: string | null;
  heroUrl: string | null;
  status: SpotStatus;
  isSponsored: boolean;
  addedBy: ProfileSummary | null;
  createdAt: string;
};

export type SpotTipItem = {
  id: number;
  author: ProfileSummary | null;
  body: string;
  createdAt: string;
};

export type SpotDetail = {
  spot: SpotListItem;
  reviewedBy: ProfileSummary | null;
  reviewedAt: string | null;
  photoCount: number;
  tips: SpotTipItem[];
};

type SpotRow = {
  id: number;
  name: string;
  city: string | null;
  rating: number;
  reviews_count: number;
  best_time: string | null;
  hero_url: string | null;
  created_by: string | null;
  is_sponsored: boolean;
  status: SpotStatus;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
};

type SpotTipRow = {
  id: number;
  user_id: string;
  body: string;
  created_at: string;
};

const SPOT_COLUMNS =
  "id, name, city, rating, reviews_count, best_time, hero_url, created_by, is_sponsored, status, reviewed_at, reviewed_by, created_at";

function toSpotListItem(row: SpotRow, profiles: Map<string, ProfileSummary>): SpotListItem {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    rating: Number(row.rating),
    reviewsCount: row.reviews_count,
    bestTime: row.best_time,
    heroUrl: row.hero_url,
    status: row.status,
    isSponsored: row.is_sponsored,
    addedBy: row.created_by ? profiles.get(row.created_by) ?? null : null,
    createdAt: row.created_at,
  };
}

async function getSpotsList(
  onlyPending: boolean,
): Promise<ModerationQueryResult<SpotListItem[]>> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("spots")
    .select(SPOT_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(50);

  if (onlyPending) {
    query = query.eq("status", "pending");
  }

  const { data, error } = await query;

  if (error) return mapQueryError(error, "Impossible de charger les spots.");

  const rows = (data ?? []) as SpotRow[];

  try {
    const profiles = await loadProfiles(
      supabase,
      rows.flatMap((row) => (row.created_by ? [row.created_by] : [])),
    );

    return { kind: "ok", data: rows.map((row) => toSpotListItem(row, profiles)) };
  } catch (profileError) {
    return mapQueryError(profileError as QueryError, "Impossible de charger les profils associés.");
  }
}

export async function getSpotsReadModel() {
  return getSpotsList(false);
}

export async function getPendingSpotsReadModel() {
  return getSpotsList(true);
}

export async function getSpotDetail(
  spotId: number,
): Promise<ModerationQueryResult<SpotDetail> | { kind: "not_found" }> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  if (!Number.isInteger(spotId)) return { kind: "not_found" };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("spots")
    .select(SPOT_COLUMNS)
    .eq("id", spotId)
    .maybeSingle();

  if (error) return mapQueryError(error, "Impossible de charger le spot.");
  if (!data) return { kind: "not_found" };

  const spotRow = data as SpotRow;

  const [tipsResult, photoCountResult] = await Promise.all([
    supabase
      .from("spot_tips")
      .select("id, user_id, body, created_at")
      .eq("spot_id", spotId)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("spot_photos")
      .select("id", { count: "exact", head: true })
      .eq("spot_id", spotId),
  ]);

  if (tipsResult.error) return mapQueryError(tipsResult.error, "Impossible de charger les conseils.");
  if (photoCountResult.error) {
    return mapQueryError(photoCountResult.error, "Impossible de charger les photos du spot.");
  }

  const tipRows = (tipsResult.data ?? []) as SpotTipRow[];

  try {
    const profiles = await loadProfiles(supabase, [
      ...(spotRow.created_by ? [spotRow.created_by] : []),
      ...(spotRow.reviewed_by ? [spotRow.reviewed_by] : []),
      ...tipRows.map((row) => row.user_id),
    ]);

    return {
      kind: "ok",
      data: {
        spot: toSpotListItem(spotRow, profiles),
        reviewedBy: spotRow.reviewed_by ? profiles.get(spotRow.reviewed_by) ?? null : null,
        reviewedAt: spotRow.reviewed_at,
        photoCount: photoCountResult.count ?? 0,
        tips: tipRows.map((row) => ({
          id: row.id,
          author: profiles.get(row.user_id) ?? null,
          body: row.body,
          createdAt: row.created_at,
        })),
      },
    };
  } catch (profileError) {
    return mapQueryError(profileError as QueryError, "Impossible de charger les profils associés.");
  }
}
