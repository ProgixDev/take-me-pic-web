"use client";

import Link from "next/link";
import {
  Camera,
  Users,
  Heart,
  MapPin,
  TrendingUp,
  Star,
  ArrowRight,
} from "lucide-react";
import {
  PaperCard,
  Stamp,
  Polaroid,
  Tape,
  SectionHeading,
  StatCard,
} from "@/components/ui";
import {
  PageHero,
  CtaBand,
} from "@/components/marketing/MarketingBits";
import { analytics, team, fmtNum } from "@/lib/data";
import { useT } from "@/i18n/I18nProvider";

const { kpis } = analytics;

export default function AboutPage() {
  const t = useT();
  const firstSix = team.slice(0, 6);

  const STATS = [
    {
      label: t("Voyageurs dans la communauté"),
      value: fmtNum(kpis.users),
      delta: kpis.usersDelta,
      icon: <Users size={20} />,
      tone: "ink" as const,
    },
    {
      label: t("Photos prises entre voyageurs"),
      value: fmtNum(kpis.photos),
      delta: kpis.photosDelta,
      icon: <Camera size={20} />,
      tone: "gold" as const,
    },
    {
      label: t("Sessions d'entraide"),
      value: fmtNum(kpis.sessions),
      delta: kpis.sessionsDelta,
      icon: <Heart size={20} />,
      tone: "green" as const,
    },
    {
      label: t("Points karma distribués"),
      value: fmtNum(kpis.karma),
      delta: kpis.karmaDelta,
      icon: <Star size={20} />,
      tone: "blue" as const,
    },
  ];

  const VALUES_TEASER = [
    { emoji: "🤝", label: t("Humain d'abord") },
    { emoji: "🛡️", label: t("Confiance") },
    { emoji: "✨", label: t("Beauté du quotidien") },
    { emoji: "🌍", label: t("Communauté") },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("notre histoire")}
        title={t("Nous faisons de chaque voyage")}
        highlight={t("un album de souvenirs.")}
        sub={t("Take Me Pic est né d'une conviction simple : tout le monde mérite de belles photos de soi en voyage, sans payer un photographe, sans tendre le bras.")}
        stamp={`À PROPOS\n★\nTMP`}
      />

      {/* ── Mission narrative ── */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <SectionHeading
              eyebrow={t("notre mission")}
              title={t("L'entraide comme")}
              highlight={t("super-pouvoir.")}
              sub={t("Nous croyons qu'un voyageur peut en aider un autre, partout dans le monde, avec juste un téléphone et de la bienveillance. Pas besoin d'être photographe. Juste d'être là.")}
            />
            <div className="mt-8 space-y-5">
              <p className="font-[family-name:var(--font-serif)] text-ink-faded leading-relaxed">
                {t("Le selfie-bras tendu a vécu. Le selfie-stick est ridicule. Demander à un inconnu reste gênant — et le résultat souvent flou. Alors on a construit une communauté où la photo devient un échange de sourires.")}
              </p>
              <p className="font-[family-name:var(--font-serif)] text-ink-faded leading-relaxed">
                {t("Claire et Léo ont fondé Take Me Pic à Paris en 2025, après avoir raté trop de photos à Lisbonne. Depuis, des milliers de voyageurs se retrouvent, se prennent en photo, et repartent avec un vrai souvenir.")}
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/about/story"
                className="inline-flex items-center gap-2 font-[family-name:var(--font-serif)] font-semibold text-gold-deep hover:underline transition"
              >
                {t("Lire notre histoire")} <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Polaroid cluster */}
          <div className="relative h-[380px] hidden md:block">
            <div className="absolute top-0 left-12">
              <Polaroid
                src="https://picsum.photos/seed/about1/400/400"
                caption={t("Paris, 2025")}
                width={180}
                tilt={-4}
              />
            </div>
            <div className="absolute top-16 right-8">
              <Polaroid
                src="https://picsum.photos/seed/about2/400/400"
                caption={t("Lisbonne ✿")}
                width={160}
                tilt={5}
              />
            </div>
            <div className="absolute bottom-0 left-28">
              <Polaroid
                src="https://picsum.photos/seed/about3/400/400"
                caption={t("Marrakech ☼")}
                width={170}
                tilt={2}
              />
            </div>
            <div className="absolute top-8 left-56 z-10">
              <Stamp color="red" size={88} fontSize={9} rotate={12}>
                {`DEPUIS\n2025\n★ TMP`}
              </Stamp>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats band ── */}
      <section className="bg-paper-warm border-y-[1.5px] border-[var(--ink-line)] py-14">
        <div className="mx-auto max-w-7xl px-5">
          <div className="text-center mb-10">
            <div className="font-[family-name:var(--font-hand)] text-2xl text-gold-deep -rotate-1 mb-1">
              {t("en chiffres")}
            </div>
            <h2 className="font-[family-name:var(--font-serif)] font-bold text-4xl tracking-tight">
              {t("La communauté en mouvement")}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {STATS.map((s) => (
              <StatCard
                key={s.label}
                label={s.label}
                value={s.value}
                delta={s.delta}
                icon={s.icon}
                tone={s.tone}
              />
            ))}
          </div>
          {/* City bar */}
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            {analytics.byCity.map((c) => (
              <div
                key={c.city}
                className="flex items-center gap-2 bg-card border-[1.5px] border-ink rounded-[4px] px-3 py-1.5 shadow-ink-sm"
              >
                <MapPin size={13} className="text-gold-deep" />
                <span className="font-[family-name:var(--font-serif)] text-[13px] font-semibold">
                  {c.city}
                </span>
                <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
                  {fmtNum(c.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values teaser ── */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-col md:flex-row md:items-end gap-8 mb-10">
          <SectionHeading
            eyebrow={t("nos valeurs")}
            title={t("Ce qui nous guide")}
            highlight={t("au quotidien.")}
            sub={t("Quatre convictions fondatrices qui orientent chacune de nos décisions produit.")}
          />
          <Link
            href="/about/values"
            className="shrink-0 inline-flex items-center gap-2 font-[family-name:var(--font-serif)] font-semibold text-gold-deep hover:underline"
          >
            {t("Voir toutes nos valeurs")} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {VALUES_TEASER.map((v, i) => (
            <PaperCard
              key={v.label}
              shadow="soft"
              tilt={i % 2 === 0 ? -1 : 1}
              className="p-6 text-center hover:shadow-ink transition-all"
            >
              <div className="text-4xl mb-3">{v.emoji}</div>
              <div className="font-[family-name:var(--font-serif)] font-bold text-base">
                {v.label}
              </div>
            </PaperCard>
          ))}
        </div>
      </section>

      {/* ── Team teaser ── */}
      <section className="bg-paper-warm border-y-[1.5px] border-[var(--ink-line)] py-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-col md:flex-row md:items-end gap-8 mb-12">
            <SectionHeading
              eyebrow={t("l'équipe")}
              title={t("Ceux qui font")}
              highlight={t("l'appli.")}
              sub={t("Une équipe parisienne, passionnée de voyage, obsédée par l'expérience utilisateur.")}
            />
            <Link
              href="/about/team"
              className="shrink-0 inline-flex items-center gap-2 font-[family-name:var(--font-serif)] font-semibold text-gold-deep hover:underline"
            >
              {t("Rencontrer toute l'équipe")} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 justify-items-center">
            {firstSix.map((member, i) => {
              const tilts = [-3, 2, -2, 3, -1, 2];
              return (
                <div key={member.name} className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <Polaroid
                      src={member.avatar}
                      caption={member.name.split(" ")[0]}
                      width={130}
                      tilt={tilts[i]}
                      captionSize={14}
                    />
                    {i === 0 && (
                      <div className="absolute -top-2 -right-2">
                        <Tape color="cream" width={40} height={16} rotate={-30} />
                      </div>
                    )}
                  </div>
                  <div className="text-center mt-1">
                    <div className="font-[family-name:var(--font-serif)] font-bold text-[13px]">
                      {member.name}
                    </div>
                    <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-wider text-ink-faded mt-0.5">
                      {member.role}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link href="/careers">
              <span className="inline-flex items-center gap-2 font-[family-name:var(--font-serif)] font-semibold border-[1.5px] border-dashed border-ink rounded-[4px] px-5 py-3 hover:bg-card transition">
                <TrendingUp size={16} /> {t("On recrute ! Rejoins l'aventure")}
              </span>
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
