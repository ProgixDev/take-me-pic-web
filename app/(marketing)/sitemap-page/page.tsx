"use client";

import { PageHero } from "@/components/marketing/MarketingBits";
import { PaperCard, Stamp } from "@/components/ui";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useT } from "@/i18n/I18nProvider";

type SitemapSection = {
  title: string;
  stampLabel: string;
  stampColor: "red" | "blue" | "green" | "gold" | "ink";
  links: { href: string; label: string; desc?: string; external?: boolean }[];
};

export default function SitemapPage() {
  const t = useT();

  const SECTIONS: SitemapSection[] = [
    {
      title: t("Accueil & Produit"),
      stampLabel: t("HOME\n★"),
      stampColor: "gold",
      links: [
        { href: "/", label: t("Accueil"), desc: t("Page principale") },
        { href: "/how-it-works", label: t("Comment ça marche"), desc: t("Le fonctionnement de l'app") },
        { href: "/features", label: t("Fonctionnalités"), desc: t("Toutes les features") },
        { href: "/pricing", label: t("Tarifs"), desc: t("Plans Carnet & Première classe") },
        { href: "/download", label: t("Télécharger l'app"), desc: t("App Store & Google Play") },
        { href: "/spots", label: t("Spots photo"), desc: t("Carte des meilleurs spots") },
      ],
    },
    {
      title: t("Communauté"),
      stampLabel: t("COMMUNITY\n♥"),
      stampColor: "red",
      links: [
        { href: "/community", label: t("Communauté"), desc: t("Le fil de la communauté") },
        { href: "/community-guidelines", label: t("Charte communautaire"), desc: t("Nos règles de bonne conduite") },
        { href: "/leaderboard", label: t("Classement karma"), desc: t("Top voyageurs") },
        { href: "/ambassadors", label: t("Programme ambassadeurs"), desc: t("Rejoindre le programme") },
        { href: "/guides", label: t("Guides photo"), desc: t("Conseils et techniques") },
      ],
    },
    {
      title: t("À propos"),
      stampLabel: t("ABOUT\n★"),
      stampColor: "blue",
      links: [
        { href: "/about", label: t("Notre histoire"), desc: t("L'équipe fondatrice") },
        { href: "/careers", label: t("Carrières"), desc: t("Rejoindre l'équipe") },
        { href: "/press", label: t("Presse"), desc: t("Kit presse & communiqués") },
        { href: "/partners", label: t("Partenaires"), desc: t("Devenir partenaire") },
        { href: "/blog", label: t("Blog"), desc: t("Articles & actualités") },
        { href: "/stories", label: t("Histoires"), desc: t("Témoignages de voyageurs") },
      ],
    },
    {
      title: t("Support"),
      stampLabel: t("AIDE\n?"),
      stampColor: "green",
      links: [
        { href: "/help", label: t("Centre d'aide"), desc: t("FAQ & guides d'utilisation") },
        { href: "/contact", label: t("Contact"), desc: t("Nous écrire directement") },
        { href: "/safety", label: t("Sécurité & confiance"), desc: t("Nos engagements de sécurité") },
        { href: "/status", label: t("Statut du service"), desc: t("Disponibilité en temps réel") },
      ],
    },
    {
      title: t("Documents légaux"),
      stampLabel: t("LÉGAL\n§"),
      stampColor: "ink",
      links: [
        { href: "/legal/terms", label: t("Conditions d'utilisation"), desc: t("CGU v2.1") },
        { href: "/legal/privacy", label: t("Politique de confidentialité"), desc: t("RGPD & données personnelles") },
        { href: "/legal/gdpr", label: t("RGPD & vos droits"), desc: t("Exercer vos droits") },
        { href: "/legal/cookies", label: t("Politique cookies"), desc: t("Gérer vos préférences") },
        { href: "/legal/mentions", label: t("Mentions légales"), desc: t("Informations légales") },
      ],
    },
    {
      title: t("Administration"),
      stampLabel: t("ADMIN\n⚙"),
      stampColor: "red",
      links: [
        { href: "/admin", label: t("Tableau de bord admin"), desc: t("Accès réservé") },
        { href: "/admin/users", label: t("Gestion des utilisateurs"), desc: t("Accès réservé") },
        { href: "/admin/sessions", label: t("Gestion des sessions"), desc: t("Accès réservé") },
        { href: "/admin/reports", label: t("Signalements"), desc: t("Accès réservé") },
        { href: "/admin/analytics", label: t("Analytiques"), desc: t("Accès réservé") },
      ],
    },
  ];

  return (
    <div>
      <PageHero
        eyebrow={t("Navigation")}
        title={t("Plan du")}
        highlight={t("site")}
        sub={t("Retrouvez toutes les pages de Take Me Pic organisées par section. Un index complet pour naviguer rapidement.")}
        stamp={`PLAN\n★\n2026`}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">
        {/* Grille principale */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTIONS.map((section) => (
            <PaperCard key={section.title} shadow="soft" className="p-6">
              <div className="flex items-start justify-between mb-5">
                <h2 className="font-[family-name:var(--font-serif)] font-bold text-lg">{section.title}</h2>
                <Stamp
                  color={section.stampColor}
                  size={52}
                  fontSize={8}
                  rotate={-8}
                >
                  {section.stampLabel}
                </Stamp>
              </div>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-start gap-2 hover:text-gold-deep transition"
                    >
                      <span className="text-gold-deep mt-1 shrink-0">›</span>
                      <div className="min-w-0">
                        <span className="font-[family-name:var(--font-serif)] font-medium text-sm group-hover:underline">
                          {link.label}
                        </span>
                        {link.external && (
                          <ExternalLink size={10} className="inline-block ml-1 opacity-50" />
                        )}
                        {link.desc && (
                          <p className="text-xs text-ink-faded font-[family-name:var(--font-type)] mt-0.5">
                            {link.desc}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </PaperCard>
          ))}
        </div>

        {/* Liens rapides */}
        <section className="mt-16">
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-2xl mb-6">
            {t("Pages fréquemment visitées")}
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "/", label: t("Accueil") },
              { href: "/how-it-works", label: t("Comment ça marche") },
              { href: "/pricing", label: t("Tarifs") },
              { href: "/download", label: t("Télécharger") },
              { href: "/help", label: t("Aide") },
              { href: "/blog", label: t("Blog") },
              { href: "/spots", label: t("Spots photo") },
              { href: "/ambassadors", label: t("Ambassadeurs") },
              { href: "/press", label: t("Presse") },
              { href: "/legal/privacy", label: t("Confidentialité") },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center px-4 py-2 rounded-full border border-dashed border-[var(--ink-line)] font-[family-name:var(--font-serif)] text-sm hover:bg-gold-light hover:border-gold-deep transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Dernière mise à jour */}
        <div className="mt-12 pt-6 border-t border-dashed border-[var(--ink-line)]">
          <p className="text-xs text-ink-faded font-[family-name:var(--font-type)]">
            {t("Plan du site mis à jour le 30 mai 2026 · {{count}} pages répertoriées", { count: SECTIONS.reduce((acc, s) => acc + s.links.length, 0) })}
          </p>
        </div>
      </div>
    </div>
  );
}
