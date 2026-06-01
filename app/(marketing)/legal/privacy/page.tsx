"use client";

import { useState } from "react";
import { PageHero } from "@/components/marketing/MarketingBits";
import { PaperCard, Stamp, Chip } from "@/components/ui";
import Link from "next/link";
import { useT } from "@/i18n/I18nProvider";


export default function PrivacyPage() {
  const t = useT();
  const [activeSection, setActiveSection] = useState("responsable");

  const SECTIONS = [
    { id: "responsable", num: "1", title: t("Responsable du traitement") },
    { id: "collecte", num: "2", title: t("Données collectées") },
    { id: "gps", num: "3", title: t("GPS éphémère") },
    { id: "finalites", num: "4", title: t("Finalités du traitement") },
    { id: "conservation", num: "5", title: t("Durées de conservation") },
    { id: "partage", num: "6", title: t("Partage des données") },
    { id: "securite", num: "7", title: t("Sécurité") },
    { id: "droits", num: "8", title: t("Vos droits") },
    { id: "cookies", num: "9", title: t("Cookies et traceurs") },
    { id: "contact", num: "10", title: t("Contact DPO") },
  ];

  const DATA_CATEGORIES = [
    {
      category: t("Identité"),
      color: "blue" as const,
      items: [t("Prénom, nom"), t("Date de naissance"), t("Photo de profil"), t("Numéro de téléphone"), t("Adresse e-mail")],
      base: t("Exécution du contrat"),
    },
    {
      category: t("Localisation"),
      color: "gold" as const,
      items: [t("Position GPS (session active uniquement)"), t("Ville de résidence déclarée"), t("Historique des villes visitées")],
      base: t("Consentement"),
    },
    {
      category: t("Contenu"),
      color: "green" as const,
      items: [t("Photos prises lors des sessions"), t("Publications communautaires"), t("Spots ajoutés"), t("Commentaires")],
      base: t("Exécution du contrat"),
    },
    {
      category: t("Technique"),
      color: "ink" as const,
      items: [t("Adresse IP"), t("Type d'appareil et OS"), t("Logs de connexion"), t("Identifiant publicitaire (optionnel)")],
      base: t("Intérêt légitime"),
    },
  ];

  const RETENTION_ROWS = [
    { type: t("Compte actif"), duration: t("Durée de la relation contractuelle"), base: t("Contrat") },
    { type: t("Données GPS de session"), duration: t("Suppression immédiate après la session"), base: t("Consentement") },
    { type: t("Photos de session"), duration: t("24 heures (galerie chiffrée)"), base: t("Contrat") },
    { type: t("Photos publiées"), duration: t("Jusqu'à suppression par l'utilisateur"), base: t("Contrat") },
    { type: t("Logs de connexion"), duration: t("12 mois"), base: t("Intérêt légitime") },
    { type: t("Données de paiement (référence)"), duration: t("10 ans (obligation comptable)"), base: t("Obligation légale") },
    { type: t("Compte supprimé"), duration: t("30 jours (délai de rétractation), puis suppression"), base: t("Légal") },
  ];

  return (
    <div>
      <PageHero
        eyebrow={t("Documents légaux")}
        title={t("Politique de")}
        highlight={t("confidentialité")}
        sub={t("Nous traitons vos données avec le plus grand soin. Cette page explique quelles données nous collectons, pourquoi, et comment vous pouvez les contrôler.")}
        stamp={`PRIVÉ\n🔒\n2026`}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="flex gap-10 items-start">
          {/* Sommaire sticky */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
            <PaperCard shadow="soft" className="p-5">
              <div className="font-[family-name:var(--font-hand)] text-gold-deep text-lg mb-3 -rotate-1">
                {t("Sommaire")}
              </div>
              <nav className="space-y-1">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={() => setActiveSection(s.id)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm font-[family-name:var(--font-type)] transition-colors ${
                      activeSection === s.id
                        ? "bg-gold-light text-gold-deep font-semibold"
                        : "text-ink-faded hover:text-ink"
                    }`}
                  >
                    <span className="text-[10px] text-gold-deep font-bold tabular-nums">{s.num}.</span>
                    {s.title}
                  </a>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t border-dashed border-[var(--ink-line)]">
                <p className="text-[11px] text-ink-faded font-[family-name:var(--font-type)]">
                  {t("Mis à jour le 1er janvier 2026")}
                </p>
              </div>
            </PaperCard>
          </aside>

          {/* Corps */}
          <article className="flex-1 min-w-0 max-w-prose">
            <div className="font-[family-name:var(--font-serif)] text-ink leading-relaxed space-y-12">

              <section id="responsable">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">1</span>
                  {t("Responsable du traitement")}
                </h2>
                <p className="mb-3">
                  {t("Le responsable du traitement de vos données personnelles est :")}
                </p>
                <PaperCard shadow="soft" className="p-5 mb-3">
                  <p className="font-semibold">Take Me Pic SAS</p>
                  <p className="text-ink-faded text-sm mt-1">12 rue de la Photographie, 75003 Paris, France</p>
                  <p className="text-ink-faded text-sm">SIRET : 987 654 321 00014 — RCS Paris</p>
                  <p className="text-ink-faded text-sm">{t("E-mail :")} <a href="mailto:dpo@takemepic.app" className="text-gold-deep">dpo@takemepic.app</a></p>
                </PaperCard>
                <p>
                  {t("Nous sommes enregistrés auprès de la")} <strong>CNIL</strong> {t("(Commission Nationale de l'Informatique et des Libertés) sous le numéro 4567890. Le traitement de vos données est conforme au Règlement Général sur la Protection des Données (RGPD — UE 2016/679).")}
                </p>
              </section>

              <section id="collecte">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">2</span>
                  {t("Données collectées")}
                </h2>
                <p className="mb-6">
                  {t("Nous collectons uniquement les données nécessaires au bon fonctionnement de la Plateforme. Voici les catégories de données traitées, leur contenu et leur base légale :")}
                </p>
                <div className="space-y-4">
                  {DATA_CATEGORIES.map((cat) => (
                    <PaperCard key={cat.category} shadow="soft" className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold font-[family-name:var(--font-serif)]">{cat.category}</span>
                        <Chip color={cat.color} variant="outline" size="sm">{cat.base}</Chip>
                      </div>
                      <ul className="space-y-1">
                        {cat.items.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-sm text-ink-faded">
                            <span className="text-gold-deep">·</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </PaperCard>
                  ))}
                </div>
              </section>

              <section id="gps">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">3</span>
                  {t("GPS éphémère")}
                </h2>
                <div className="bg-paper-warm border-l-4 border-gold-deep p-5 rounded mb-4">
                  <p className="font-semibold mb-2">{t("Notre engagement : votre position n'est jamais stockée de façon permanente.")}</p>
                  <p className="text-sm text-ink-faded">
                    {t("La géolocalisation n'est activée qu'à votre demande explicite, uniquement pendant la durée d'une session active.")}
                  </p>
                </div>
                <p className="mb-3">
                  {t("Lorsque vous activez le mode « je suis disponible pour aider » ou lorsque vous cherchez un photographe à proximité, votre position GPS est partagée avec les utilisateurs proches (dans un rayon configurable de 100 m à 1 km).")}
                </p>
                <p className="mb-3">
                  {t("Cette donnée de localisation")} <strong>{t("n'est pas stockée")}</strong> {t("sur nos serveurs au-delà de la session. Elle est traitée en mémoire volatile et effacée dès que la session se termine, que vous désactivez le mode disponible, ou que vous fermez l'application.")}
                </p>
                <p>
                  {t("Nous ne collectons jamais votre historique de déplacements, et votre position n'est jamais transmise à des tiers à des fins publicitaires.")}
                </p>
              </section>

              <section id="finalites">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">4</span>
                  {t("Finalités du traitement")}
                </h2>
                <p className="mb-4">{t("Vos données sont traitées pour les finalités suivantes :")}</p>
                <ul className="space-y-3">
                  {[
                    { finalite: t("Fourniture du service"), detail: t("Mise en relation, gestion des sessions, galerie photo, karma") },
                    { finalite: t("Sécurité"), detail: t("Vérification d'identité, détection de fraude, modération") },
                    { finalite: t("Communication"), detail: t("Notifications de session, e-mails transactionnels, support") },
                    { finalite: t("Amélioration du produit"), detail: t("Analyses d'usage anonymisées, A/B tests, rapports d'erreur") },
                    { finalite: t("Obligations légales"), detail: t("Comptabilité, réponse aux demandes judiciaires autorisées") },
                  ].map((row) => (
                    <li key={row.finalite} className="flex items-start gap-3">
                      <span className="text-gold-deep mt-0.5">✦</span>
                      <div>
                        <span className="font-semibold">{row.finalite}</span>
                        <span className="text-ink-faded"> — {row.detail}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section id="conservation">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">5</span>
                  {t("Durées de conservation")}
                </h2>
                <p className="mb-5">{t("Nous ne conservons vos données que le temps nécessaire à leur finalité :")}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[var(--ink-line)]">
                        <th className="text-left py-2 pr-4 font-semibold font-[family-name:var(--font-type)] uppercase text-xs tracking-wider">{t("Type de données")}</th>
                        <th className="text-left py-2 pr-4 font-semibold font-[family-name:var(--font-type)] uppercase text-xs tracking-wider">{t("Durée")}</th>
                        <th className="text-left py-2 font-semibold font-[family-name:var(--font-type)] uppercase text-xs tracking-wider">{t("Base")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RETENTION_ROWS.map((row, i) => (
                        <tr key={i} className="border-b border-dashed border-[var(--ink-line)]">
                          <td className="py-2.5 pr-4 font-medium">{row.type}</td>
                          <td className="py-2.5 pr-4 text-ink-faded">{row.duration}</td>
                          <td className="py-2.5">
                            <Chip color="ink" variant="outline" size="sm">{row.base}</Chip>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="partage">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">6</span>
                  {t("Partage des données")}
                </h2>
                <p className="mb-3">
                  <strong>{t("Nous ne vendons jamais vos données.")}</strong> {t("Vos données peuvent être partagées avec des sous-traitants soigneusement sélectionnés, dans le seul but de faire fonctionner la Plateforme :")}
                </p>
                <ul className="space-y-2 pl-4">
                  {[
                    t("Hébergeur cloud (serveurs en France et UE uniquement)"),
                    t("Prestataire de paiement sécurisé (traitement des transactions)"),
                    t("Service d'envoi d'e-mails transactionnels"),
                    t("Outil d'analyse d'audience (données anonymisées)"),
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-ink-faded">
                      <span className="text-gold-deep">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3">
                  {t("Tous nos sous-traitants ont signé des accords de traitement conformes au RGPD. Aucun transfert de données hors UE/EEE n'est effectué sans garanties appropriées.")}
                </p>
              </section>

              <section id="securite">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">7</span>
                  {t("Sécurité")}
                </h2>
                <p className="mb-3">
                  {t("La sécurité de vos données est notre priorité. Nos mesures techniques incluent :")}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    t("Chiffrement TLS 1.3 en transit"),
                    t("Chiffrement AES-256 au repos"),
                    t("Galeries de session chiffrées de bout en bout"),
                    t("Authentification à deux facteurs disponible"),
                    t("Audits de sécurité trimestriels"),
                    t("Programme de divulgation responsable"),
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm bg-paper-warm p-2 rounded">
                      <span className="text-stamp-green">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section id="droits">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">8</span>
                  {t("Vos droits")}
                </h2>
                <p className="mb-4">
                  {t("Conformément au RGPD, vous disposez des droits suivants. Pour les exercer, consultez notre")}{" "}
                  <Link href="/legal/gdpr" className="text-gold-deep underline">{t("page RGPD dédiée")}</Link>.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { droit: t("Accès"), desc: t("Savoir quelles données nous avons") },
                    { droit: t("Rectification"), desc: t("Corriger des données inexactes") },
                    { droit: t("Effacement"), desc: t("Supprimer votre compte et données") },
                    { droit: t("Portabilité"), desc: t("Exporter vos données (JSON/CSV)") },
                    { droit: t("Opposition"), desc: t("Refuser certains traitements") },
                    { droit: t("Limitation"), desc: t("Restreindre temporairement un traitement") },
                  ].map((d) => (
                    <PaperCard key={d.droit} shadow="soft" className="p-3">
                      <p className="font-semibold text-sm">{d.droit}</p>
                      <p className="text-xs text-ink-faded mt-1">{d.desc}</p>
                    </PaperCard>
                  ))}
                </div>
              </section>

              <section id="cookies">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">9</span>
                  {t("Cookies et traceurs")}
                </h2>
                <p className="mb-3">
                  {t("Notre site utilise des cookies techniques (indispensables au fonctionnement), des cookies analytiques (avec votre consentement) et des cookies de personnalisation.")}
                </p>
                <p>
                  {t("Vous pouvez gérer vos préférences à tout moment via notre")}{" "}
                  <Link href="/legal/cookies" className="text-gold-deep underline">
                    {t("Politique cookies")}
                  </Link>.
                </p>
              </section>

              <section id="contact">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">10</span>
                  {t("Contact DPO")}
                </h2>
                <PaperCard shadow="gold" className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="hidden sm:block">
                      <Stamp color="blue" size={72} fontSize={9} rotate={-5}>{`DPO\n★\nRGPD`}</Stamp>
                    </div>
                    <div>
                      <p className="font-semibold text-lg mb-2">{t("Délégué à la Protection des Données")}</p>
                      <p className="text-ink-faded mb-1">{t("Pour toute question relative à vos données personnelles :")}</p>
                      <p><a href="mailto:dpo@takemepic.app" className="text-gold-deep font-semibold underline">dpo@takemepic.app</a></p>
                      <p className="text-sm text-ink-faded mt-2">{t("Réponse garantie sous 72 heures ouvrées.")}</p>
                      <p className="text-sm text-ink-faded mt-1">
                        {t("Vous pouvez également saisir la")} <strong>CNIL</strong> :{" "}
                        <a href="https://www.cnil.fr" target="_blank" rel="noreferrer" className="text-gold-deep underline">www.cnil.fr</a>
                      </p>
                    </div>
                  </div>
                </PaperCard>

                <div className="mt-8 p-4 bg-paper-warm border border-dashed border-[var(--ink-line)] rounded">
                  <p className="text-sm text-ink-faded font-[family-name:var(--font-type)]">
                    {t("Politique de confidentialité v2.1 — En vigueur depuis le 1er janvier 2026")}
                  </p>
                </div>
              </section>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
