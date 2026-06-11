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

// Derived per CONTEXT.md: "Flagged content" comes from open reports, hidden
// state from the stored content hide; "published" is just the default.
export type CommunityContentState = "published" | "flagged" | "hidden";

export type CommunityPostListItem = {
  id: number;
  author: ProfileSummary | null;
  city: string | null;
  imageUrl: string;
  caption: string | null;
  heartsCount: number;
  commentsCount: number;
  state: CommunityContentState;
  openReports: number;
  createdAt: string;
};

export type CommunityCommentItem = {
  id: number;
  postId: number;
  author: ProfileSummary | null;
  body: string;
  heartsCount: number;
  state: CommunityContentState;
  openReports: number;
  createdAt: string;
};

export type CommunityCommentListItem = CommunityCommentItem & {
  postCaption: string | null;
};

export type CommunityPostDetail = {
  post: CommunityPostListItem;
  comments: CommunityCommentItem[];
};

type PostRow = {
  id: number;
  author_id: string;
  city: string | null;
  image_url: string;
  caption: string | null;
  hearts_count: number;
  comments_count: number;
  hidden_at: string | null;
  created_at: string;
};

type CommentRow = {
  id: number;
  post_id: number;
  author_id: string;
  body: string;
  hearts_count: number;
  hidden_at: string | null;
  created_at: string;
};

const POST_COLUMNS =
  "id, author_id, city, image_url, caption, hearts_count, comments_count, hidden_at, created_at";
const COMMENT_COLUMNS = "id, post_id, author_id, body, hearts_count, hidden_at, created_at";

function contentState(hiddenAt: string | null, openReports: number): CommunityContentState {
  if (hiddenAt !== null) return "hidden";
  if (openReports > 0) return "flagged";
  return "published";
}

async function loadOpenReportCounts(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  column: "post_id" | "comment_id",
  ids: number[],
) {
  const counts = new Map<number, number>();
  if (ids.length === 0) return counts;

  const { data, error } = await supabase
    .from("reports")
    .select(column)
    .in(column, ids)
    .in("status", ["open", "reviewing"]);

  if (error) {
    throw error;
  }

  for (const row of (data ?? []) as Record<typeof column, number>[]) {
    const id = row[column];
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  return counts;
}

function toPostListItem(
  row: PostRow,
  profiles: Map<string, ProfileSummary>,
  openReports: Map<number, number>,
): CommunityPostListItem {
  const reportCount = openReports.get(row.id) ?? 0;

  return {
    id: row.id,
    author: profiles.get(row.author_id) ?? null,
    city: row.city,
    imageUrl: row.image_url,
    caption: row.caption,
    heartsCount: row.hearts_count,
    commentsCount: row.comments_count,
    state: contentState(row.hidden_at, reportCount),
    openReports: reportCount,
    createdAt: row.created_at,
  };
}

function toCommentItem(
  row: CommentRow,
  profiles: Map<string, ProfileSummary>,
  openReports: Map<number, number>,
): CommunityCommentItem {
  const reportCount = openReports.get(row.id) ?? 0;

  return {
    id: row.id,
    postId: row.post_id,
    author: profiles.get(row.author_id) ?? null,
    body: row.body,
    heartsCount: row.hearts_count,
    state: contentState(row.hidden_at, reportCount),
    openReports: reportCount,
    createdAt: row.created_at,
  };
}

export async function getCommunityPostsReadModel(): Promise<
  ModerationQueryResult<CommunityPostListItem[]>
> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return mapQueryError(error, "Impossible de charger les publications.");

  const rows = (data ?? []) as PostRow[];

  try {
    const [profiles, openReports] = await Promise.all([
      loadProfiles(supabase, rows.map((row) => row.author_id)),
      loadOpenReportCounts(supabase, "post_id", rows.map((row) => row.id)),
    ]);

    return { kind: "ok", data: rows.map((row) => toPostListItem(row, profiles, openReports)) };
  } catch (relatedError) {
    return mapQueryError(relatedError as QueryError, "Impossible de charger les données associées.");
  }
}

export async function getCommunityPostDetail(
  postId: number,
): Promise<ModerationQueryResult<CommunityPostDetail> | { kind: "not_found" }> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  if (!Number.isInteger(postId)) return { kind: "not_found" };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_COLUMNS)
    .eq("id", postId)
    .maybeSingle();

  if (error) return mapQueryError(error, "Impossible de charger la publication.");
  if (!data) return { kind: "not_found" };

  const postRow = data as PostRow;

  const { data: commentData, error: commentError } = await supabase
    .from("comments")
    .select(COMMENT_COLUMNS)
    .eq("post_id", postId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (commentError) return mapQueryError(commentError, "Impossible de charger les commentaires.");

  const commentRows = (commentData ?? []) as CommentRow[];

  try {
    const [profiles, postReports, commentReports] = await Promise.all([
      loadProfiles(supabase, [postRow.author_id, ...commentRows.map((row) => row.author_id)]),
      loadOpenReportCounts(supabase, "post_id", [postRow.id]),
      loadOpenReportCounts(supabase, "comment_id", commentRows.map((row) => row.id)),
    ]);

    return {
      kind: "ok",
      data: {
        post: toPostListItem(postRow, profiles, postReports),
        comments: commentRows.map((row) => toCommentItem(row, profiles, commentReports)),
      },
    };
  } catch (relatedError) {
    return mapQueryError(relatedError as QueryError, "Impossible de charger les données associées.");
  }
}

export async function getCommunityCommentsReadModel(): Promise<
  ModerationQueryResult<CommunityCommentListItem[]>
> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("comments")
    .select(COMMENT_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return mapQueryError(error, "Impossible de charger les commentaires.");

  const rows = (data ?? []) as CommentRow[];
  const postIds = [...new Set(rows.map((row) => row.post_id))];

  try {
    const [profiles, openReports, postCaptions] = await Promise.all([
      loadProfiles(supabase, rows.map((row) => row.author_id)),
      loadOpenReportCounts(supabase, "comment_id", rows.map((row) => row.id)),
      (async () => {
        const captions = new Map<number, string | null>();
        if (postIds.length === 0) return captions;

        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select("id, caption")
          .in("id", postIds);

        if (postError) throw postError;

        for (const row of (postData ?? []) as { id: number; caption: string | null }[]) {
          captions.set(row.id, row.caption);
        }
        return captions;
      })(),
    ]);

    return {
      kind: "ok",
      data: rows.map((row) => ({
        ...toCommentItem(row, profiles, openReports),
        postCaption: postCaptions.get(row.post_id) ?? null,
      })),
    };
  } catch (relatedError) {
    return mapQueryError(relatedError as QueryError, "Impossible de charger les données associées.");
  }
}
