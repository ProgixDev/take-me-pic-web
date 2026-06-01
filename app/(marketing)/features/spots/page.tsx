"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Map,
  Clock,
  Star,
  CheckCircle2,
  Compass,
  Camera,
  Sun,
  Eye,
  Plus,
} from "lucide-react";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import {
  PaperCard,
  Stamp,
  Tape,
  Polaroid,
  Badge,
  SectionHeading,
  Avatar,
} from "@/components/ui";
import { spots, users } from "@/lib/data";
import { useT } from "@/i18n/I18nProvider";

const STRENGTHS_DATA = [
  { icon: <Compass size={18} />, titleKey: "Angles conseillés", bodyKey: "Chaque spot liste les 2 ou 3 meilleurs angles pour un résultat immédiat, même sans expérience." },
  { icon: <Clock size={18} />, titleKey: "Meilleur moment", bodyKey: "Lever, coucher, midi bleu — la communauté indique quand la lumière est au rendez-vous." },
  { icon: <Star size={18} />, titleKey: "Notes & avis", bodyKey: "Des centaines d'avis vérifiés pour choisir le bon spot avant de se déplacer." },
  { icon: <Camera size={18} />, titleKey: "Photos de référence", bodyKey: "Vois à quoi ressemble le spot en conditions réelles, pas une image promotionnelle." },
  { icon: <Sun size={18} />, titleKey: "Spots secrets Premium", bodyKey: "Les membres Première Classe accèdent à des spots hors-guide, soumis par la communauté." },
  { icon: <Eye size={18} />, titleKey: "Ajout communautaire", bodyKey: "N'importe quel membre vérifié peut soumettre un nouveau spot et gagner du karma." },
];

const CATEGORIES_DATA = [
  { key: "tous", labelKey: "Tous" },
  { key: "coucher", labelKey: "Coucher de soleil" },
  { key: "lever", labelKey: "Lever du soleil" },
  { key: "portrait", labelKey: "Portrait" },
  { key: "archi", labelKey: "Architecture" },
];

const CAT_COLORS: Record<string, "gold" | "red" | "blue" | "green"> = {
  coucher: "gold",
  lever: "red",
  portrait: "blue",
  archi: "green",
};

export default function SpotsPage() {
  const t = useT();
  const [cat, setCat] = useState("tous");

  const STRENGTHS = STRENGTHS_DATA.map((s) => ({ ...s, title: t(s.titleKey as Parameters<typeof t>[0]), body: t(s.bodyKey as Parameters<typeof t>[0]) }));
  const CATEGORIES = CATEGORIES_DATA.map((c) => ({ ...c, label: t(c.labelKey as Parameters<typeof t>[0]) }));

  const filtered = cat === "tous" ? spots.slice(0, 8) : spots.filter((s) => s.category === cat).slice(0, 8);

  return (
    <>
      <PageHero
        eyebrow={t("fonctionnalité")}
        title={t("La carte au trésor")}
        highlight={t("des spots photo")}
        sub={t("Des centaines de spots sélectionnés par la communauté : les meilleurs angles, les bons moments, les conseils de cadrage — tout ce dont tu as besoin avant d'arriver.")}
        stamp={t("CARTE\n★\nTRÉSOR")}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">

        {/* ── Section 1 : grille de spots ─────────────────── */}
        <section className="mb-24">
          <SectionHeading
            eyebrow={t("explorer")}
            title={t("Des spots pour chaque")}
            highlight={t("lumière")}
            center
            className="mb-6"
          />

          {/* Category filter */}
          <div className="flex gap-2 flex-wrap justify-center mb-8">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setCat(c.key)}
                className={`px-4 py-1.5 rounded-[4px] border-[1.5px] font-[family-name:var(--font-serif)] text-[13px] font-semibold transition cursor-pointer ${
                  cat === c.key
                    ? "bg-ink text-paper-warm border-ink"
                    : "bg-card border-ink text-ink hover:bg-paper-warm"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((spot, i) => (
              <PaperCard key={spot.id} shadow="soft" tilt={i % 2 === 0 ? 0.3 : -0.3} className="overflow-hidden">
                <div
                  className="h-36 bg-center bg-cover relative"
                  style={{ backgroundImage: `url(${spot.hero})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                  <Badge
                    tone={
                      spot.category === "coucher" ? "gold"
                      : spot.category === "lever" ? "sunset"
                      : spot.category === "portrait" ? "blue"
                      : "neutral"
                    }
                    className="absolute top-2 left-2 text-[10px]"
                  >
                    {spot.category}
                  </Badge>
                  {spot.status === "approved" && (
                    <div className="absolute top-2 right-2">
                      <Stamp color={CAT_COLORS[spot.category] ?? "gold"} size={30} fontSize={7} rotate={8}>
                        ★
                      </Stamp>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="font-[family-name:var(--font-serif)] font-bold text-[13px] mb-0.5">
                    {spot.name}
                  </div>
                  <div className="flex items-center gap-2 text-ink-faded text-[11px] font-[family-name:var(--font-serif)] mb-2">
                    <span>{spot.country} {spot.city}</span>
                    <span>·</span>
                    <Clock size={10} />
                    <span>{spot.bestTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={11} className="text-gold-deep fill-gold-deep" />
                    <span className="font-[family-name:var(--font-serif)] font-semibold text-[12px]">{spot.rating.toFixed(1)}</span>
                    <span className="font-[family-name:var(--font-serif)] text-ink-faded text-[11px]">
                      ({spot.reviews} avis)
                    </span>
                  </div>
                </div>
              </PaperCard>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/download">
              <span className="inline-flex h-[52px] items-center gap-2 px-6 rounded-[4px] bg-ink text-paper-warm font-[family-name:var(--font-serif)] font-semibold shadow-ink-sm hover:brightness-110 transition">
                <Map size={18} /> {t("Explorer tous les spots")}
              </span>
            </Link>
          </div>
        </section>

        {/* ── Section 2 : spot detail ──────────────────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <SectionHeading
              eyebrow={t("la fiche spot")}
              title={t("Tout savoir avant")}
              highlight={t("d'arriver")}
              sub={t("Chaque fiche spot détaille : angles recommandés, heure idéale, météo type, niveau de difficulté et retours de la communauté.")}
            />
            <ul className="mt-6 space-y-2">
              {([
                "Plan d'accès avec transport en commun",
                "Conseils de cadrage pas à pas",
                "Photos de référence de la communauté",
                "Foule estimée selon l'horaire",
                "Spots similaires à proximité",
              ] as const).map((item) => (
                <li key={item} className="flex items-center gap-2 font-[family-name:var(--font-serif)] text-[14px]">
                  <CheckCircle2 size={16} className="text-stamp-green shrink-0" />
                  {t(item)}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <Tape color="blue" rotate={3} className="absolute -top-3 left-1/4 z-10" />
            <PaperCard shadow="ink" className="overflow-hidden">
              <div
                className="h-48 bg-center bg-cover"
                style={{ backgroundImage: `url(${spots[3].hero})` }}
              />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-[family-name:var(--font-serif)] font-bold text-[16px]">{spots[3].name}</div>
                    <div className="font-[family-name:var(--font-serif)] text-ink-faded text-[12px]">
                      {spots[3].country} {spots[3].city}
                    </div>
                  </div>
                  <Stamp color="gold" size={44} fontSize={8} rotate={-5}>{`★\n${spots[3].rating.toFixed(1)}`}</Stamp>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: t("Meilleur moment"), val: spots[3].bestTime },
                    { label: t("Catégorie"), val: spots[3].category },
                    { label: t("Avis"), val: `${spots[3].reviews}` },
                    { label: t("Visites"), val: `${spots[3].visits}` },
                  ].map((r) => (
                    <div key={r.label} className="bg-paper-warm rounded-[2px] p-2">
                      <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-wider text-ink-faded">
                        {r.label}
                      </div>
                      <div className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">{r.val}</div>
                    </div>
                  ))}
                </div>
                <div className="font-[family-name:var(--font-hand)] text-[13px] text-gold-deep">
                  {t("\"Le meilleur angle est sur la terrasse du café de gauche, face est.\"")}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Avatar src={spots[3].addedBy.avatar} size={24} />
                  <span className="font-[family-name:var(--font-serif)] text-ink-faded text-[11px]">
                    {t("ajouté par")} {spots[3].addedBy.firstName}
                  </span>
                </div>
              </div>
            </PaperCard>
          </div>
        </section>

        {/* ── Section 3 : soumettre un spot ───────────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative">
            <PaperCard shadow="gold" className="p-6">
              <div className="font-[family-name:var(--font-hand)] text-2xl text-gold-deep mb-4">
                {t("soumettre un spot")}
              </div>
              <div className="space-y-3">
                {[
                  { n: "01", title: t("Prends une photo du lieu"), desc: t("Montre le spot, l'angle idéal, la lumière.") },
                  { n: "02", title: t("Ajoute les détails"), desc: t("Nom, catégorie, heure idéale, conseil de cadrage.") },
                  { n: "03", title: t("Soumets à la validation"), desc: t("Notre équipe et la communauté examinent en 48 h.") },
                  { n: "04", title: t("Gagne du karma"), desc: t("+50 points de karma dès que le spot est approuvé !") },
                ].map((step) => (
                  <div key={step.n} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-ink text-paper-warm flex items-center justify-center font-[family-name:var(--font-type)] text-[11px] shrink-0 mt-0.5">
                      {step.n}
                    </div>
                    <div>
                      <div className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">{step.title}</div>
                      <div className="font-[family-name:var(--font-serif)] text-ink-faded text-[13px]">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Polaroid
                  src={spots[0].hero}
                  caption={t("mon spot ✿")}
                  width={100}
                  tilt={-3}
                  captionSize={11}
                />
                <Polaroid
                  src={spots[2].hero}
                  caption={t("vue magique")}
                  width={100}
                  tilt={4}
                  captionSize={11}
                />
              </div>
            </PaperCard>
          </div>

          <div>
            <SectionHeading
              eyebrow={t("la communauté construit la carte")}
              title={t("Partage tes spots")}
              highlight={t("cachés")}
              sub={t("Chaque membre peut soumettre un lieu secret. Les meilleurs spots sont vérifiés, puis partagés à toute la communauté. Tu gagnes du karma à chaque validation.")}
            />
            <div className="mt-6 flex items-center gap-3">
              <Link href="/download">
                <span className="inline-flex h-[52px] items-center gap-2 px-6 rounded-[4px] bg-gold-deep text-paper-warm font-[family-name:var(--font-serif)] font-semibold shadow-gold hover:brightness-105 transition">
                  <Plus size={18} /> {t("Soumettre un spot")}
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Points forts ──────────────────────────────────── */}
        <section className="mb-24">
          <SectionHeading
            eyebrow={t("points forts")}
            title={t("Ce qui rend la carte au trésor")}
            highlight={t("indispensable")}
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
                  {s.title}
                </div>
                <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[13px] leading-relaxed">
                  {s.body}
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
