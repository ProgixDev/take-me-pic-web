"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Flag, CheckCircle, Trash2, AlertTriangle } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Avatar,
  Badge,
  Chip,
  Button,
  StatCard,
  useToast,
} from "@/components/ui";
import { users, posts, fmtNum } from "@/lib/data";
import Link from "next/link";

type CommentStatus = "approuvé" | "signalé" | "supprimé" | "en attente";

interface SyntheticComment {
  id: string;
  author: { name: string; avatar: string; username: string };
  excerpt: string;
  postId: string;
  postCaption: string;
  status: CommentStatus;
  reports: number;
  date: string;
}

const COMMENT_TEXTS = [
  "Magnifique composition ! J'adore la lumière dorée de cette heure.",
  "Super spot, j'y suis allé la semaine dernière. Impeccable !",
  "Spam — cliquez ici pour gagner des followers → lien suspect",
  "Belle profondeur de champ, quel appareil as-tu utilisé ?",
  "Contenu inapproprié signalé par 3 utilisateurs.",
  "Incroyable coucher de soleil, j'y retourne cet été !",
  "Vraiment beau cadrage, bravo pour la photo !",
  "Ce spot est dans ma liste depuis longtemps, merci !",
  "Trop beau ✿ — heure dorée garantie.",
  "Message à caractère commercial non sollicité, signalé.",
  "La lumière du matin est parfaite ici, je confirme.",
  "Tu as fait la photo toi-même ? C'est fantastique !",
  "Harcèlement signalé par l'auteur du post.",
  "Superbe prise de vue, le cadre est parfait.",
  "Ça donne envie de voyager immédiatement !",
  "Merci pour ce partage, les infos sont très utiles.",
  "Photo volée d'un autre compte, signalée.",
  "L'angle est vraiment unique, bravo !",
  "Commentaire hors sujet supprimé par modération.",
  "J'adore cette atmosphère magique ☼",
];

const STATUSES: CommentStatus[] = ["approuvé", "approuvé", "approuvé", "signalé", "en attente", "approuvé", "signalé", "supprimé", "approuvé", "signalé", "approuvé", "approuvé", "signalé", "approuvé", "approuvé", "approuvé", "signalé", "approuvé", "supprimé", "approuvé"];

const syntheticComments: SyntheticComment[] = Array.from({ length: 20 }, (_, i) => {
  const u = users[(i * 7) % users.length];
  const p = posts[(i * 3) % posts.length];
  return {
    id: `cm${i + 1}`,
    author: {
      name: `${u.firstName} ${u.lastName}`,
      avatar: u.avatar,
      username: u.username,
    },
    excerpt: COMMENT_TEXTS[i % COMMENT_TEXTS.length],
    postId: p.id,
    postCaption: p.caption,
    status: STATUSES[i % STATUSES.length],
    reports: STATUSES[i % STATUSES.length] === "signalé" ? 1 + (i % 4) : 0,
    date: `2026-05-${String((i % 27) + 1).padStart(2, "0")}`,
  };
});

type StatusFilter = "tous" | "approuvé" | "signalé" | "en attente" | "supprimé";

const STATUS_TONE: Record<CommentStatus, "green" | "red" | "gold" | "neutral"> = {
  "approuvé": "green",
  "signalé": "red",
  "en attente": "gold",
  "supprimé": "neutral",
};

export default function CommentsPage() {
  const router = useRouter();
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");
  const [localComments, setLocalComments] = useState(syntheticComments);

  const filtered = useMemo(() => {
    if (statusFilter === "tous") return localComments;
    return localComments.filter((c) => c.status === statusFilter);
  }, [localComments, statusFilter]);

  const total = localComments.length;
  const approves = localComments.filter((c) => c.status === "approuvé").length;
  const signales = localComments.filter((c) => c.status === "signalé").length;
  const enAttente = localComments.filter((c) => c.status === "en attente").length;

  const handleApprove = (id: string) => {
    setLocalComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "approuvé" as CommentStatus, reports: 0 } : c))
    );
    toast.push("Commentaire approuvé.", "ok");
  };

  const handleDelete = (id: string) => {
    setLocalComments((prev) => prev.filter((c) => c.id !== id));
    toast.push("Commentaire supprimé.", "ok");
  };

  const filterChips: { key: StatusFilter; label: string; color: "ink" | "red" | "green" | "gold" }[] = [
    { key: "tous", label: "Tous", color: "ink" },
    { key: "approuvé", label: "Approuvés", color: "green" },
    { key: "signalé", label: "Signalés", color: "red" },
    { key: "en attente", label: "En attente", color: "gold" },
    { key: "supprimé", label: "Supprimés", color: "ink" },
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
          value={fmtNum(total)}
          tone="ink"
          icon={<MessageCircle size={18} />}
        />
        <StatCard
          label="Approuvés"
          value={fmtNum(approves)}
          tone="green"
          icon={<CheckCircle size={18} />}
        />
        <StatCard
          label="Signalés"
          value={fmtNum(signales)}
          tone="red"
          icon={<Flag size={18} />}
        />
        <StatCard
          label="En attente"
          value={fmtNum(enAttente)}
          tone="gold"
          icon={<AlertTriangle size={18} />}
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
                  c.status === "signalé" ? "bg-stamp-red/3" : "hover:bg-paper-warm/70"
                }`}
              >
                {/* Author */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar src={c.author.avatar} size={32} />
                    <div>
                      <div className="font-[family-name:var(--font-serif)] text-[13px] font-semibold leading-tight">
                        {c.author.name}
                      </div>
                      <div className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
                        {c.author.username}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Excerpt */}
                <td className="px-4 py-3 max-w-[240px]">
                  <p className={`font-[family-name:var(--font-serif)] text-[13px] line-clamp-2 leading-snug ${
                    c.status === "signalé" ? "text-stamp-red" : "text-ink"
                  }`}>
                    {c.excerpt}
                  </p>
                </td>

                {/* Post */}
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/community/posts/${c.postId}`}
                    className="font-[family-name:var(--font-serif)] text-[12px] text-stamp-blue hover:underline line-clamp-2 max-w-[160px] block"
                  >
                    {c.postCaption}
                  </Link>
                </td>

                {/* Reports */}
                <td className="px-4 py-3 text-center">
                  {c.reports > 0 ? (
                    <Badge tone="red" dot>{c.reports}</Badge>
                  ) : (
                    <span className="text-ink-faded text-[12px]">—</span>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <Badge tone={STATUS_TONE[c.status]} dot>{c.status}</Badge>
                </td>

                {/* Date */}
                <td className="px-4 py-3 font-[family-name:var(--font-serif)] text-[12px] text-ink-faded">
                  {c.date}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handleApprove(c.id)}
                      disabled={c.status === "approuvé"}
                      className="p-1.5 rounded hover:bg-stamp-green/10 transition cursor-pointer text-stamp-green disabled:opacity-30 disabled:cursor-default"
                      title="Approuver"
                    >
                      <CheckCircle size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
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
