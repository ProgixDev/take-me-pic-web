"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  ToggleLeft,
  Star,
  Users,
  Compass,
  Zap,
  CheckCircle2,
  Radio,
  Navigation,
} from "lucide-react";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import {
  PaperCard,
  Stamp,
  Tape,
  SectionHeading,
  Toggle,
  Polaroid,
} from "@/components/ui";
import { users } from "@/lib/data";
import { useT } from "@/i18n/I18nProvider";

/* ── Local map-hand pin block ────────────────────────────────── */
const PINS = [
  { top: "18%", left: "22%", user: users[0], online: true },
  { top: "38%", left: "58%", user: users[1], online: true },
  { top: "60%", left: "30%", user: users[4], online: false },
  { top: "25%", left: "72%", user: users[7], online: true },
  { top: "70%", left: "65%", user: users[2], online: false },
  { top: "50%", left: "12%", user: users[11], online: true },
];

function MapHandBlock({ disponible }: { disponible: boolean }) {
  const t = useT();
  return (
    <div className="relative w-full h-[340px] map-hand rounded-[6px] border-[1.5px] border-ink overflow-hidden shadow-ink">
      {/* decorative grid lines */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      {/* street lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]" preserveAspectRatio="none">
        <line x1="0" y1="45%" x2="100%" y2="45%" stroke="var(--color-ink)" strokeWidth="3" />
        <line x1="0" y1="70%" x2="100%" y2="70%" stroke="var(--color-ink)" strokeWidth="1.5" />
        <line x1="35%" y1="0" x2="35%" y2="100%" stroke="var(--color-ink)" strokeWidth="2" />
        <line x1="68%" y1="0" x2="68%" y2="100%" stroke="var(--color-ink)" strokeWidth="1.5" />
      </svg>

      {/* Centre marker (me) */}
      <div className="absolute" style={{ top: "44%", left: "46%", transform: "translate(-50%, -50%)" }}>
        <div className="w-6 h-6 rounded-full bg-gold-deep border-2 border-polaroid shadow-gold flex items-center justify-center">
          <Navigation size={12} className="text-paper-warm" />
        </div>
        <div className="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-[family-name:var(--font-hand)] text-[11px] text-gold-deep">
          {t("toi ici")}
        </div>
      </div>

      {/* Avatar pins */}
      {PINS.map((p, i) => (
        <div
          key={i}
          className="absolute"
          style={{ top: p.top, left: p.left, transform: "translate(-50%, -50%)" }}
        >
          <div className={`w-1.5 h-1.5 rounded-full mx-auto mb-0.5 ${p.online && disponible ? "bg-stamp-green" : "bg-ink/30"}`} />
          <div className={`rounded-full border-2 overflow-hidden shadow-ink-sm transition-all ${p.online && disponible ? "border-stamp-green opacity-100" : "border-ink/30 opacity-40"}`}
            style={{ width: 36, height: 36 }}>
            <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: `url(${p.user.avatar})` }} />
          </div>
          {p.online && disponible && (
            <div className="font-[family-name:var(--font-hand)] text-[10px] text-stamp-green text-center mt-0.5 whitespace-nowrap">
              {p.user.firstName}
            </div>
          )}
        </div>
      ))}

      {/* radius ring */}
      {disponible && (
        <div className="absolute" style={{ top: "44%", left: "46%", transform: "translate(-50%, -50%)" }}>
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-gold-deep/40 animate-pulse" />
        </div>
      )}

      {/* corner stamp */}
      <div className="absolute bottom-3 right-3">
        <Stamp color="blue" size={52} fontSize={8} rotate={5}>{t("CARTE\nLIVE")}</Stamp>
      </div>
    </div>
  );
}

/* ── Strengths list ─────────────────────────────────────────── */
const STRENGTHS_DATA = [
  { icon: <Radio size={18} />, title: "Disponibilité en temps réel", body: "Active le mode « je veux bien aider » et apparais sur la carte des gens qui cherchent." },
  { icon: <MapPin size={18} />, title: "Rayon de 500 m", body: "On ne te propose que des personnes à portée de voix — pas à l'autre bout de la ville." },
  { icon: <Star size={18} />, title: "+Karma à chaque aide", body: "Chaque photo prise pour quelqu'un rapporte des points de karma. Plus tu aides, plus tu montes." },
  { icon: <Users size={18} />, title: "Profils vérifiés", body: "Email, téléphone, selfie de vérification. Tu sais à qui tu as affaire avant d'approcher." },
  { icon: <Zap size={18} />, title: "Match instantané", body: "La mise en relation prend moins de 30 secondes — moins que de trouver un passant." },
  { icon: <Compass size={18} />, title: "Filtres de langue", body: "Trouve quelqu'un qui parle ta langue pour des instructions de cadrage claires." },
];

export default function DiscoverPage() {
  const t = useT();
  const [disponible, setDisponible] = useState(true);

  const STEPS = [
    { n: "01", t: t("Ouvre la carte"), d: t("Lance l'appli et vois les points disponibles autour de toi.") },
    { n: "02", t: t("Envoie un pli"), d: t("Contacte quelqu'un en un tap — comme glisser un mot.") },
    { n: "03", t: t("Rendez-vous au spot"), d: t("La personne accepte et vous vous retrouvez sur place.") },
    { n: "04", t: t("Photos & karma"), d: t("La session se termine, tu reçois tes photos, elle reçoit du karma.") },
  ];

  const CHECKLIST = [
    t("Pas de coordonnées personnelles échangées"),
    t("Photos envoyées dans la galerie chiffrée"),
    t("Annulation libre sans pénalité"),
  ];

  const STRENGTHS = STRENGTHS_DATA.map((s) => ({
    ...s,
    title: t(s.title as Parameters<typeof t>[0]),
    body: t(s.body as Parameters<typeof t>[0]),
  }));

  return (
    <>
      <PageHero
        eyebrow={t("fonctionnalité")}
        title={t("La carte du quartier")}
        highlight={t("tout près de toi")}
        sub={t("Trouve en quelques secondes quelqu'un de disponible autour de toi pour prendre ta photo — ou propose ton aide et gagne du karma.")}
        stamp={t("CARTE\n★\nVIVANTE")}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">

        {/* ── Section 1 : carte interactive ─────────────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <SectionHeading
              eyebrow={t("carte en direct")}
              title={t("Vois qui est disponible")}
              highlight={t("maintenant")}
              sub={t("La carte se met à jour en temps réel. Un point vert signifie que la personne est prête à aider — maintenant, ici.")}
            />
            <div className="mt-8 flex items-center gap-4 p-4 bg-card border-[1.5px] border-ink rounded-[4px] shadow-ink-sm w-fit">
              <Toggle checked={disponible} onChange={setDisponible} />
              <div>
                <div className="font-[family-name:var(--font-serif)] font-semibold text-[15px]">
                  {disponible ? t("Je suis disponible ✓") : t("Mode discret")}
                </div>
                <div className="font-[family-name:var(--font-serif)] text-ink-faded text-[13px]">
                  {disponible ? t("Tu apparais sur la carte des autres") : t("Tu es invisible sur la carte")}
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/download">
                <span className="inline-flex h-[52px] items-center px-6 rounded-[4px] bg-ink text-paper-warm font-[family-name:var(--font-serif)] font-semibold shadow-ink-sm hover:brightness-110 transition">
                  {t("Essayer maintenant")}
                </span>
              </Link>
              <Link href="/how-it-works">
                <span className="inline-flex h-[52px] items-center px-6 rounded-[4px] border-[1.5px] border-dashed border-ink/40 text-ink font-[family-name:var(--font-serif)] font-semibold hover:bg-card/60 transition">
                  {t("Comment ça marche")}
                </span>
              </Link>
            </div>
          </div>
          <div className="relative">
            <Tape color="cream" rotate={-3} className="absolute -top-3 left-1/2 -translate-x-1/2 z-10" />
            <MapHandBlock disponible={disponible} />
            <div className="absolute -bottom-4 -right-4">
              <Polaroid
                src={users[0].avatar}
                caption={`${users[0].firstName} ★ ${users[0].rating.toFixed(1)}`}
                width={110}
                tilt={4}
                captionSize={13}
              />
            </div>
          </div>
        </section>

        {/* ── Section 2 : comment ça marche ──────────────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative order-2 md:order-1">
            <div className="relative bg-paper-warm border-[1.5px] border-ink rounded-[6px] p-6 shadow-ink">
              <div className="font-[family-name:var(--font-hand)] text-xl text-gold-deep mb-4 -rotate-1">
                {t("en 4 étapes simples...")}
              </div>
              {STEPS.map((step) => (
                <div key={step.n} className="flex gap-4 mb-4 last:mb-0">
                  <div className="w-8 h-8 rounded-full bg-ink text-paper-warm flex items-center justify-center font-[family-name:var(--font-type)] text-[11px] shrink-0 mt-0.5">
                    {step.n}
                  </div>
                  <div>
                    <div className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">{step.t}</div>
                    <div className="font-[family-name:var(--font-serif)] text-ink-faded text-[13px]">{step.d}</div>
                  </div>
                </div>
              ))}
              <Tape color="blue" rotate={8} className="absolute -top-3 -right-3" width={50} />
            </div>
          </div>
          <div className="order-1 md:order-2">
            <SectionHeading
              eyebrow={t("ultra simple")}
              title={t("Un rendez-vous photo")}
              highlight={t("en 4 étapes")}
              sub={t("Pas de négociation, pas de numéro de téléphone à partager. L'échange se fait entièrement dans l'appli, de la demande à la livraison des photos.")}
            />
            <ul className="mt-6 space-y-2">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex items-center gap-2 font-[family-name:var(--font-serif)] text-[14px]">
                  <CheckCircle2 size={16} className="text-stamp-green shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Points forts ───────────────────────────────────── */}
        <section className="mb-24">
          <SectionHeading
            eyebrow={t("points forts")}
            title={t("Ce qui rend la carte")}
            highlight={t("unique")}
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

        {/* ── Stats row ──────────────────────────────────────── */}
        <section className="mb-16">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { v: "< 30 s", l: t("temps de mise en relation") },
              { v: "500 m", l: t("rayon de recherche") },
              { v: "4,8 ★", l: t("note moyenne des sessions") },
            ].map((s) => (
              <PaperCard key={s.l} shadow="gold" className="py-8 px-4">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[clamp(24px,4vw,40px)] tracking-[-0.02em] text-gold-deep">
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
