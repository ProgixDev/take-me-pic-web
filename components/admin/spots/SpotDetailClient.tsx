"use client";

import { useState, useTransition } from "react";
import { Star, MessageSquare, Clock, MapPin, CheckCircle, XCircle, Edit3, Camera, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AdminPage } from "@/components/admin/AdminPage";
import { Avatar, Badge, Button, Modal, PaperCard, Stamp, useToast } from "@/components/ui";
import { fmtNum } from "@/lib/data";
import type { SpotDetail } from "@/lib/admin/spots";
import { reviewSpot, type SpotDecision } from "@/lib/admin/spots-actions";
import {
  SPOT_STATUS_LABEL,
  SPOT_STATUS_TONE,
  actionErrorMessage,
  formatDate,
  profileName,
} from "@/components/admin/spots/status";

export function SpotDetailClient({ detail }: { detail: SpotDetail }) {
  const { spot, reviewedBy, reviewedAt, photoCount, tips } = detail;
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [confirmAction, setConfirmAction] = useState<SpotDecision | null>(null);

  const handleAction = (decision: SpotDecision) => {
    startTransition(async () => {
      const result = await reviewSpot(spot.id, decision);
      if (result.kind === "ok") {
        toast.push(
          decision === "approved"
            ? `Spot « ${spot.name} » approuvé et mis en ligne.`
            : `Spot « ${spot.name} » rejeté.`,
          "ok",
        );
      } else {
        toast.push(actionErrorMessage(result), "err");
      }
    });
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
          <Link href={`/admin/spots/${spot.id}/edit`}>
            <Button variant="paper" size="sm" icon={<Edit3 size={14} />}>
              Modifier
            </Button>
          </Link>
          <Button
            variant="gold"
            size="sm"
            icon={<CheckCircle size={14} />}
            onClick={() => setConfirmAction("approved")}
            disabled={pending || spot.status === "approved"}
          >
            Approuver
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<XCircle size={14} />}
            onClick={() => setConfirmAction("rejected")}
            disabled={pending || spot.status === "rejected"}
          >
            Rejeter
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — hero + tips */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Hero Image */}
          <div className="relative rounded-[4px] overflow-hidden border-[1.5px] border-ink shadow-ink-sm">
            {spot.heroUrl ? (
              <img src={spot.heroUrl} alt={spot.name} className="w-full aspect-video object-cover" />
            ) : (
              <div className="w-full aspect-video bg-paper-warm flex items-center justify-center font-[family-name:var(--font-hand)] text-xl text-ink-faded">
                Pas de photo de couverture
              </div>
            )}
            {/* Overlays */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <Badge tone={SPOT_STATUS_TONE[spot.status]} dot>
                {SPOT_STATUS_LABEL[spot.status]}
              </Badge>
              {spot.isSponsored && <Badge tone="gold">Sponsorisé</Badge>}
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
                  <span className="opacity-70">({fmtNum(spot.reviewsCount)} avis)</span>
                </span>
                <span className="flex items-center gap-1.5 text-paper-warm font-[family-name:var(--font-serif)] text-[14px]">
                  <Camera size={14} className="text-gold-light" />
                  <strong>{fmtNum(photoCount)}</strong>
                  <span className="opacity-70">photos</span>
                </span>
                <span className="flex items-center gap-1.5 text-paper-warm font-[family-name:var(--font-serif)] text-[14px]">
                  <Clock size={14} className="text-gold-light" />
                  <strong>{spot.bestTime ?? "—"}</strong>
                </span>
                <span className="flex items-center gap-1.5 text-paper-warm font-[family-name:var(--font-serif)] text-[14px]">
                  <MapPin size={14} className="text-gold-light" />
                  {spot.city ?? "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Conseils */}
          <PaperCard shadow="soft" className="p-5">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-[18px] mb-3 flex items-center gap-2">
              <span className="font-[family-name:var(--font-hand)] text-gold-deep text-2xl -rotate-1">✎</span>
              Conseils de la communauté ({tips.length})
            </h3>
            {tips.length === 0 ? (
              <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
                Aucun conseil partagé pour ce spot.
              </p>
            ) : (
              <ol className="space-y-2.5">
                {tips.map((tip, i) => (
                  <li key={tip.id} className="flex gap-3">
                    <span className="font-[family-name:var(--font-serif)] font-bold text-gold-deep text-[18px] leading-tight shrink-0 w-5">
                      {i + 1}.
                    </span>
                    <span className="font-[family-name:var(--font-serif)] text-[14px] text-ink leading-relaxed">
                      {tip.body}
                      <span className="block font-[family-name:var(--font-type)] text-[11px] text-ink-faded mt-0.5">
                        {profileName(tip.author)} · {formatDate(tip.createdAt)}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
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
                { icon: <MessageSquare size={15} className="text-stamp-blue" />, label: "Avis", value: fmtNum(spot.reviewsCount) },
                { icon: <Camera size={15} className="text-ink" />, label: "Photos", value: fmtNum(photoCount) },
                { icon: <Clock size={15} className="text-gold-deep" />, label: "Meilleure heure", value: spot.bestTime ?? "—" },
                { icon: <MapPin size={15} className="text-stamp-red" />, label: "Localisation", value: spot.city ?? "—" },
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
              <Avatar src={spot.addedBy?.avatarUrl ?? undefined} size={52} />
              <div>
                <div className="font-[family-name:var(--font-serif)] font-bold text-[15px]">
                  {profileName(spot.addedBy)}
                </div>
                <div className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
                  {spot.addedBy?.username ?? "—"}
                </div>
              </div>
            </div>
            {spot.addedBy && (
              <Link
                href={`/admin/users/${spot.addedBy.id}`}
                className="font-[family-name:var(--font-serif)] text-[12px] text-stamp-blue hover:underline"
              >
                Voir le profil complet →
              </Link>
            )}
          </PaperCard>

          {/* Review trail */}
          <PaperCard shadow="soft" className="p-5">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">
              Revue staff
            </div>
            <div className="flex items-center gap-2 font-[family-name:var(--font-serif)] text-[13px]">
              <ShieldCheck size={15} className="text-stamp-green" />
              {reviewedAt ? (
                <span>
                  {profileName(reviewedBy)} · {formatDate(reviewedAt)}
                </span>
              ) : (
                <span className="text-ink-faded">Pas encore revu</span>
              )}
            </div>
          </PaperCard>

          {/* Moderation */}
          <PaperCard shadow="soft" className="p-5">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">
              Modération
            </div>
            <div className="flex flex-col gap-2.5">
              <Link href={`/admin/spots/${spot.id}/edit`}>
                <Button variant="paper" size="sm" full icon={<Edit3 size={14} />}>
                  Modifier le spot
                </Button>
              </Link>
              <Button
                variant="gold"
                size="sm"
                full
                icon={<CheckCircle size={14} />}
                onClick={() => setConfirmAction("approved")}
                disabled={pending || spot.status === "approved"}
              >
                Approuver
              </Button>
              <Button
                variant="danger"
                size="sm"
                full
                icon={<XCircle size={14} />}
                onClick={() => setConfirmAction("rejected")}
                disabled={pending || spot.status === "rejected"}
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
        title={confirmAction === "approved" ? "Approuver ce spot ?" : "Rejeter ce spot ?"}
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setConfirmAction(null)}>
              Annuler
            </Button>
            <Button
              variant={confirmAction === "rejected" ? "danger" : "gold"}
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
          {confirmAction === "approved"
            ? `Le spot « ${spot.name} » sera mis en ligne et visible par toute la communauté. L'action est journalisée.`
            : `Le spot « ${spot.name} » sera rejeté et restera visible uniquement par son auteur. L'action est journalisée.`}
        </p>
      </Modal>
    </AdminPage>
  );
}
