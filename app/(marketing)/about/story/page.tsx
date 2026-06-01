"use client";

import { PaperCard, Stamp, Tape } from "@/components/ui";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import { useT } from "@/i18n/I18nProvider";

interface TimelineEvent {
  year: string;
  month?: string;
  title: string;
  body: string;
  stamp?: { text: string; color: "red" | "blue" | "green" | "gold" | "ink" };
  tapeColor?: "cream" | "red" | "blue";
}

function getTimeline(t: (key: string) => string): TimelineEvent[] {
  return [
    {
      year: "2025",
      month: t("Janvier"),
      title: t("La galère à Lisbonne"),
      body: t(
        "Claire et Léo rentrent de Lisbonne avec 300 photos d'Airbnb… et zéro souvenir d'eux-mêmes. « On était bien là, on le jure. » C'est de cette frustration universelle que naît l'idée."
      ),
      stamp: { text: `GENÈSE\n★\nJAN 25`, color: "red" },
      tapeColor: "cream",
    },
    {
      year: "2025",
      month: t("Mars"),
      title: t("Les premiers croquis"),
      body: t(
        "Sami rejoint l'aventure et dessine les premières maquettes sur des carnets de voyage. L'esthétique « polaroid et timbres postaux » s'impose naturellement comme signature visuelle."
      ),
      tapeColor: "blue",
    },
    {
      year: "2025",
      month: t("Juin"),
      title: t("Bêta fermée, Paris"),
      body: t(
        "200 testeurs, 14 arrondissements, 3 semaines de chaos organisé. Résultat : 4,6 étoiles de satisfaction et une conviction que le concept fonctionne. L'équipe fête ça avec du champagne et des macarons."
      ),
      stamp: { text: `BÊTA\n★★★`, color: "gold" },
      tapeColor: "cream",
    },
    {
      year: "2026",
      month: t("Janvier"),
      title: t("🚀 Lancement sur l'App Store"),
      body: t(
        "Disponible en France, au Portugal et en Espagne. 10 000 téléchargements la première semaine. Les médias parlent de « l'appli qui met fin aux selfies ratés ». On ne dort plus, mais on sourit."
      ),
      stamp: { text: `LANCÉ\n10 JAN\n2026`, color: "red" },
      tapeColor: "red",
    },
    {
      year: "2026",
      month: t("Avril"),
      title: t("1 million de photos 📸"),
      body: t(
        "Un million de photos prises entre voyageurs à travers le monde. Une étape symbolique célébrée avec la communauté lors d'un live Instagram depuis le Pont des Arts."
      ),
      stamp: { text: `1M\nPHOTOS\n★`, color: "green" },
      tapeColor: "cream",
    },
    {
      year: "2026",
      month: t("Mai"),
      title: t("Tour de table de 8 M€"),
      body: t(
        "Un tour de table mené par des investisseurs européens passionnés de voyage. Objectif : étendre la communauté à 20 nouvelles villes d'ici fin 2026 et lancer la version Android."
      ),
      stamp: { text: `8M€\nSEED\n★ TMP`, color: "blue" },
      tapeColor: "blue",
    },
  ];
}

export default function StoryPage() {
  const t = useT();
  const TIMELINE = getTimeline(t);

  return (
    <>
      <PageHero
        eyebrow={t("chapitre par chapitre")}
        title={t("Notre histoire,")}
        highlight={t("de l'idée à l'appli.")}
        sub={t("Du carnet de voyage griffonné à Lisbonne jusqu'au premier million de photos — les étapes clés de Take Me Pic.")}
        stamp={`TIMELINE\n★\nTMP`}
      />

      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[var(--ink-line)] to-transparent md:-translate-x-px" />

          <div className="space-y-16">
            {TIMELINE.map((ev, i) => {
              const isRight = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`relative flex flex-col md:flex-row gap-8 items-start ${
                    isRight ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Year dot */}
                  <div className="absolute left-0 md:left-1/2 top-6 w-14 h-14 -translate-x-1/2 hidden md:flex items-center justify-center bg-card border-[2px] border-ink rounded-full shadow-ink-sm z-10">
                    <span className="font-[family-name:var(--font-type)] text-[11px] font-bold tracking-wider text-ink">
                      {ev.year}
                    </span>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="hidden md:block flex-1" />

                  {/* Card */}
                  <div className={`flex-1 relative ${isRight ? "md:pr-10" : "md:pl-10"}`}>
                    {/* Mobile year badge */}
                    <div className="flex items-center gap-3 mb-3 md:hidden">
                      <div className="w-10 h-10 flex items-center justify-center bg-card border-[1.5px] border-ink rounded-full shadow-ink-sm shrink-0 ml-8">
                        <span className="font-[family-name:var(--font-type)] text-[9px] font-bold">
                          {ev.year}
                        </span>
                      </div>
                    </div>

                    <PaperCard
                      shadow="soft"
                      tilt={i % 3 === 0 ? -1 : i % 3 === 1 ? 1 : 0}
                      className="p-6 relative overflow-visible ml-10 md:ml-0"
                    >
                      {/* Tape accent */}
                      {ev.tapeColor && (
                        <div className="absolute -top-3 left-6">
                          <Tape
                            color={ev.tapeColor}
                            width={48}
                            height={20}
                            rotate={i % 2 === 0 ? -5 : 5}
                          />
                        </div>
                      )}

                      {/* Stamp */}
                      {ev.stamp && (
                        <div className="absolute -right-4 -top-4 z-10">
                          <Stamp
                            color={ev.stamp.color}
                            size={72}
                            fontSize={9}
                            rotate={i % 2 === 0 ? 12 : -10}
                          >
                            {ev.stamp.text}
                          </Stamp>
                        </div>
                      )}

                      {/* Month */}
                      {ev.month && (
                        <div className="font-[family-name:var(--font-hand)] text-xl text-gold-deep -rotate-1 mb-1">
                          {ev.month} {ev.year}
                        </div>
                      )}

                      <h3 className="font-[family-name:var(--font-serif)] font-bold text-xl tracking-tight mb-3">
                        {ev.title}
                      </h3>
                      <p className="font-[family-name:var(--font-serif)] text-ink-faded leading-relaxed text-[15px]">
                        {ev.body}
                      </p>
                    </PaperCard>
                  </div>
                </div>
              );
            })}
          </div>

          {/* End marker */}
          <div className="relative flex justify-center mt-16">
            <div className="bg-paper-warm border-[2px] border-ink rounded-full px-6 py-3 shadow-ink-sm text-center">
              <div className="font-[family-name:var(--font-hand)] text-2xl text-gold-deep">
                {t("et la suite…")}
              </div>
              <div className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-wider text-ink-faded mt-0.5">
                {t("on écrit encore")}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
