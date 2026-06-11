import "server-only";

import {
  loadProfiles,
  mapQueryError,
  requireStaffSession,
  type ModerationQueryResult,
  type ProfileSummary,
} from "@/lib/admin/moderation";
import type { StaffRole } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type VerificationState = "verified" | "partial" | "none";

export type AccountStatus = "active" | "suspended" | "banned";

export type UserListItem = {
  id: string;
  firstName: string;
  lastName: string | null;
  username: string;
  avatarUrl: string | null;
  city: string | null;
  karma: number;
  isPremium: boolean;
  verification: VerificationState;
  status: AccountStatus;
  openReports: number;
};

export type UserReportEntry = {
  id: number;
  reason: string;
  status: string;
  reporter: ProfileSummary | null;
  createdAt: string;
};

export type ActiveBan = {
  id: number;
  reason: string;
  expiresAt: string | null;
  bannedBy: ProfileSummary | null;
};

export type UserDetailModel = {
  id: string;
  firstName: string;
  lastName: string | null;
  username: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  bio: string | null;
  age: number | null;
  city: string | null;
  phone: string | null;
  languages: string[];
  karma: number;
  rating: number;
  photosCount: number;
  followers: number;
  following: number;
  spotsCount: number;
  isPremium: boolean;
  memberSince: string;
  verification: VerificationState;
  emailVerified: boolean;
  phoneVerified: boolean;
  status: AccountStatus;
  activeBan: ActiveBan | null;
  roles: StaffRole[];
  reports: UserReportEntry[];
};

export type VerificationQueueItem = {
  id: string;
  firstName: string;
  lastName: string | null;
  username: string;
  avatarUrl: string | null;
  city: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  verification: VerificationState;
  memberSince: string;
};

export type StaffRosterEntry = {
  profile: ProfileSummary | null;
  userId: string;
  role: StaffRole;
  grantedBy: ProfileSummary | null;
  grantedAt: string;
};

type ProfileRow = {
  id: string;
  first_name: string;
  last_name: string | null;
  username: string;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
  age: number | null;
  city: string | null;
  phone: string | null;
  languages: string[] | null;
  karma: number;
  rating: number;
  photos_count: number;
  followers: number;
  following: number;
  spots_count: number;
  is_premium: boolean;
  member_since: string;
  email_verified: boolean;
  phone_verified: boolean;
  verified: boolean;
};

type ActiveBanRow = {
  id: number;
  user_id: string;
  reason: string;
  banned_by: string | null;
  expires_at: string | null;
};

const LIST_COLUMNS =
  "id, first_name, last_name, username, avatar_url, city, karma, is_premium, member_since, email_verified, phone_verified, verified";

const DETAIL_COLUMNS =
  "id, first_name, last_name, username, avatar_url, cover_url, bio, age, city, phone, languages, karma, rating, photos_count, followers, following, spots_count, is_premium, member_since, email_verified, phone_verified, verified";

function verificationState(row: Pick<ProfileRow, "verified" | "email_verified" | "phone_verified">): VerificationState {
  if (row.verified) return "verified";
  if (row.email_verified || row.phone_verified) return "partial";
  return "none";
}

function banStatus(ban: ActiveBanRow | undefined): AccountStatus {
  if (!ban) return "active";
  return ban.expires_at === null ? "banned" : "suspended";
}

async function loadActiveBans(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userIds: string[],
) {
  if (userIds.length === 0) return new Map<string, ActiveBanRow>();

  const { data, error } = await supabase
    .from("bans")
    .select("id, user_id, reason, banned_by, expires_at")
    .in("user_id", userIds)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

  if (error) throw error;

  return new Map(((data ?? []) as ActiveBanRow[]).map((row) => [row.user_id, row]));
}

export async function getUsersReadModel(): Promise<ModerationQueryResult<UserListItem[]>> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(LIST_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return mapQueryError(error, "Impossible de charger les utilisateurs.");

  const rows = (data ?? []) as unknown as ProfileRow[];
  const ids = rows.map((row) => row.id);

  try {
    const [bans, reportRows] = await Promise.all([
      loadActiveBans(supabase, ids),
      ids.length === 0
        ? Promise.resolve([] as { reported_user_id: string | null }[])
        : supabase
            .from("reports")
            .select("reported_user_id")
            .in("reported_user_id", ids)
            .in("status", ["open", "reviewing"])
            .then(({ data: reportData, error: reportError }) => {
              if (reportError) throw reportError;
              return (reportData ?? []) as { reported_user_id: string | null }[];
            }),
    ]);

    const reportCounts = new Map<string, number>();
    for (const report of reportRows) {
      if (!report.reported_user_id) continue;
      reportCounts.set(report.reported_user_id, (reportCounts.get(report.reported_user_id) ?? 0) + 1);
    }

    return {
      kind: "ok",
      data: rows.map<UserListItem>((row) => ({
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        username: row.username,
        avatarUrl: row.avatar_url,
        city: row.city,
        karma: row.karma,
        isPremium: row.is_premium,
        verification: verificationState(row),
        status: banStatus(bans.get(row.id)),
        openReports: reportCounts.get(row.id) ?? 0,
      })),
    };
  } catch (enrichError) {
    return mapQueryError(enrichError as { code?: string; message?: string }, "Impossible de charger l'état des comptes.");
  }
}

export async function getUserDetailReadModel(
  userId: string,
): Promise<ModerationQueryResult<UserDetailModel> | { kind: "not_found" }> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(DETAIL_COLUMNS)
    .eq("id", userId)
    .maybeSingle();

  if (error) return mapQueryError(error, "Impossible de charger ce profil.");
  if (!data) return { kind: "not_found" };

  const row = data as unknown as ProfileRow;

  try {
    const [bans, rolesResult, reportsResult] = await Promise.all([
      loadActiveBans(supabase, [row.id]),
      supabase.from("user_roles").select("role").eq("user_id", row.id),
      supabase
        .from("reports")
        .select("id, reporter_id, reason, status, created_at")
        .eq("reported_user_id", row.id)
        .order("created_at", { ascending: false })
        .limit(25),
    ]);

    if (rolesResult.error) throw rolesResult.error;
    if (reportsResult.error) throw reportsResult.error;

    const reportRows = (reportsResult.data ?? []) as {
      id: number;
      reporter_id: string;
      reason: string;
      status: string;
      created_at: string;
    }[];

    const ban = bans.get(row.id);
    const profileIds = [
      ...reportRows.map((report) => report.reporter_id),
      ...(ban?.banned_by ? [ban.banned_by] : []),
    ];
    const profiles = await loadProfiles(supabase, profileIds);

    const staffRoles = ((rolesResult.data ?? []) as { role: string }[])
      .map((entry) => entry.role)
      .filter((role): role is StaffRole => role === "moderator" || role === "admin" || role === "super_admin");

    return {
      kind: "ok",
      data: {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        username: row.username,
        avatarUrl: row.avatar_url,
        coverUrl: row.cover_url,
        bio: row.bio,
        age: row.age,
        city: row.city,
        phone: row.phone,
        languages: row.languages ?? [],
        karma: row.karma,
        rating: Number(row.rating),
        photosCount: row.photos_count,
        followers: row.followers,
        following: row.following,
        spotsCount: row.spots_count,
        isPremium: row.is_premium,
        memberSince: row.member_since,
        verification: verificationState(row),
        emailVerified: row.email_verified,
        phoneVerified: row.phone_verified,
        status: banStatus(ban),
        activeBan: ban
          ? {
              id: ban.id,
              reason: ban.reason,
              expiresAt: ban.expires_at,
              bannedBy: ban.banned_by ? profiles.get(ban.banned_by) ?? null : null,
            }
          : null,
        roles: staffRoles,
        reports: reportRows.map<UserReportEntry>((report) => ({
          id: report.id,
          reason: report.reason,
          status: report.status,
          reporter: profiles.get(report.reporter_id) ?? null,
          createdAt: report.created_at,
        })),
      },
    };
  } catch (enrichError) {
    return mapQueryError(enrichError as { code?: string; message?: string }, "Impossible de charger les données associées au profil.");
  }
}

export async function getVerificationQueue(): Promise<ModerationQueryResult<VerificationQueueItem[]>> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(LIST_COLUMNS)
    .eq("verified", false)
    .order("member_since", { ascending: true })
    .limit(60);

  if (error) return mapQueryError(error, "Impossible de charger la file de vérification.");

  const rows = (data ?? []) as unknown as ProfileRow[];

  return {
    kind: "ok",
    data: rows.map<VerificationQueueItem>((row) => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      username: row.username,
      avatarUrl: row.avatar_url,
      city: row.city,
      emailVerified: row.email_verified,
      phoneVerified: row.phone_verified,
      verification: verificationState(row),
      memberSince: row.member_since,
    })),
  };
}

export async function getStaffRoster(): Promise<ModerationQueryResult<StaffRosterEntry[]>> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("user_roles")
    .select("user_id, role, granted_by, created_at")
    .in("role", ["moderator", "admin", "super_admin"])
    .order("created_at", { ascending: true });

  if (error) return mapQueryError(error, "Impossible de charger l'équipe staff.");

  const rows = (data ?? []) as { user_id: string; role: StaffRole; granted_by: string | null; created_at: string }[];

  try {
    const profiles = await loadProfiles(
      supabase,
      rows.flatMap((row) => [row.user_id, row.granted_by].filter(Boolean) as string[]),
    );

    return {
      kind: "ok",
      data: rows.map<StaffRosterEntry>((row) => ({
        userId: row.user_id,
        profile: profiles.get(row.user_id) ?? null,
        role: row.role,
        grantedBy: row.granted_by ? profiles.get(row.granted_by) ?? null : null,
        grantedAt: row.created_at,
      })),
    };
  } catch (enrichError) {
    return mapQueryError(enrichError as { code?: string; message?: string }, "Impossible de charger les profils associés.");
  }
}
