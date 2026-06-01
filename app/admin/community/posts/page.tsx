"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, List, Eye, EyeOff, Trash2, Heart, MessageCircle, Flag } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Avatar,
  Badge,
  Chip,
  Button,
  StatCard,
  useToast,
} from "@/components/ui";
import { posts, CommunityPost, fmtNum } from "@/lib/data";
import Link from "next/link";

type StatusFilter = "tous" | "published" | "flagged" | "removed";

const STATUS_TONE: Record<CommunityPost["status"], "green" | "red" | "neutral"> = {
  published: "green",
  flagged: "red",
  removed: "neutral",
};

const STATUS_LABEL: Record<CommunityPost["status"], string> = {
  published: "publié",
  flagged: "signalé",
  removed: "retiré",
};

export default function PostsModerationPage() {
  const router = useRouter();
  const toast = useToast();
  const [view, setView] = useState<"grid" | "table">("grid");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");
  const [localPosts, setLocalPosts] = useState(posts);

  const filtered = useMemo(() => {
    if (statusFilter === "tous") return localPosts;
    return localPosts.filter((p) => p.status === statusFilter);
  }, [localPosts, statusFilter]);

  const total = localPosts.length;
  const published = localPosts.filter((p) => p.status === "published").length;
  const flagged = localPosts.filter((p) => p.status === "flagged").length;
  const removed = localPosts.filter((p) => p.status === "removed").length;

  const handleHide = (id: string) => {
    setLocalPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "removed" as const } : p))
    );
    toast.push("Publication masquée avec succès.", "ok");
  };

  const handleDelete = (id: string) => {
    setLocalPosts((prev) => prev.filter((p) => p.id !== id));
    toast.push("Publication supprimée définitivement.", "ok");
  };

  const filterChips: { key: StatusFilter; label: string; color: "ink" | "red" | "green" | "gold" }[] = [
    { key: "tous", label: "Toutes", color: "ink" },
    { key: "published", label: "Publiées", color: "green" },
    { key: "flagged", label: "Signalées", color: "red" },
    { key: "removed", label: "Retirées", color: "ink" },
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
          value={fmtNum(total)}
          tone="ink"
          icon={<MessageCircle size={18} />}
        />
        <StatCard
          label="Publiées"
          value={fmtNum(published)}
          delta="+4,2 %"
          tone="green"
          icon={<Eye size={18} />}
        />
        <StatCard
          label="Signalées"
          value={fmtNum(flagged)}
          tone="red"
          icon={<Flag size={18} />}
        />
        <StatCard
          label="Retirées"
          value={fmtNum(removed)}
          tone="ink"
          icon={<EyeOff size={18} />}
        />
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
              onView={() => router.push(`/admin/community/posts/${post.id}`)}
              onHide={() => handleHide(post.id)}
              onDelete={() => handleDelete(post.id)}
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
                        style={{ backgroundImage: `url(${post.image})` }}
                      />
                      <Link
                        href={`/admin/community/posts/${post.id}`}
                        className="font-[family-name:var(--font-serif)] text-[13px] text-ink line-clamp-2 hover:text-gold-deep transition max-w-[200px]"
                      >
                        {post.caption}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar src={post.author.avatar} size={28} />
                      <span className="font-[family-name:var(--font-serif)] text-[13px]">
                        {post.author.firstName} {post.author.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
                    {post.city}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <span className="flex items-center gap-1 font-[family-name:var(--font-serif)] text-[13px]">
                        <Heart size={12} className="text-stamp-red" />
                        {fmtNum(post.hearts)}
                      </span>
                      <span className="flex items-center gap-1 font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
                        <MessageCircle size={12} />
                        {post.comments}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[post.status]} dot>
                      {STATUS_LABEL[post.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-[family-name:var(--font-serif)] text-[12px] text-ink-faded">
                    {post.date}
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
                        onClick={() => handleHide(post.id)}
                        className="p-1.5 rounded hover:bg-paper-warm transition cursor-pointer text-ink-faded"
                        title="Masquer"
                      >
                        <EyeOff size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 rounded hover:bg-stamp-red/10 transition cursor-pointer text-stamp-red"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center font-[family-name:var(--font-hand)] text-lg text-ink-faded">
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
  onView,
  onHide,
  onDelete,
}: {
  post: CommunityPost;
  onView: () => void;
  onHide: () => void;
  onDelete: () => void;
}) {
  const STATUS_TONE: Record<CommunityPost["status"], "green" | "red" | "neutral"> = {
    published: "green",
    flagged: "red",
    removed: "neutral",
  };
  const STATUS_LABEL: Record<CommunityPost["status"], string> = {
    published: "publié",
    flagged: "signalé",
    removed: "retiré",
  };

  return (
    <div className="bg-card border-[1.5px] border-ink rounded-[4px] shadow-ink-sm overflow-hidden group">
      {/* Image */}
      <div className="relative overflow-hidden">
        <div
          className="w-full aspect-square bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
          style={{ backgroundImage: `url(${post.image})` }}
        />
        <div className="absolute top-2 right-2">
          <Badge tone={STATUS_TONE[post.status]} dot>
            {STATUS_LABEL[post.status]}
          </Badge>
        </div>
        {post.status === "flagged" && (
          <div className="absolute top-2 left-2 bg-stamp-red/90 text-paper-warm rounded-full p-1">
            <Flag size={12} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        {/* Author */}
        <div className="flex items-center gap-2 mb-2">
          <Avatar src={post.author.avatar} size={24} />
          <span className="font-[family-name:var(--font-serif)] text-[12px] font-semibold truncate">
            {post.author.firstName} {post.author.lastName}
          </span>
        </div>

        {/* Caption */}
        <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded line-clamp-2 mb-2 leading-snug">
          {post.caption}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 mb-3">
          <span className="flex items-center gap-1 font-[family-name:var(--font-serif)] text-[11px] text-ink-faded">
            <Heart size={11} className="text-stamp-red" />
            {fmtNum(post.hearts)}
          </span>
          <span className="flex items-center gap-1 font-[family-name:var(--font-serif)] text-[11px] text-ink-faded">
            <MessageCircle size={11} />
            {post.comments}
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
            onClick={onHide}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] font-[family-name:var(--font-serif)] border-[1.5px] border-ink/40 rounded-[4px] text-ink-faded hover:bg-paper-warm transition cursor-pointer"
          >
            <EyeOff size={11} /> masquer
          </button>
          <button
            onClick={onDelete}
            className="px-2 py-1.5 text-[11px] font-[family-name:var(--font-serif)] border-[1.5px] border-stamp-red/40 rounded-[4px] text-stamp-red hover:bg-stamp-red/10 transition cursor-pointer"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
