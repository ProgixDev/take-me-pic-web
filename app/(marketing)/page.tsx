"use client";

import Link from "next/link";
import {
  Camera,
  MapPin,
  Star,
  Users,
  Heart,
  Compass,
  Sparkles,
  ArrowRight,
  Shield,
  Globe2,
  Smartphone,
  Map,
} from "lucide-react";
import {
  PaperCard,
  Stamp,
  Polaroid,
  Tape,
  Avatar,
  SectionHeading,
  Button,
  Chip,
} from "@/components/ui";
import { CtaBand } from "@/components/marketing/MarketingBits";
import { LiveMap, type MapMarker } from "@/components/marketing/LiveMap";
import { useT } from "@/i18n/I18nProvider";
import {
  analytics,
  stories,
  spots,
  fmtNum,
} from "@/lib/data";

/* ------------------------------------------------------------------ */
/* Local sub-components (defined inside this file, not shared)         */
/* ------------------------------------------------------------------ */

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-[family-name:var(--font-serif)] font-bold text-[28px] text-ink leading-none">
        {value}
      </div>
      <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mt-1">
        {label}
      </div>
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  desc,
  tilt,
  shadow,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  tilt?: number;
  shadow?: "ink" | "gold" | "red" | "blue" | "soft" | "none";
}) {
  return (
    <PaperCard shadow={shadow ?? "ink"} tilt={tilt} className="p-7 relative">
      <div className="absolute -top-5 left-6">
        <Stamp color="gold" shape="circle" size={40} fontSize={14} rotate={-4}>
          {number}
        </Stamp>
      </div>
      <div className="mt-4 mb-3 text-gold-deep">{icon}</div>
      <h3 className="font-[family-name:var(--font-serif)] font-bold text-[20px] leading-tight mb-2">
        {title}
      </h3>
      <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[15px] leading-relaxed">
        {desc}
      </p>
    </PaperCard>
  );
}

function FeatureMiniCard({
  icon,
  title,
  desc,
  href,
  tilt,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
  tilt?: number;
}) {
  const t = useT();
  return (
    <Link href={href} className="block group">
      <PaperCard
        shadow="soft"
        tilt={tilt}
        className="p-6 hover:-translate-y-1 transition-transform duration-200 h-full"
      >
        <div className="mb-3 text-stamp-blue">{icon}</div>
        <h3 className="font-[family-name:var(--font-serif)] font-bold text-[17px] leading-tight mb-1.5">
          {title}
        </h3>
        <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[14px] leading-relaxed">
          {desc}
        </p>
        <div className="mt-4 flex items-center gap-1 text-gold-deep font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.08em] opacity-0 group-hover:opacity-100 transition-opacity">
          {t("découvrir")} <ArrowRight size={11} />
        </div>
      </PaperCard>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const kpis = analytics.kpis;
  const t = useT();

  // Live "neighbourhood" pins around central Paris (Le Marais).
  const neighbourhoodMarkers: MapMarker[] = [
    { id: "p1", lat: 48.8606, lng: 2.3376, label: "Paris", icon: "📸", online: true },
    { id: "p2", lat: 48.8629, lng: 2.3499, label: "Léo", icon: "📷", online: false },
    { id: "p3", lat: 48.8554, lng: 2.3601, label: "Inès", icon: "✿", online: true },
    { id: "p4", lat: 48.8584, lng: 2.3412, label: "Claire", icon: "📸", online: true },
    { id: "p5", lat: 48.8651, lng: 2.3280, label: "Sami", icon: "🙂", online: false },
  ];

  return (
    <div>
      {/* ============================================================ HERO */}
      <section className="relative paper bg-paper-warm overflow-hidden border-b-[1.5px] border-[var(--ink-line)] min-h-[90vh] flex items-center">
        {/* Decorative tape strips */}
        <Tape color="cream" width={80} height={24} rotate={-12} className="absolute top-10 right-[22%] z-10" />
        <Tape color="red" width={60} height={20} rotate={8} className="absolute top-20 left-[12%] z-10" />

        <div className="mx-auto max-w-7xl px-5 py-20 md:py-28 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div className="stagger">
              <div className="font-[family-name:var(--font-hand)] text-3xl text-gold-deep -rotate-2 mb-3">
                {t("bonjour, voyageur ✿")}
              </div>
              <h1 className="font-[family-name:var(--font-serif)] font-bold text-[clamp(42px,7vw,72px)] tracking-[-0.03em] leading-[0.95]">
                {t("On se prend")}{" "}
                <span className="squiggle">{t("en photo")}</span>
                {" ?"}
              </h1>
              <p className="font-[family-name:var(--font-serif)] text-lg text-ink-faded mt-6 max-w-lg leading-relaxed">
                {t("Trouve quelqu'un à côté de toi. Échange un sourire, deux poses, trois souvenirs. Pas de selfie raté. Juste des vraies photos de voyage — entre voyageurs.")}
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/download">
                  <Button variant="gold" size="lg" icon={<Smartphone size={18} />}>
                    {t("télécharger l'app")}
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="paper" size="lg" trailing={<ArrowRight size={16} />}>
                    {t("comment ça marche")}
                  </Button>
                </Link>
              </div>

              {/* Mini stats */}
              <div className="mt-10 flex items-center gap-8 flex-wrap">
                <HeroStat value={fmtNum(kpis.users)} label={t("Voyageurs")} />
                <div className="w-px h-10 bg-[var(--ink-line)]" />
                <HeroStat value={fmtNum(kpis.photos)} label={t("Photos prises")} />
                <div className="w-px h-10 bg-[var(--ink-line)]" />
                <HeroStat value="4,9 ★" label={t("Note moy.")} />
              </div>
            </div>

            {/* Right: polaroid cluster */}
            <div className="relative h-[440px] hidden lg:block">
              {/* Main large polaroid */}
              <div className="absolute top-8 left-16 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <Polaroid
                  src="https://picsum.photos/seed/hero1/400/400"
                  caption={t("Pont des Arts ☼")}
                  width={210}
                  height={200}
                  tilt={-4}
                  captionSize={18}
                />
              </div>
              {/* Second polaroid overlapping */}
              <div className="absolute top-2 right-4 animate-fade-in" style={{ animationDelay: "0.35s" }}>
                <Polaroid
                  src="https://picsum.photos/seed/hero2/400/400"
                  caption={t("Alfama, Lisbonne")}
                  width={190}
                  height={180}
                  tilt={6}
                  captionSize={16}
                />
              </div>
              {/* Third polaroid bottom */}
              <div className="absolute bottom-4 left-4 animate-fade-in" style={{ animationDelay: "0.5s" }}>
                <Polaroid
                  src="https://picsum.photos/seed/hero3/400/400"
                  caption={t("Marrakech ✿")}
                  width={170}
                  height={160}
                  tilt={3}
                  captionSize={15}
                />
              </div>
              {/* Fourth small polaroid bottom-right */}
              <div className="absolute bottom-10 right-6 animate-fade-in" style={{ animationDelay: "0.65s" }}>
                <Polaroid
                  src="https://picsum.photos/seed/hero4/400/400"
                  caption={t("Shibuya ★")}
                  width={150}
                  height={140}
                  tilt={-6}
                  captionSize={14}
                />
              </div>
              {/* Tape accents on polaroids */}
              <div className="absolute top-4 left-[108px] z-20">
                <Tape color="cream" width={55} height={20} rotate={-8} />
              </div>
              <div className="absolute top-[-2px] right-[80px] z-20">
                <Tape color="blue" width={50} height={18} rotate={5} />
              </div>
              {/* Stamp */}
              <div className="absolute bottom-16 right-2 z-20 animate-stamp-in" style={{ animationDelay: "0.8s" }}>
                <Stamp color="red" size={80} fontSize={9} rotate={12}>
                  {`VOYAGE\n★\nPHOTO`}
                </Stamp>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ HOW IT WORKS (3 steps) */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <SectionHeading
          eyebrow={t("c'est simple")}
          title={t("Comment ça marche")}
          highlight={t("en 3 étapes")}
          sub={t("Pas de compte compliqué. Pas de paiement pour les photos. Juste de l'entraide entre voyageurs.")}
          center
          className="mb-14"
        />
        <div className="grid md:grid-cols-3 gap-10 stagger">
          <StepCard
            number="01"
            icon={<MapPin size={32} />}
            title={t("Trouver")}
            desc={t("Ouvre la carte autour de toi. Vois les voyageurs disponibles dans le quartier, avec leur note et leur style photo.")}
            tilt={-1}
            shadow="ink"
          />
          <StepCard
            number="02"
            icon={<Heart size={32} />}
            title={t("Demander")}
            desc={t("Envoie un pli — une demande amicale. L'autre voyageur accepte, vous vous retrouvez à l'endroit qui te fait rêver.")}
            tilt={0.5}
            shadow="gold"
          />
          <StepCard
            number="03"
            icon={<Camera size={32} />}
            title={t("Sourire")}
            desc={t("Il ou elle te prend en photo, tu lui rends la pareille si tu veux. Souvenirs partagés, karma gagné, amis peut-être.")}
            tilt={-1.5}
            shadow="blue"
          />
        </div>
        <div className="mt-10 text-center">
          <Link href="/how-it-works">
            <Button variant="ghost" trailing={<ArrowRight size={15} />}>
              {t("voir toutes les étapes")}
            </Button>
          </Link>
        </div>
      </section>

      {/* ============================================================ MAP TEASER */}
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="relative rounded-[6px] border-[1.5px] border-[var(--ink-line)] overflow-hidden shadow-ink-sm">
          <LiveMap markers={neighbourhoodMarkers} height={360} zoom={14} center={[48.8606, 2.3441]} />
          {/* Handwritten "carte du quartier" label */}
          <div className="absolute top-5 left-6 z-[500] pointer-events-none">
            <div className="font-[family-name:var(--font-hand)] text-2xl text-ink -rotate-1 bg-paper-warm/75 px-2 rounded">
              {t("carte du quartier")}
            </div>
          </div>
          {/* Stamp top right */}
          <div className="absolute top-4 right-6 z-[500] pointer-events-none">
            <Stamp color="blue" size={72} fontSize={8} rotate={10}>
              {`LIVE\n★\nCARTE`}
            </Stamp>
          </div>
          {/* CTA overlay */}
          <div className="absolute bottom-5 left-0 right-0 flex justify-center z-[500]">
            <Link href="/download">
              <Button variant="ink" size="sm" icon={<Compass size={14} />}>
                {t("explore autour de moi")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ FEATURE GRID */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <SectionHeading
          eyebrow={t("tout ce qu'on a préparé")}
          title={t("Les fonctionnalités")}
          highlight={t("pour toi")}
          sub={t("De la carte aux souvenirs, en passant par l'IA et la famille — tout est pensé pour le voyageur.")}
          center
          className="mb-14"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          <FeatureMiniCard
            icon={<Map size={28} />}
            title={t("Spots photo")}
            desc={t("Des milliers de lieux testés par la communauté, notés et géolocalisés.")}
            href="/features/spots"
            tilt={-0.5}
          />
          <FeatureMiniCard
            icon={<Star size={28} />}
            title={t("Karma & récompenses")}
            desc={t("Chaque photo prise gagne du karma. Débloques des badges, monte dans le classement.")}
            href="/features/karma"
            tilt={0.8}
          />
          <FeatureMiniCard
            icon={<Users size={28} />}
            title={t("Communauté")}
            desc={t("Partage tes clichés, découvre les albums des autres, commente et mets des cœurs.")}
            href="/features/community"
            tilt={-1}
          />
          <FeatureMiniCard
            icon={<Sparkles size={28} />}
            title={t("Assistant IA")}
            desc={t("Il t'aide à trouver le meilleur angle, suggère des poses et crée des itinéraires photos.")}
            href="/features/ai-helper"
            tilt={0.3}
          />
          <FeatureMiniCard
            icon={<Shield size={28} />}
            title={t("Sécurité & confiance")}
            desc={t("GPS éphémère, vérification d'identité, mode famille, bouton SOS discret.")}
            href="/features/safety"
            tilt={-0.7}
          />
          <FeatureMiniCard
            icon={<Globe2 size={28} />}
            title={t("Premium — Première classe")}
            desc={t("Profil mis en avant, spots secrets, 2× karma, galerie illimitée. Dès 4,99 €/mois.")}
            href="/features/premium"
            tilt={1}
          />
        </div>
        <div className="mt-10 text-center">
          <Link href="/features">
            <Button variant="paper" trailing={<ArrowRight size={15} />}>
              {t("toutes les fonctionnalités")}
            </Button>
          </Link>
        </div>
      </section>

      {/* ============================================================ KARMA/COMMUNITY BAND */}
      <section className="bg-ink paper paper-dark">
        <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="font-[family-name:var(--font-hand)] text-2xl text-gold-light -rotate-1 mb-2">
                {t("une vraie communauté")}
              </div>
              <h2 className="font-[family-name:var(--font-serif)] font-bold text-[clamp(28px,4vw,44px)] tracking-[-0.02em] text-paper-warm leading-tight">
                {t("L'entraide, ça")} <span className="text-gold-light squiggle">{t("compte")}</span>
              </h2>
              <p className="font-[family-name:var(--font-serif)] text-paper-warm/70 mt-4 text-[15px] leading-relaxed max-w-lg">
                {t("Chaque photo que tu prends pour quelqu'un d'autre fait grandir le karma de toute la communauté. Ensemble, on a déjà pris plus d'un million de photos.")}
              </p>
              <div className="mt-6">
                <Link href="/download">
                  <Button variant="gold">{t("rejoindre la communauté")}</Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 stagger">
              {[
                { v: fmtNum(kpis.users), d: kpis.usersDelta, l: t("Voyageurs") },
                { v: fmtNum(kpis.photos), d: kpis.photosDelta, l: t("Photos prises") },
                { v: fmtNum(kpis.sessions), d: kpis.sessionsDelta, l: t("Sessions") },
                { v: fmtNum(kpis.karma), d: kpis.karmaDelta, l: t("Points karma") },
              ].map(({ v, d, l }) => (
                <PaperCard key={l} shadow="gold" className="p-5 text-center">
                  <div className="font-[family-name:var(--font-serif)] font-bold text-[26px] text-ink leading-none">
                    {v}
                  </div>
                  <Chip color="green" variant="filled" size="sm" mono className="mt-1">
                    {d}
                  </Chip>
                  <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mt-2">
                    {l}
                  </div>
                </PaperCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <SectionHeading
          eyebrow={t("ils le disent mieux que nous")}
          title={t("Leurs histoires")}
          highlight={t("de voyage")}
          center
          className="mb-14"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 stagger">
          {stories.map((s, i) => (
            <Link key={s.slug} href={`/stories/${s.slug}`} className="block group">
              <div className="flex flex-col items-center">
                <Polaroid
                  src={s.cover}
                  caption={`${s.name} — ${s.city}`}
                  width={180}
                  height={160}
                  tilt={i % 2 === 0 ? -2 : 2}
                  captionSize={15}
                  className="group-hover:scale-[1.02] transition-transform duration-200"
                />
                <div className="mt-4 relative">
                  <Tape
                    color={["cream", "red", "blue", "cream"][i] as "cream" | "red" | "blue"}
                    width={48}
                    height={16}
                    rotate={i % 2 === 0 ? -3 : 3}
                    className="absolute -top-2 left-1/2 -translate-x-1/2"
                  />
                  <PaperCard shadow="soft" className="px-4 py-3 max-w-[200px] mt-1">
                    <p className="font-[family-name:var(--font-hand)] text-[14px] text-ink-faded italic leading-relaxed text-center">
                      &ldquo;{s.quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Avatar src={s.avatar} size={24} />
                      <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.08em] text-ink-faded">
                        {s.name}
                      </span>
                    </div>
                  </PaperCard>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================ SPOTS TEASER */}
      <section className="mx-auto max-w-7xl px-5 pb-16">
        <SectionHeading
          eyebrow={t("repéré par la communauté")}
          title={t("Spots photo")}
          highlight={t("du moment")}
          sub={t("Des lieux uniques, testés et notés par des voyageurs comme toi.")}
          center
          className="mb-12"
        />
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 stagger">
          {spots.slice(0, 4).map((spot, i) => (
            <Link key={spot.id} href="/spots-vitrine" className="block group">
              <PaperCard shadow="soft" className="overflow-hidden hover:-translate-y-1 transition-transform duration-200">
                <div
                  className="w-full h-36 bg-center bg-cover"
                  style={{ backgroundImage: `url(${spot.hero})` }}
                />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-[family-name:var(--font-serif)] font-bold text-[15px] leading-tight">
                      {spot.name}
                    </h4>
                    <Chip color="gold" variant="outline" size="sm" mono>
                      ★ {spot.rating.toFixed(1)}
                    </Chip>
                  </div>
                  <div className="flex items-center gap-1 text-ink-faded">
                    <MapPin size={11} />
                    <span className="font-[family-name:var(--font-type)] text-[11px]">
                      {spot.city}
                    </span>
                  </div>
                </div>
              </PaperCard>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/spots-vitrine">
            <Button variant="paper" trailing={<ArrowRight size={15} />}>
              {t("voir tous les spots")}
            </Button>
          </Link>
        </div>
      </section>

      {/* ============================================================ CTA BAND */}
      <CtaBand />
    </div>
  );
}
