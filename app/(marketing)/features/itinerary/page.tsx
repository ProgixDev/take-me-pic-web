"use client";

import { useState } from "react";
import Link from "next/link";
import { useT } from "@/i18n/I18nProvider";
import {
  Clock,
  MapPin,
  Sun,
  Camera,
  ChevronRight,
  CheckCircle2,
  Shuffle,
  Compass,
} from "lucide-react";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import {
  PaperCard,
  Stamp,
  Tape,
  Polaroid,
  SectionHeading,
  Badge,
} from "@/components/ui";
import { spots } from "@/lib/data";

const CITIES = ["Paris", "Lisbonne", "Barcelone", "Marrakech", "Rome"];

const ITINERAIRES: Record<string, Array<{
  time: string;
  spot: string;
  tip: string;
  cat: "lever" | "portrait" | "archi" | "coucher";
  img: string;
}>> = {
  Paris: [
    { time: "07H00", spot: "Montmartre", tip: "Lumière rasante sur les toits — arrive avant les touristes.", cat: "lever", img: "https://picsum.photos/seed/paris1/400/300" },
    { time: "09H30", spot: "Le Marais", tip: "Façades haussmanniennes à l'ombre du matin.", cat: "archi", img: "https://picsum.photos/seed/paris2/400/300" },
    { time: "12H30", spot: "Jardin des Tuileries", tip: "Contre-jour avec les jets d'eau — pause déjeuner.", cat: "portrait", img: "https://picsum.photos/seed/paris3/400/300" },
    { time: "17H00", spot: "Pont des Arts", tip: "Heure dorée sur la Seine — cadre large.", cat: "coucher", img: "https://picsum.photos/seed/paris4/400/300" },
    { time: "19H30", spot: "Tour Eiffel", tip: "Attends les lumières scintillantes à 21H.", cat: "coucher", img: "https://picsum.photos/seed/paris5/400/300" },
  ],
  Lisbonne: [
    { time: "06H45", spot: "Miradouro da Graça", tip: "Vue 360° sur la ville au lever — arriver tôt.", cat: "lever", img: "https://picsum.photos/seed/lisbon1/400/300" },
    { time: "09H00", spot: "Alfama", tip: "Ruelles pavées avant l'afflux touristique.", cat: "archi", img: "https://picsum.photos/seed/lisbon2/400/300" },
    { time: "11H30", spot: "Tram 28", tip: "Embarcadère — portrait devant le tram jaune.", cat: "portrait", img: "https://picsum.photos/seed/lisbon3/400/300" },
    { time: "18H30", spot: "Tour de Belém", tip: "Soleil derrière la tour — silhouette parfaite.", cat: "coucher", img: "https://picsum.photos/seed/lisbon4/400/300" },
  ],
  Barcelone: [
    { time: "07H15", spot: "Parc Güell", tip: "Entrée libre avant 8H — vue sur la ville.", cat: "lever", img: "https://picsum.photos/seed/bcn1/400/300" },
    { time: "10H00", spot: "Sagrada Família", tip: "Façade est au soleil du matin.", cat: "archi", img: "https://picsum.photos/seed/bcn2/400/300" },
    { time: "15H00", spot: "La Barceloneta", tip: "Lumière méditerranéenne, sable blond.", cat: "portrait", img: "https://picsum.photos/seed/bcn3/400/300" },
    { time: "19H00", spot: "Bunkers del Carmel", tip: "Panorama 360° au coucher — le plus beau de Barcelone.", cat: "coucher", img: "https://picsum.photos/seed/bcn4/400/300" },
  ],
  Marrakech: [
    { time: "06H30", spot: "Jemaa el-Fna", tip: "La place vide à l'aube — cadre historique.", cat: "lever", img: "https://picsum.photos/seed/marra1/400/300" },
    { time: "09H00", spot: "Souk des teinturiers", tip: "Couleurs et lumière matinale.", cat: "archi", img: "https://picsum.photos/seed/marra2/400/300" },
    { time: "16H00", spot: "Jardins Majorelle", tip: "Bleu Klein + fleurs — lumière de fin d'après-midi.", cat: "portrait", img: "https://picsum.photos/seed/marra3/400/300" },
    { time: "18H30", spot: "Remparts de la médina", tip: "Soleil rouge sur les ocres.", cat: "coucher", img: "https://picsum.photos/seed/marra4/400/300" },
  ],
  Rome: [
    { time: "07H00", spot: "Colisée", tip: "L'arène à vide, lumière oblique.", cat: "lever", img: "https://picsum.photos/seed/rome1/400/300" },
    { time: "09H30", spot: "Trastevere", tip: "Ruelles colorées à l'ombre du matin.", cat: "archi", img: "https://picsum.photos/seed/rome2/400/300" },
    { time: "13H00", spot: "Fontaine de Trevi", tip: "Moins de monde après 13H — patience récompensée.", cat: "portrait", img: "https://picsum.photos/seed/rome3/400/300" },
    { time: "19H00", spot: "Janicule", tip: "Le plus beau panorama de Rome au coucher.", cat: "coucher", img: "https://picsum.photos/seed/rome4/400/300" },
  ],
};

const CAT_TONE: Record<string, "gold" | "sunset" | "blue" | "neutral"> = {
  lever: "sunset",
  portrait: "blue",
  archi: "neutral",
  coucher: "gold",
};

const STRENGTHS = [
  { icon: <Shuffle size={18} />, title: "Personnalisé chaque jour", body: "L'itinéraire s'adapte à la météo, à ta position de départ et à l'heure du lever du soleil ce jour-là." },
  { icon: <Compass size={18} />, title: "Guidé étape par étape", body: "Directions, durée de trajet et conseil de cadrage pour chaque spot — tout dans une seule vue." },
  { icon: <Clock size={18} />, title: "Timing de lumière", body: "L'appli calcule l'heure dorée du jour et place les spots de coucher/lever aux bons moments." },
  { icon: <Camera size={18} />, title: "Spots photo uniquement", body: "Pas de restaurants, pas de musées — uniquement des lieux photographiques triés sur le volet." },
  { icon: <Sun size={18} />, title: "Mode sérendipité", body: "Tire au sort un itinéraire surprise pour ta ville — et découvre des endroits que tu ne connaissais pas." },
  { icon: <MapPin size={18} />, title: "Exportable & partageable", body: "Enregistre l'itinéraire du jour et partage-le avec tes compagnons de voyage." },
];

export default function ItineraryPage() {
  const t = useT();
  const [city, setCity] = useState("Paris");
  const steps = ITINERAIRES[city] ?? [];

  return (
    <>
      <PageHero
        eyebrow={t("fonctionnalité")}
        title={t("L'itinéraire du jour")}
        highlight={t("parcours photo sur mesure")}
        sub={t("Chaque matin, Take Me Pic compose pour toi un parcours photo personnalisé selon la ville, la météo et l'heure dorée — du lever au coucher du soleil.")}
        stamp={t("ITINÉ\n★\nRAIRE")}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">

        {/* ── Section 1 : sélecteur de ville + timeline ───── */}
        <section className="mb-24">
          <SectionHeading
            eyebrow={t("choisir sa ville")}
            title={t("Ton parcours photo")}
            highlight={t("en un coup d'œil")}
            center
            className="mb-6"
          />

          {/* City selector */}
          <div className="flex gap-2 flex-wrap justify-center mb-10">
            {CITIES.map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`px-4 py-1.5 rounded-[4px] border-[1.5px] font-[family-name:var(--font-serif)] text-[13px] font-semibold transition cursor-pointer ${
                  city === c
                    ? "bg-ink text-paper-warm border-ink"
                    : "bg-card border-ink text-ink hover:bg-paper-warm"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="max-w-2xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-[60px] top-0 bottom-0 w-px bg-ink/20" />

            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  {/* Time column */}
                  <div className="w-[52px] shrink-0 text-right">
                    <div className="font-[family-name:var(--font-type)] text-[11px] text-gold-deep font-bold leading-tight">
                      {step.time}
                    </div>
                  </div>

                  {/* Circle node */}
                  <div className="relative z-10 shrink-0 w-4 h-4 mt-0.5">
                    <div className={`w-4 h-4 rounded-full border-2 border-ink ${i === 0 ? "bg-gold-deep" : "bg-card"}`} />
                  </div>

                  {/* Content card */}
                  <PaperCard shadow="soft" className="flex-1 overflow-hidden" tilt={i % 2 === 0 ? 0.3 : -0.2}>
                    <div className="flex gap-3">
                      <div
                        className="w-20 h-20 shrink-0 bg-center bg-cover"
                        style={{ backgroundImage: `url(${step.img})` }}
                      />
                      <div className="p-3 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-[family-name:var(--font-serif)] font-bold text-[14px]">{step.spot}</div>
                          <Badge tone={CAT_TONE[step.cat]} className="text-[9px]">{step.cat}</Badge>
                        </div>
                        <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[12px] leading-snug">
                          {step.tip}
                        </p>
                      </div>
                    </div>
                  </PaperCard>
                </div>
              ))}

              {/* End marker */}
              <div className="flex gap-4 items-center">
                <div className="w-[52px]" />
                <div className="w-4 h-4 rounded-full bg-stamp-green border-2 border-ink shrink-0" />
                <div className="font-[family-name:var(--font-hand)] text-[15px] text-stamp-green">
                  {t("itinéraire terminé — bien joué ✿")}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2 : personnalisation ─────────────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <SectionHeading
              eyebrow={t("sur mesure")}
              title={t("Ton itinéraire,")}
              highlight={t("tes préférences")}
              sub={t("Choisis ta durée de marche, tes catégories préférées (portrait, architecture, paysage) et ton niveau de mobilité. L'appli fait le reste.")}
            />
            <ul className="mt-6 space-y-2">
              {[
                t("Durée : 2 h, demi-journée ou journée entière"),
                t("Filtre par catégorie de photo"),
                t("Mode économe en énergie (moins de spots)"),
                t("Synchronisation avec le calendrier"),
                t("Partage de l'itinéraire avec des amis"),
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 font-[family-name:var(--font-serif)] text-[14px]">
                  <CheckCircle2 size={16} className="text-stamp-green shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link href="/download">
                <span className="inline-flex h-[52px] items-center gap-2 px-6 rounded-[4px] bg-ink text-paper-warm font-[family-name:var(--font-serif)] font-semibold shadow-ink-sm hover:brightness-110 transition">
                  {t("Créer mon itinéraire")}
                </span>
              </Link>
            </div>
          </div>

          <div className="relative">
            <Tape color="red" rotate={-5} className="absolute -top-3 left-1/4 z-10" width={56} />
            <div className="relative flex gap-4 flex-wrap justify-center">
              <Polaroid
                src={spots[0].hero}
                caption={t("07H · Montmartre")}
                width={150}
                tilt={-4}
                captionSize={12}
              />
              <Polaroid
                src={spots[4].hero}
                caption={t("19H · Pont des Arts")}
                width={150}
                tilt={5}
                captionSize={12}
              />
              <Stamp color="gold" size={64} fontSize={9} rotate={-8} className="absolute bottom-0 left-0">
                {t("JOUR\n★\nPARFAIT")}
              </Stamp>
            </div>
          </div>
        </section>

        {/* ── Section 3 : intégration TMP ─────────────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative order-2 md:order-1">
            <PaperCard shadow="ink" className="p-5">
              <div className="font-[family-name:var(--font-hand)] text-xl text-gold-deep mb-4">
                {t("intégré à tout TMP")}
              </div>
              {[
                { icon: <MapPin size={16} />, t: t("Spots vérifiés"), d: t("Chaque stop de l'itinéraire est un spot validé par la communauté.") },
                { icon: <Camera size={16} />, t: t("Trouve un photographe"), d: t("Sur chaque spot, tu peux appeler un membre disponible.") },
                { icon: <Clock size={16} />, t: t("Timing automatique"), d: t("L'heure dorée est calculée chaque matin selon ta position.") },
              ].map((r, i) => (
                <div key={i} className="flex gap-3 items-start mb-4 last:mb-0">
                  <div className="w-8 h-8 rounded-full bg-gold-light/30 flex items-center justify-center text-gold-deep shrink-0">
                    {r.icon}
                  </div>
                  <div>
                    <div className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">{r.t}</div>
                    <div className="font-[family-name:var(--font-serif)] text-ink-faded text-[12px]">{r.d}</div>
                  </div>
                </div>
              ))}
            </PaperCard>
          </div>

          <div className="order-1 md:order-2">
            <SectionHeading
              eyebrow={t("tout connecté")}
              title={t("L'itinéraire qui")}
              highlight={t("appelle au secours")}
              sub={t("Sur chaque arrêt de ton parcours, un bouton te permet d'appeler un membre TMP disponible à proximité pour prendre ta photo. Tout est intégré — tu n'as rien à jongler.")}
            />
            <ul className="mt-6 space-y-2">
              {[
                t("Appel direct à un photographe depuis la fiche spot"),
                t("Karma automatiquement attribué après la session"),
                t("Photos ajoutées à ta galerie de voyage"),
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 font-[family-name:var(--font-serif)] text-[14px]">
                  <CheckCircle2 size={16} className="text-stamp-green shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Points forts ──────────────────────────────────── */}
        <section className="mb-24">
          <SectionHeading
            eyebrow={t("points forts")}
            title={t("Pourquoi l'itinéraire")}
            highlight={t("change ta journée")}
            center
            className="mb-10"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STRENGTHS.map((s, i) => (
              <PaperCard key={i} shadow="soft" tilt={i % 2 === 0 ? 0.3 : -0.3} className="p-5">
                <div className="w-9 h-9 rounded-full bg-gold-light/30 flex items-center justify-center text-gold-deep mb-3">
                  {s.icon}
                </div>
                <div className="font-[family-name:var(--font-serif)] font-bold text-[15px] mb-1 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-stamp-green shrink-0" />
                  {t(s.title)}
                </div>
                <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[13px] leading-relaxed">
                  {t(s.body)}
                </p>
              </PaperCard>
            ))}
          </div>
        </section>

      </div>
      <CtaBand />
    </>
  );
}
