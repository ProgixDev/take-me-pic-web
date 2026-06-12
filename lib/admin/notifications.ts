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

export type NotificationKind = "karma" | "request" | "community" | "badge" | "spot" | "system";

export type NotificationListItem = {
  id: number;
  recipient: ProfileSummary | null;
  kind: NotificationKind;
  body: string;
  emphasis: string | null;
  dataType: string | null;
  readAt: string | null;
  createdAt: string;
};

export type PushTokenStat = {
  platform: string;
  deviceCount: number;
  userCount: number;
};

export type NotificationsOverview = {
  notifications: NotificationListItem[];
  pushStats: PushTokenStat[];
};

type NotificationRow = {
  id: number;
  user_id: string;
  kind: NotificationKind;
  body: string;
  emphasis: string | null;
  data: { type?: string } | null;
  read_at: string | null;
  created_at: string;
};

type PushStatRow = {
  platform: string;
  device_count: number;
  user_count: number;
};

export async function getNotificationsOverview(): Promise<
  ModerationQueryResult<NotificationsOverview>
> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();

  const [notificationsResult, statsResult] = await Promise.all([
    supabase
      .from("notifications")
      .select("id, user_id, kind, body, emphasis, data, read_at, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase.rpc("admin_push_token_stats"),
  ]);

  if (notificationsResult.error) {
    return mapQueryError(notificationsResult.error, "Impossible de charger les notifications.");
  }
  if (statsResult.error) {
    return mapQueryError(statsResult.error, "Impossible de charger les statistiques push.");
  }

  const rows = (notificationsResult.data ?? []) as NotificationRow[];
  const statRows = (statsResult.data ?? []) as PushStatRow[];

  try {
    const profiles = await loadProfiles(supabase, rows.map((row) => row.user_id));

    return {
      kind: "ok",
      data: {
        notifications: rows.map<NotificationListItem>((row) => ({
          id: row.id,
          recipient: profiles.get(row.user_id) ?? null,
          kind: row.kind,
          body: row.body,
          emphasis: row.emphasis,
          dataType: row.data?.type ?? null,
          readAt: row.read_at,
          createdAt: row.created_at,
        })),
        pushStats: statRows.map<PushTokenStat>((row) => ({
          platform: row.platform,
          deviceCount: row.device_count,
          userCount: row.user_count,
        })),
      },
    };
  } catch (profileError) {
    return mapQueryError(profileError as QueryError, "Impossible de charger les profils associés.");
  }
}
