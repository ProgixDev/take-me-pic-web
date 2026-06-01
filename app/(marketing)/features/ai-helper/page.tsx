"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  AlignCenter,
  Sunrise,
  Grid3x3,
  CheckCircle2,
  Cpu,
  Wand2,
  Zap,
} from "lucide-react";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import {
  PaperCard,
  Stamp,
  Tape,
  Polaroid,
  SectionHeading,
} from "@/components/ui";
import { useT } from "@/i18n/I18nProvider";

const STRENGTHS_DATA = [
  { icon: <Grid3x3 size={18} />, titleKey: "Règle des tiers", bodyKey: "L'IA détecte si ton sujet est bien placé sur une ligne de force et te guide en temps réel." },
  { icon: <AlignCenter size={18} />, titleKey: "Alignement de l'horizon", bodyKey: "Fini les photos penchées : l'assistant signale dès que l'horizon n'est pas droit." },
  { icon: <Sunrise size={18} />, titleKey: "Analyse de la lumière", bodyKey: "Le modèle évalue la luminosité, les zones brûlées et te conseille d'attendre quelques minutes." },
  { icon: <Eye size={18} />, titleKey: "Cadrage du visage", bodyKey: "Détection de visages pour s'assurer qu'ils sont nets, bien exposés et dans le cadre." },
  { icon: <Wand2 size={18} />, titleKey: "Suggestions de pose", bodyKey: "Des micro-conseils textuels pour guider la personne devant l'objectif : « recule d'un pas », etc." },
  { icon: <Zap size={18} />, titleKey: "Traitement en local", bodyKey: "L'analyse IA se fait sur ton téléphone — aucune photo n'est envoyée à un serveur." },
];

const SUGGESTIONS_DATA = [
  { typeKey: "cadrage", msgKey: "Le sujet est trop centré — décale légèrement vers la gauche.", icon: <Grid3x3 size={14} /> },
  { typeKey: "lumière", msgKey: "Contre-jour détecté — expose pour le visage, pas le ciel.", icon: <Sunrise size={14} /> },
  { typeKey: "horizon", msgKey: "L'horizon penche de 3° — incline légèrement à droite.", icon: <AlignCenter size={14} /> },
  { typeKey: "focus", msgKey: "Visage détecté — vérifie la mise au point avant de prendre.", icon: <Eye size={14} /> },
];

export default function AiHelperPage() {
  const t = useT();
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const STRENGTHS = STRENGTHS_DATA.map((s) => ({
    icon: s.icon,
    title: t(s.titleKey),
    body: t(s.bodyKey),
  }));

  const SUGGESTIONS = SUGGESTIONS_DATA.map((s) => ({
    type: t(s.typeKey),
    msg: t(s.msgKey),
    icon: s.icon,
  }));

  return (
    <>
      <PageHero
        eyebrow={t("fonctionnalité")}
        title={t("L'œil bienveillant")}
        highlight={t("l'IA de cadrage")}
        sub={t("Un assistant intelligent qui guide la personne qui te photographie en temps réel : règle des tiers, horizon, lumière, visage. Sans jargon technique.")}
        stamp={"IA\n★\nCADRAGE"}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">

        {/* ── Section 1 : assistant en direct ─────────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <SectionHeading
              eyebrow={t("en temps réel")}
              title={t("Des conseils au moment")}
              highlight={t("où tu en as besoin")}
              sub={t("L'assistant analyse la scène et envoie des micro-conseils à la personne qui tient ton téléphone — pour qu'elle n'ait pas besoin de savoir photographier.")}
            />
            <div className="mt-8 space-y-3">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSuggestion(i)}
                  className={`w-full text-left p-4 rounded-[4px] border-[1.5px] transition cursor-pointer flex items-start gap-3 ${
                    activeSuggestion === i
                      ? "bg-ink text-paper-warm border-ink"
                      : "bg-card border-ink hover:bg-paper-warm"
                  }`}
                >
                  <span className={`mt-0.5 shrink-0 ${activeSuggestion === i ? "text-gold-light" : "text-gold-deep"}`}>
                    {s.icon}
                  </span>
                  <div>
                    <div className={`font-[family-name:var(--font-type)] text-[10px] uppercase tracking-wider mb-0.5 ${activeSuggestion === i ? "text-paper-warm/60" : "text-ink-faded"}`}>
                      {s.type}
                    </div>
                    <div className="font-[family-name:var(--font-serif)] text-[13px]">{s.msg}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Tape color="cream" rotate={3} className="absolute -top-3 left-1/4 z-10" />

            {/* Simulated viewfinder */}
            <PaperCard shadow="ink" className="overflow-hidden">
              <div className="relative h-80 bg-ink flex items-center justify-center">
                {/* Photo background */}
                <div
                  className="absolute inset-0 bg-center bg-cover opacity-70"
                  style={{ backgroundImage: "url(https://picsum.photos/seed/aiframe/800/600)" }}
                />
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-paper-warm" />
                  <div className="absolute top-2/3 left-0 right-0 h-px bg-paper-warm" />
                  <div className="absolute left-1/3 top-0 bottom-0 w-px bg-paper-warm" />
                  <div className="absolute left-2/3 top-0 bottom-0 w-px bg-paper-warm" />
                </div>
                {/* Active suggestion overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="bg-ink/80 backdrop-blur-sm rounded-[4px] p-3 border border-paper-warm/20">
                    <div className="flex items-center gap-2 text-gold-light mb-1">
                      {SUGGESTIONS[activeSuggestion].icon}
                      <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-wider">
                        {SUGGESTIONS[activeSuggestion].type}
                      </span>
                    </div>
                    <div className="font-[family-name:var(--font-serif)] text-paper-warm text-[13px]">
                      {SUGGESTIONS[activeSuggestion].msg}
                    </div>
                  </div>
                </div>
                {/* Corner stamp */}
                <div className="absolute top-3 right-3">
                  <Stamp color="gold" size={42} fontSize={8} rotate={-8}>{`IA\n★`}</Stamp>
                </div>
              </div>
              <div className="p-3 bg-paper-warm/50 flex items-center justify-center">
                <div className="flex items-center gap-2 font-[family-name:var(--font-serif)] text-ink-faded text-[12px]">
                  <Cpu size={14} />
                  <span>{t("Analyse locale · Aucune donnée envoyée")}</span>
                </div>
              </div>
            </PaperCard>
          </div>
        </section>

        {/* ── Section 2 : horizon & lumière ───────────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative order-2 md:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Polaroid
                  src="https://picsum.photos/seed/horizon1/400/400"
                  caption={t("avant correction ✗")}
                  width={150}
                  tilt={-5}
                  captionSize={12}
                />
                <div className="absolute inset-0 border-2 border-stamp-red/60 rounded-[2px] pointer-events-none" style={{ transform: "rotate(-5deg)" }} />
              </div>
              <div className="relative mt-8">
                <Polaroid
                  src="https://picsum.photos/seed/horizon2/400/400"
                  caption={t("après correction ✓")}
                  width={150}
                  tilt={0}
                  captionSize={12}
                />
                <div className="absolute inset-0 border-2 border-stamp-green/60 rounded-[2px] pointer-events-none" />
              </div>
            </div>
            <Tape color="blue" rotate={7} className="absolute -bottom-3 left-1/2 -translate-x-1/2" width={70} />
          </div>

          <div className="order-1 md:order-2">
            <SectionHeading
              eyebrow={t("horizon & lumière")}
              title={t("Une photo nette,")}
              highlight={t("bien cadrée")}
              sub={t("L'IA vérifie l'horizon, la règle des tiers et la lumière avant que tu appuies sur le déclencheur. Résultat : des photos réussies du premier coup.")}
            />
            <ul className="mt-6 space-y-2">
              {[
                t("Détection de l'inclinaison de l'horizon"),
                t("Analyse des zones surexposées"),
                t("Guide de placement du sujet"),
                t("Compatible avec n'importe quel téléphone"),
                t("Fonctionne hors ligne (traitement local)"),
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 font-[family-name:var(--font-serif)] text-[14px]">
                  <CheckCircle2 size={16} className="text-stamp-green shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Section 3 : confidentialité ─────────────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <SectionHeading
              eyebrow={t("vie privée")}
              title={t("L'IA qui")}
              highlight={t("reste sur ton téléphone")}
              sub={t("Toute l'analyse est effectuée en local sur ton appareil. Aucune image n'est envoyée à nos serveurs. L'œil bienveillant ne voit que ce que tu lui montres — et rien de plus.")}
            />
            <ul className="mt-6 space-y-2">
              {[
                t("Modèle embarqué — pas de cloud"),
                t("Aucune image stockée par l'IA"),
                t("Suggestions optionnelles (désactivables)"),
                t("Conforme RGPD par conception"),
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 font-[family-name:var(--font-serif)] text-[14px]">
                  <CheckCircle2 size={16} className="text-stamp-green shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link href="/features/safety">
                <span className="inline-flex h-[52px] items-center gap-2 px-6 rounded-[4px] border-[1.5px] border-ink text-ink font-[family-name:var(--font-serif)] font-semibold hover:bg-card/60 transition">
                  {t("Notre engagement sécurité →")}
                </span>
              </Link>
            </div>
          </div>

          <div className="relative">
            <PaperCard shadow="gold" className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold-light/30 flex items-center justify-center text-gold-deep">
                  <Cpu size={20} />
                </div>
                <div>
                  <div className="font-[family-name:var(--font-serif)] font-bold text-[15px]">{t("Modèle embarqué")}</div>
                  <div className="font-[family-name:var(--font-serif)] text-ink-faded text-[12px]">{t("Téléchargé une seule fois")}</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: t("Analyse par image"), val: "< 50 ms" },
                  { label: t("Connexion internet requise"), val: "Non" },
                  { label: t("Photos envoyées"), val: "0" },
                  { label: t("Taille du modèle"), val: "12 Mo" },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between items-center py-2 border-b border-ink/10 last:border-0">
                    <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">{r.label}</span>
                    <span className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">{r.val}</span>
                  </div>
                ))}
              </div>
              <Stamp color="green" size={52} fontSize={8} rotate={6} className="absolute top-3 right-3">{`LOCAL\n★\nSAFE`}</Stamp>
            </PaperCard>
          </div>
        </section>

        {/* ── Points forts ──────────────────────────────────── */}
        <section className="mb-24">
          <SectionHeading
            eyebrow={t("points forts")}
            title={t("Ce que l'œil")}
            highlight={t("bienveillant fait")}
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
