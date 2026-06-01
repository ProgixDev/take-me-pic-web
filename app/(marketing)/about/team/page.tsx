"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Polaroid, Tape, Stamp, PaperCard } from "@/components/ui";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import { team } from "@/lib/data";
import { useT } from "@/i18n/I18nProvider";

const TILTS = [-3, 2, -2, 4, -1, 3, -3, 2, -1, 4];
const TAPE_COLORS: ("cream" | "red" | "blue")[] = [
  "cream",
  "blue",
  "cream",
  "red",
  "cream",
  "blue",
];

// Extended roles / blurb for a richer page — keys are resolved at render time via t()
const BLURB_KEYS: Record<string, string> = {
  "Claire Bernard":
    "Architecte de la vision. Ex-Airbnb, obsédée par l'UX des voyageurs.",
  "Léo Margaux":
    "Bâtit la stack depuis zéro. Aime le café long et les requêtes SQL courtes.",
  "Inès Rahmouni":
    "Transforme des inconnus en communauté. 5 langues, 20 pays.",
  "Sami Belkacem":
    "Carnet de croquis toujours ouvert. Signe l'esthétique polaroid de l'appli.",
  "Marc Olivier":
    "Croissance organique & partenariats. Ancien chef de projet chez Booking.",
  "Yasmine Karam":
    "Garde la communauté sûre et bienveillante, 24h/24.",
};

export default function TeamPage() {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow={t("les gens derrière l'appli")}
        title={t("Une équipe de")}
        highlight={t("vrais voyageurs.")}
        sub={t("Nous ne gérons pas une appli depuis un bureau. On la teste dans les ruelles de Lisbonne, sur les toits de Paris, au coucher de soleil à Marrakech.")}
        stamp={`${t("ÉQUIPE")}\n★ TMP`}
      />

      <section className="mx-auto max-w-7xl px-5 py-16">
        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-x-8 gap-y-14">
          {team.map((member, i) => {
            const tilt = TILTS[i % TILTS.length];
            const tape = TAPE_COLORS[i % TAPE_COLORS.length];
            const blurb = t(BLURB_KEYS[member.name] ?? "Passionné·e de voyage et de photo.");
            return (
              <div
                key={member.name}
                className="flex flex-col items-center gap-3 group"
              >
                <div className="relative">
                  <Polaroid
                    src={member.avatar}
                    caption={member.name.split(" ")[0]}
                    width={200}
                    height={200}
                    tilt={tilt}
                    captionSize={18}
                    className="transition-transform duration-300 group-hover:rotate-0"
                  />
                  {/* Tape corner */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <Tape
                      color={tape}
                      width={52}
                      height={18}
                      rotate={tilt * -1.2}
                    />
                  </div>
                  {/* Index stamp for founders */}
                  {i < 2 && (
                    <div className="absolute -bottom-2 -right-3 z-10">
                      <Stamp
                        color={i === 0 ? "red" : "blue"}
                        size={52}
                        fontSize={8}
                        rotate={i === 0 ? 10 : -12}
                      >
                        {i === 0 ? `${t("CO")}\n${t("FOND.")}` : `CTO\n★`}
                      </Stamp>
                    </div>
                  )}
                </div>

                <PaperCard
                  shadow="soft"
                  border
                  className="w-full max-w-[220px] p-4 text-center"
                >
                  <div className="font-[family-name:var(--font-serif)] font-bold text-[16px] leading-tight">
                    {member.name}
                  </div>
                  <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-wider text-gold-deep mt-1">
                    {member.role}
                  </div>
                  <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[13px] leading-snug mt-2 italic">
                    {blurb}
                  </p>
                </PaperCard>
              </div>
            );
          })}
        </div>

        {/* On recrute CTA */}
        <div className="mt-20 text-center">
          <div className="inline-block relative">
            <PaperCard shadow="gold" tilt={-1} className="px-10 py-10 max-w-lg mx-auto">
              <div className="absolute -top-4 right-6">
                <Stamp color="green" size={68} fontSize={8} rotate={12}>
                  {`${t("ON")}\n${t("RECRUTE")}\n!`}
                </Stamp>
              </div>
              <div className="font-[family-name:var(--font-hand)] text-3xl text-gold-deep -rotate-1 mb-2">
                {t("on recrute !")}
              </div>
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-2xl tracking-tight mb-3">
                {t("Rejoins l'aventure TMP.")}
              </h3>
              <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[15px] leading-relaxed mb-6">
                {t("On cherche des gens passionnés, curieux, qui ont déjà perdu leur appareil photo dans un souk. Viens construire avec nous.")}
              </p>
              <Link
                href="/careers"
                className="inline-flex items-center gap-2 bg-ink text-paper-warm font-[family-name:var(--font-serif)] font-semibold px-6 py-3 rounded-[4px] hover:brightness-110 transition"
              >
                {t("Voir les offres")} <ArrowRight size={16} />
              </Link>
            </PaperCard>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
