"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, User, ArrowRight, BookOpen } from "lucide-react";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import { PaperCard, Chip, Badge, Stamp, Tape, SectionHeading } from "@/components/ui";
import { blogPosts } from "@/lib/data";
import { useT } from "@/i18n/I18nProvider";

const CATEGORY_COLORS: Record<string, "ink" | "gold" | "red" | "blue" | "green"> = {
  Histoire: "red",
  Spots: "green",
  Technique: "blue",
  Voyage: "gold",
  Produit: "ink",
  Sécurité: "red",
  Itinéraire: "blue",
};

const BADGE_TONES: Record<string, "neutral" | "green" | "red" | "blue" | "gold" | "sunset"> = {
  Histoire: "red",
  Spots: "green",
  Technique: "blue",
  Voyage: "gold",
  Produit: "neutral",
  Sécurité: "red",
  Itinéraire: "blue",
};

export default function BlogPage() {
  const t = useT();
  const categories = ["Tout", ...Array.from(new Set(blogPosts.map((p) => p.category)))];
  const [activeCategory, setActiveCategory] = useState("Tout");

  const filtered =
    activeCategory === "Tout"
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <PageHero
        eyebrow={t("nos histoires")}
        title={t("Le carnet")}
        highlight={t("de voyage")}
        sub={t("Conseils photo, spots secrets, récits de communauté — tout ce qui alimente votre envie de partir.")}
        stamp={t("LE\nCARNET\n★")}
      />

      {/* Category Filter */}
      <div className="mx-auto max-w-7xl px-5 py-10">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-[family-name:var(--font-hand)] text-lg text-gold-deep mr-1">
            {t("filtrer par —")}
          </span>
          {categories.map((cat) => (
            <Chip
              key={cat}
              color={cat === "Tout" ? "ink" : CATEGORY_COLORS[cat] ?? "ink"}
              variant={activeCategory === cat ? "filled" : "outline"}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Chip>
          ))}
        </div>
      </div>

      {/* Featured Post */}
      {featured && (
        <div className="mx-auto max-w-7xl px-5 pb-12">
          <div className="font-[family-name:var(--font-hand)] text-xl text-ink-faded mb-4 -rotate-1 inline-block">
            {t("★ à la une")}
          </div>
          <Link href={`/blog/${featured.slug}`} className="block group">
            <PaperCard shadow="gold" className="overflow-hidden hover:-translate-y-1 transition-transform duration-300">
              <div className="grid md:grid-cols-[1fr_420px] lg:grid-cols-[1fr_480px]">
                {/* Cover image */}
                <div className="relative overflow-hidden min-h-[280px] md:min-h-[380px]">
                  <div
                    className="absolute inset-0 bg-center bg-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${featured.cover})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink/20" />
                  {/* Tape decoration */}
                  <div className="absolute top-4 left-8">
                    <Tape color="cream" width={70} rotate={-3} />
                  </div>
                  <div className="absolute bottom-4 right-6">
                    <Stamp color="gold" size={72} fontSize={9} rotate={6}>{t("À LA\nUNE\n★")}</Stamp>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-10 flex flex-col justify-between bg-card">
                  <div>
                    <Badge tone={BADGE_TONES[featured.category] ?? "neutral"}>
                      {featured.category}
                    </Badge>
                    <h2 className="font-[family-name:var(--font-serif)] font-bold text-[clamp(22px,3vw,34px)] tracking-[-0.02em] leading-tight mt-3 mb-4 group-hover:text-gold-deep transition-colors">
                      {featured.title}
                    </h2>
                    <p className="font-[family-name:var(--font-serif)] text-ink-faded leading-relaxed text-base">
                      {featured.excerpt}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-[var(--ink-line)]">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4 text-sm text-ink-faded font-[family-name:var(--font-type)]">
                        <span className="flex items-center gap-1.5">
                          <User size={13} />
                          {featured.author}
                        </span>
                        <span>{featured.date}</span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} />
                          {featured.readMin} min
                        </span>
                      </div>
                      <span className="flex items-center gap-1.5 font-[family-name:var(--font-serif)] font-semibold text-gold-deep text-sm group-hover:gap-2.5 transition-all">
                        {t("lire l'article")} <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </PaperCard>
          </Link>
        </div>
      )}

      {/* Rest of posts grid */}
      {rest.length > 0 && (
        <div className="mx-auto max-w-7xl px-5 pb-16">
          <div className="mb-8">
            <SectionHeading
              eyebrow={t("tous les articles")}
              title={t("Dans nos pages")}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <PaperCard shadow="soft" className="overflow-hidden h-full flex flex-col hover:-translate-y-1 transition-transform duration-300">
                  {/* Cover */}
                  <div className="relative h-44 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-center bg-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${post.cover})` }}
                    />
                    {/* Tape decoration - alternating positions */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                      <Tape color="cream" width={55} rotate={Math.abs(post.slug.length % 8) - 4} />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1 bg-card">
                    <div className="mb-3">
                      <Badge tone={BADGE_TONES[post.category] ?? "neutral"}>
                        {post.category}
                      </Badge>
                    </div>
                    <h3 className="font-[family-name:var(--font-serif)] font-bold text-[18px] leading-tight tracking-tight mb-2 group-hover:text-gold-deep transition-colors">
                      {post.title}
                    </h3>
                    <p className="font-[family-name:var(--font-serif)] text-ink-faded text-sm leading-relaxed flex-1">
                      {post.excerpt}
                    </p>

                    <div className="mt-4 pt-4 border-t border-dashed border-[var(--ink-line)] flex items-center justify-between gap-2 text-[12px] text-ink-faded font-[family-name:var(--font-type)]">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <User size={11} />
                          {post.author.split(" ")[0]}
                        </span>
                        <span>{post.date}</span>
                      </div>
                      <span className="flex items-center gap-1 text-gold-deep font-semibold">
                        <BookOpen size={11} />
                        {post.readMin} min
                      </span>
                    </div>
                  </div>
                </PaperCard>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="font-[family-name:var(--font-hand)] text-3xl text-ink-faded">
                {t("Aucun article dans cette catégorie pour l'instant…")}
              </div>
              <button
                onClick={() => setActiveCategory("Tout")}
                className="mt-4 font-[family-name:var(--font-serif)] text-gold-deep underline cursor-pointer"
              >
                {t("voir tout le carnet")}
              </button>
            </div>
          )}
        </div>
      )}

      <CtaBand />
    </>
  );
}
