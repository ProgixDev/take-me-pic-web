"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, BookOpen, ArrowLeft } from "lucide-react";
import { PageHero, Breadcrumb } from "@/components/marketing/MarketingBits";
import { PaperCard, Chip, Badge, Stamp, SectionHeading } from "@/components/ui";
import { helpCategories, helpArticles } from "@/lib/data";
import { useT } from "@/i18n/I18nProvider";

export default function HelpCategoryPage() {
  const t = useT();
  const { category } = useParams<{ category: string }>();

  const cat = helpCategories.find((c) => c.slug === category);
  const title = cat?.title ?? t("Articles d'aide");
  const emoji = cat?.emoji ?? "📖";

  // Filter articles by matching category title, or show all if no match
  const CATEGORY_MAP: Record<string, string> = {
    "getting-started": "Démarrer",
    account: "Compte",
    safety: "Sécurité",
    payments: "Paiements",
  };
  const catLabel = CATEGORY_MAP[category] ?? "";
  const articles = catLabel
    ? helpArticles.filter((a) => a.category === catLabel)
    : helpArticles;

  const relatedCats = helpCategories.filter((c) => c.slug !== category);

  return (
    <>
      <PageHero
        eyebrow={emoji + " " + title}
        title={title}
        highlight={t("— guides & conseils")}
        sub={t("Tous les articles pour cette rubrique, organisés pour vous aider rapidement.")}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb
            items={[
              { href: "/", label: t("Accueil") },
              { href: "/help", label: t("Centre d'aide") },
              { label: title },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main article list */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <SectionHeading
                eyebrow={t("dans cette rubrique")}
                title={articles.length + " article" + (articles.length > 1 ? "s" : "")}
              />
              <Badge tone="gold" dot>
                {title}
              </Badge>
            </div>

            {articles.length === 0 ? (
              <PaperCard shadow="soft" className="p-10 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-[family-name:var(--font-serif)] italic text-ink-faded">
                  {t("Aucun article dans cette rubrique pour l'instant.")}
                </p>
                <Link
                  href="/help"
                  className="inline-flex items-center gap-2 mt-4 font-[family-name:var(--font-serif)] font-semibold text-gold-deep hover:text-ink transition"
                >
                  <ArrowLeft size={14} />
                  {t("Retour au centre d'aide")}
                </Link>
              </PaperCard>
            ) : (
              <div className="space-y-3 stagger">
                {articles.map((article, idx) => {
                  const tilts = [0, 0.3, -0.3, 0.5, -0.5];
                  return (
                    <Link
                      key={article.slug}
                      href={`/help/article/${article.slug}`}
                      className="group block"
                    >
                      <PaperCard
                        shadow="soft"
                        tilt={tilts[idx % tilts.length]}
                        className="p-5 flex items-start gap-4 hover:shadow-ink transition-all duration-200"
                      >
                        {/* Number badge */}
                        <div className="w-8 h-8 rounded-full bg-paper-warm border-[1.5px] border-[var(--ink-line)] flex items-center justify-center font-[family-name:var(--font-type)] text-[10px] text-ink-faded shrink-0 mt-0.5">
                          {String(idx + 1).padStart(2, "0")}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 mb-1">
                            <BookOpen size={14} className="text-gold-deep shrink-0 mt-0.5" />
                            <h3 className="font-[family-name:var(--font-serif)] font-semibold text-[15px] text-ink group-hover:text-gold-deep transition leading-snug">
                              {article.title}
                            </h3>
                          </div>
                          <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] leading-snug ml-5">
                            {article.excerpt}
                          </p>
                          <div className="mt-2.5 ml-5">
                            <Chip color="gold" variant="dashed" size="sm">
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
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Stamp decoration */}
            <div className="flex justify-center py-4">
              <Stamp color="blue" shape="octagon" size={90} fontSize={9} rotate={5}>
                {`${emoji}\n${title}\n★`}
              </Stamp>
            </div>

            {/* Other categories */}
            <PaperCard shadow="soft" className="p-5">
              <h4 className="font-[family-name:var(--font-hand)] text-lg text-gold-deep mb-4">
                {t("Autres rubriques")}
              </h4>
              <ul className="space-y-2">
                {relatedCats.map((rc) => (
                  <li key={rc.slug}>
                    <Link
                      href={`/help/${rc.slug}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-[4px] hover:bg-paper-warm transition group"
                    >
                      <span className="text-lg">{rc.emoji}</span>
                      <span className="flex-1 font-[family-name:var(--font-serif)] text-[14px] text-ink group-hover:text-gold-deep transition">
                        {rc.title}
                      </span>
                      <Badge tone="neutral">{rc.count}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </PaperCard>

            {/* Back link */}
            <PaperCard shadow="none" border className="p-5">
              <Link
                href="/help"
                className="flex items-center gap-2 font-[family-name:var(--font-serif)] font-semibold text-[14px] text-ink-faded hover:text-ink transition group"
              >
                <ArrowLeft
                  size={16}
                  className="group-hover:-translate-x-0.5 transition-transform"
                />
                {t("Retour au centre d'aide")}
              </Link>
            </PaperCard>

            {/* Contact block */}
            <PaperCard shadow="gold" className="p-5 text-center">
              <div className="text-2xl mb-2">💬</div>
              <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded mb-3">
                {t("Vous n'avez pas trouvé votre réponse ?")}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 font-[family-name:var(--font-serif)] font-semibold text-[13px] text-gold-deep hover:text-ink transition"
              >
                {t("Nous contacter")}
                <ChevronRight size={13} />
              </Link>
            </PaperCard>
          </aside>
        </div>
      </div>
    </>
  );
}
