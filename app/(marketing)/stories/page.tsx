"use client";

import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import { PaperCard, Polaroid, Stamp, Tape, SectionHeading } from "@/components/ui";
import { stories } from "@/lib/data";
import { useT } from "@/i18n/I18nProvider";

const TILT_MAP = [-2, 1, -1, 2];
const STAMP_COLORS: Array<"red" | "blue" | "green" | "gold"> = ["red", "blue", "green", "gold"];

export default function StoriesPage() {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow={t("ils l'ont vécu")}
        title={t("Leurs histoires,")}
        highlight={t("vos souvenirs")}
        sub={t("Des voyageurs du monde entier partagent comment Take Me Pic a changé leur façon de voyager.")}
        stamp={t("VRAIS\nVOYAGEURS\n★")}
      />

      {/* Intro band */}
      <div className="mx-auto max-w-7xl px-5 pt-12 pb-4">
        <div className="flex items-start gap-6">
          <div className="hidden md:block shrink-0 mt-1">
            <Stamp color="blue" size={64} fontSize={8} rotate={-6}>{t("TÉMOINS\n★")}</Stamp>
          </div>
          <p className="font-[family-name:var(--font-serif)] text-[18px] text-ink-faded italic leading-[1.7] max-w-2xl">
            {t("Ce ne sont pas des acteurs. Ce ne sont pas des influenceurs. Ce sont des gens ordinaires qui voulaient juste avoir de vraies photos d'eux en voyage — et qui ont trouvé bien plus que ça.")}
          </p>
        </div>
      </div>

      {/* Stories grid */}
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid md:grid-cols-2 gap-10 stagger">
          {stories.map((story, i) => (
            <Link key={story.slug} href={`/stories/${story.slug}`} className="block group">
              <PaperCard
                shadow={i % 2 === 0 ? "gold" : "ink"}
                tilt={TILT_MAP[i % TILT_MAP.length]}
                className="overflow-visible hover:shadow-gold transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="grid sm:grid-cols-[180px_1fr]">
                  {/* Polaroid avatar side */}
                  <div className="relative flex items-center justify-center p-6 pb-2 sm:pb-6 bg-paper-warm">
                    {/* Tape holding the polaroid */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <Tape color="cream" width={50} rotate={-2} />
                    </div>
                    <Polaroid
                      src={story.avatar}
                      caption={story.name}
                      width={140}
                      height={140}
                      tilt={-2}
                      captionSize={17}
                    />
                    {/* City stamp */}
                    <div className="absolute -bottom-3 -right-2 sm:-right-4">
                      <Stamp
                        color={STAMP_COLORS[i % STAMP_COLORS.length]}
                        size={56}
                        fontSize={8}
                        rotate={i % 2 === 0 ? -8 : 6}
                      >
                        {story.city.toUpperCase()}
                      </Stamp>
                    </div>
                  </div>

                  {/* Content side */}
                  <div className="p-6 flex flex-col justify-between bg-card">
                    <div>
                      <div className="flex items-start gap-2 mb-3">
                        <Quote size={18} className="text-gold-deep shrink-0 mt-1" />
                        <p className="font-[family-name:var(--font-serif)] italic text-[17px] leading-[1.6] text-ink">
                          {story.quote}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-dashed border-[var(--ink-line)]">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-[family-name:var(--font-serif)] font-bold text-[16px]">
                            {story.name}
                          </div>
                          <div className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded uppercase tracking-widest mt-0.5">
                            {story.city}
                          </div>
                        </div>
                        <span className="flex items-center gap-1.5 font-[family-name:var(--font-serif)] text-sm font-semibold text-gold-deep group-hover:gap-2.5 transition-all">
                          {t("lire")} <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </PaperCard>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats band */}
      <div className="mx-auto max-w-7xl px-5 py-10">
        <div className="relative bg-paper-warm border-[1.5px] border-ink rounded-[4px] shadow-ink p-10 overflow-hidden">
          <div className="absolute right-6 top-6 hidden md:block">
            <Stamp color="red" size={72} fontSize={9} rotate={10}>{t("VRAI\n★\nTMP")}</Stamp>
          </div>
          <div className="absolute left-4 bottom-4 hidden lg:block opacity-50">
            <Tape color="red" width={80} rotate={-30} />
          </div>

          <SectionHeading
            eyebrow={t("en chiffres")}
            title={t("Une communauté qui grandit")}
            sub={t("Ce ne sont pas des témoignages isolés. C'est un mouvement.")}
            center
          />

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center stagger">
            {[
              { num: "+48 000", label: t("voyageurs actifs"), sub: t("dans le monde") },
              { num: "142 300", label: t("photos échangées"), sub: t("depuis le lancement") },
              { num: "4,9 ★", label: t("note moyenne"), sub: t("sur l'App Store") },
              { num: "42 pays", label: t("représentés"), sub: t("et ça grandit") },
            ].map((stat) => (
              <div key={stat.label} className="py-4">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[clamp(28px,4vw,40px)] tracking-tight text-ink">
                  {stat.num}
                </div>
                <div className="font-[family-name:var(--font-serif)] font-semibold text-sm mt-1 text-ink">
                  {stat.label}
                </div>
                <div className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded mt-0.5 uppercase tracking-widest">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CtaBand />
    </>
  );
}
