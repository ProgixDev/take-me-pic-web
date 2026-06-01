"use client";

import { useState } from "react";
import { PageHero } from "@/components/marketing/MarketingBits";
import { Button, PaperCard, Stamp, Chip, Badge } from "@/components/ui";
import { useToast } from "@/components/ui";
import { Lock, BarChart2, Megaphone, Settings } from "lucide-react";
import { useT } from "@/i18n/I18nProvider";

type CookieCategory = {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  name: string;
  description: string;
  required: boolean;
  examples: { name: string; purpose: string; duration: string }[];
  color: "green" | "blue" | "gold" | "ink";
};

function getCookieCategories(t: (key: string) => string): CookieCategory[] {
  return [
    {
      id: "essential",
      icon: Lock,
      name: t("Essentiels"),
      description: t(
        "Ces cookies sont indispensables au fonctionnement du site. Ils permettent la navigation, la connexion sécurisée et la mémorisation de vos préférences de session. Ils ne peuvent pas être désactivés."
      ),
      required: true,
      color: "green",
      examples: [
        { name: "session_id", purpose: t("Maintien de la session de connexion"), duration: "Session" },
        { name: "csrf_token", purpose: t("Protection contre les attaques CSRF"), duration: "Session" },
        { name: "cookie_consent", purpose: t("Mémorisation de vos préférences cookies"), duration: "12 mois" },
        { name: "lang", purpose: t("Préférence de langue"), duration: "12 mois" },
      ],
    },
    {
      id: "analytics",
      icon: BarChart2,
      name: t("Analytiques"),
      description: t(
        "Ces cookies nous aident à comprendre comment les visiteurs utilisent le site (pages vues, durée, parcours). Les données sont anonymisées et agrégées — aucun profil individuel n'est créé."
      ),
      required: false,
      color: "blue",
      examples: [
        { name: "mp_*", purpose: t("Analyse des parcours (anonymisé)"), duration: "6 mois" },
        { name: "_ga", purpose: t("Statistiques d'audience Google Analytics (anonymisé)"), duration: "13 mois" },
        { name: "tmp_perf", purpose: t("Métriques de performance des pages"), duration: "30 jours" },
      ],
    },
    {
      id: "marketing",
      icon: Megaphone,
      name: t("Marketing"),
      description: t(
        "Ces cookies permettent d'afficher des publicités pertinentes et de mesurer l'efficacité des campagnes. Ils peuvent être déposés par nos partenaires publicitaires."
      ),
      required: false,
      color: "gold",
      examples: [
        { name: "fbp", purpose: t("Suivi des conversions Meta Ads"), duration: "3 mois" },
        { name: "ttclid", purpose: t("Attribution TikTok Ads"), duration: "7 jours" },
        { name: "google_ads", purpose: t("Conversion Google Ads"), duration: "3 mois" },
      ],
    },
    {
      id: "personalization",
      icon: Settings,
      name: t("Personnalisation"),
      description: t(
        "Ces cookies mémorisent vos préférences d'affichage et personnalisent votre expérience (thème, suggestions de spots, tri des résultats)."
      ),
      required: false,
      color: "ink",
      examples: [
        { name: "pref_theme", purpose: t("Préférence de thème (clair/sombre)"), duration: "12 mois" },
        { name: "pref_city", purpose: t("Ville préférée pour les suggestions"), duration: "6 mois" },
        { name: "pref_sort", purpose: t("Préférence de tri des spots"), duration: "3 mois" },
      ],
    },
  ];
}

export default function CookiesPage() {
  const t = useT();
  const toast = useToast();
  const [consent, setConsent] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    personalization: false,
  });
  const [expanded, setExpanded] = useState<string | null>(null);

  const COOKIE_CATEGORIES = getCookieCategories(t);

  function handleToggle(id: string) {
    if (id === "essential") return;
    setConsent((prev) => ({ ...prev, [id]: !prev[id as keyof typeof prev] }));
  }

  function handleAcceptAll() {
    setConsent({ essential: true, analytics: true, marketing: true, personalization: true });
    toast.push(t("Tous les cookies ont été acceptés. Merci !"), "ok");
  }

  function handleRejectAll() {
    setConsent({ essential: true, analytics: false, marketing: false, personalization: false });
    toast.push(t("Seuls les cookies essentiels sont activés."), "info");
  }

  function handleSave() {
    const active = Object.entries(consent)
      .filter(([, v]) => v)
      .map(([k]) => COOKIE_CATEGORIES.find((c) => c.id === k)?.name)
      .join(", ");
    toast.push(t("Préférences enregistrées : {{active}}.", { active }), "ok");
  }

  const activeCount = Object.values(consent).filter(Boolean).length;

  return (
    <div>
      <PageHero
        eyebrow={t("Documents légaux")}
        title={t("Politique des")}
        highlight={t("cookies")}
        sub={t("Gérez vos préférences de cookies. Nous utilisons des cookies pour faire fonctionner le site, comprendre son utilisation et vous proposer une expérience personnalisée.")}
        stamp={`COOKIES\n🍪\n2026`}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">
        {/* Bannière résumé */}
        <PaperCard shadow="gold" className="p-6 mb-10 max-w-3xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-semibold font-[family-name:var(--font-serif)] text-lg">
                {t("Vos préférences actuelles")}
              </p>
              <p className="text-ink-faded text-sm mt-1 font-[family-name:var(--font-serif)]">
                {activeCount} catégorie{activeCount > 1 ? "s" : ""} activée{activeCount > 1 ? "s" : ""} sur {COOKIE_CATEGORIES.length}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="ghost" size="sm" onClick={handleRejectAll}>
                {t("Refuser tout")}
              </Button>
              <Button variant="paper" size="sm" onClick={handleAcceptAll}>
                {t("Accepter tout")}
              </Button>
              <Button variant="gold" size="sm" onClick={handleSave}>
                {t("Enregistrer mes préférences")}
              </Button>
            </div>
          </div>
        </PaperCard>

        {/* Catégories de cookies */}
        <section className="mb-12">
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-3xl mb-6">
            {t("Catégories de cookies")}
          </h2>
          <div className="space-y-4 max-w-3xl">
            {COOKIE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isOn = consent[cat.id as keyof typeof consent];
              const isExpanded = expanded === cat.id;

              return (
                <PaperCard key={cat.id} shadow="soft" className="overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-paper-warm rounded shrink-0 mt-0.5">
                          <Icon size={18} className="text-gold-deep" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold font-[family-name:var(--font-serif)]">{cat.name}</span>
                            {cat.required && (
                              <Badge tone="green" dot>{t("Obligatoire")}</Badge>
                            )}
                            {!cat.required && (
                              <Badge tone={isOn ? "green" : "neutral"} dot>
                                {isOn ? t("Activé") : t("Désactivé")}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-ink-faded font-[family-name:var(--font-serif)]">
                            {cat.description}
                          </p>
                          <button
                            className="mt-2 text-xs text-gold-deep font-[family-name:var(--font-type)] underline"
                            onClick={() => setExpanded(isExpanded ? null : cat.id)}
                          >
                            {isExpanded ? t("Masquer les détails") : t("Voir les cookies concernés")}
                          </button>
                        </div>
                      </div>

                      {/* Toggle */}
                      <div className="shrink-0">
                        <button
                          onClick={() => handleToggle(cat.id)}
                          disabled={cat.required}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            cat.required
                              ? "bg-stamp-green cursor-not-allowed opacity-80"
                              : isOn
                              ? "bg-stamp-green cursor-pointer"
                              : "bg-ink-faded cursor-pointer"
                          }`}
                          aria-label={`${isOn ? t("Désactiver") : t("Activer")} ${cat.name}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                              isOn ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        {cat.required && (
                          <p className="text-[10px] text-ink-faded mt-1 text-center font-[family-name:var(--font-type)]">
                            {t("Toujours actif")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Détails cookies */}
                  {isExpanded && (
                    <div className="border-t border-dashed border-[var(--ink-line)] bg-paper-warm px-5 py-4">
                      <p className="text-xs font-semibold font-[family-name:var(--font-type)] uppercase tracking-wider text-ink-faded mb-3">
                        {t("Liste des cookies")}
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-dashed border-[var(--ink-line)]">
                              <th className="text-left py-1 pr-4 font-semibold font-[family-name:var(--font-type)] text-xs">{t("Nom")}</th>
                              <th className="text-left py-1 pr-4 font-semibold font-[family-name:var(--font-type)] text-xs">{t("Finalité")}</th>
                              <th className="text-left py-1 font-semibold font-[family-name:var(--font-type)] text-xs">{t("Durée")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cat.examples.map((ex, i) => (
                              <tr key={i} className="border-b border-dashed border-[var(--ink-line)] last:border-0">
                                <td className="py-1.5 pr-4">
                                  <code className="font-[family-name:var(--font-mono)] text-xs bg-paper px-1 rounded">
                                    {ex.name}
                                  </code>
                                </td>
                                <td className="py-1.5 pr-4 text-ink-faded">{ex.purpose}</td>
                                <td className="py-1.5">
                                  <Chip color="ink" variant="outline" size="sm">{ex.duration}</Chip>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </PaperCard>
              );
            })}
          </div>
        </section>

        {/* CTA enregistrer */}
        <section className="mb-16 max-w-3xl">
          <PaperCard shadow="soft" className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-semibold font-[family-name:var(--font-serif)]">{t("Enregistrer vos préférences")}</p>
                <p className="text-sm text-ink-faded font-[family-name:var(--font-serif)] mt-1">
                  {t("Vos choix sont valables 12 mois. Vous pouvez les modifier à tout moment depuis cette page.")}
                </p>
              </div>
              <Button variant="gold" size="lg" onClick={handleSave}>
                {t("Enregistrer mes préférences")}
              </Button>
            </div>
          </PaperCard>
        </section>

        {/* Infos légales */}
        <section className="max-w-3xl">
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-2xl mb-4">{t("Informations légales")}</h2>
          <div className="font-[family-name:var(--font-serif)] text-ink-faded leading-relaxed space-y-3 text-sm">
            <p>
              {t("Conformément aux lignes directrices de la CNIL sur les cookies (délibération du 17 septembre 2020), votre consentement est requis avant tout dépôt de cookies non essentiels. Ce consentement est libre, spécifique, éclairé et univoque.")}
            </p>
            <p>
              {t("Vous pouvez également bloquer les cookies directement depuis les paramètres de votre navigateur. Notez que la désactivation de certains cookies essentiels pourrait affecter le fonctionnement du site.")}
            </p>
            <p>
              {t("Pour toute question relative aux cookies, contactez notre DPO :")}{" "}
              <a href="mailto:dpo@takemepic.app" className="text-gold-deep underline">dpo@takemepic.app</a>
            </p>
          </div>
          <div className="mt-6 p-4 bg-paper-warm border border-dashed border-[var(--ink-line)] rounded">
            <p className="text-xs text-ink-faded font-[family-name:var(--font-type)]">
              {t("Politique cookies v2.0 — En vigueur depuis le 1er janvier 2026")}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
