"use client";

import Link from "next/link";
import { useState } from "react";
import { useT } from "@/i18n/I18nProvider";
import {
  MapPin,
  Briefcase,
  ArrowRight,
  Plane,
  Coffee,
  Heart,
  Laptop,
  BookOpen,
  Globe2,
} from "lucide-react";
import { PaperCard, Chip, Stamp, Badge, Tape, SectionHeading } from "@/components/ui";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import { jobs } from "@/lib/data";

const ALL_TEAMS = ["Tous", ...Array.from(new Set(jobs.map((j) => j.team)))];
const ALL_LOCS = ["Toutes", ...Array.from(new Set(jobs.map((j) => j.location)))];

const TEAM_TONE: Record<string, "neutral" | "green" | "red" | "blue" | "gold" | "sunset"> = {
  Produit: "blue",
  Design: "gold",
  Communauté: "green",
  Marketing: "sunset",
  Opérations: "neutral",
};


export default function CareersPage() {
  const t = useT();
  const [teamFilter, setTeamFilter] = useState("Tous");
  const [locFilter, setLocFilter] = useState("Toutes");

  const PERKS = [
    {
      icon: <Plane size={24} />,
      title: t("Budget voyage annuel"),
      body: t("1 000 € par an pour aller tester l'appli dans le monde réel. C'est une dépense professionnelle."),
      tape: "cream" as const,
    },
    {
      icon: <Laptop size={24} />,
      title: t("Full remote ou bureau Paris"),
      body: t("On fait confiance. Tu travailles d'où tu veux, avec un Mac offert le premier jour."),
      tape: "blue" as const,
    },
    {
      icon: <Coffee size={24} />,
      title: t("Semaine de 4 jours"),
      body: t("Le vendredi est off. Pour voyager, photographier, ou dormir. On ne juge pas."),
      tape: "cream" as const,
    },
    {
      icon: <Heart size={24} />,
      title: t("Mutuelle 100 %"),
      body: t("Alan prise en charge intégralement, famille incluse."),
      tape: "red" as const,
    },
    {
      icon: <BookOpen size={24} />,
      title: t("Budget formation"),
      body: t("500 € / an pour des livres, conférences ou cours en ligne. Sans justification."),
      tape: "cream" as const,
    },
    {
      icon: <Globe2 size={24} />,
      title: t("Premium à vie"),
      body: t("Tu utilises l'appli. Vraiment. Avec toutes les fonctionnalités, pour toujours."),
      tape: "blue" as const,
    },
  ];

  const filtered = jobs.filter((j) => {
    const byTeam = teamFilter === "Tous" || j.team === teamFilter;
    const byLoc = locFilter === "Toutes" || j.location === locFilter;
    return byTeam && byLoc;
  });

  return (
    <>
      <PageHero
        eyebrow={t("rejoins l'aventure")}
        title={t("On cherche des")}
        highlight={t("voyageurs curieux.")}
        sub={t("Nous construisons l'appli que nous aurions voulu avoir à Lisbonne. Si tu t'es déjà dit « il manque quelque chose » en voyage, tu es au bon endroit.")}
        stamp={`ON\nRECRUTE\n★ TMP`}
      />

      {/* ── Jobs section ── */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-col md:flex-row md:items-end gap-8 mb-10">
          <SectionHeading
            eyebrow={t("postes ouverts")}
            title={t("Nos offres")}
            highlight={t("du moment.")}
            sub={`${jobs.length} postes ouverts · CDI · Partout dans le monde`}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-widest text-ink-faded">
              {t("Équipe :")}
            </span>
            {ALL_TEAMS.map((team) => (
              <Chip
                key={team}
                color={teamFilter === team ? "ink" : "gold"}
                variant={teamFilter === team ? "filled" : "outline"}
                size="sm"
                onClick={() => setTeamFilter(team)}
              >
                {team}
              </Chip>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-2 md:mt-0">
            <span className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-widest text-ink-faded">
              {t("Lieu :")}
            </span>
            {ALL_LOCS.map((loc) => (
              <Chip
                key={loc}
                color={locFilter === loc ? "ink" : "blue"}
                variant={locFilter === loc ? "filled" : "outline"}
                size="sm"
                onClick={() => setLocFilter(loc)}
              >
                {loc}
              </Chip>
            ))}
          </div>
        </div>

        {/* Job list */}
        {filtered.length === 0 ? (
          <PaperCard shadow="soft" className="p-10 text-center">
            <div className="text-5xl mb-3">📷</div>
            <p className="font-[family-name:var(--font-serif)] text-ink-faded">
              {t("Aucun poste ne correspond à ces filtres pour l'instant.")}
            </p>
            <button
              onClick={() => { setTeamFilter("Tous"); setLocFilter("Toutes"); }}
              className="mt-4 font-[family-name:var(--font-serif)] text-gold-deep hover:underline cursor-pointer"
            >
              {t("Réinitialiser les filtres")}
            </button>
          </PaperCard>
        ) : (
          <div className="space-y-4">
            {filtered.map((job, i) => (
              <Link key={job.slug} href={`/careers/${job.slug}`}>
                <PaperCard
                  shadow="soft"
                  tilt={0}
                  className="p-5 hover:shadow-ink transition-all group relative overflow-visible"
                >
                  {/* Tape accent on first item */}
                  {i === 0 && (
                    <div className="absolute -top-2.5 left-10">
                      <Tape color="cream" width={44} height={18} rotate={-5} />
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge tone={TEAM_TONE[job.team] ?? "neutral"} dot>
                          {job.team}
                        </Badge>
                        <Badge tone="neutral">{job.type}</Badge>
                      </div>
                      <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg tracking-tight group-hover:text-gold-deep transition">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-ink-faded">
                        <MapPin size={13} />
                        <span className="font-[family-name:var(--font-type)] text-[12px]">
                          {job.location}
                        </span>
                      </div>
                    </div>
                    {/* Arrow */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-[family-name:var(--font-serif)] text-[13px] text-gold-deep font-semibold hidden sm:block">
                        {t("Voir l'offre")}
                      </span>
                      <ArrowRight
                        size={18}
                        className="text-gold-deep group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </PaperCard>
              </Link>
            ))}
          </div>
        )}

        {/* Open application note */}
        <PaperCard shadow="gold" tilt={-1} className="p-6 mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="shrink-0">
            <Stamp color="gold" size={68} fontSize={8} rotate={-8}>
              {`CANDI\nDAT.\nLIBRE`}
            </Stamp>
          </div>
          <div>
            <h4 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-1">
              {t("Tu ne trouves pas le bon poste ?")}
            </h4>
            <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[15px]">
              {t("Envoie-nous une candidature spontanée à")}{" "}
              <span className="text-gold-deep font-semibold">jobs@takemepic.com</span>. {t("On lit tout.")}
            </p>
          </div>
        </PaperCard>
      </section>

      {/* ── Pourquoi nous rejoindre ── */}
      <section className="bg-paper-warm border-y-[1.5px] border-[var(--ink-line)] py-16">
        <div className="mx-auto max-w-7xl px-5">
          <SectionHeading
            eyebrow={t("pourquoi nous rejoindre")}
            title={t("Travailler chez TMP,")}
            highlight={t("c'est quoi ?")}
            sub={t("Des avantages concrets, pas du baby-foot. On préfère t'envoyer en voyage.")}
            center
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {PERKS.map((perk, i) => (
              <PaperCard
                key={perk.title}
                shadow="soft"
                tilt={i % 2 === 0 ? -1 : 1}
                className="p-6 relative"
              >
                <div className="absolute -top-2.5 left-6">
                  <Tape color={perk.tape} width={44} height={18} rotate={i % 2 === 0 ? -4 : 4} />
                </div>
                <div className="text-gold-deep mb-3">{perk.icon}</div>
                <h4 className="font-[family-name:var(--font-serif)] font-bold text-[16px] mb-2">
                  {perk.title}
                </h4>
                <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[14px] leading-relaxed">
                  {perk.body}
                </p>
              </PaperCard>
            ))}
          </div>
        </div>
      </section>

      {/* Values nod */}
      <section className="mx-auto max-w-7xl px-5 py-12 text-center">
        <div className="font-[family-name:var(--font-hand)] text-2xl text-gold-deep -rotate-1 mb-2">
          {t("envie d'en savoir plus sur nous ?")}
        </div>
        <div className="flex flex-wrap gap-4 justify-center mt-4">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 font-[family-name:var(--font-serif)] font-semibold border-[1.5px] border-ink rounded-[4px] px-5 py-2.5 hover:bg-card transition"
          >
            <Briefcase size={15} /> {t("À propos de TMP")}
          </Link>
          <Link
            href="/about/values"
            className="inline-flex items-center gap-2 font-[family-name:var(--font-serif)] font-semibold border-[1.5px] border-dashed border-gold-deep text-gold-deep rounded-[4px] px-5 py-2.5 hover:bg-gold-light/10 transition"
          >
            <Heart size={15} /> {t("Nos valeurs")}
          </Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
