"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, List, Eye, EyeOff, Heart, MessageCircle, Flag, RotateCcw } from "lucide-react";
import Link from "next/link";
import { AdminPage } from "@/components/admin/AdminPage";
import { Avatar, Badge, Chip, Button, StatCard, useToast } from "@/components/ui";
import { fmtNum } from "@/lib/data";
import type { CommunityPostListItem, CommunityContentState } from "@/lib/admin/community";
import { setPostVisibility } from "@/lib/admin/community-actions";
import { STATE_LABEL, STATE_TONE, actionErrorMessage, formatDate } from "@/components/admin/community/state";

type StatusFilter = "tous" | CommunityContentState;

function authorName(post: CommunityPostListItem) {
  if (!post.author) return "Profil supprimé";
  return [post.author.firstName, post.author.lastName].filter(Boolean).join(" ");
}

function useVisibilityAction() {
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const toggle = (post: CommunityPostListItem) => {
    const hide = post.state !== "hidden";
    startTransition(async () => {
      const result = await setPostVisibility(post.id, hide);
      if (result.kind === "ok") {
        toast.push(hide ? "Publication masquée avec succès." : "Publication rétablie.", "ok");
      } else {
        toast.push(actionErrorMessage(result), "err");
      }
    });
  };

  return { pending, toggle };
}

export function PostsClient({ posts }: { posts: CommunityPostListItem[] }) {
  const router = useRouter();
  const [view, setView] = useState<"grid" | "table">("grid");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");
  const { pending, toggle } = useVisibilityAction();

  const filtered = useMemo(() => {
    if (statusFilter === "tous") return posts;
    return posts.filter((p) => p.state === statusFilter);
  }, [posts, statusFilter]);

  const published = posts.filter((p) => p.state === "published").length;
  const flagged = posts.filter((p) => p.state === "flagged").length;
  const hidden = posts.filter((p) => p.state === "hidden").length;

  const filterChips: { key: StatusFilter; label: string; color: "ink" | "red" | "green" }[] = [
    { key: "tous", label: "Toutes", color: "ink" },
    { key: "published", label: "Publiées", color: "green" },
    { key: "flagged", label: "Signalées", color: "red" },
    { key: "hidden", label: "Masquées", color: "ink" },
  ];

  return (
    <AdminPage
      title="Publications communauté"
      eyebrow="modération des posts"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/community", label: "Communauté" },
        { label: "Publications" },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant={view === "grid" ? "ink" : "paper"}
            size="sm"
            icon={<LayoutGrid size={14} />}
            onClick={() => setView("grid")}
          >
            Grille
          </Button>
          <Button
            variant={view === "table" ? "ink" : "paper"}
            size="sm"
            icon={<List size={14} />}
            onClick={() => setView("table")}
          >
            Liste
          </Button>
        </div>
      }
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Publications totales"
          value={fmtNum(posts.length)}
          tone="ink"
          icon={<MessageCircle size={18} />}
        />
        <StatCard label="Publiées" value={fmtNum(published)} tone="green" icon={<Eye size={18} />} />
        <StatCard label="Signalées" value={fmtNum(flagged)} tone="red" icon={<Flag size={18} />} />
        <StatCard label="Masquées" value={fmtNum(hidden)} tone="ink" icon={<EyeOff size={18} />} />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mr-1">
          Filtrer :
        </span>
        {filterChips.map((f) => (
          <Chip
            key={f.key}
            color={statusFilter === f.key ? f.color : "ink"}
            variant={statusFilter === f.key ? "filled" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(f.key)}
          >
            {f.label}
          </Chip>
        ))}
        <span className="ml-auto font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* GRID VIEW */}
      {view === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              pending={pending}
              onView={() => router.push(`/admin/community/posts/${post.id}`)}
              onToggle={() => toggle(post)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center font-[family-name:var(--font-hand)] text-xl text-ink-faded">
              Aucune publication pour ce filtre.
            </div>
          )}
        </div>
      )}

      {/* TABLE VIEW */}
      {view === "table" && (
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] overflow-hidden shadow-ink-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-[1.5px] border-dashed border-[var(--ink-line)] bg-paper-2/60">
                <th className="px-4 py-3 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Publication</th>
                <th className="px-4 py-3 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Auteur</th>
                <th className="px-4 py-3 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Ville</th>
                <th className="px-4 py-3 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded text-right">Engagement</th>
                <th className="px-4 py-3 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded text-center">Signalements</th>
                <th className="px-4 py-3 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Statut</th>
                <th className="px-4 py-3 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Date</th>
                <th className="px-4 py-3 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-[var(--ink-line)] last:border-0 hover:bg-paper-warm/70 transition"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-[4px] bg-cover bg-center border border-ink/20 shrink-0"
                        style={{ backgroundImage: `url(${post.imageUrl})` }}
                      />
                      <Link
                        href={`/admin/community/posts/${post.id}`}
                        className="font-[family-name:var(--font-serif)] text-[13px] text-ink line-clamp-2 hover:text-gold-deep transition max-w-[200px]"
                      >
                        {post.caption ?? `Publication #${post.id}`}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar src={post.author?.avatarUrl ?? undefined} size={28} />
                      <span className="font-[family-name:var(--font-serif)] text-[13px]">
                        {authorName(post)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
                    {post.city ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <span className="flex items-center gap-1 font-[family-name:var(--font-serif)] text-[13px]">
                        <Heart size={12} className="text-stamp-red" />
                        {fmtNum(post.heartsCount)}
                      </span>
                      <span className="flex items-center gap-1 font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
                        <MessageCircle size={12} />
                        {post.commentsCount}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {post.openReports > 0 ? (
                      <Badge tone="red" dot>{post.openReports}</Badge>
                    ) : (
                      <span className="text-ink-faded text-[12px]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={STATE_TONE[post.state]} dot>
                      {STATE_LABEL[post.state]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-[family-name:var(--font-serif)] text-[12px] text-ink-faded">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => router.push(`/admin/community/posts/${post.id}`)}
                        className="p-1.5 rounded hover:bg-paper-warm transition cursor-pointer"
                        title="Voir"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => toggle(post)}
                        disabled={pending}
                        className="p-1.5 rounded hover:bg-paper-warm transition cursor-pointer text-ink-faded disabled:opacity-30"
                        title={post.state === "hidden" ? "Rétablir" : "Masquer"}
                      >
                        {post.state === "hidden" ? <RotateCcw size={14} /> : <EyeOff size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center font-[family-name:var(--font-hand)] text-lg text-ink-faded">
                    Aucune publication pour ce filtre.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminPage>
  );
}

function PostCard({
  post,
  pending,
  onView,
  onToggle,
}: {
  post: CommunityPostListItem;
  pending: boolean;
  onView: () => void;
  onToggle: () => void;
}) {
  return (
    <div className="bg-card border-[1.5px] border-ink rounded-[4px] shadow-ink-sm overflow-hidden group">
      {/* Image */}
      <div className="relative overflow-hidden">
        <div
          className="w-full aspect-square bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
          style={{ backgroundImage: `url(${post.imageUrl})` }}
        />
        <div className="absolute top-2 right-2">
          <Badge tone={STATE_TONE[post.state]} dot>
            {STATE_LABEL[post.state]}
          </Badge>
        </div>
        {post.state === "flagged" && (
          <div className="absolute top-2 left-2 bg-stamp-red/90 text-paper-warm rounded-full p-1">
            <Flag size={12} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        {/* Author */}
        <div className="flex items-center gap-2 mb-2">
          <Avatar src={post.author?.avatarUrl ?? undefined} size={24} />
          <span className="font-[family-name:var(--font-serif)] text-[12px] font-semibold truncate">
            {authorName(post)}
          </span>
        </div>

        {/* Caption */}
        <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded line-clamp-2 mb-2 leading-snug">
          {post.caption ?? `Publication #${post.id}`}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1 font-[family-name:var(--font-serif)] text-[11px] text-ink-faded">
            <Heart size={11} className="text-stamp-red" />
            {fmtNum(post.heartsCount)}
          </span>
          <span className="flex items-center gap-1 font-[family-name:var(--font-serif)] text-[11px] text-ink-faded">
            <MessageCircle size={11} />
            {post.commentsCount}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-1.5">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-[family-name:var(--font-serif)] border-[1.5px] border-ink rounded-[4px] hover:bg-paper-warm transition cursor-pointer"
          >
            <Eye size={11} /> voir
          </button>
          <button
            onClick={onToggle}
            disabled={pending}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-[family-name:var(--font-serif)] border-[1.5px] border-ink/40 rounded-[4px] text-ink-faded hover:bg-paper-warm transition cursor-pointer disabled:opacity-30"
          >
            {post.state === "hidden" ? (
              <>
                <RotateCcw size={11} /> rétablir
              </>
            ) : (
              <>
                <EyeOff size={11} /> masquer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
