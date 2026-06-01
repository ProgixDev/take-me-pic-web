"use client";

import Link from "next/link";
import {
  Map,
  Star,
  Users,
  Sparkles,
  Shield,
  Crown,
  Route,
  Baby,
  Camera,
  ArrowRight,
} from "lucide-react";
import { PaperCard, Stamp, Tape, SectionHeading, Chip, Badge } from "@/components/ui";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import { useT } from "@/i18n/I18nProvider";

/* ------------------------------------------------------------------ */
/* Feature catalogue                                                    */
/* ------------------------------------------------------------------ */

interface Feature {
  slug: string;
  icon: React.ReactNode;
  label: string;
  title: string;
  blurb: string;
  badge?: { text: string; tone: "gold" | "blue" | "green" | "red" | "neutral" | "sunset" };
  tilt: number;
  shadow: "ink" | "gold" | "red" | "blue" | "soft" | "none";
}


/* ------------------------------------------------------------------ */
/* Sub-component: feature card                                          */
/* ------------------------------------------------------------------ */

function FeatureCard({ f }: { f: Feature }) {
  const t = useT();
  return (
    <Link href={`/features/${f.slug}`} className="block group h-full">
      <PaperCard
        shadow={f.shadow}
        tilt={f.tilt}
        className="p-7 flex flex-col h-full hover:-translate-y-1 transition-transform duration-200"
      >
        {/* Label / eyebrow */}
        <div className="font-[family-name:var(--font-hand)] text-gold-deep text-[15px] -rotate-1 mb-3">
          {f.label}
        </div>
        {/* Icon */}
        <div className="text-stamp-blue mb-4">{f.icon}</div>
        {/* Title */}
        <h2 className="font-[family-name:var(--font-serif)] font-bold text-[20px] leading-tight mb-3">
          {f.title}
        </h2>
        {/* Blurb */}
        <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[14px] leading-relaxed flex-1">
          {f.blurb}
        </p>
        {/* Optional badge */}
        {f.badge && (
          <div className="mt-4">
            <Badge tone={f.badge.tone} dot>
              {f.badge.text}
            </Badge>
          </div>
        )}
        {/* Hover arrow */}
        <div className="mt-5 flex items-center gap-1 text-gold-deep font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.08em] opacity-0 group-hover:opacity-100 transition-opacity">
          {t("en savoir plus")} <ArrowRight size={11} />
        </div>
      </PaperCard>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                 */
/* ------------------------------------------------------------------ */

export default function FeaturesPage() {
  const t = useT();

  const FEATURES: Feature[] = [
    {
      slug: "discover",
      icon: <Camera size={36} />,
      label: t("Le cœur de l'app"),
      title: t("Trouver & se faire photographier"),
      blurb: t("Ouvre la carte, repère un voyageur disponible près de toi, envoie un pli et retrouve-toi dans les minutes qui suivent au meilleur spot du quartier. Gratuit, immédiat, magique."),
      tilt: -1.2,
      shadow: "ink",
    },
    {
      slug: "community",
      icon: <Users size={36} />,
      label: t("Ensemble"),
      title: t("Communauté & galerie partagée"),
      blurb: t("Partage tes clichés dans le fil de la communauté, commente, mets des cœurs, découvre des albums de voyageurs du monde entier. Une vraie inspiration quotidienne."),
      tilt: 0.8,
      shadow: "blue",
    },
    {
      slug: "spots",
      icon: <Map size={36} />,
      label: t("Lieux secrets"),
      title: t("Carte des spots photo"),
      blurb: t("Des milliers d'endroits repérés et notés par la communauté : meilleur créneau, meilleur angle, niveau de fréquentation. Jamais à court d'idées."),
      badge: { text: t("communauté"), tone: "green" },
      tilt: -0.5,
      shadow: "soft",
    },
    {
      slug: "karma",
      icon: <Star size={36} />,
      label: t("L'économie de l'entraide"),
      title: t("Karma & badges"),
      blurb: t("Chaque photo que tu prends pour quelqu'un te rapporte du karma. Débloque des badges rares, monte dans le classement de ta ville, accède à des avantages exclusifs."),
      tilt: 1.2,
      shadow: "gold",
    },
    {
      slug: "ai-helper",
      icon: <Sparkles size={36} />,
      label: t("Intelligence artificielle"),
      title: t("Assistant IA — le photo-coach"),
      blurb: t("L'IA analyse la scène, suggère le meilleur cadrage, guide l'autre voyageur avec des instructions claires et propose des poses adaptées au lieu. Plus de photos floues."),
      badge: { text: t("nouveau"), tone: "sunset" },
      tilt: -1,
      shadow: "ink",
    },
    {
      slug: "itinerary",
      icon: <Route size={36} />,
      label: t("Plein de mémoires"),
      title: t("Itinéraires photo générés"),
      blurb: t("Dis à l'IA combien de temps tu as, tes préférences (coucher de soleil, architecture, portraits) et elle te génère un itinéraire photo complet, heure par heure."),
      tilt: 0.4,
      shadow: "soft",
    },
    {
      slug: "family",
      icon: <Baby size={36} />,
      label: t("Pour toute la famille"),
      title: t("Mode famille"),
      blurb: t("Partage ta position en temps réel avec tes proches, définis une zone de sécurité pour les enfants, et reçois une alerte si quelqu'un sort du périmètre. Sérénité garantie."),
      tilt: -0.7,
      shadow: "blue",
    },
    {
      slug: "premium",
      icon: <Crown size={36} />,
      label: t("Première classe"),
      title: t("Premium — Première classe"),
      blurb: t("Profil mis en avant (3× plus de matchs), spots secrets hors guide, 2× karma par session, galerie illimitée, aucune pub. Dès 4,99 €/mois, résiliable à tout moment."),
      badge: { text: t("à partir de 4,99 €"), tone: "gold" },
      tilt: 1,
      shadow: "gold",
    },
    {
      slug: "safety",
      icon: <Shield size={36} />,
      label: t("On veille sur toi"),
      title: t("Sécurité & confiance"),
      blurb: t("GPS éphémère, vérification d'identité, bouton SOS discret, signalement instantané, modération humaine des profils. La sécurité n'est pas une option, c'est notre fondation."),
      tilt: -1.5,
      shadow: "red",
    },
  ];

  return (
    <div>
      <PageHero
        eyebrow={t("tout est là pour toi")}
        title={t("Les fonctionnalités")}
        highlight="Take Me Pic"
        sub={t("De la première photo à la famille en vadrouille, tout ce qu'on a construit pour rendre chaque voyage inoubliable — avec les photos pour le prouver.")}
        stamp={`FONCTIONS\n★\nTMP`}
      />

      {/* ============================================================ FEATURE GRID */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <SectionHeading
          eyebrow={t("neuf fonctionnalités")}
          title={t("Ce qu'on a mis dans l'appli")}
          highlight={t("pour vous")}
          sub={t("Chaque fonctionnalité a été pensée avec des voyageurs. Pas de bloatware — juste ce qui compte.")}
          center
          className="mb-14"
        />

        {/* Decorative tape above grid */}
        <div className="relative h-10 mb-4 hidden md:block">
          <Tape color="cream" width={70} height={22} rotate={-7} className="absolute left-8 top-0" />
          <Tape color="red" width={55} height={18} rotate={5} className="absolute left-[38%] top-1" />
          <Tape color="blue" width={65} height={20} rotate={-3} className="absolute right-12 top-2" />
        </div>

        {/* 3-col grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
          {FEATURES.map((f) => (
            <FeatureCard key={f.slug} f={f} />
          ))}
        </div>
      </section>

      {/* ============================================================ COMPARISON NOTE */}
      <section className="mx-auto max-w-7xl px-5 py-12">
        <PaperCard shadow="gold" className="p-10 md:p-14 relative overflow-hidden">
          <div className="absolute right-6 top-6 hidden md:block">
            <Stamp color="gold" size={90} fontSize={8} rotate={12}>
              {t("COMPRIS\nDANS\nL'APP")}
            </Stamp>
          </div>
          <div className="max-w-xl">
            <div className="font-[family-name:var(--font-hand)] text-2xl text-gold-deep -rotate-1 mb-3">
              {t("le plan gratuit, c'est déjà tout ça")}
            </div>
            <h2 className="font-[family-name:var(--font-serif)] font-bold text-[clamp(22px,3.5vw,36px)] leading-tight mb-5">
              {t("Aucune fonctionnalité clé n'est derrière un mur payant.")}
            </h2>
            <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[15px] leading-relaxed mb-6">
              {t("Trouver un photographe, prendre des photos, gagner du karma, accéder à la communauté et à la carte des spots — tout ça est 100 % gratuit. Le plan Première classe ajoute du confort, pas l'essentiel.")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Chip color="green" variant="filled" size="md">
                {t("✓ Gratuit pour toujours")}
              </Chip>
              <Chip color="gold" variant="outline" size="md">
                {t("✓ Première classe dès 4,99 €/mois")}
              </Chip>
              <Chip color="ink" variant="dashed" size="md">
                {t("✓ Résiliable à tout moment")}
              </Chip>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/download">
                <button className="inline-flex items-center gap-2 h-[52px] px-7 rounded-[4px] bg-ink text-paper-warm font-[family-name:var(--font-serif)] font-semibold hover:brightness-110 transition">
                  {t("télécharger gratuitement")} <ArrowRight size={16} />
                </button>
              </Link>
              <Link href="/pricing">
                <button className="inline-flex items-center gap-2 h-[52px] px-7 rounded-[4px] border-[1.5px] border-dashed border-[var(--ink-soft)] font-[family-name:var(--font-serif)] font-semibold hover:bg-card/60 transition">
                  {t("voir les tarifs")}
                </button>
              </Link>
            </div>
          </div>
        </PaperCard>
      </section>

      <CtaBand />
    </div>
  );
}
