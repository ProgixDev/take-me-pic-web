"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star,
  Trophy,
  Zap,
  Gift,
  TrendingUp,
  CheckCircle2,
  Award,
  Heart,
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
import { badges, leaderboard } from "@/lib/data";
import { useT } from "@/i18n/I18nProvider";

const RARITY_TONE: Record<string, "neutral" | "blue" | "gold"> = {
  commun: "neutral",
  rare: "blue",
  légendaire: "gold",
};

export default function KarmaPage() {
  const t = useT();
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const top3 = leaderboard.slice(0, 3);

  const STRENGTHS = [
    { icon: <Star size={18} />, title: t("Points à chaque aide"), body: t("Chaque photo prise pour quelqu'un rapporte du karma. Plus la note est haute, plus tu en gagnes.") },
    { icon: <Zap size={18} />, title: t("Multiplicateur Premium"), body: t("Les membres Première Classe gagnent 2× plus de karma par session.") },
    { icon: <Trophy size={18} />, title: t("Classement mondial"), body: t("Monte dans le tableau d'honneur de ta ville et du monde entier.") },
    { icon: <Gift size={18} />, title: t("Récompenses débloquées"), body: t("Du karma élevé débloque des spots secrets, des badges rares et des avantages communautaires.") },
    { icon: <TrendingUp size={18} />, title: t("Historique de progression"), body: t("Visualise ta courbe de karma et tes sessions mois par mois.") },
    { icon: <Heart size={18} />, title: t("Économie de l'entraide"), body: t("Le karma n'est pas de l'argent — c'est de la gratitude mesurée. Une valeur authentique.") },
  ];

  const KARMA_ACTIONS = [
    { action: t("Photo prise (note 5★)"), points: "+20 pts" },
    { action: t("Photo prise (note 4★)"), points: "+14 pts" },
    { action: t("Spot validé par la communauté"), points: "+50 pts" },
    { action: t("Premier avis sur un spot"), points: "+10 pts" },
    { action: t("Parrainage d'un ami"), points: "+30 pts" },
    { action: t("Session annulée (sans préavis)"), points: "−15 pts" },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("fonctionnalité")}
        title={t("Le karma")}
        highlight={t("l'économie de l'entraide")}
        sub={t("Aide quelqu'un à avoir une belle photo, gagne des points, monte dans le classement. Le karma, c'est la monnaie de la bienveillance dans Take Me Pic.")}
        stamp={"KARMA\n★\nPOINTS"}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">

        {/* ── Section 1 : comment gagner du karma ─────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <SectionHeading
              eyebrow={t("le barème")}
              title={t("Chaque action")}
              highlight={t("a sa valeur")}
              sub={t("Le karma se gagne en aidant et en contribuant à la communauté. Il reflète ton investissement dans l'entraide.")}
            />

            <PaperCard shadow="ink" className="mt-6 overflow-hidden">
              <div className="p-4 border-b-[1.5px] border-ink bg-paper-warm">
                <div className="font-[family-name:var(--font-hand)] text-lg text-gold-deep">
                  {t("barème des points")}
                </div>
              </div>
              <div className="divide-y divide-ink/10">
                {KARMA_ACTIONS.map((a) => (
                  <div key={a.action} className="flex items-center justify-between px-4 py-3">
                    <span className="font-[family-name:var(--font-serif)] text-[13px]">{a.action}</span>
                    <span
                      className={`font-[family-name:var(--font-type)] text-[12px] font-bold ${
                        a.points.startsWith("+") ? "text-stamp-green" : "text-stamp-red"
                      }`}
                    >
                      {a.points}
                    </span>
                  </div>
                ))}
              </div>
            </PaperCard>
          </div>

          <div className="relative">
            <Tape color="cream" rotate={-4} className="absolute -top-3 left-1/3 z-10" />
            {/* Karma counter card */}
            <PaperCard shadow="gold" className="p-6 text-center mb-4">
              <div className="font-[family-name:var(--font-hand)] text-xl text-gold-deep mb-1">
                {t("ton karma actuel")}
              </div>
              <div className="font-[family-name:var(--font-serif)] font-bold text-[64px] tracking-[-0.04em] text-gold-deep leading-none">
                1 847
              </div>
              <div className="font-[family-name:var(--font-serif)] text-ink-faded text-[13px] mt-1">
                Top 12 % · Paris
              </div>
              <div className="mt-4 h-2 bg-paper-warm rounded-full overflow-hidden border border-ink/20">
                <div className="h-full bg-gradient-to-r from-gold-light to-gold-deep rounded-full" style={{ width: "56%" }} />
              </div>
              <div className="flex justify-between font-[family-name:var(--font-type)] text-[10px] text-ink-faded mt-1">
                <span>0</span>
                <span>{t("prochain badge : 2 000 pts")}</span>
                <span>★</span>
              </div>
            </PaperCard>

            <div className="flex gap-3 flex-wrap justify-center">
              <Polaroid
                src={`https://i.pravatar.cc/300?img=47`}
                caption="Claire · 3 240 pts"
                width={120}
                tilt={-3}
                captionSize={12}
              />
              <Polaroid
                src={`https://i.pravatar.cc/300?img=12`}
                caption="Léo · 2 980 pts"
                width={120}
                tilt={4}
                captionSize={12}
              />
            </div>
          </div>
        </section>

        {/* ── Section 2 : badges ──────────────────────────── */}
        <section className="mb-24">
          <SectionHeading
            eyebrow={t("récompenses")}
            title={t("Des badges pour")}
            highlight={t("chaque exploit")}
            center
            className="mb-3"
          />
          <p className="text-center font-[family-name:var(--font-serif)] text-ink-faded text-[14px] mb-8 max-w-xl mx-auto">
            {t("Clique sur un badge pour voir comment le débloquer.")}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {badges.map((b) => (
              <PaperCard
                key={b.id}
                shadow={selectedBadge === b.id ? "gold" : "soft"}
                tilt={0}
                className="p-4 text-center cursor-pointer transition-all hover:-translate-y-1"
                onClick={() => setSelectedBadge(selectedBadge === b.id ? null : b.id)}
              >
                <div className="text-3xl mb-2">{b.emoji}</div>
                <div className="font-[family-name:var(--font-serif)] font-bold text-[12px] mb-1">{b.name}</div>
                <Badge tone={RARITY_TONE[b.rarity]}>{b.rarity}</Badge>
              </PaperCard>
            ))}
          </div>

          {selectedBadge && (() => {
            const b = badges.find((x) => x.id === selectedBadge)!;
            return (
              <PaperCard shadow="gold" className="mt-6 p-5 max-w-lg mx-auto text-center animate-fade-up">
                <div className="text-4xl mb-2">{b.emoji}</div>
                <div className="font-[family-name:var(--font-serif)] font-bold text-[17px] mb-1">{b.name}</div>
                <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[14px] mb-2">{b.description}</p>
                <div className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded uppercase tracking-wider">
                  {t("{{count}} membres le possèdent", { count: b.holders.toLocaleString("fr-FR") })}
                </div>
              </PaperCard>
            );
          })()}
        </section>

        {/* ── Section 3 : tableau d'honneur ───────────────── */}
        <section className="mb-24">
          <SectionHeading
            eyebrow={t("tableau d'honneur")}
            title={t("Les meilleurs")}
            highlight={t("de la communauté")}
            center
            className="mb-10"
          />

          <div className="flex flex-wrap justify-center gap-6 items-end">
            {top3.map((entry, i) => {
              const heights = ["h-40", "h-52", "h-40"];
              const positions = [1, 0, 2];
              const sorted = [top3[1], top3[0], top3[2]];
              const e = sorted[i];
              const rank = e.rank;
              return (
                <div key={e.user.id} className="flex flex-col items-center gap-3">
                  <Polaroid
                    src={e.user.avatar}
                    caption={e.user.firstName}
                    width={rank === 1 ? 150 : 120}
                    tilt={rank === 1 ? 0 : rank === 2 ? -4 : 4}
                    captionSize={rank === 1 ? 15 : 13}
                  />
                  <div className={`w-20 ${rank === 1 ? "bg-gold-deep" : "bg-ink/60"} rounded-t-[4px] flex items-end justify-center pb-2 ${rank === 1 ? "h-24" : "h-16"}`}>
                    <span className="font-[family-name:var(--font-serif)] font-bold text-paper-warm text-lg">#{rank}</span>
                  </div>
                  <div className="text-center">
                    <div className="font-[family-name:var(--font-serif)] font-bold text-[13px]">
                      {e.user.firstName} {e.user.lastName}
                    </div>
                    <div className="font-[family-name:var(--font-type)] text-[11px] text-gold-deep">
                      {e.score.toLocaleString("fr-FR")} pts
                    </div>
                    <div className="font-[family-name:var(--font-serif)] text-ink-faded text-[11px]">{e.user.city}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link href="/download">
              <span className="inline-flex h-[52px] items-center gap-2 px-6 rounded-[4px] bg-ink text-paper-warm font-[family-name:var(--font-serif)] font-semibold shadow-ink-sm hover:brightness-110 transition">
                <Trophy size={18} /> {t("Voir le classement complet")}
              </span>
            </Link>
          </div>
        </section>

        {/* ── Points forts ──────────────────────────────────── */}
        <section className="mb-24">
          <SectionHeading
            eyebrow={t("points forts")}
            title={t("Pourquoi le karma")}
            highlight={t("change tout")}
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

        {/* ── Stats ─────────────────────────────────────────── */}
        <section className="mb-16">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { v: "2,8 M", l: t("points de karma distribués") },
              { v: "6", l: t("badges disponibles") },
              { v: "48 k", l: t("membres dans le classement") },
            ].map((s) => (
              <PaperCard key={s.l} shadow="gold" className="py-8 px-4">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[clamp(22px,4vw,40px)] tracking-[-0.02em] text-gold-deep">
                  {s.v}
                </div>
                <div className="font-[family-name:var(--font-serif)] text-ink-faded text-[13px] mt-1">
                  {s.l}
                </div>
              </PaperCard>
            ))}
          </div>
        </section>

      </div>
      <CtaBand />
    </>
  );
}
