"use client";

import { useState, useMemo, useTransition } from "react";
import { MessageCircle, Flag, EyeOff, RotateCcw, Eye } from "lucide-react";
import Link from "next/link";
import { AdminPage } from "@/components/admin/AdminPage";
import { Avatar, Badge, Chip, StatCard, useToast } from "@/components/ui";
import { fmtNum } from "@/lib/data";
import type { CommunityCommentListItem, CommunityContentState } from "@/lib/admin/community";
import { setCommentVisibility } from "@/lib/admin/community-actions";
import { STATE_LABEL, STATE_TONE, actionErrorMessage, formatDate } from "@/components/admin/community/state";

type StatusFilter = "tous" | CommunityContentState;

function authorName(comment: CommunityCommentListItem) {
  if (!comment.author) return "Profil supprimé";
  return [comment.author.firstName, comment.author.lastName].filter(Boolean).join(" ");
}

export function CommentsClient({ comments }: { comments: CommunityCommentListItem[] }) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");

  const filtered = useMemo(() => {
    if (statusFilter === "tous") return comments;
    return comments.filter((c) => c.state === statusFilter);
  }, [comments, statusFilter]);

  const published = comments.filter((c) => c.state === "published").length;
  const flagged = comments.filter((c) => c.state === "flagged").length;
  const hidden = comments.filter((c) => c.state === "hidden").length;

  const toggle = (comment: CommunityCommentListItem) => {
    const hide = comment.state !== "hidden";
    startTransition(async () => {
      const result = await setCommentVisibility(comment.id, hide);
      if (result.kind === "ok") {
        toast.push(hide ? "Commentaire masqué." : "Commentaire rétabli.", "ok");
      } else {
        toast.push(actionErrorMessage(result), "err");
      }
    });
  };

  const filterChips: { key: StatusFilter; label: string; color: "ink" | "red" | "green" }[] = [
    { key: "tous", label: "Tous", color: "ink" },
    { key: "published", label: "Publiés", color: "green" },
    { key: "flagged", label: "Signalés", color: "red" },
    { key: "hidden", label: "Masqués", color: "ink" },
  ];

  return (
    <AdminPage
      title="Commentaires"
      eyebrow="modération"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/community", label: "Communauté" },
        { label: "Commentaires" },
      ]}
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Commentaires total"
          value={fmtNum(comments.length)}
          tone="ink"
          icon={<MessageCircle size={18} />}
        />
        <StatCard label="Publiés" value={fmtNum(published)} tone="green" icon={<Eye size={18} />} />
        <StatCard label="Signalés" value={fmtNum(flagged)} tone="red" icon={<Flag size={18} />} />
        <StatCard label="Masqués" value={fmtNum(hidden)} tone="ink" icon={<EyeOff size={18} />} />
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

      {/* DataTable */}
      <div className="bg-card border-[1.5px] border-ink rounded-[4px] overflow-hidden shadow-ink-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-[1.5px] border-dashed border-[var(--ink-line)] bg-paper-2/60">
              <th className="px-4 py-3 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Auteur</th>
              <th className="px-4 py-3 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Extrait</th>
              <th className="px-4 py-3 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Publication</th>
              <th className="px-4 py-3 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded text-center">Signalements</th>
              <th className="px-4 py-3 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Statut</th>
              <th className="px-4 py-3 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Date</th>
              <th className="px-4 py-3 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                className={`border-b border-[var(--ink-line)] last:border-0 transition ${
                  c.state === "flagged" ? "bg-stamp-red/3" : "hover:bg-paper-warm/70"
                }`}
              >
                {/* Author */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar src={c.author?.avatarUrl ?? undefined} size={32} />
                    <div>
                      <div className="font-[family-name:var(--font-serif)] text-[13px] font-semibold leading-tight">
                        {authorName(c)}
                      </div>
                      <div className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
                        {c.author?.username ?? "—"}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Excerpt */}
                <td className="px-4 py-3 max-w-[240px]">
                  <p className={`font-[family-name:var(--font-serif)] text-[13px] line-clamp-2 leading-snug ${
                    c.state === "flagged" ? "text-stamp-red" : "text-ink"
                  }`}>
                    {c.body}
                  </p>
                </td>

                {/* Post */}
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/community/posts/${c.postId}`}
                    className="font-[family-name:var(--font-serif)] text-[12px] text-stamp-blue hover:underline line-clamp-2 max-w-[160px] block"
                  >
                    {c.postCaption ?? `Publication #${c.postId}`}
                  </Link>
                </td>

                {/* Reports */}
                <td className="px-4 py-3 text-center">
                  {c.openReports > 0 ? (
                    <Badge tone="red" dot>{c.openReports}</Badge>
                  ) : (
                    <span className="text-ink-faded text-[12px]">—</span>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <Badge tone={STATE_TONE[c.state]} dot>{STATE_LABEL[c.state]}</Badge>
                </td>

                {/* Date */}
                <td className="px-4 py-3 font-[family-name:var(--font-serif)] text-[12px] text-ink-faded">
                  {formatDate(c.createdAt)}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => toggle(c)}
                      disabled={pending}
                      className={`p-1.5 rounded transition cursor-pointer disabled:opacity-30 ${
                        c.state === "hidden"
                          ? "hover:bg-stamp-green/10 text-stamp-green"
                          : "hover:bg-stamp-red/10 text-stamp-red"
                      }`}
                      title={c.state === "hidden" ? "Rétablir" : "Masquer"}
                    >
                      {c.state === "hidden" ? <RotateCcw size={14} /> : <EyeOff size={14} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center font-[family-name:var(--font-hand)] text-lg text-ink-faded">
                  Aucun commentaire pour ce filtre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminPage>
  );
}
