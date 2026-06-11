import "server-only";

import { getStaffSession, type StaffSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type QueryError = { code?: string; message?: string };

export type ProfileSummary = {
  id: string;
  firstName: string;
  lastName: string | null;
  username: string;
  avatarUrl: string | null;
  city: string | null;
};

export type ReportTargetType =
  | "user"
  | "post"
  | "comment"
  | "session"
  | "conversation"
  | "message"
  | "unknown";

export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed";

export type BanAppealStatus = "open" | "reviewing" | "resolved" | "dismissed" | null;

export type AuditActionEntry = {
  id: number;
  actor: ProfileSummary | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  detailText: string;
  createdAt: string;
};

export type ReportReadModel = {
  id: number;
  reporter: ProfileSummary | null;
  targetType: ReportTargetType;
  targetLabel: string;
  reportedUserId: string | null;
  reason: string;
  status: ReportStatus;
  resolver: ProfileSummary | null;
  resolvedAt: string | null;
  createdAt: string;
};

export type BanReadModel = {
  id: number;
  user: ProfileSummary | null;
  reason: string;
  bannedBy: ProfileSummary | null;
  expiresAt: string | null;
  appealStatus: BanAppealStatus;
  createdAt: string;
};

export type ModerationOverview = {
  reports: ReportReadModel[];
  counts: {
    open: number;
    reviewing: number;
    resolved: number;
    dismissed: number;
  };
};

export type StaffGuardResult =
  | { kind: "ok"; session: Extract<StaffSession, { kind: "staff" }> }
  | { kind: "unauthenticated" }
  | { kind: "unauthorized" };

export type ModerationQueryResult<T> =
  | { kind: "ok"; data: T }
  | { kind: "unauthenticated" }
  | { kind: "unauthorized" }
  | { kind: "error"; message: string };

type ProfileRow = {
  id: string;
  first_name: string;
  last_name: string | null;
  username: string;
  avatar_url: string | null;
  city: string | null;
};

type ReportRow = {
  id: number;
  reporter_id: string;
  reported_user_id: string | null;
  post_id: number | null;
  comment_id: number | null;
  help_request_id: number | null;
  conversation_id: number | null;
  message_id: number | null;
  reason: string;
  status: ReportStatus;
  resolver_id: string | null;
  resolved_at: string | null;
  created_at: string;
};

type BanRow = {
  id: number;
  user_id: string;
  reason: string;
  banned_by: string | null;
  expires_at: string | null;
  appeal_status: BanAppealStatus;
  created_at: string;
};

type AuditLogRow = {
  id: number;
  admin_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  detail: unknown | null;
  created_at: string;
};

function toProfileSummary(row: ProfileRow): ProfileSummary {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    username: row.username,
    avatarUrl: row.avatar_url,
    city: row.city,
  };
}

function formatProfileName(profile: ProfileSummary | null) {
  if (!profile) return "Profil supprimé";
  return [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.username;
}

function reportTargetLabel(row: ReportRow, profile: ProfileSummary | null) {
  if (profile) return `Utilisateur ${formatProfileName(profile)}`;
  if (row.post_id !== null) return `Publication #${row.post_id}`;
  if (row.comment_id !== null) return `Commentaire #${row.comment_id}`;
  if (row.message_id !== null) return `Message #${row.message_id}`;
  if (row.conversation_id !== null) return `Conversation #${row.conversation_id}`;
  if (row.help_request_id !== null) return `Session #${row.help_request_id}`;
  if (row.reported_user_id) return `Utilisateur ${row.reported_user_id.slice(0, 8)}`;
  return "Cible non précisée";
}

function reportTargetType(row: ReportRow): ReportTargetType {
  if (row.reported_user_id) return "user";
  if (row.post_id !== null) return "post";
  if (row.comment_id !== null) return "comment";
  if (row.message_id !== null) return "message";
  if (row.conversation_id !== null) return "conversation";
  if (row.help_request_id !== null) return "session";
  return "unknown";
}

function summarizeDetail(detail: unknown): string {
  if (detail == null) return "—";
  if (typeof detail === "string") return detail;
  if (typeof detail === "number" || typeof detail === "boolean") return String(detail);
  if (Array.isArray(detail)) return detail.map((item) => summarizeDetail(item)).join(", ");
  if (typeof detail === "object") {
    const entries = Object.entries(detail as Record<string, unknown>);
    if (entries.length === 0) return "—";
    return entries
      .slice(0, 3)
      .map(([key, value]) => `${key}: ${summarizeDetail(value)}`)
      .join(" · ");
  }
  return "—";
}

export async function loadProfiles(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  ids: string[],
) {
  const uniqueIds = [...new Set(ids)].filter(Boolean);

  if (uniqueIds.length === 0) {
    return new Map<string, ProfileSummary>();
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, username, avatar_url, city")
    .in("id", uniqueIds);

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as ProfileRow[];
  return new Map(rows.map((row) => [row.id, toProfileSummary(row)]));
}

export async function requireStaffSession(): Promise<StaffGuardResult> {
  const session = await getStaffSession();

  if (session.kind === "unauthenticated") {
    return { kind: "unauthenticated" };
  }

  if (session.kind !== "staff") {
    return { kind: "unauthorized" };
  }

  return { kind: "ok", session };
}

export function mapQueryError(error: QueryError, fallback: string): { kind: "error"; message: string } {
  console.error("[admin/moderation]", fallback, error.code ?? "", error.message ?? "");
  return {
    kind: "error",
    message: fallback,
  };
}

export async function getModerationOverview(): Promise<ModerationQueryResult<ModerationOverview>> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("reports")
    .select(
      "id, reporter_id, reported_user_id, post_id, comment_id, help_request_id, conversation_id, message_id, reason, status, resolver_id, resolved_at, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return mapQueryError(error, "Impossible de charger les signalements.");

  const reports = (data ?? []) as ReportRow[];
  const profileIds = reports.flatMap((row) => [row.reporter_id, row.reported_user_id, row.resolver_id].filter(Boolean) as string[]);

  let profiles: Map<string, ProfileSummary>;
  try {
    profiles = await loadProfiles(supabase, profileIds);
  } catch (profileError) {
    return mapQueryError(profileError as QueryError, "Impossible de charger les profils associés.");
  }

  const items = reports.map<ReportReadModel>((row) => {
    const reportedProfile = row.reported_user_id ? profiles.get(row.reported_user_id) ?? null : null;

    return {
      id: row.id,
      reporter: profiles.get(row.reporter_id) ?? null,
      targetType: reportTargetType(row),
      targetLabel: reportTargetLabel(row, reportedProfile),
      reportedUserId: row.reported_user_id,
      reason: row.reason,
      status: row.status,
      resolver: row.resolver_id ? profiles.get(row.resolver_id) ?? null : null,
      resolvedAt: row.resolved_at,
      createdAt: row.created_at,
    };
  });

  const counts = items.reduce(
    (acc, report) => {
      acc[report.status] += 1;
      return acc;
    },
    { open: 0, reviewing: 0, resolved: 0, dismissed: 0 } satisfies ModerationOverview["counts"],
  );

  return {
    kind: "ok",
    data: {
      reports: items,
      counts,
    },
  };
}

export async function getReportsReadModel(): Promise<ModerationQueryResult<ReportReadModel[]>> {
  const overview = await getModerationOverview();
  if (overview.kind !== "ok") return overview;
  return { kind: "ok", data: overview.data.reports };
}

export async function getBansReadModel(): Promise<ModerationQueryResult<BanReadModel[]>> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("bans")
    .select("id, user_id, reason, banned_by, expires_at, appeal_status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return mapQueryError(error, "Impossible de charger les utilisateurs bloqués.");

  const rows = (data ?? []) as BanRow[];

  let profiles: Map<string, ProfileSummary>;
  try {
    profiles = await loadProfiles(
      supabase,
      rows.flatMap((row) => [row.user_id, row.banned_by].filter(Boolean) as string[]),
    );
  } catch (profileError) {
    return mapQueryError(profileError as QueryError, "Impossible de charger les profils associés.");
  }

  return {
    kind: "ok",
    data: rows.map<BanReadModel>((row) => ({
      id: row.id,
      user: profiles.get(row.user_id) ?? null,
      reason: row.reason,
      bannedBy: row.banned_by ? profiles.get(row.banned_by) ?? null : null,
      expiresAt: row.expires_at,
      appealStatus: row.appeal_status,
      createdAt: row.created_at,
    })),
  };
}

export async function getAuditLogReadModel(): Promise<ModerationQueryResult<AuditActionEntry[]>> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("admin_audit_log")
    .select("id, admin_id, action, target_type, target_id, detail, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return mapQueryError(error, "Impossible de charger le journal d'audit.");

  const rows = (data ?? []) as AuditLogRow[];

  let profiles: Map<string, ProfileSummary>;
  try {
    profiles = await loadProfiles(
      supabase,
      rows.flatMap((row) => [row.admin_id].filter(Boolean) as string[]),
    );
  } catch (profileError) {
    return mapQueryError(profileError as QueryError, "Impossible de charger les profils associés.");
  }

  return {
    kind: "ok",
    data: rows.map<AuditActionEntry>((row) => ({
      id: row.id,
      actor: row.admin_id ? profiles.get(row.admin_id) ?? null : null,
      action: row.action,
      targetType: row.target_type,
      targetId: row.target_id,
      detailText: summarizeDetail(row.detail),
      createdAt: row.created_at,
    })),
  };
}
