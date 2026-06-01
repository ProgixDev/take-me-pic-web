"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star,
  Zap,
  Map,
  Eye,
  Gift,
  Crown,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import {
  PaperCard,
  Stamp,
  Tape,
  Polaroid,
  Ticket,
  Badge,
  SectionHeading,
} from "@/components/ui";
import { plans } from "@/lib/data";
import { useT } from "@/i18n/I18nProvider";

const STRENGTHS = [
  { icon: <Star size={18} />, title: "Profil mis en avant", body: "Tu apparais 3× plus souvent dans les suggestions — plus de matchs, moins d'attente." },
  { icon: <Map size={18} />, title: "Spots secrets", body: "Accès aux spots hors-guide soumis par la communauté et réservés aux membres Premium." },
  { icon: <Zap size={18} />, title: "Karma x2", body: "Chaque session te rapporte deux fois plus de karma qu'un membre Carnet." },
  { icon: <Eye size={18} />, title: "Aucune publicité", body: "L'expérience est entièrement propre — pas de bannières, pas d'interruptions." },
  { icon: <Gift size={18} />, title: "Galerie illimitée", body: "Stocke autant de sessions que tu veux, sans délai d'expiration." },
  { icon: <Crown size={18} />, title: "Support prioritaire", body: "Ta demande passe devant la file — réponse garantie en moins de 2 heures." },
];

const PERKS = [
  { emoji: "🎯", title: "3× plus de matchs", sub: "Profil boosté en permanence" },
  { emoji: "🗺️", title: "Spots exclusifs", sub: "Lieux hors-guide vérifiés" },
  { emoji: "⚡", title: "Karma doublé", sub: "Montez plus vite dans le classement" },
  { emoji: "🎫", title: "Badge Première classe", sub: "Visible sur ton profil public" },
  { emoji: "📷", title: "Galerie illimitée", sub: "Aucune expiration de session" },
  { emoji: "🛎️", title: "Support VIP", sub: "Réponse en moins de 2 heures" },
];

export default function PremiumPage() {
  const t = useT();
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");
  const monthly = plans.find((p) => p.id === "monthly")!;
  const annual = plans.find((p) => p.id === "annual")!;
  const current = billing === "monthly" ? monthly : annual;

  return (
    <>
      <PageHero
        eyebrow={t("fonctionnalité")}
        title={t("Première classe")}
        highlight={t("l'expérience sans compromis")}
        sub={t("Pour les voyageurs qui veulent le meilleur : profil boosté, spots exclusifs, karma doublé et galerie illimitée. Sans publicités. Sans attente.")}
        stamp={"1ère\n★\nCLASSE"}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">

        {/* ── Boarding pass ticket ──────────────────────────── */}
        <section className="mb-24">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <SectionHeading
                eyebrow={t("votre billet")}
                title={t("Le billet")}
                highlight={t("Première Classe")}
                sub={t("Présentation de votre billet d'embarquement pour une expérience photo sans frontières.")}
                center
              />
            </div>

            {/* Billing toggle */}
            <div className="flex gap-2 justify-center mb-8">
              {(["monthly", "annual"] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  className={`px-5 py-2 rounded-[4px] border-[1.5px] font-[family-name:var(--font-serif)] text-[13px] font-semibold transition cursor-pointer ${
                    billing === b ? "bg-ink text-paper-warm border-ink" : "bg-card border-ink text-ink hover:bg-paper-warm"
                  }`}
                >
                  {b === "monthly" ? t("Mensuel") : t("Annuel")}
                  {b === "annual" && (
                    <span className="ml-2 text-[10px] font-[family-name:var(--font-type)] uppercase text-gold-deep">
                      −33 %
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Gold boarding-pass Ticket */}
            <div className="relative">
              <Tape color="cream" rotate={-2} className="absolute -top-3 left-8 z-10" width={70} />
              <Ticket
                dark
                notch="var(--color-paper-warm)"
                className="border-[1.5px] border-gold-deep/40"
              >
                <div className="px-8 py-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-gold-light mb-1">
                        Take Me Pic · Boarding Pass
                      </div>
                      <div className="font-[family-name:var(--font-serif)] font-bold text-[26px] text-gold-light tracking-[-0.02em]">
                        {t("Première Classe")}
                      </div>
                    </div>
                    <div className="text-right">
                      <Stamp color="gold" size={64} fontSize={9} rotate={5}>{`★\nVIP\n★`}</Stamp>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="flex items-center gap-3 mb-5">
                    <div>
                      <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-wider text-paper-warm/50 mb-0.5">{t("De")}</div>
                      <div className="font-[family-name:var(--font-serif)] font-bold text-[18px] text-paper-warm">CARNET</div>
                    </div>
                    <ArrowRight size={20} className="text-gold-deep shrink-0" />
                    <div>
                      <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-wider text-paper-warm/50 mb-0.5">{t("À")}</div>
                      <div className="font-[family-name:var(--font-serif)] font-bold text-[18px] text-paper-warm">1ère CLASSE</div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-dashed border-gold-deep/30 my-4" />

                  {/* Details grid */}
                  <div className="grid grid-cols-3 gap-4 mb-5">
                    <div>
                      <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-wider text-paper-warm/50 mb-1">{t("Tarif")}</div>
                      <div className="font-[family-name:var(--font-serif)] font-bold text-[20px] text-gold-light">{current.price}</div>
                      <div className="font-[family-name:var(--font-serif)] text-paper-warm/60 text-[11px]">{current.period}</div>
                    </div>
                    <div>
                      <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-wider text-paper-warm/50 mb-1">{t("Validité")}</div>
                      <div className="font-[family-name:var(--font-serif)] font-bold text-paper-warm text-[14px]">
                        {billing === "annual" ? t("12 mois") : t("1 mois")}
                      </div>
                      <div className="font-[family-name:var(--font-serif)] text-paper-warm/60 text-[11px]">{t("renouvellement auto")}</div>
                    </div>
                    <div>
                      <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-wider text-paper-warm/50 mb-1">{t("Essai")}</div>
                      <div className="font-[family-name:var(--font-serif)] font-bold text-paper-warm text-[14px]">{t("7 jours")}</div>
                      <div className="font-[family-name:var(--font-serif)] text-paper-warm/60 text-[11px]">{t("gratuit & sans engagement")}</div>
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="border-t border-dashed border-gold-deep/30 pt-4 mb-5">
                    <div className="grid grid-cols-2 gap-2">
                      {current.features.map((f) => (
                        <div key={f} className="flex items-start gap-1.5">
                          <CheckCircle2 size={13} className="text-gold-deep shrink-0 mt-0.5" />
                          <span className="font-[family-name:var(--font-serif)] text-paper-warm/80 text-[12px]">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <Link href="/pricing">
                    <span className="flex items-center justify-center h-[52px] rounded-[4px] bg-gradient-to-b from-gold-light to-gold-deep text-ink font-[family-name:var(--font-serif)] font-bold shadow-gold hover:brightness-105 transition gap-2">
                      <Sparkles size={18} /> {current.cta}
                    </span>
                  </Link>
                </div>
              </Ticket>
            </div>
          </div>
        </section>

        {/* ── Perks grid ──────────────────────────────────── */}
        <section className="mb-24">
          <SectionHeading
            eyebrow={t("les avantages")}
            title={t("Ce qui est inclus")}
            highlight={t("dans Première Classe")}
            center
            className="mb-10"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERKS.map((p, i) => (
              <PaperCard key={i} shadow={i === 0 ? "gold" : "soft"} tilt={i % 2 === 0 ? 0.3 : -0.3} className="p-5">
                <div className="text-3xl mb-3">{p.emoji}</div>
                <div className="font-[family-name:var(--font-serif)] font-bold text-[15px] mb-1">{t(p.title)}</div>
                <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[13px]">{t(p.sub)}</p>
              </PaperCard>
            ))}
          </div>
        </section>

        {/* ── Comparison free vs premium ─────────────────── */}
        <section className="mb-24">
          <SectionHeading
            eyebrow={t("comparaison")}
            title={t("Carnet vs")}
            highlight={t("Première Classe")}
            center
            className="mb-10"
          />

          <div className="max-w-2xl mx-auto">
            <PaperCard shadow="ink" className="overflow-hidden">
              <div className="grid grid-cols-3 bg-paper-warm border-b-[1.5px] border-ink">
                <div className="p-3 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-wider text-ink-faded">{t("Fonctionnalité")}</div>
                <div className="p-3 text-center font-[family-name:var(--font-serif)] font-bold text-[13px] border-l border-ink">{t("Carnet")}</div>
                <div className="p-3 text-center font-[family-name:var(--font-serif)] font-bold text-[13px] border-l border-ink text-gold-deep">
                  {t("1ère Classe ★")}
                </div>
              </div>
              {[
                { f: "Trouver quelqu'un à proximité", free: true, premium: true },
                { f: "Gagner du karma", free: true, premium: true },
                { f: "Accès communauté", free: true, premium: true },
                { f: "Galerie 24 h", free: true, premium: false },
                { f: "Galerie illimitée", free: false, premium: true },
                { f: "Profil boosté x3", free: false, premium: true },
                { f: "Spots secrets", free: false, premium: true },
                { f: "Karma doublé", free: false, premium: true },
                { f: "Sans publicités", free: false, premium: true },
                { f: "Support prioritaire", free: false, premium: true },
              ].map((row, i) => (
                <div key={i} className={`grid grid-cols-3 border-b border-ink/10 last:border-0 ${i % 2 === 0 ? "" : "bg-paper-warm/40"}`}>
                  <div className="p-3 font-[family-name:var(--font-serif)] text-[13px]">{t(row.f)}</div>
                  <div className="p-3 text-center border-l border-ink/10">
                    {row.free
                      ? <CheckCircle2 size={16} className="text-stamp-green mx-auto" />
                      : <span className="text-ink-faded text-[16px]">—</span>}
                  </div>
                  <div className="p-3 text-center border-l border-ink/10">
                    {row.premium
                      ? <CheckCircle2 size={16} className="text-gold-deep mx-auto" />
                      : <span className="text-ink-faded text-[16px]">—</span>}
                  </div>
                </div>
              ))}
            </PaperCard>

            <div className="text-center mt-6">
              <Link href="/pricing">
                <span className="inline-flex h-[52px] items-center gap-2 px-8 rounded-[4px] bg-gradient-to-b from-gold-light to-gold-deep text-ink font-[family-name:var(--font-serif)] font-bold shadow-gold hover:brightness-105 transition">
                  <Crown size={18} /> {t("Voir les tarifs complets")}
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Points forts ──────────────────────────────────── */}
        <section className="mb-24">
          <SectionHeading
            eyebrow={t("points forts")}
            title={t("Tout ce que")}
            highlight={t("Première Classe t'apporte")}
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

        {/* ── Polaroid testimonials ──────────────────────────── */}
        <section className="mb-16">
          <SectionHeading
            eyebrow={t("ils ont choisi le confort")}
            title={t("Ce qu'ils en pensent")}
            highlight=""
            center
            className="mb-10"
          />
          <div className="flex flex-wrap gap-6 justify-center">
            {[
              { src: "https://i.pravatar.cc/300?img=47", caption: "Claire · Paris", quote: "Le karma doublé m'a propulsée dans le top 5 %." },
              { src: "https://i.pravatar.cc/300?img=12", caption: "Léo · Lisbonne", quote: "Les spots secrets sont incroyables." },
              { src: "https://i.pravatar.cc/300?img=22", caption: "Inès · Marrakech", quote: "Plus une seule pub — enfin !" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3 max-w-[160px]">
                <Polaroid
                  src={item.src}
                  caption={item.caption}
                  width={150}
                  tilt={i === 0 ? -3 : i === 1 ? 0 : 4}
                  captionSize={12}
                />
                <p className="font-[family-name:var(--font-hand)] text-[13px] text-ink text-center leading-snug">
                  &ldquo;{t(item.quote)}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
      <CtaBand />
    </>
  );
}
