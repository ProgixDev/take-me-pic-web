"use client";

import { useState } from "react";
import { useT } from "@/i18n/I18nProvider";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import { PaperCard, Stamp, Chip, Badge, Button } from "@/components/ui";
import { useToast } from "@/components/ui";
import { Heart, Shield, Camera, Star, ThumbsUp, ThumbsDown, AlertTriangle, Users, Globe, Flag } from "lucide-react";
import Link from "next/link";

type DoCard = {
  emoji: string;
  title: string;
  desc: string;
};

type DontCard = {
  emoji: string;
  title: string;
  desc: string;
};

export default function CommunityGuidelinesPage() {
  const t = useT();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("respect");

  const PILLARS = [
    {
      id: "respect",
      icon: Heart,
      color: "red" as const,
      stampColor: "red" as const,
      title: t("Respect & bienveillance"),
      sub: t("La base de tout"),
      description: t("Take Me Pic est une communauté de voyageurs qui se font confiance. Chaque interaction doit être empreinte de respect, de chaleur et de bienveillance."),
      dos: [
        { emoji: "😊", title: t("Soyez accueillant·e"), desc: t("Accueillez chaque demande avec le sourire, même si vous n'êtes pas disponible.") },
        { emoji: "🙏", title: t("Remerciez sincèrement"), desc: t("Un merci bien senti fait toute la différence pour un photographe volontaire.") },
        { emoji: "⭐", title: t("Notez honnêtement"), desc: t("Les avis honnêtes aident la communauté à s'améliorer.") },
        { emoji: "🗣️", title: t("Communiquez clairement"), desc: t("Expliquez ce que vous souhaitez : angle, pose, ambiance souhaitée.") },
      ],
      donts: [
        { emoji: "🚫", title: t("Pas de pression"), desc: t("N'insistez jamais si quelqu'un refuse. Un refus est toujours respectable.") },
        { emoji: "💢", title: t("Pas d'agressivité"), desc: t("Tout comportement agressif ou menaçant entraîne une suspension immédiate.") },
        { emoji: "👎", title: t("Pas de fausses notes"), desc: t("Laisser une mauvaise note par dépit ou vengeance est sanctionnable.") },
      ],
    },
    {
      id: "securite",
      icon: Shield,
      color: "blue" as const,
      stampColor: "blue" as const,
      title: t("Sécurité"),
      sub: t("Votre protection avant tout"),
      description: t("Nous avons conçu Take Me Pic avec la sécurité comme priorité absolue. Voici les règles qui protègent chacun d'entre nous."),
      dos: [
        { emoji: "📍", title: t("Rendez-vous dans des lieux publics"), desc: t("Toutes les sessions doivent se dérouler dans des espaces ouverts et fréquentés.") },
        { emoji: "📞", title: t("Gardez un contact d'urgence"), desc: t("Informez toujours un proche de votre lieu de session.") },
        { emoji: "🔒", title: t("Protégez vos données"), desc: t("Ne partagez jamais vos coordonnées personnelles en dehors de l'app.") },
        { emoji: "🛡️", title: t("Signalez les comportements suspects"), desc: t("Le bouton de signalement est là pour protéger toute la communauté.") },
      ],
      donts: [
        { emoji: "🏠", title: t("Jamais en lieu privé"), desc: t("N'invitez jamais un inconnu chez vous ou n'acceptez pas non plus.") },
        { emoji: "📱", title: t("Pas de contact hors app"), desc: t("Gardez toutes les communications dans l'application pour votre protection.") },
        { emoji: "💰", title: t("Aucune transaction financière"), desc: t("Take Me Pic est basé sur l'entraide. Toute demande d'argent est une arnaque.") },
      ],
    },
    {
      id: "contenu",
      icon: Camera,
      color: "gold" as const,
      stampColor: "gold" as const,
      title: t("Contenu"),
      sub: t("Des photos pour tous"),
      description: t("Les photos partagées sur Take Me Pic doivent être belles, respectueuses et appropriées pour une communauté internationale et multigénérationnelle."),
      dos: [
        { emoji: "📸", title: t("Partagez vos plus belles photos"), desc: t("Qualité, composition, lumière — inspirez la communauté.") },
        { emoji: "🌍", title: t("Valorisez les cultures locales"), desc: t("Chaque destination est unique : montrez sa singularité avec respect.") },
        { emoji: "🎨", title: t("Soyez créatif·ve"), desc: t("N'hésitez pas à proposer des angles originaux et des compositions audacieuses.") },
      ],
      donts: [
        { emoji: "🔞", title: t("Pas de contenu adulte"), desc: t("Tout contenu à caractère sexuel est strictement interdit.") },
        { emoji: "😡", title: t("Pas de contenu haineux"), desc: t("Aucun message de haine, discrimination ou incitation à la violence.") },
        { emoji: "©️", title: t("Pas de plagiat"), desc: t("Ne publiez que vos propres photos. Respectez le droit d'auteur des autres.") },
      ],
    },
  ];

  const SEVERITIES = [
    { level: t("Avertissement"), desc: t("Pour les infractions mineures et premiers écarts. Un message de rappel est envoyé."), color: "gold" as const },
    { level: t("Suspension temporaire"), desc: t("24 h à 30 jours selon la gravité. Accès limité à la plateforme."), color: "blue" as const },
    { level: t("Suspension définitive"), desc: t("Pour les violations graves ou répétées. Le compte est désactivé sans remboursement."), color: "red" as const },
  ];

  const activePillar = PILLARS.find((p) => p.id === activeTab) ?? PILLARS[0];

  return (
    <div>
      <PageHero
        eyebrow={t("Vivre ensemble")}
        title={t("La charte")}
        highlight={t("communautaire")}
        sub={t("Take Me Pic repose sur la confiance entre voyageurs. Cette charte définit les règles qui rendent notre communauté chaleureuse, sûre et inclusive.")}
        stamp={`★\nCHARTE\n★`}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">
        {/* Intro */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-4 mb-6">
            {[
              { icon: Users, label: t("48 230 membres"), color: "text-gold-deep" },
              { icon: Globe, label: t("42 pays"), color: "text-stamp-blue" },
              { icon: Star, label: t("4,8 / 5 de confiance"), color: "text-stamp-green" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 text-sm font-[family-name:var(--font-serif)]">
                <Icon size={16} className={color} />
                <span className="text-ink-faded">{label}</span>
              </div>
            ))}
          </div>
          <p className="font-[family-name:var(--font-serif)] text-ink-faded leading-relaxed">
            {t("La charte s'applique à tous les membres, quels que soient leur niveau, leur pays ou leur ancienneté. En créant un compte Take Me Pic, vous acceptez de la respecter intégralement.")}
          </p>
        </div>

        {/* Onglets piliers */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition font-[family-name:var(--font-serif)] text-sm ${
                  activeTab === p.id
                    ? "bg-ink text-paper-warm border-ink"
                    : "bg-paper border-dashed border-[var(--ink-line)] hover:border-ink"
                }`}
              >
                <Icon size={14} />
                {p.title}
              </button>
            );
          })}
        </div>

        {/* Contenu pilier actif */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Description */}
          <div className="lg:col-span-1">
            <PaperCard shadow="soft" className="p-6 sticky top-24">
              <div className="mb-4">
                <Stamp color={activePillar.stampColor} size={80} fontSize={10} rotate={-8}>
                  {activePillar.title.toUpperCase().split(" ").join("\n")}
                </Stamp>
              </div>
              <h2 className="font-[family-name:var(--font-serif)] font-bold text-xl mb-1">{activePillar.title}</h2>
              <Chip color={activePillar.color} variant="filled" size="sm">{activePillar.sub}</Chip>
              <p className="mt-4 text-ink-faded font-[family-name:var(--font-serif)] text-sm leading-relaxed">
                {activePillar.description}
              </p>
            </PaperCard>
          </div>

          {/* Do / Don't */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ce qu'on fait */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ThumbsUp size={18} className="text-stamp-green" />
                <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg">{t("Ce qu'on fait")}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activePillar.dos.map((card) => (
                  <PaperCard key={card.title} shadow="soft" className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{card.emoji}</span>
                      <div>
                        <p className="font-semibold font-[family-name:var(--font-serif)] text-sm mb-1">{card.title}</p>
                        <p className="text-xs text-ink-faded font-[family-name:var(--font-serif)]">{card.desc}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Badge tone="green" dot>{t("À faire")}</Badge>
                    </div>
                  </PaperCard>
                ))}
              </div>
            </div>

            {/* Ce qu'on ne fait pas */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ThumbsDown size={18} className="text-stamp-red" />
                <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg">{t("Ce qu'on ne fait pas")}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activePillar.donts.map((card) => (
                  <PaperCard key={card.title} shadow="soft" className="p-4 border-l-2 border-stamp-red">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{card.emoji}</span>
                      <div>
                        <p className="font-semibold font-[family-name:var(--font-serif)] text-sm mb-1">{card.title}</p>
                        <p className="text-xs text-ink-faded font-[family-name:var(--font-serif)]">{card.desc}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Badge tone="red" dot>{t("Interdit")}</Badge>
                    </div>
                  </PaperCard>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sanctions */}
        <section className="mb-16">
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-3xl mb-2">
            {t("En cas de violation")}
          </h2>
          <p className="text-ink-faded font-[family-name:var(--font-serif)] mb-8 max-w-2xl">
            {t("Notre équipe de modération examine chaque signalement avec attention. Les sanctions sont proportionnelles à la gravité et à la répétition des infractions.")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SEVERITIES.map((s) => (
              <PaperCard key={s.level} shadow="soft" className="p-5">
                <div className="mb-3">
                  <AlertTriangle size={20} className={`${s.color === "red" ? "text-stamp-red" : s.color === "gold" ? "text-gold-deep" : "text-stamp-blue"}`} />
                </div>
                <Chip color={s.color} variant="filled" size="sm">{s.level}</Chip>
                <p className="mt-3 text-sm text-ink-faded font-[family-name:var(--font-serif)]">{s.desc}</p>
              </PaperCard>
            ))}
          </div>
        </section>

        {/* Signaler */}
        <section className="mb-16">
          <PaperCard shadow="gold" className="p-8 max-w-3xl">
            <div className="flex items-start gap-5">
              <Flag size={32} className="text-gold-deep shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-[family-name:var(--font-serif)] font-bold text-xl mb-2">{t("Vous observez un problème ?")}</h3>
                <p className="text-ink-faded font-[family-name:var(--font-serif)] mb-5">
                  {t("Le bouton de signalement est accessible sur chaque profil et chaque publication. Toutes les alertes sont examinées par notre équipe dans les 24 heures.")}
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    variant="gold"
                    icon={<Flag size={16} />}
                    onClick={() => toast.push(t("Formulaire de signalement ouvert dans l'app."), "info")}
                  >
                    {t("Signaler un problème")}
                  </Button>
                  <Link href="/help">
                    <Button variant="ghost">
                      {t("Centre d'aide")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </PaperCard>
        </section>
      </div>

      <CtaBand />
    </div>
  );
}
