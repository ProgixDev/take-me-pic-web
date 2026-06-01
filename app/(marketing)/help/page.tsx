"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, BookOpen, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { PageHero } from "@/components/marketing/MarketingBits";
import { PaperCard, Input, Stamp, Chip, Badge, SectionHeading } from "@/components/ui";
import { helpArticles, helpCategories } from "@/lib/data";
import { useT } from "@/i18n/I18nProvider";

const POPULAR_SLUGS = [
  "creer-compte",
  "trouver-photographe",
  "gerer-karma",
  "confidentialite-gps",
  "abonnement-premium",
  "mode-famille",
];

export default function HelpPage() {
  const t = useT();
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? helpArticles.filter((a) =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const popular = POPULAR_SLUGS.map((s) => helpArticles.find((a) => a.slug === s)).filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow={t("besoin d'aide ?")}
        title={t("Centre d'aide")}
        highlight="Take Me Pic"
        sub={t("Trouvez des réponses, explorez les guides et prenez la route sans inquiétude.")}
        stamp={t("SUPPORT\n★\n24/7")}
      />

      {/* Search bar */}
      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="max-w-2xl mx-auto mb-14">
          <PaperCard shadow="ink" className="p-6">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faded pointer-events-none"
                style={{ top: "calc(50% + 4px)" }}
              />
              <Input
                label={t("Rechercher dans l'aide")}
                placeholder={t("Ex : karma, photo, abonnement…")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Live search results */}
            {query.trim() && (
              <div className="mt-2 border-t-[1.5px] border-[var(--ink-line)] pt-3">
                {filtered.length === 0 ? (
                  <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-sm py-2 text-center">
                    {t("Aucun résultat pour « {{query}} »", { query })}
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {filtered.map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={`/help/article/${a.slug}`}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-[4px] hover:bg-paper-warm transition group"
                        >
                          <BookOpen size={14} className="text-gold-deep shrink-0" />
                          <span className="flex-1 font-[family-name:var(--font-serif)] text-[14px] text-ink group-hover:text-gold-deep transition">
                            {a.title}
                          </span>
                          <Chip color="gold" variant="outline" size="sm">
                            {a.category}
                          </Chip>
                          <ChevronRight size={14} className="text-ink-faded group-hover:translate-x-0.5 transition" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </PaperCard>
        </div>

        {/* Category Cards */}
        <SectionHeading
          eyebrow={t("par thème")}
          title={t("Choisissez une catégorie")}
          sub={t("Chaque rubrique rassemble les articles les plus utiles.")}
          className="mb-8"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16 stagger">
          {helpCategories.map((cat, i) => {
            const tilts = [-1, 1, -0.5, 0.8];
            return (
              <Link key={cat.slug} href={`/help/${cat.slug}`} className="group block">
                <PaperCard
                  shadow="soft"
                  tilt={tilts[i % tilts.length]}
                  className="p-6 hover:shadow-ink transition-all duration-200 group-hover:-translate-y-1"
                >
                  <div className="text-4xl mb-3">{cat.emoji}</div>
                  <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg text-ink mb-1 group-hover:text-gold-deep transition">
                    {cat.title}
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    <Badge tone="neutral">{t("{{count}} articles", { count: cat.count })}</Badge>
                    <ArrowRight
                      size={16}
                      className="text-ink-faded group-hover:text-gold-deep group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </PaperCard>
              </Link>
            );
          })}
        </div>

        {/* Popular Articles */}
        <div className="mb-16">
          <div className="flex items-start justify-between mb-8">
            <SectionHeading
              eyebrow={t("les plus consultés")}
              title={t("Articles populaires")}
              highlight={t("ce mois")}
            />
            <div className="hidden md:block">
              <Stamp color="gold" shape="rect" fontSize={9} rotate={3} size={80}>
                {t("✦ TOP\nARTICLES")}
              </Stamp>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
            {popular.map((article, idx) => {
              if (!article) return null;
              const toneMap: Array<"neutral" | "gold" | "blue" | "green"> = [
                "gold", "blue", "green", "neutral", "gold", "blue",
              ];
              return (
                <Link
                  key={article.slug}
                  href={`/help/article/${article.slug}`}
                  className="group block"
                >
                  <PaperCard
                    shadow="soft"
                    className="p-5 flex items-start gap-4 hover:shadow-gold transition-all duration-200"
                  >
                    <div className="w-9 h-9 rounded-full bg-paper-warm border-[1.5px] border-[var(--ink-line)] flex items-center justify-center font-[family-name:var(--font-type)] text-[11px] text-ink-faded shrink-0 mt-0.5">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-[family-name:var(--font-serif)] font-semibold text-[15px] text-ink group-hover:text-gold-deep transition mb-1 leading-snug">
                        {article.title}
                      </h4>
                      <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] leading-snug line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="mt-2.5">
                        <Chip color="gold" variant="outline" size="sm">
                          {article.category}
                        </Chip>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className="text-ink-faded shrink-0 group-hover:text-gold-deep group-hover:translate-x-0.5 transition-all mt-1"
                    />
                  </PaperCard>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Contact Teaser */}
        <div className="max-w-2xl mx-auto">
          <PaperCard shadow="gold" className="p-8 text-center">
            <div className="text-3xl mb-3">✉️</div>
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-xl text-ink mb-2">
              {t("Vous n'avez pas trouvé votre réponse ?")}
            </h3>
            <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-sm mb-5">
              {t("Notre équipe est là pour vous aider — en français, bien sûr.")}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-[family-name:var(--font-serif)] font-semibold text-[15px] text-gold-deep hover:text-ink transition"
            >
              <Sparkles size={16} />
              {t("Contacter le support")}
              <ArrowRight size={16} />
            </Link>
          </PaperCard>
        </div>
      </div>
    </>
  );
}
