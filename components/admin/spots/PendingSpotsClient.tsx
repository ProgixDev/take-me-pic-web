"use client";

import { useState, useTransition } from "react";
import { CheckCircle, XCircle, Clock, MapPin, Star, User } from "lucide-react";
import Link from "next/link";
import { AdminPage } from "@/components/admin/AdminPage";
import { Avatar, Button, PaperCard, Stamp, StatCard, useToast } from "@/components/ui";
import { fmtNum } from "@/lib/data";
import type { SpotListItem } from "@/lib/admin/spots";
import { reviewSpot, type SpotDecision } from "@/lib/admin/spots-actions";
import { actionErrorMessage, profileName } from "@/components/admin/spots/status";

export function PendingSpotsClient({ spots }: { spots: SpotListItem[] }) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [decisions, setDecisions] = useState<Record<number, SpotDecision>>({});

  const undecided = spots.filter((s) => !decisions[s.id]);
  const approvedCount = spots.filter((s) => decisions[s.id] === "approved").length;
  const rejectedCount = spots.filter((s) => decisions[s.id] === "rejected").length;

  const decide = (spot: SpotListItem, decision: SpotDecision) => {
    startTransition(async () => {
      const result = await reviewSpot(spot.id, decision);
      if (result.kind === "ok") {
        setDecisions((prev) => ({ ...prev, [spot.id]: decision }));
        toast.push(
          decision === "approved" ? `Spot « ${spot.name} » approuvé ✓` : `Spot « ${spot.name} » rejeté.`,
          "ok",
        );
      } else {
        toast.push(actionErrorMessage(result), "err");
      }
    });
  };

  return (
    <AdminPage
      title="File d'attente — Spots"
      eyebrow="en attente de validation"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/spots", label: "Spots" },
        { label: "En attente" },
      ]}
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="En attente" value={undecided.length} tone="gold" icon={<Clock size={18} />} />
        <StatCard label="Approuvés" value={approvedCount} tone="green" icon={<CheckCircle size={18} />} />
        <StatCard label="Rejetés" value={rejectedCount} tone="red" icon={<XCircle size={18} />} />
      </div>

      {/* Empty state */}
      {spots.length === 0 && (
        <div className="py-16 text-center flex flex-col items-center gap-4">
          <Stamp color="green" shape="circle" size={80} rotate={-8} fontSize={9}>
            TOUT{"\n"}TRAITÉ
          </Stamp>
          <p className="font-[family-name:var(--font-hand)] text-xl text-ink-faded">
            Aucun spot en attente de validation ✓
          </p>
          <Link href="/admin/spots">
            <Button variant="paper" size="sm">Retour aux spots</Button>
          </Link>
        </div>
      )}

      {/* Pending Spots Grid */}
      {spots.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {spots.map((spot) => (
            <ReviewCard
              key={spot.id}
              spot={spot}
              decision={decisions[spot.id] ?? null}
              pending={pending}
              onApprove={() => decide(spot, "approved")}
              onReject={() => decide(spot, "rejected")}
            />
          ))}
        </div>
      )}

      {/* Summary action note */}
      {spots.length > 0 && undecided.length === 0 && (
        <div className="mt-8 p-5 bg-card border-[1.5px] border-stamp-green rounded-[4px] text-center">
          <p className="font-[family-name:var(--font-hand)] text-xl text-stamp-green mb-3">
            Tous les spots ont été traités ✓
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/admin/spots">
              <Button variant="gold" size="sm">
                Voir tous les spots
              </Button>
            </Link>
          </div>
        </div>
      )}
    </AdminPage>
  );
}

function ReviewCard({
  spot,
  decision,
  pending,
  onApprove,
  onReject,
}: {
  spot: SpotListItem;
  decision: SpotDecision | null;
  pending: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <PaperCard
      shadow={decision === "approved" ? "gold" : decision === "rejected" ? "red" : "soft"}
      className={`overflow-hidden transition-all duration-300 ${
        decision === "approved" ? "opacity-70" : decision === "rejected" ? "opacity-50" : ""
      }`}
    >
      {/* Hero image */}
      <div className="relative">
        {spot.heroUrl ? (
          <img src={spot.heroUrl} alt={spot.name} className="w-full aspect-video object-cover" />
        ) : (
          <div className="w-full aspect-video bg-paper-warm flex items-center justify-center font-[family-name:var(--font-hand)] text-ink-faded">
            Pas de photo
          </div>
        )}
        {/* Decision stamp overlay */}
        {decision && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/30">
            <Stamp
              color={decision === "approved" ? "green" : "red"}
              shape="rect"
              size={72}
              rotate={decision === "approved" ? -8 : 8}
              fontSize={12}
            >
              {decision === "approved" ? "APPROUVÉ" : "REJETÉ"}
            </Stamp>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name + Location */}
        <h3 className="font-[family-name:var(--font-serif)] font-bold text-[16px] leading-tight mb-1">
          <Link href={`/admin/spots/${spot.id}`} className="hover:text-gold-deep transition">
            {spot.name}
          </Link>
        </h3>
        <div className="flex items-center gap-1 text-ink-faded font-[family-name:var(--font-serif)] text-[13px] mb-3">
          <MapPin size={12} />
          {spot.city ?? "—"}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-3 pb-3 border-b border-dashed border-[var(--ink-line)]">
          <span className="flex items-center gap-1 font-[family-name:var(--font-serif)] text-[12px]">
            <Star size={11} className="text-gold-deep" fill="currentColor" />
            {spot.rating.toFixed(1)}
          </span>
          <span className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded">
            {fmtNum(spot.reviewsCount)} avis
          </span>
          <span className="flex items-center gap-1 font-[family-name:var(--font-serif)] text-[12px] text-ink-faded ml-auto">
            <Clock size={11} />
            {spot.bestTime ?? "—"}
          </span>
        </div>

        {/* Added by */}
        <div className="flex items-center gap-2 mb-4">
          <User size={12} className="text-ink-faded shrink-0" />
          <Avatar src={spot.addedBy?.avatarUrl ?? undefined} size={22} />
          <span className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded">
            Proposé par <strong className="text-ink">{profileName(spot.addedBy)}</strong>
          </span>
        </div>

        {/* Action buttons */}
        {!decision ? (
          <div className="flex gap-2">
            <Button
              variant="gold"
              size="sm"
              full
              icon={<CheckCircle size={13} />}
              disabled={pending}
              onClick={onApprove}
            >
              Approuver
            </Button>
            <Button
              variant="danger"
              size="sm"
              full
              icon={<XCircle size={13} />}
              disabled={pending}
              onClick={onReject}
            >
              Rejeter
            </Button>
          </div>
        ) : (
          <div className={`text-center py-2 rounded-[4px] font-[family-name:var(--font-serif)] text-[13px] font-semibold ${
            decision === "approved"
              ? "bg-stamp-green/10 text-stamp-green"
              : "bg-stamp-red/10 text-stamp-red"
          }`}>
            {decision === "approved" ? "✓ Approuvé" : "✗ Rejeté"}
          </div>
        )}
      </div>
    </PaperCard>
  );
}
