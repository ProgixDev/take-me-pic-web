"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Star, Clock, Eye } from "lucide-react";
import {
  PaperCard,
  Stamp,
  Chip,
  Badge,
  SectionHeading,
  Avatar,
} from "@/components/ui";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import { LiveMap, type MapMarker } from "@/components/marketing/LiveMap";
import { useT } from "@/i18n/I18nProvider";
import { spots } from "@/lib/data";
import type { PhotoSpot } from "@/lib/data";

/* ------------------------------------------------------------------ */
/* Filter types & helpers                                               */
/* ------------------------------------------------------------------ */

type Category = "all" | PhotoSpot["category"];

const FILTERS: { key: Category; label: string; emoji: string }[] = [
  { key: "all", label: "Tous les spots", emoji: "✦" },
  { key: "coucher", label: "Coucher de soleil", emoji: "🌅" },
  { key: "lever", label: "Lever du soleil", emoji: "☼" },
  { key: "portrait", label: "Portrait", emoji: "📸" },
  { key: "archi", label: "Architecture", emoji: "🏛" },
];

const CATEGORY_TONE: Record<PhotoSpot["category"], "gold" | "blue" | "green" | "sunset" | "neutral" | "red"> = {
  coucher: "sunset",
  lever: "gold",
  portrait: "blue",
  archi: "neutral",
};

const CATEGORY_LABEL: Record<PhotoSpot["category"], string> = {
  coucher: "Coucher ★",
  lever: "Lever ☼",
  portrait: "Portrait",
  archi: "Architecture",
};

/* ------------------------------------------------------------------ */
/* Sub-component: spot card                                             */
/* ------------------------------------------------------------------ */

function SpotCard({ spot, i }: { spot: PhotoSpot; i: number }) {
  const t = useT();
  const tilt = [-1.2, 0.8, -0.5, 1, -1.5, 0.4, -0.8, 1.2][i % 8];
  return (
    <Link href="/help" className="block group">
      <PaperCard shadow="soft" tilt={tilt} className="overflow-hidden hover:-translate-y-1 transition-transform duration-200">
        {/* Photo */}
        <div className="relative">
          <div
            className="w-full h-44 bg-center bg-cover"
            style={{ backgroundImage: `url(${spot.hero})` }}
          />
          {/* Category badge overlay */}
          <div className="absolute top-3 left-3">
            <Badge tone={CATEGORY_TONE[spot.category]} dot>
              {t(CATEGORY_LABEL[spot.category])}
            </Badge>
          </div>
          {/* Rating chip top-right */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 bg-polaroid/90 backdrop-blur-sm border border-ink/20 rounded-full px-2 py-0.5 font-[family-name:var(--font-type)] text-[11px] text-ink">
              <Star size={10} className="fill-gold-deep text-gold-deep" />
              {spot.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-[16px] leading-tight mb-1">
            {spot.name}
          </h3>
          <div className="flex items-center gap-1 text-ink-faded mb-2">
            <MapPin size={11} />
            <span className="font-[family-name:var(--font-type)] text-[11px]">
              {spot.country} {spot.city}
            </span>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-ink-faded mt-3 flex-wrap">
            <div className="flex items-center gap-1">
              <Clock size={11} />
              <span className="font-[family-name:var(--font-type)] text-[11px]">
                {t("Idéal {{bestTime}}", { bestTime: spot.bestTime })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={11} />
              <span className="font-[family-name:var(--font-type)] text-[11px]">
                {t("{{visits}} visites", { visits: spot.visits })}
              </span>
            </div>
          </div>

          {/* Added by */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--ink-line)]">
            <Avatar src={spot.addedBy.avatar} size={20} />
            <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.06em] text-ink-faded">
              {t("ajouté par {{firstName}}", { firstName: spot.addedBy.firstName })}
            </span>
          </div>
        </div>
      </PaperCard>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                 */
/* ------------------------------------------------------------------ */

export default function SpotsVitrinePage() {
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const t = useT();

  const filtered =
    activeFilter === "all"
      ? spots.filter((s) => s.status === "approved")
      : spots.filter((s) => s.status === "approved" && s.category === activeFilter);

  // Polaroid markers on the real map — every approved spot, placed by lat/lng.
  const spotMarkers: MapMarker[] = spots
    .filter((s) => s.status === "approved")
    .map((s) => ({
      id: s.id,
      lat: s.lat,
      lng: s.lng,
      label: s.city,
      variant: "polaroid",
      image: s.hero,
      href: "/help",
    }));

  return (
    <div>
      <PageHero
        eyebrow={t("repérés par la communauté")}
        title={t("Les spots photo")}
        highlight={t("du monde entier")}
        sub={t("Des milliers d'endroits testés, photographiés et notés par des voyageurs. Trouve le spot parfait avant même d'arriver.")}
        stamp={`SPOTS\n★\nCHOISIS`}
      />

      {/* ============================================================ REAL MAP */}
      <div className="relative border-b-[1.5px] border-[var(--ink-line)] overflow-hidden">
        <LiveMap markers={spotMarkers} height={380} zoom={4} />
        {/* Handwritten label */}
        <div className="absolute top-4 left-6 z-[500] pointer-events-none">
          <div className="font-[family-name:var(--font-hand)] text-2xl text-ink -rotate-1 bg-paper-warm/75 px-2 rounded">
            {t("repérés par la communauté")}
          </div>
        </div>
        {/* Stamp on map */}
        <div className="absolute bottom-6 right-6 z-[500] pointer-events-none">
          <Stamp color="blue" size={64} fontSize={7} rotate={10}>
            {t("CARTE\nLIVE\n★")}
          </Stamp>
        </div>
      </div>

      {/* ============================================================ FILTER + GRID */}
      <section className="mx-auto max-w-7xl px-5 py-14">
        {/* Section heading */}
        <SectionHeading
          eyebrow={t("{{n}} spots validés", { n: filtered.length })}
          title={t("Explorer les spots")}
          highlight={t("par catégorie")}
          className="mb-8"
        />

        {/* Filter chips */}
        <div className="flex flex-wrap gap-3 mb-10">
          {FILTERS.map((f) => (
            <Chip
              key={f.key}
              color={activeFilter === f.key ? "ink" : "gold"}
              variant={activeFilter === f.key ? "filled" : "outline"}
              size="md"
              onClick={() => setActiveFilter(f.key)}
            >
              {f.emoji} {t(f.label)}
            </Chip>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Stamp color="ink" size={80} fontSize={9} rotate={-5} shape="octagon">
              {t("AUCUN\nRÉSULTAT")}
            </Stamp>
            <p className="font-[family-name:var(--font-hand)] text-xl text-ink-faded mt-6">
              {t("Essaie une autre catégorie !")}
            </p>
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 stagger">
            {filtered.map((spot, i) => (
              <SpotCard key={spot.id} spot={spot} i={i} />
            ))}
          </div>
        )}

        {/* Count note */}
        {filtered.length > 0 && (
          <p className="mt-8 font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.08em] text-ink-faded text-center">
            {filtered.length} spot{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""} · mis à jour par la communauté
          </p>
        )}
      </section>

      {/* ============================================================ ADD SPOT TEASER */}
      <section className="mx-auto max-w-7xl px-5 pb-12">
        <PaperCard shadow="ink" className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0">
            <Stamp color="green" size={90} fontSize={9} rotate={-8} shape="octagon">
              {t("TON\nSPOT\n★ ICI")}
            </Stamp>
          </div>
          <div className="flex-1">
            <div className="font-[family-name:var(--font-hand)] text-xl text-gold-deep -rotate-1 mb-2">
              {t("tu connais un endroit incroyable ?")}
            </div>
            <h2 className="font-[family-name:var(--font-serif)] font-bold text-[clamp(20px,3vw,32px)] leading-tight mb-3">
              {t("Ajoute-le à la carte et gagne du karma.")}
            </h2>
            <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[14px] leading-relaxed max-w-md mb-6">
              {t("Chaque spot ajouté et validé par la communauté te rapporte")}{" "}
              <span className="font-bold text-ink">{t("50 points karma")}</span>. {t("Et chaque voyageur qui le visite grâce à toi t'en rapporte encore.")}
            </p>
            <Link href="/download">
              <button className="inline-flex items-center gap-2 h-[48px] px-6 rounded-[4px] bg-ink text-paper-warm font-[family-name:var(--font-serif)] font-semibold hover:brightness-110 transition text-[15px]">
                {t("ajouter un spot dans l'app")}
              </button>
            </Link>
          </div>
        </PaperCard>
      </section>

      <CtaBand />
    </div>
  );
}
