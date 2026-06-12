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

export type KarmaLedgerEntry = {
  id: number;
  delta: number;
  reason: string;
  helpRequestId: number | null;
  createdAt: string;
};

export type RatingEntry = {
  id: number;
  helpRequestId: number;
  rater: ProfileSummary | null;
  ratee: ProfileSummary | null;
  stars: number;
  comment: string | null;
  createdAt: string;
};

export type UserReputation = {
  ledger: KarmaLedgerEntry[];
  ratingsReceived: RatingEntry[];
  ratingsGiven: RatingEntry[];
};

type LedgerRow = {
  id: number;
  delta: number;
  reason: string;
  help_request_id: number | null;
  created_at: string;
};

type RatingRow = {
  id: number;
  help_request_id: number;
  rater_id: string;
  ratee_id: string;
  stars: number;
  comment: string | null;
  created_at: string;
};

const RATING_COLUMNS = "id, help_request_id, rater_id, ratee_id, stars, comment, created_at";

function toRatingEntry(row: RatingRow, profiles: Map<string, ProfileSummary>): RatingEntry {
  return {
    id: row.id,
    helpRequestId: row.help_request_id,
    rater: profiles.get(row.rater_id) ?? null,
    ratee: profiles.get(row.ratee_id) ?? null,
    stars: row.stars,
    comment: row.comment,
    createdAt: row.created_at,
  };
}

export async function getUserReputation(
  userId: string,
): Promise<ModerationQueryResult<UserReputation>> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();

  const [ledgerResult, receivedResult, givenResult] = await Promise.all([
    supabase
      .from("karma_ledger")
      .select("id, delta, reason, help_request_id, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("ratings")
      .select(RATING_COLUMNS)
      .eq("ratee_id", userId)
      .order("created_at", { ascending: false })
      .limit(25),
    supabase
      .from("ratings")
      .select(RATING_COLUMNS)
      .eq("rater_id", userId)
      .order("created_at", { ascending: false })
      .limit(25),
  ]);

  if (ledgerResult.error) {
    return mapQueryError(ledgerResult.error, "Impossible de charger le journal de karma.");
  }
  if (receivedResult.error || givenResult.error) {
    return mapQueryError(
      (receivedResult.error ?? givenResult.error) as QueryError,
      "Impossible de charger les notes.",
    );
  }

  const ledgerRows = (ledgerResult.data ?? []) as LedgerRow[];
  const receivedRows = (receivedResult.data ?? []) as RatingRow[];
  const givenRows = (givenResult.data ?? []) as RatingRow[];

  try {
    const profiles = await loadProfiles(supabase, [
      ...receivedRows.flatMap((row) => [row.rater_id, row.ratee_id]),
      ...givenRows.flatMap((row) => [row.rater_id, row.ratee_id]),
    ]);

    return {
      kind: "ok",
      data: {
        ledger: ledgerRows.map<KarmaLedgerEntry>((row) => ({
          id: row.id,
          delta: row.delta,
          reason: row.reason,
          helpRequestId: row.help_request_id,
          createdAt: row.created_at,
        })),
        ratingsReceived: receivedRows.map((row) => toRatingEntry(row, profiles)),
        ratingsGiven: givenRows.map((row) => toRatingEntry(row, profiles)),
      },
    };
  } catch (profileError) {
    return mapQueryError(profileError as QueryError, "Impossible de charger les profils associés.");
  }
}

export async function getSessionRatings(
  helpRequestId: number,
): Promise<ModerationQueryResult<RatingEntry[]>> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  if (!Number.isInteger(helpRequestId) || helpRequestId <= 0) {
    return { kind: "ok", data: [] };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("ratings")
    .select(RATING_COLUMNS)
    .eq("help_request_id", helpRequestId)
    .order("created_at", { ascending: false });

  if (error) return mapQueryError(error, "Impossible de charger les notes de la session.");

  const rows = (data ?? []) as RatingRow[];

  try {
    const profiles = await loadProfiles(
      supabase,
      rows.flatMap((row) => [row.rater_id, row.ratee_id]),
    );

    return { kind: "ok", data: rows.map((row) => toRatingEntry(row, profiles)) };
  } catch (profileError) {
    return mapQueryError(profileError as QueryError, "Impossible de charger les profils associés.");
  }
}
