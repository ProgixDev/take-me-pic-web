"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Stamp } from "@/components/ui";
import { useT } from "@/i18n/I18nProvider";

/** Hero band used at the top of most marketing sub-pages. */
export function PageHero({
  eyebrow,
  title,
  highlight,
  sub,
  stamp,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  sub?: string;
  stamp?: string;
}) {
  return (
    <section className="relative paper bg-paper-warm border-b-[1.5px] border-[var(--ink-line)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-20 relative">
        {stamp && (
          <div className="hidden md:block absolute right-8 top-12">
            <Stamp color="red" size={120} fontSize={11} rotate={-10}>{stamp}</Stamp>
          </div>
        )}
        {eyebrow && (
          <div className="font-[family-name:var(--font-hand)] text-2xl text-gold-deep -rotate-2 mb-1">
            {eyebrow}
          </div>
        )}
        <h1 className="font-[family-name:var(--font-serif)] font-bold text-[clamp(36px,6vw,64px)] tracking-[-0.03em] leading-[0.98] max-w-3xl">
          {title} {highlight && <span className="squiggle">{highlight}</span>}
        </h1>
        {sub && (
          <p className="font-[family-name:var(--font-serif)] text-lg text-ink-faded mt-5 max-w-2xl leading-relaxed">
            {sub}
          </p>
        )}
      </div>
    </section>
  );
}

/** Simple breadcrumb trail. */
export function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav className="flex items-center gap-1.5 font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.1em] text-ink-faded flex-wrap">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {it.href ? (
            <Link href={it.href} className="hover:text-ink transition">
              {it.label}
            </Link>
          ) : (
            <span className="text-ink">{it.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight size={12} className="opacity-50" />}
        </span>
      ))}
    </nav>
  );
}

/** Big call-to-action band reused at the bottom of marketing pages. */
export function CtaBand() {
  const t = useT();
  return (
    <section className="mx-auto max-w-7xl px-5 my-24">
      <div className="relative bg-ink text-paper-warm rounded-[8px] paper paper-dark overflow-hidden px-8 py-14 md:px-16 md:py-20 text-center shadow-gold">
        <div className="absolute right-8 top-8 hidden md:block">
          <Stamp color="gold" size={92} fontSize={9} rotate={8}>{t("PRÊT ?\n★\nEN ROUTE")}</Stamp>
        </div>
        <div className="font-[family-name:var(--font-hand)] text-2xl text-gold-light -rotate-1">
          {t("alors, on y va ?")}
        </div>
        <h2 className="font-[family-name:var(--font-serif)] font-bold text-[clamp(30px,5vw,52px)] tracking-[-0.02em] leading-tight mt-2 max-w-2xl mx-auto">
          {t("Ta prochaine belle photo t'attend dehors.")}
        </h2>
        <p className="font-[family-name:var(--font-serif)] text-paper-warm/70 mt-4 max-w-lg mx-auto">
          {t("Rejoins des milliers de voyageurs qui se prennent en photo, partout dans le monde.")}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/download"
            className="inline-flex items-center justify-center h-[52px] px-7 rounded-[4px] bg-gradient-to-b from-gold-light to-gold-deep text-ink font-[family-name:var(--font-serif)] font-semibold border-t border-white/40 hover:brightness-105 transition"
          >
            {t("télécharger l'app")}
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center justify-center h-[52px] px-7 rounded-[4px] border-[1.5px] border-dashed border-paper-warm/40 text-paper-warm font-[family-name:var(--font-serif)] font-semibold hover:bg-white/5 transition"
          >
            {t("comment ça marche")}
          </Link>
        </div>
      </div>
    </section>
  );
}
