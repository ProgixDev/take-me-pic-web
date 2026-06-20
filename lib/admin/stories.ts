import "server-only";

import {
  loadProfiles,
  mapQueryError,
  requireStaffSession,
  type ModerationQueryResult,
  type ProfileSummary,
} from "@/lib/admin/moderation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ActiveStory = {
  id: number;
  user: ProfileSummary | null;
  imageUrl: string;
  caption: string | null;
  city: string | null;
  viewCount: number;
  createdAt: string;
  expiresAt: string;
};

type StoryRow = {
  id: number;
  user_id: string;
  image_url: string;
  caption: string | null;
  city: string | null;
  view_count: number;
  created_at: string;
  expires_at: string;
};

// Active stories only (not removed, not expired) — the admin moderation view.
export async function getActiveStoriesReadModel(): Promise<ModerationQueryResult<ActiveStory[]>> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("stories")
    .select("id, user_id, image_url, caption, city, view_count, created_at, expires_at")
    .is("removed_at", null)
    .gt("expires_at", nowIso)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return mapQueryError(error, "Impossible de charger les stories.");

  const rows = (data ?? []) as StoryRow[];

  let profiles: Map<string, ProfileSummary>;
  try {
    profiles = await loadProfiles(supabase, rows.map((r) => r.user_id));
  } catch (profileError) {
    return mapQueryError(profileError as { code?: string; message?: string }, "Impossible de charger les profils associés.");
  }

  return {
    kind: "ok",
    data: rows.map<ActiveStory>((r) => ({
      id: r.id,
      user: profiles.get(r.user_id) ?? null,
      imageUrl: r.image_url,
      caption: r.caption,
      city: r.city,
      viewCount: r.view_count,
      createdAt: r.created_at,
      expiresAt: r.expires_at,
    })),
  };
}
