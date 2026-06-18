import "server-only";

import {
  mapQueryError,
  requireStaffSession,
  type ModerationQueryResult,
} from "@/lib/admin/moderation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type QueryError = { code?: string; message?: string };

export type LeaderRow = {
  rank: number;
  userId: string;
  firstName: string;
  lastName: string | null;
  username: string;
  avatarUrl: string | null;
  city: string | null;
  karma: number;
  rating: number;
  photosCount: number;
};

export type KarmaRule = {
  code: string;
  label: string;
  description: string;
  category: string;
  points: number;
  active: boolean;
  wired: boolean;
  sort: number;
};

export type BadgeRow = {
  code: string;
  name: string;
  description: string;
  emoji: string;
  rarity: string;
  holders: number;
  sort: number;
};

export type KarmaDashboard = {
  totalKarma: number;
  awards: number;
  weeklyKarma: number;
  topEarner: { name: string; karma: number } | null;
  activeUsers: number;
  series: { week: string; karma: number }[];
};

type LeaderboardViewRow = {
  user_id: string;
  first_name: string;
  last_name: string | null;
  username: string;
  avatar_url: string | null;
  karma: number;
  rank: number;
};

type ProfileExtraRow = { id: string; city: string | null; rating: number; photos_count: number };

// Leaderboard rows for the admin "Tableau d'honneur" — the live `leaderboard`
// view (same source the mobile app reads) joined with profile extras the view
// doesn't carry (city / rating / photos).
export async function getLeaderboardReadModel(
  limit = 100,
): Promise<ModerationQueryResult<LeaderRow[]>> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("leaderboard")
    .select("user_id, first_name, last_name, username, avatar_url, karma, rank")
    .order("rank", { ascending: true })
    .limit(limit);

  if (error) return mapQueryError(error, "Impossible de charger le classement.");

  const rows = (data ?? []) as LeaderboardViewRow[];
  const ids = rows.map((r) => r.user_id);

  let extras = new Map<string, ProfileExtraRow>();
  if (ids.length > 0) {
    const { data: profs, error: profErr } = await supabase
      .from("profiles")
      .select("id, city, rating, photos_count")
      .in("id", ids);
    if (profErr) return mapQueryError(profErr, "Impossible de charger les profils du classement.");
    extras = new Map((profs as ProfileExtraRow[]).map((p) => [p.id, p]));
  }

  return {
    kind: "ok",
    data: rows.map<LeaderRow>((r) => {
      const x = extras.get(r.user_id);
      return {
        rank: r.rank,
        userId: r.user_id,
        firstName: r.first_name,
        lastName: r.last_name,
        username: r.username,
        avatarUrl: r.avatar_url,
        city: x?.city ?? null,
        karma: r.karma,
        rating: Number(x?.rating ?? 0),
        photosCount: x?.photos_count ?? 0,
      };
    }),
  };
}

function isoWeek(date: Date): string {
  // Monday-anchored YYYY-MM-DD label for charting.
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() - day + 1);
  return d.toISOString().slice(0, 10);
}

export async function getKarmaDashboard(): Promise<ModerationQueryResult<KarmaDashboard>> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();

  const [profilesRes, ledgerRes, topRes] = await Promise.all([
    supabase.from("profiles").select("karma").eq("is_banned", false),
    supabase
      .from("karma_ledger")
      .select("delta, created_at")
      .order("created_at", { ascending: false })
      .limit(5000),
    supabase
      .from("leaderboard")
      .select("first_name, last_name, karma")
      .order("rank", { ascending: true })
      .limit(1),
  ]);

  if (profilesRes.error) return mapQueryError(profilesRes.error, "Impossible de charger le karma total.");
  if (ledgerRes.error) return mapQueryError(ledgerRes.error, "Impossible de charger le journal de karma.");
  if (topRes.error) return mapQueryError(topRes.error, "Impossible de charger le meilleur profil.");

  const karmas = (profilesRes.data ?? []) as { karma: number }[];
  const ledger = (ledgerRes.data ?? []) as { delta: number; created_at: string }[];
  const top = ((topRes.data ?? []) as { first_name: string; last_name: string | null; karma: number }[])[0];

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weeklyKarma = ledger
    .filter((e) => new Date(e.created_at).getTime() >= weekAgo)
    .reduce((s, e) => s + e.delta, 0);

  const buckets = new Map<string, number>();
  for (const e of ledger) {
    const wk = isoWeek(new Date(e.created_at));
    buckets.set(wk, (buckets.get(wk) ?? 0) + e.delta);
  }
  const series = [...buckets.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-8)
    .map(([week, karma]) => ({ week, karma }));

  return {
    kind: "ok",
    data: {
      totalKarma: karmas.reduce((s, p) => s + p.karma, 0),
      awards: ledger.length,
      weeklyKarma,
      activeUsers: karmas.length,
      topEarner: top
        ? { name: [top.first_name, top.last_name].filter(Boolean).join(" "), karma: top.karma }
        : null,
      series,
    },
  };
}

export async function getKarmaRules(): Promise<ModerationQueryResult<KarmaRule[]>> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("karma_rules")
    .select("code, label, description, category, points, active, wired, sort")
    .order("sort", { ascending: true });

  if (error) return mapQueryError(error, "Impossible de charger les règles de karma.");
  return { kind: "ok", data: (data ?? []) as KarmaRule[] };
}

export async function getBadgesReadModel(): Promise<ModerationQueryResult<BadgeRow[]>> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("badge_holder_counts")
    .select("code, name, description, emoji, rarity, holders, sort")
    .order("sort", { ascending: true });

  if (error) return mapQueryError(error, "Impossible de charger les badges.");
  return { kind: "ok", data: (data ?? []) as BadgeRow[] };
}
