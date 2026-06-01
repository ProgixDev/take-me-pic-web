"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, MessageCircle, Eye, EyeOff, Trash2, CheckCircle, MapPin, Calendar } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Avatar,
  Badge,
  Button,
  Modal,
  PaperCard,
  Stamp,
  useToast,
} from "@/components/ui";
import { getPost, fmtNum } from "@/lib/data";

type PostStatus = "published" | "flagged" | "removed";

const STATUS_TONE: Record<PostStatus, "green" | "red" | "neutral"> = {
  published: "green",
  flagged: "red",
  removed: "neutral",
};

const STATUS_LABEL: Record<PostStatus, string> = {
  published: "publié",
  flagged: "signalé",
  removed: "retiré",
};

const SYNTHETIC_COMMENTS = [
  {
    id: "c1",
    author: { name: "Léa Moreau", avatar: "https://i.pravatar.cc/300?img=5", username: "@lea.moreau" },
    text: "Magnifique cadrage ! J'adore la lumière à cette heure-là ☼",
    date: "il y a 2 h",
    likes: 14,
  },
  {
    id: "c2",
    author: { name: "Hugo Petit", avatar: "https://i.pravatar.cc/300?img=8", username: "@hugo.petit" },
    text: "C'est exactement l'endroit où je veux aller cet été. Merci pour le partage !",
    date: "il y a 4 h",
    likes: 7,
  },
  {
    id: "c3",
    author: { name: "Yasmine K.", avatar: "https://i.pravatar.cc/300?img=44", username: "@yasmine.k" },
    text: "La composition est superbe. Quel téléphone as-tu utilisé ?",
    date: "il y a 6 h",
    likes: 3,
  },
  {
    id: "c4",
    author: { name: "Thomas Dubois", avatar: "https://i.pravatar.cc/300?img=15", username: "@thomas.dubois" },
    text: "J'y suis allé la semaine dernière, c'est encore plus beau en vrai !",
    date: "hier",
    likes: 21,
  },
  {
    id: "c5",
    author: { name: "Camille Garcia", avatar: "https://i.pravatar.cc/300?img=25", username: "@camille.garcia" },
    text: "Spam — achetez vos followers ici → lien suspect supprimé par modération.",
    date: "hier",
    likes: 0,
    flagged: true,
  },
];

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();

  const post = getPost(id);
  const [status, setStatus] = useState<PostStatus>(post.status);
  const [confirmAction, setConfirmAction] = useState<"approuver" | "masquer" | "supprimer" | null>(null);
  const [comments, setComments] = useState(SYNTHETIC_COMMENTS);

  const handleAction = (action: "approuver" | "masquer" | "supprimer") => {
    if (action === "approuver") {
      setStatus("published");
      toast.push("Publication approuvée et remise en ligne.", "ok");
    } else if (action === "masquer") {
      setStatus("removed");
      toast.push("Publication masquée avec succès.", "ok");
    } else {
      toast.push("Publication supprimée définitivement.", "ok");
      router.push("/admin/community/posts");
    }
    setConfirmAction(null);
  };

  const deleteComment = (cid: string) => {
    setComments((prev) => prev.filter((c) => c.id !== cid));
    toast.push("Commentaire supprimé.", "ok");
  };

  return (
    <AdminPage
      title="Détail publication"
      eyebrow="modération"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/community", label: "Communauté" },
        { href: "/admin/community/posts", label: "Publications" },
        { label: `Post #${id}` },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="paper"
            size="sm"
            icon={<EyeOff size={14} />}
            onClick={() => setConfirmAction("masquer")}
            disabled={status === "removed"}
          >
            Masquer
          </Button>
          <Button
            variant="gold"
            size="sm"
            icon={<CheckCircle size={14} />}
            onClick={() => setConfirmAction("approuver")}
            disabled={status === "published"}
          >
            Approuver
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={14} />}
            onClick={() => setConfirmAction("supprimer")}
          >
            Supprimer
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
              src={post.image}
              alt={post.caption}
              className="w-full aspect-video object-cover"
            />
            <div className="absolute top-3 left-3">
              <Badge tone={STATUS_TONE[status]} dot>
                {STATUS_LABEL[status]}
              </Badge>
            </div>
            <div className="absolute top-3 right-3">
              <Stamp color="ink" shape="rect" size={56} rotate={-4} fontSize={9}>
                POST #{id}
              </Stamp>
            </div>
          </div>

          {/* Caption */}
          <PaperCard shadow="soft" className="p-4">
            <p className="font-[family-name:var(--font-serif)] text-[16px] leading-relaxed italic text-ink">
              « {post.caption} »
            </p>
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-dashed border-[var(--ink-line)]">
              <span className="flex items-center gap-1.5 font-[family-name:var(--font-serif)] text-[14px]">
                <Heart size={15} className="text-stamp-red" />
                <strong>{fmtNum(post.hearts)}</strong> j'aime
              </span>
              <span className="flex items-center gap-1.5 font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">
                <MessageCircle size={15} />
                {post.comments} commentaires
              </span>
              <span className="flex items-center gap-1.5 font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">
                <MapPin size={15} />
                {post.city}
              </span>
              <span className="flex items-center gap-1.5 font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">
                <Calendar size={15} />
                {post.date}
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
                    c.flagged
                      ? "border-stamp-red/40 bg-stamp-red/5"
                      : "border-ink/20 bg-card"
                  }`}
                >
                  <Avatar src={c.author.avatar} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-[family-name:var(--font-serif)] text-[13px] font-semibold">
                          {c.author.name}
                        </span>
                        <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded ml-2">
                          {c.author.username}
                        </span>
                      </div>
                      <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded shrink-0">
                        {c.date}
                      </span>
                    </div>
                    <p className={`font-[family-name:var(--font-serif)] text-[13px] mt-1 leading-snug ${c.flagged ? "text-stamp-red" : "text-ink"}`}>
                      {c.text}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="flex items-center gap-1 text-[11px] text-ink-faded font-[family-name:var(--font-serif)]">
                        <Heart size={10} /> {c.likes}
                      </span>
                      <button
                        onClick={() => deleteComment(c.id)}
                        className="text-[11px] font-[family-name:var(--font-serif)] text-stamp-red hover:underline cursor-pointer"
                      >
                        supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — author card + engagement stats */}
        <div className="flex flex-col gap-5">
          {/* Author PaperCard */}
          <PaperCard shadow="gold" className="p-5">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">
              Auteur
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Avatar src={post.author.avatar} size={56} ring={post.author.premium} />
              <div>
                <div className="font-[family-name:var(--font-serif)] font-bold text-[16px]">
                  {post.author.firstName} {post.author.lastName}
                </div>
                <div className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded">
                  {post.author.username}
                </div>
                {post.author.premium && (
                  <Badge tone="gold" className="mt-1">✦ Premium</Badge>
                )}
              </div>
            </div>
            <p className="font-[family-name:var(--font-serif)] italic text-[13px] text-ink-faded leading-snug mb-3 border-l-2 border-gold-deep pl-3">
              {post.author.bio}
            </p>
            <div className="grid grid-cols-2 gap-2 text-center">
              {[
                { label: "Karma", value: fmtNum(post.author.karma) },
                { label: "Abonnés", value: fmtNum(post.author.followers) },
                { label: "Photos données", value: post.author.photosGiven },
                { label: "Signalements", value: post.author.reports },
              ].map((stat) => (
                <div key={stat.label} className="bg-paper-warm rounded-[4px] p-2">
                  <div className="font-[family-name:var(--font-serif)] font-bold text-[16px]">{stat.value}</div>
                  <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.08em] text-ink-faded">{stat.label}</div>
                </div>
              ))}
            </div>
          </PaperCard>

          {/* Engagement KPIs */}
          <PaperCard shadow="soft" className="p-5">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">
              Engagement
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-[family-name:var(--font-serif)] text-[14px] flex items-center gap-2">
                  <Heart size={14} className="text-stamp-red" /> J'aime
                </span>
                <span className="font-[family-name:var(--font-serif)] font-bold text-[18px] text-stamp-red">
                  {fmtNum(post.hearts)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-[family-name:var(--font-serif)] text-[14px] flex items-center gap-2">
                  <MessageCircle size={14} className="text-stamp-blue" /> Commentaires
                </span>
                <span className="font-[family-name:var(--font-serif)] font-bold text-[18px] text-stamp-blue">
                  {post.comments}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-[family-name:var(--font-serif)] text-[14px] flex items-center gap-2">
                  <Eye size={14} className="text-ink-faded" /> Vues estimées
                </span>
                <span className="font-[family-name:var(--font-serif)] font-bold text-[18px] text-ink-faded">
                  {fmtNum(post.hearts * 8)}
                </span>
              </div>
            </div>
          </PaperCard>

          {/* Moderation actions card */}
          <PaperCard shadow="soft" className="p-5">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">
              Modération
            </div>
            <div className="flex flex-col gap-2.5">
              <Button
                variant="gold"
                size="sm"
                full
                icon={<CheckCircle size={14} />}
                onClick={() => setConfirmAction("approuver")}
                disabled={status === "published"}
              >
                Approuver
              </Button>
              <Button
                variant="paper"
                size="sm"
                full
                icon={<EyeOff size={14} />}
                onClick={() => setConfirmAction("masquer")}
                disabled={status === "removed"}
              >
                Masquer
              </Button>
              <Button
                variant="danger"
                size="sm"
                full
                icon={<Trash2 size={14} />}
                onClick={() => setConfirmAction("supprimer")}
              >
                Supprimer définitivement
              </Button>
            </div>
          </PaperCard>
        </div>
      </div>

      {/* Confirm Modal */}
      <Modal
        open={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        title={
          confirmAction === "supprimer"
            ? "Supprimer la publication ?"
            : confirmAction === "masquer"
            ? "Masquer la publication ?"
            : "Approuver la publication ?"
        }
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setConfirmAction(null)}>
              Annuler
            </Button>
            <Button
              variant={confirmAction === "supprimer" ? "danger" : confirmAction === "masquer" ? "paper" : "gold"}
              size="sm"
              onClick={() => confirmAction && handleAction(confirmAction)}
            >
              Confirmer
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[15px] text-ink-faded leading-relaxed">
          {confirmAction === "supprimer" &&
            "Cette action est irréversible. La publication sera définitivement supprimée de la plateforme."}
          {confirmAction === "masquer" &&
            "La publication sera masquée du fil communauté. L'auteur ne sera pas notifié."}
          {confirmAction === "approuver" &&
            "La publication sera remise en ligne et visible par toute la communauté."}
        </p>
      </Modal>
    </AdminPage>
  );
}
