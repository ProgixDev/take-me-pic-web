"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  UserPlus,
  Share2,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Globe,
} from "lucide-react";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import {
  PaperCard,
  Avatar,
  Stamp,
  Tape,
  Polaroid,
  Chip,
  SectionHeading,
} from "@/components/ui";
import { posts, users } from "@/lib/data";
import { useT } from "@/i18n/I18nProvider";

const FEED_POSTS = posts.slice(0, 6);

const STRENGTHS = [
  { icon: <Heart size={18} />, title: "Likes & commentaires", body: "Montre ton appréciation pour les belles photos partagées par la communauté." },
  { icon: <UserPlus size={18} />, title: "Suivre des membres", body: "Abonne-toi aux photographes de voyage que tu admires, reçois leur fil en priorité." },
  { icon: <BookOpen size={18} />, title: "Stories de voyage", body: "Partage ton récit : spot, conseil, lumière du moment. Expire après 24 h." },
  { icon: <Globe size={18} />, title: "Communauté mondiale", body: "Paris, Lisbonne, Tokyo — explore les publications depuis n'importe quelle ville." },
  { icon: <Share2 size={18} />, title: "Partage simple", body: "Un lien propre pour chaque photo. Partage sur tes réseaux en un tap." },
  { icon: <Sparkles size={18} />, title: "Fil curé", body: "L'algorithme met en avant les photos les plus inspirantes de ton réseau." },
] as const;

export default function CommunityPage() {
  const t = useT();
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [followed, setFollowed] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"tendances" | "suivis" | "ville">("tendances");

  function toggleLike(id: string) {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleFollow(id: string) {
    setFollowed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <>
      <PageHero
        eyebrow={t("fonctionnalité")}
        title={t("Le carnet partagé")}
        highlight={t("de la communauté")}
        sub={t("Un fil d'inspiration où chaque photo racontée devient un souvenir de voyage partagé — likes, commentaires, stories et abonnements.")}
        stamp={t("CARNET\n★\nPARTAGÉ")}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">

        {/* ── Feed demo ────────────────────────────────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-start mb-24">
          <div>
            <SectionHeading
              eyebrow={t("le fil d'actus")}
              title={t("Toutes les histoires,")}
              highlight={t("un seul endroit")}
              sub={t("Photos de session, spots découverts, conseils du matin — la communauté partage en continu.")}
            />

            {/* Tab switcher */}
            <div className="flex gap-2 mt-6 mb-5 flex-wrap">
              {(["tendances", "suivis", "ville"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-[4px] border-[1.5px] font-[family-name:var(--font-serif)] text-[13px] font-semibold transition cursor-pointer ${
                    activeTab === tab
                      ? "bg-ink text-paper-warm border-ink"
                      : "bg-card border-ink text-ink hover:bg-paper-warm"
                  }`}
                >
                  {tab === "tendances" ? t("tendances") : tab === "suivis" ? t("suivis") : t("ville")}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {FEED_POSTS.slice(0, 3).map((post) => (
                <PaperCard key={post.id} shadow="soft" className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar src={post.author.avatar} size={36} online={post.author.status === "active"} />
                    <div className="flex-1">
                      <div className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">
                        {post.author.firstName} {post.author.lastName}
                      </div>
                      <div className="font-[family-name:var(--font-serif)] text-ink-faded text-[11px]">
                        {post.city} · {post.date}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFollow(post.author.id)}
                      className={`text-[12px] px-2.5 py-1 rounded-[4px] border-[1.5px] font-[family-name:var(--font-serif)] font-semibold transition cursor-pointer ${
                        followed[post.author.id]
                          ? "bg-ink text-paper-warm border-ink"
                          : "border-ink text-ink hover:bg-card"
                      }`}
                    >
                      {followed[post.author.id] ? t("suivi ✓") : t("+ suivre")}
                    </button>
                  </div>

                  <div
                    className="w-full h-36 bg-center bg-cover rounded-[2px] mb-3"
                    style={{ backgroundImage: `url(${post.image})` }}
                  />

                  <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded mb-3">
                    {post.caption}
                  </p>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <Heart
                        size={16}
                        className={liked[post.id] ? "fill-stamp-red text-stamp-red" : "text-ink-faded"}
                      />
                      <span className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded">
                        {post.hearts + (liked[post.id] ? 1 : 0)}
                      </span>
                    </button>
                    <div className="flex items-center gap-1.5 text-ink-faded">
                      <MessageCircle size={16} />
                      <span className="font-[family-name:var(--font-serif)] text-[12px]">{post.comments}</span>
                    </div>
                    <Share2 size={16} className="text-ink-faded ml-auto cursor-pointer hover:text-ink transition" />
                  </div>
                </PaperCard>
              ))}
            </div>
          </div>

          {/* right: polaroid collage + stories */}
          <div className="relative">
            <div className="relative h-[500px]">
              <Tape color="cream" rotate={-4} className="absolute top-0 left-1/3 z-10" />
              <Polaroid
                src={posts[0].image}
                caption={posts[0].caption.slice(0, 22) + "…"}
                width={190}
                tilt={-4}
                captionSize={13}
                className="absolute top-4 left-4"
              />
              <Polaroid
                src={posts[1].image}
                caption={t("heure dorée ☼")}
                width={170}
                tilt={5}
                captionSize={13}
                className="absolute top-28 right-4"
              />
              <Polaroid
                src={posts[2].image}
                caption={t("la médina, 7H")}
                width={155}
                tilt={-2}
                captionSize={12}
                className="absolute bottom-8 left-16"
              />
              <Stamp color="red" size={64} fontSize={9} rotate={12} className="absolute bottom-4 right-8">
                {`FEED\n★\nLIVE`}
              </Stamp>
            </div>

            {/* stories preview */}
            <PaperCard shadow="soft" className="p-4 mt-4">
              <div className="font-[family-name:var(--font-hand)] text-xl text-gold-deep mb-3">
                {t("stories du moment")}
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {users.slice(0, 5).map((u) => (
                  <div key={u.id} className="flex flex-col items-center shrink-0 gap-1">
                    <Avatar src={u.avatar} size={48} ring online={u.status === "active"} />
                    <span className="font-[family-name:var(--font-hand)] text-[11px] text-ink">{u.firstName}</span>
                  </div>
                ))}
              </div>
            </PaperCard>
          </div>
        </section>

        {/* ── Section 2 : partage & follow ─────────────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative">
            <PaperCard shadow="ink" className="p-6">
              <div className="font-[family-name:var(--font-hand)] text-2xl text-gold-deep mb-4">
                {t("tes abonnements")}
              </div>
              <div className="space-y-3">
                {users.slice(0, 4).map((u) => (
                  <div key={u.id} className="flex items-center gap-3">
                    <Avatar src={u.avatar} size={40} />
                    <div className="flex-1">
                      <div className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">
                        {u.firstName} {u.lastName}
                      </div>
                      <div className="font-[family-name:var(--font-serif)] text-ink-faded text-[11px]">
                        {u.city} · {u.photosGiven} photos données
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFollow(u.id)}
                      className={`px-3 py-1 rounded-[4px] border-[1.5px] text-[12px] font-[family-name:var(--font-serif)] font-semibold cursor-pointer transition ${
                        followed[u.id]
                          ? "bg-ink text-paper-warm border-ink"
                          : "border-ink text-ink hover:bg-paper-warm"
                      }`}
                    >
                      {followed[u.id] ? t("suivi ✓") : t("+ suivre")}
                    </button>
                  </div>
                ))}
              </div>
            </PaperCard>
            <Tape color="red" rotate={-6} className="absolute -top-3 -left-3" width={48} />
          </div>

          <div>
            <SectionHeading
              eyebrow={t("liens durables")}
              title={t("Abonne-toi aux gens")}
              highlight={t("qui t'inspirent")}
              sub={t("Chaque beau cliché devient une invitation à suivre son auteur. Construis ton cercle de voyageurs au fil de tes découvertes.")}
            />
            <ul className="mt-6 space-y-2">
              {[
                "Fil personnalisé selon tes suivis",
                "Notifications pour les nouvelles publications",
                "Découverte de membres par ville",
                "Blocage facile pour garder le fil sain",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 font-[family-name:var(--font-serif)] text-[14px]">
                  <CheckCircle2 size={16} className="text-stamp-green shrink-0" />
                  {t(item as Parameters<typeof t>[0])}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link href="/download">
                <span className="inline-flex h-[52px] items-center px-6 rounded-[4px] bg-ink text-paper-warm font-[family-name:var(--font-serif)] font-semibold shadow-ink-sm hover:brightness-110 transition">
                  {t("Rejoindre la communauté")}
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Points forts ──────────────────────────────────── */}
        <section className="mb-24">
          <SectionHeading
            eyebrow={t("points forts")}
            title={t("Tout ce que le carnet")}
            highlight={t("t'offre")}
            center
            className="mb-10"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STRENGTHS.map((s, i) => (
              <PaperCard key={i} shadow="soft" tilt={i % 3 === 1 ? -0.4 : 0.4} className="p-5">
                <div className="w-9 h-9 rounded-full bg-gold-light/30 flex items-center justify-center text-gold-deep mb-3">
                  {s.icon}
                </div>
                <div className="font-[family-name:var(--font-serif)] font-bold text-[15px] mb-1 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-stamp-green shrink-0" />
                  {t(s.title as Parameters<typeof t>[0])}
                </div>
                <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[13px] leading-relaxed">
                  {t(s.body as Parameters<typeof t>[0])}
                </p>
              </PaperCard>
            ))}
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────── */}
        <section className="mb-16">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { v: "142 k", l: "photos partagées" },
              { v: "48 k", l: "membres actifs" },
              { v: "10 villes", l: "couvertes dans le monde" },
            ].map((s) => (
              <PaperCard key={s.l} shadow="gold" className="py-8 px-4">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[clamp(22px,4vw,40px)] tracking-[-0.02em] text-gold-deep">
                  {s.v}
                </div>
                <div className="font-[family-name:var(--font-serif)] text-ink-faded text-[13px] mt-1">
                  {t(s.l as Parameters<typeof t>[0])}
                </div>
              </PaperCard>
            ))}
          </div>
        </section>

      </div>
      <CtaBand />
    </>
  );
}
