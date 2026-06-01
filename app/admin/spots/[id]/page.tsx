"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Star, Eye, MessageSquare, Clock, MapPin, CheckCircle, XCircle, Edit3 } from "lucide-react";
import Link from "next/link";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Avatar,
  Badge,
  Button,
  Modal,
  PaperCard,
  Polaroid,
  Stamp,
  useToast,
} from "@/components/ui";
import { getSpot, fmtNum } from "@/lib/data";

const STATUS_TONE: Record<string, "green" | "gold" | "red"> = {
  approved: "green",
  pending: "gold",
  rejected: "red",
};

const STATUS_LABEL: Record<string, string> = {
  approved: "validé",
  pending: "en attente",
  rejected: "rejeté",
};

const CAT_LABEL: Record<string, string> = {
  coucher: "Coucher de soleil ☀",
  lever: "Lever du soleil 🌅",
  portrait: "Portrait",
  archi: "Architecture",
};

const CAT_TONE: Record<string, "gold" | "blue" | "green" | "red"> = {
  coucher: "gold",
  lever: "blue",
  portrait: "green",
  archi: "red",
};

// Synthetic "best angles" images for the polaroid strip
const ANGLE_CAPTIONS = [
  "Face sud",
  "Angle bas",
  "Vue plongeante",
  "Contre-jour",
];

// Synthetic tips
const TIPS = [
  "Arriver 20 min avant l'heure dorée pour trouver la meilleure position.",
  "Éviter les week-ends et jours fériés — préférer le mardi ou le mercredi matin.",
  "Le pilier de gauche offre un premier plan naturel pour les portraits.",
  "En cas de pluie, les reflets sur les pavés offrent des effets magiques.",
  "Un trépied est recommandé pour les longues expositions au coucher.",
];

export default function SpotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const spot = getSpot(id);
  const [status, setStatus] = useState(spot.status);
  const [confirmAction, setConfirmAction] = useState<"approuver" | "rejeter" | null>(null);

  const handleAction = (action: "approuver" | "rejeter") => {
    if (action === "approuver") {
      setStatus("approved");
      toast.push(`Spot « ${spot.name} » approuvé et mis en ligne.`, "ok");
    } else {
      setStatus("rejected");
      toast.push(`Spot « ${spot.name} » rejeté.`, "ok");
    }
    setConfirmAction(null);
  };

  return (
    <AdminPage
      title={spot.name}
      eyebrow="détail du spot"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/spots", label: "Spots" },
        { label: spot.name },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Link href={`/admin/spots/${id}/edit`}>
            <Button variant="paper" size="sm" icon={<Edit3 size={14} />}>
              Modifier
            </Button>
          </Link>
          <Button
            variant="gold"
            size="sm"
            icon={<CheckCircle size={14} />}
            onClick={() => setConfirmAction("approuver")}
            disabled={status === "approved"}
          >
            Approuver
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<XCircle size={14} />}
            onClick={() => setConfirmAction("rejeter")}
            disabled={status === "rejected"}
          >
            Rejeter
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — hero + polaroids + tips */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Hero Image */}
          <div className="relative rounded-[4px] overflow-hidden border-[1.5px] border-ink shadow-ink-sm">
            <img
              src={spot.hero}
              alt={spot.name}
              className="w-full aspect-video object-cover"
            />
            {/* Overlays */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <Badge tone={STATUS_TONE[status]} dot>
                {STATUS_LABEL[status]}
              </Badge>
              <Badge tone={CAT_TONE[spot.category]}>
                {CAT_LABEL[spot.category]}
              </Badge>
            </div>
            <div className="absolute top-3 right-3">
              <Stamp color="gold" shape="circle" size={64} rotate={8} fontSize={8}>
                {spot.rating.toFixed(1)}{"\n"}★★★★★
              </Stamp>
            </div>
            {/* Stat strip overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/80 to-transparent p-4">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5 text-paper-warm font-[family-name:var(--font-serif)] text-[14px]">
                  <Star size={14} fill="currentColor" className="text-gold-light" />
                  <strong>{spot.rating.toFixed(1)}</strong>
                  <span className="opacity-70">({fmtNum(spot.reviews)} avis)</span>
                </span>
                <span className="flex items-center gap-1.5 text-paper-warm font-[family-name:var(--font-serif)] text-[14px]">
                  <Eye size={14} className="text-gold-light" />
                  <strong>{fmtNum(spot.visits)}</strong>
                  <span className="opacity-70">visites</span>
                </span>
                <span className="flex items-center gap-1.5 text-paper-warm font-[family-name:var(--font-serif)] text-[14px]">
                  <Clock size={14} className="text-gold-light" />
                  <strong>{spot.bestTime}</strong>
                </span>
                <span className="flex items-center gap-1.5 text-paper-warm font-[family-name:var(--font-serif)] text-[14px]">
                  <MapPin size={14} className="text-gold-light" />
                  {spot.country} {spot.city}
                </span>
              </div>
            </div>
          </div>

          {/* Polaroid strip — "les meilleurs angles" */}
          <div>
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-[18px] mb-4">
              Les meilleurs angles
            </h3>
            <div className="flex gap-4 flex-wrap">
              {ANGLE_CAPTIONS.map((caption, i) => (
                <Polaroid
                  key={caption}
                  src={`https://picsum.photos/seed/${spot.id}_angle${i}/400/400`}
                  caption={caption}
                  width={130}
                  height={110}
                  tilt={i % 2 === 0 ? -3 : 2.5}
                  captionSize={14}
                />
              ))}
            </div>
          </div>

          {/* Conseils */}
          <PaperCard shadow="soft" className="p-5">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-[18px] mb-3 flex items-center gap-2">
              <span className="font-[family-name:var(--font-hand)] text-gold-deep text-2xl -rotate-1">✎</span>
              Conseils de la communauté
            </h3>
            <ol className="space-y-2.5">
              {TIPS.map((tip, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-[family-name:var(--font-serif)] font-bold text-gold-deep text-[18px] leading-tight shrink-0 w-5">
                    {i + 1}.
                  </span>
                  <span className="font-[family-name:var(--font-serif)] text-[14px] text-ink leading-relaxed">
                    {tip}
                  </span>
                </li>
              ))}
            </ol>
          </PaperCard>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-5">
          {/* Spot KPIs */}
          <PaperCard shadow="gold" className="p-5">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-4">
              Statistiques
            </div>
            <div className="space-y-3">
              {[
                { icon: <Star size={15} className="text-gold-deep" />, label: "Note", value: `${spot.rating.toFixed(1)} / 5` },
                { icon: <MessageSquare size={15} className="text-stamp-blue" />, label: "Avis", value: fmtNum(spot.reviews) },
                { icon: <Eye size={15} className="text-ink" />, label: "Visites", value: fmtNum(spot.visits) },
                { icon: <Clock size={15} className="text-gold-deep" />, label: "Meilleure heure", value: spot.bestTime },
                { icon: <MapPin size={15} className="text-stamp-red" />, label: "Localisation", value: `${spot.city}, ${spot.country}` },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
                    {stat.icon} {stat.label}
                  </span>
                  <span className="font-[family-name:var(--font-serif)] font-bold text-[14px]">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </PaperCard>

          {/* Added By */}
          <PaperCard shadow="soft" className="p-5">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">
              Ajouté par
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Avatar src={spot.addedBy.avatar} size={52} ring={spot.addedBy.premium} />
              <div>
                <div className="font-[family-name:var(--font-serif)] font-bold text-[15px]">
                  {spot.addedBy.firstName} {spot.addedBy.lastName}
                </div>
                <div className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
                  {spot.addedBy.username}
                </div>
                {spot.addedBy.premium && (
                  <Badge tone="gold" className="mt-1">✦ Premium</Badge>
                )}
              </div>
            </div>
            <p className="font-[family-name:var(--font-serif)] italic text-[13px] text-ink-faded leading-snug border-l-2 border-gold-deep pl-3 mb-3">
              {spot.addedBy.bio}
            </p>
            <div className="flex gap-2 text-center">
              <div className="flex-1 bg-paper-warm rounded-[4px] p-2">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[15px]">{spot.addedBy.spotsAdded}</div>
                <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.08em] text-ink-faded">spots</div>
              </div>
              <div className="flex-1 bg-paper-warm rounded-[4px] p-2">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[15px]">{fmtNum(spot.addedBy.karma)}</div>
                <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.08em] text-ink-faded">karma</div>
              </div>
            </div>
          </PaperCard>

          {/* Moderation */}
          <PaperCard shadow="soft" className="p-5">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">
              Modération
            </div>
            <div className="flex flex-col gap-2.5">
              <Link href={`/admin/spots/${id}/edit`}>
                <Button variant="paper" size="sm" full icon={<Edit3 size={14} />}>
                  Modifier le spot
                </Button>
              </Link>
              <Button
                variant="gold"
                size="sm"
                full
                icon={<CheckCircle size={14} />}
                onClick={() => setConfirmAction("approuver")}
                disabled={status === "approved"}
              >
                Approuver
              </Button>
              <Button
                variant="danger"
                size="sm"
                full
                icon={<XCircle size={14} />}
                onClick={() => setConfirmAction("rejeter")}
                disabled={status === "rejected"}
              >
                Rejeter
              </Button>
            </div>
          </PaperCard>
        </div>
      </div>

      {/* Confirm Modal */}
      <Modal
        open={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        title={confirmAction === "approuver" ? "Approuver ce spot ?" : "Rejeter ce spot ?"}
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setConfirmAction(null)}>
              Annuler
            </Button>
            <Button
              variant={confirmAction === "rejeter" ? "danger" : "gold"}
              size="sm"
              onClick={() => confirmAction && handleAction(confirmAction)}
            >
              Confirmer
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[15px] text-ink-faded leading-relaxed">
          {confirmAction === "approuver"
            ? `Le spot « ${spot.name} » sera mis en ligne et visible par toute la communauté.`
            : `Le spot « ${spot.name} » sera rejeté. L'utilisateur pourra modifier et resoumettre sa proposition.`}
        </p>
      </Modal>
    </AdminPage>
  );
}
