"use client";

import { useState, useTransition } from "react";
import { Heart, MessageCircle, EyeOff, CheckCircle, MapPin, Calendar, Flag, RotateCcw } from "lucide-react";
import Link from "next/link";
import { AdminPage } from "@/components/admin/AdminPage";
import { Avatar, Badge, Button, Modal, PaperCard, Stamp, useToast } from "@/components/ui";
import { fmtNum } from "@/lib/data";
import type { CommunityPostDetail, CommunityCommentItem } from "@/lib/admin/community";
import { setCommentVisibility, setPostVisibility } from "@/lib/admin/community-actions";
import { STATE_LABEL, STATE_TONE, actionErrorMessage, formatDate } from "@/components/admin/community/state";

type PostAction = "masquer" | "retablir";

function profileName(profile: CommunityCommentItem["author"]) {
  if (!profile) return "Profil supprimé";
  return [profile.firstName, profile.lastName].filter(Boolean).join(" ");
}

export function PostDetailClient({ detail }: { detail: CommunityPostDetail }) {
  const { post, comments } = detail;
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [confirmAction, setConfirmAction] = useState<PostAction | null>(null);

  const handleAction = (action: PostAction) => {
    const hide = action === "masquer";
    startTransition(async () => {
      const result = await setPostVisibility(post.id, hide);
      if (result.kind === "ok") {
        toast.push(hide ? "Publication masquée avec succès." : "Publication rétablie.", "ok");
      } else {
        toast.push(actionErrorMessage(result), "err");
      }
    });
    setConfirmAction(null);
  };

  const toggleComment = (comment: CommunityCommentItem) => {
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

  return (
    <AdminPage
      title="Détail publication"
      eyebrow="modération"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/community", label: "Communauté" },
        { href: "/admin/community/posts", label: "Publications" },
        { label: `Post #${post.id}` },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="paper"
            size="sm"
            icon={<EyeOff size={14} />}
            onClick={() => setConfirmAction("masquer")}
            disabled={pending || post.state === "hidden"}
          >
            Masquer
          </Button>
          <Button
            variant="gold"
            size="sm"
            icon={<CheckCircle size={14} />}
            onClick={() => setConfirmAction("retablir")}
            disabled={pending || post.state !== "hidden"}
          >
            Rétablir
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — big image + stats */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Hero Image */}
          <div className="relative rounded-[4px] overflow-hidden border-[1.5px] border-ink shadow-ink-sm">
            <img
              src={post.imageUrl}
              alt={post.caption ?? `Publication #${post.id}`}
              className="w-full aspect-video object-cover"
            />
            <div className="absolute top-3 left-3">
              <Badge tone={STATE_TONE[post.state]} dot>
                {STATE_LABEL[post.state]}
              </Badge>
            </div>
            <div className="absolute top-3 right-3">
              <Stamp color="ink" shape="rect" size={56} rotate={-4} fontSize={9}>
                POST #{post.id}
              </Stamp>
            </div>
          </div>

          {/* Caption */}
          <PaperCard shadow="soft" className="p-4">
            <p className="font-[family-name:var(--font-serif)] text-[16px] leading-relaxed italic text-ink">
              « {post.caption ?? "Sans légende"} »
            </p>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-dashed border-[var(--ink-line)]">
              <span className="flex items-center gap-1.5 font-[family-name:var(--font-serif)] text-[14px]">
                <Heart size={15} className="text-stamp-red" />
                <strong>{fmtNum(post.heartsCount)}</strong> j'aime
              </span>
              <span className="flex items-center gap-1.5 font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">
                <MessageCircle size={15} />
                {post.commentsCount} commentaires
              </span>
              <span className="flex items-center gap-1.5 font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">
                <MapPin size={15} />
                {post.city ?? "—"}
              </span>
              <span className="flex items-center gap-1.5 font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">
                <Calendar size={15} />
                {formatDate(post.createdAt)}
              </span>
            </div>
          </PaperCard>

          {/* Comments Section */}
          <div>
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-[18px] mb-3">
              Commentaires ({comments.length})
            </h3>
            <div className="flex flex-col gap-3">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className={`flex gap-3 p-3 rounded-[4px] border-[1.5px] ${
                    c.state === "flagged"
                      ? "border-stamp-red/40 bg-stamp-red/5"
                      : "border-ink/20 bg-card"
                  } ${c.state === "hidden" ? "opacity-60" : ""}`}
                >
                  <Avatar src={c.author?.avatarUrl ?? undefined} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-[family-name:var(--font-serif)] text-[13px] font-semibold">
                          {profileName(c.author)}
                        </span>
                        <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded ml-2">
                          {c.author?.username ?? "—"}
                        </span>
                        {c.state !== "published" && (
                          <Badge tone={STATE_TONE[c.state]} className="ml-2">
                            {STATE_LABEL[c.state]}
                          </Badge>
                        )}
                      </div>
                      <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded shrink-0">
                        {formatDate(c.createdAt)}
                      </span>
                    </div>
                    <p className={`font-[family-name:var(--font-serif)] text-[13px] mt-1 leading-snug ${c.state === "flagged" ? "text-stamp-red" : "text-ink"}`}>
                      {c.body}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="flex items-center gap-1 text-[11px] text-ink-faded font-[family-name:var(--font-serif)]">
                        <Heart size={10} /> {c.heartsCount}
                        {c.openReports > 0 && (
                          <span className="flex items-center gap-1 ml-3 text-stamp-red">
                            <Flag size={10} /> {c.openReports}
                          </span>
                        )}
                      </span>
                      <button
                        onClick={() => toggleComment(c)}
                        disabled={pending}
                        className="text-[11px] font-[family-name:var(--font-serif)] text-stamp-red hover:underline cursor-pointer disabled:opacity-30"
                      >
                        {c.state === "hidden" ? "rétablir" : "masquer"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded py-4">
                  Aucun commentaire sur cette publication.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right — author card + signals */}
        <div className="flex flex-col gap-5">
          {/* Author PaperCard */}
          <PaperCard shadow="gold" className="p-5">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">
              Auteur
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Avatar src={post.author?.avatarUrl ?? undefined} size={56} />
              <div>
                <div className="font-[family-name:var(--font-serif)] font-bold text-[16px]">
                  {profileName(post.author)}
                </div>
                <div className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded">
                  {post.author?.username ?? "—"}
                </div>
              </div>
            </div>
            {post.author && (
              <Link
                href={`/admin/users/${post.author.id}`}
                className="font-[family-name:var(--font-serif)] text-[12px] text-stamp-blue hover:underline"
              >
                Voir le profil complet →
              </Link>
            )}
          </PaperCard>

          {/* Report signal */}
          <PaperCard shadow="soft" className="p-5">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">
              Signalements
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-[family-name:var(--font-serif)] text-[14px] flex items-center gap-2">
                <Flag size={14} className="text-stamp-red" /> Signalements ouverts
              </span>
              <span className="font-[family-name:var(--font-serif)] font-bold text-[18px] text-stamp-red">
                {post.openReports}
              </span>
            </div>
            <Link
              href="/admin/moderation/reports"
              className="font-[family-name:var(--font-serif)] text-[12px] text-stamp-blue hover:underline"
            >
              Traiter dans la modération →
            </Link>
          </PaperCard>

          {/* Moderation actions card */}
          <PaperCard shadow="soft" className="p-5">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">
              Modération
            </div>
            <div className="flex flex-col gap-2.5">
              <Button
                variant="paper"
                size="sm"
                full
                icon={<EyeOff size={14} />}
                onClick={() => setConfirmAction("masquer")}
                disabled={pending || post.state === "hidden"}
              >
                Masquer
              </Button>
              <Button
                variant="gold"
                size="sm"
                full
                icon={<RotateCcw size={14} />}
                onClick={() => setConfirmAction("retablir")}
                disabled={pending || post.state !== "hidden"}
              >
                Rétablir
              </Button>
            </div>
          </PaperCard>
        </div>
      </div>

      {/* Confirm Modal */}
      <Modal
        open={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        title={confirmAction === "masquer" ? "Masquer la publication ?" : "Rétablir la publication ?"}
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setConfirmAction(null)}>
              Annuler
            </Button>
            <Button
              variant={confirmAction === "masquer" ? "paper" : "gold"}
              size="sm"
              disabled={pending}
              onClick={() => confirmAction && handleAction(confirmAction)}
            >
              Confirmer
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[15px] text-ink-faded leading-relaxed">
          {confirmAction === "masquer" &&
            "La publication sera masquée du fil communauté. L'auteur la voit toujours et l'action est journalisée."}
          {confirmAction === "retablir" &&
            "La publication sera remise en ligne et visible par toute la communauté. L'action est journalisée."}
        </p>
      </Modal>
    </AdminPage>
  );
}
