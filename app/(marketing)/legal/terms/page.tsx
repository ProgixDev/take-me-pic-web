"use client";

import { useState } from "react";
import { useT } from "@/i18n/I18nProvider";
import { PageHero } from "@/components/marketing/MarketingBits";
import { Stamp, PaperCard } from "@/components/ui";
import Link from "next/link";

export default function TermsPage() {
  const t = useT();
  const [activeSection, setActiveSection] = useState("objet");

  const SECTIONS = [
    { id: "objet", num: "1", title: t("Objet et champ d'application") },
    { id: "inscription", num: "2", title: t("Inscription et compte") },
    { id: "services", num: "3", title: t("Description des services") },
    { id: "karma", num: "4", title: t("Système de karma") },
    { id: "contenu", num: "5", title: t("Contenus et propriété intellectuelle") },
    { id: "conduite", num: "6", title: t("Règles de conduite") },
    { id: "abonnement", num: "7", title: t("Abonnements et paiements") },
    { id: "responsabilite", num: "8", title: t("Limitation de responsabilité") },
    { id: "donnees", num: "9", title: t("Données personnelles") },
    { id: "resiliation", num: "10", title: t("Résiliation") },
    { id: "droit", num: "11", title: t("Droit applicable et litiges") },
  ];

  return (
    <div>
      <PageHero
        eyebrow={t("Documents légaux")}
        title={t("Conditions")}
        highlight={t("d'utilisation")}
        sub={t("En utilisant Take Me Pic, vous acceptez les présentes conditions. Merci de les lire attentivement — nous avons essayé de les rendre aussi claires que possible.")}
        stamp={`C.G.U.\n2026`}
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

          {/* Corps du document */}
          <article className="flex-1 min-w-0 max-w-prose">
            <div className="font-[family-name:var(--font-serif)] text-ink leading-relaxed space-y-12">

              <section id="objet">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">1</span>
                  {t("Objet et champ d'application")}
                </h2>
                <p className="mb-3">
                  {t("Les présentes conditions générales d'utilisation (ci-après « CGU ») régissent l'accès et l'utilisation de l'application mobile et du site web Take Me Pic (ci-après « la Plateforme »), exploités par la société Take Me Pic SAS, au capital de 10 000 €, immatriculée au RCS de Paris sous le numéro 987 654 321, dont le siège social est situé 12 rue de la Photographie, 75003 Paris.")}
                </p>
                <p className="mb-3">
                  {t("La Plateforme met en relation des voyageurs souhaitant se faire photographier (ci-après « Demandeurs ») avec d'autres voyageurs acceptant de prendre leurs photos (ci-après « Photographes volontaires »), dans un esprit d'entraide et de communauté.")}
                </p>
                <p>
                  {t("Toute inscription ou utilisation de la Plateforme implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser la Plateforme.")}
                </p>
              </section>

              <section id="inscription">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">2</span>
                  {t("Inscription et compte")}
                </h2>
                <p className="mb-3">
                  {t("L'accès aux fonctionnalités de la Plateforme nécessite la création d'un compte personnel. L'inscription est réservée aux personnes physiques âgées d'au moins 16 ans. Les mineurs entre 13 et 16 ans peuvent utiliser la Plateforme en mode famille, avec l'accord parental explicite.")}
                </p>
                <p className="mb-3">
                  {t("Lors de l'inscription, l'utilisateur s'engage à fournir des informations exactes, complètes et à jour. Tout compte créé avec de fausses informations pourra être suspendu sans préavis.")}
                </p>
                <p className="mb-3">
                  {t("Vous êtes seul responsable de la confidentialité de vos identifiants de connexion. Toute utilisation non autorisée de votre compte doit être signalée immédiatement à notre équipe via")}{" "}
                  <a href="mailto:securite@takemepic.app" className="text-gold-deep underline">securite@takemepic.app</a>.
                </p>
                <p>
                  {t("Take Me Pic propose un système de vérification d'identité optionnel (document officiel + selfie) permettant d'obtenir le badge « Profil vérifié » et d'accéder à des fonctionnalités avancées. Cette vérification est encouragée mais non obligatoire pour l'utilisation de base.")}
                </p>
              </section>

              <section id="services">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">3</span>
                  {t("Description des services")}
                </h2>
                <p className="mb-3">
                  {t("Take Me Pic propose les services suivants :")}
                </p>
                <ul className="list-none space-y-2 mb-3 pl-4">
                  {[
                    t("La mise en relation géolocalisée de voyageurs pour l'échange de photos"),
                    t("Une galerie de session chiffrée, accessible pendant 24 heures"),
                    t("Un système de karma récompensant l'entraide"),
                    t("Une cartographie communautaire des meilleurs spots photo"),
                    t("Un mode famille permettant le suivi sécurisé des proches"),
                    t("Des guides et ressources photographiques éditoriaux"),
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-gold-deep mt-1">✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  {t("L'accès complet à ces services nécessite un abonnement Première classe. Un plan gratuit « Carnet » permet toutefois d'accéder aux fonctionnalités essentielles sans engagement.")}
                </p>
              </section>

              <section id="karma">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">4</span>
                  {t("Système de karma")}
                </h2>
                <p className="mb-3">
                  {t("Le karma est la monnaie d'entraide de Take Me Pic. Il est attribué lorsqu'un utilisateur prend des photos pour d'autres voyageurs, reçoit une bonne note, ajoute un spot validé, ou participe activement à la communauté.")}
                </p>
                <p className="mb-3">
                  {t("Le karma n'a pas de valeur monétaire et ne peut être ni vendu, ni transféré, ni échangé contre de l'argent. Il peut être utilisé pour débloquer certains avantages internes à la Plateforme.")}
                </p>
                <p>
                  {t("Take Me Pic se réserve le droit de modifier les règles d'attribution du karma à tout moment, avec un préavis de 30 jours communiqué par notification ou par e-mail.")}
                </p>
              </section>

              <section id="contenu">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">5</span>
                  {t("Contenus et propriété intellectuelle")}
                </h2>
                <p className="mb-3">
                  {t("Les photos prises lors d'une session Take Me Pic appartiennent aux utilisateurs impliqués. En les partageant sur la Plateforme, vous accordez à Take Me Pic une licence non exclusive, mondiale et gratuite pour les afficher sur la Plateforme à des fins de fonctionnement du service.")}
                </p>
                <p className="mb-3">
                  {t("L'ensemble des éléments de la Plateforme (design, code, logos, textes éditoriaux) est protégé par le droit d'auteur et appartient à Take Me Pic SAS ou à ses partenaires. Toute reproduction sans autorisation écrite préalable est interdite.")}
                </p>
                <p>
                  {t("Il est interdit de publier du contenu qui porte atteinte aux droits d'un tiers, notamment les droits de la personnalité, le droit à l'image, ou le droit d'auteur. Tout contenu signalé fait l'objet d'une procédure de modération décrite dans notre Charte communautaire.")}
                </p>
              </section>

              <section id="conduite">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">6</span>
                  {t("Règles de conduite")}
                </h2>
                <p className="mb-3">
                  {t("Chaque utilisateur s'engage à respecter la")}{" "}
                  <Link href="/community-guidelines" className="text-gold-deep underline">
                    {t("Charte communautaire")}
                  </Link>{" "}
                  {t("de Take Me Pic. En résumé, sont strictement interdits :")}
                </p>
                <ul className="list-none space-y-2 pl-4">
                  {[
                    t("Tout comportement harcelant, intimidant ou discriminatoire"),
                    t("La publication de contenus à caractère sexuel, violent ou illégal"),
                    t("L'usurpation d'identité ou la création de faux profils"),
                    t("L'utilisation à des fins commerciales sans autorisation écrite"),
                    t("Toute tentative de contournement des systèmes de sécurité"),
                    t("Le spam ou la diffusion de messages non sollicités"),
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-stamp-red mt-1">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section id="abonnement">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">7</span>
                  {t("Abonnements et paiements")}
                </h2>
                <p className="mb-3">
                  {t("L'abonnement Première classe est disponible en formule mensuelle (4,99 €/mois) ou annuelle (39,99 €/an). Ces prix sont indiqués toutes taxes comprises (TVA française en vigueur).")}
                </p>
                <p className="mb-3">
                  {t("Un essai gratuit de 7 jours est proposé aux nouveaux abonnés. Aucune carte bancaire n'est débitée avant la fin de la période d'essai, à condition d'annuler avant l'échéance.")}
                </p>
                <p className="mb-3">
                  {t("L'abonnement se renouvelle automatiquement. Vous pouvez l'annuler à tout moment depuis les paramètres de votre compte. L'annulation prend effet à la fin de la période en cours.")}
                </p>
                <p>
                  {t("Conformément à l'article L.221-18 du Code de la consommation, vous disposez d'un délai de 14 jours à compter de la souscription pour exercer votre droit de rétractation, sauf consommation immédiate du service.")}
                </p>
              </section>

              <section id="responsabilite">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">8</span>
                  {t("Limitation de responsabilité")}
                </h2>
                <p className="mb-3">
                  {t("Take Me Pic est une plateforme de mise en relation. À ce titre, elle ne saurait être tenue responsable des comportements des utilisateurs entre eux, des photos prises ou reçues lors des sessions, ni des dommages pouvant survenir lors d'une rencontre physique organisée via la Plateforme.")}
                </p>
                <p className="mb-3">
                  {t("Nous déployons tous les moyens raisonnables pour assurer la disponibilité de la Plateforme (99,5 % de disponibilité mensuelle cible), mais ne pouvons garantir un service ininterrompu, exempt d'erreurs ou parfaitement sécurisé.")}
                </p>
                <p>
                  {t("En tout état de cause, la responsabilité de Take Me Pic est limitée au montant des sommes effectivement versées au cours des 12 derniers mois précédant le fait générateur du dommage.")}
                </p>
              </section>

              <section id="donnees">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">9</span>
                  {t("Données personnelles")}
                </h2>
                <p className="mb-3">
                  {t("Le traitement de vos données personnelles est régi par notre")}{" "}
                  <Link href="/legal/privacy" className="text-gold-deep underline">
                    {t("Politique de confidentialité")}
                  </Link>{" "}
                  {t("et notre")}{" "}
                  <Link href="/legal/gdpr" className="text-gold-deep underline">
                    {t("page RGPD")}
                  </Link>
                  {t(", qui font partie intégrante des présentes CGU.")}
                </p>
                <p>
                  {t("En cas de question relative à vos données, contactez notre Délégué à la Protection des Données :")}{" "}
                  <a href="mailto:dpo@takemepic.app" className="text-gold-deep underline">dpo@takemepic.app</a>.
                </p>
              </section>

              <section id="resiliation">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">10</span>
                  {t("Résiliation")}
                </h2>
                <p className="mb-3">
                  {t("Vous pouvez supprimer votre compte à tout moment depuis les paramètres de l'application. La suppression entraîne la perte définitive de votre karma, de vos badges et de vos photos stockées sur la Plateforme.")}
                </p>
                <p className="mb-3">
                  {t("Take Me Pic peut suspendre ou supprimer un compte en cas de violation des présentes CGU, après mise en demeure restée sans effet ou, en cas d'urgence (contenu illégal, menace de sécurité), sans préavis.")}
                </p>
                <p>
                  {t("En cas de suppression injustifiée de votre compte, vous disposez d'un droit de recours auprès de notre service client :")}{" "}
                  <a href="mailto:contact@takemepic.app" className="text-gold-deep underline">contact@takemepic.app</a>.
                </p>
              </section>

              <section id="droit">
                <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">11</span>
                  {t("Droit applicable et litiges")}
                </h2>
                <p className="mb-3">
                  {t("Les présentes CGU sont soumises au droit français. En cas de litige, et après tentative amiable infructueuse, les tribunaux compétents de Paris seront seuls compétents.")}
                </p>
                <p className="mb-3">
                  {t("Conformément à l'article L.616-1 du Code de la consommation, tout consommateur a le droit de recourir gratuitement à un médiateur de la consommation. Le médiateur désigné par Take Me Pic est la Médiation du e-commerce (FEVAD).")}
                </p>
                <p>
                  {t("Take Me Pic se réserve le droit de modifier les présentes CGU à tout moment. Tout changement significatif vous sera communiqué par e-mail et notification, au moins 30 jours avant son entrée en vigueur. La poursuite de l'utilisation de la Plateforme après ce délai vaut acceptation des nouvelles CGU.")}
                </p>

                <div className="mt-8 p-4 bg-paper-warm border border-dashed border-[var(--ink-line)] rounded">
                  <p className="text-sm text-ink-faded font-[family-name:var(--font-type)]">
                    {t("Version 2.1 — En vigueur depuis le 1er janvier 2026 · Take Me Pic SAS, 12 rue de la Photographie, 75003 Paris · SIRET 987 654 321 00014")}
                  </p>
                </div>
              </section>
            </div>
          </article>
        </div>

        {/* Mobile sommaire */}
        <div className="lg:hidden mt-8">
          <PaperCard shadow="soft" className="p-5">
            <div className="font-[family-name:var(--font-hand)] text-gold-deep text-lg mb-3">{t("Sommaire rapide")}</div>
            <div className="flex flex-wrap gap-2">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-xs font-[family-name:var(--font-type)] px-2 py-1 bg-paper border border-dashed border-[var(--ink-line)] rounded hover:bg-gold-light transition"
                >
                  {s.num}. {s.title}
                </a>
              ))}
            </div>
          </PaperCard>
        </div>

        {/* Liens légaux annexes */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: "/legal/privacy", label: t("Politique de confidentialité") },
            { href: "/legal/gdpr", label: t("RGPD & vos droits") },
            { href: "/legal/cookies", label: t("Politique cookies") },
            { href: "/community-guidelines", label: t("Charte communautaire") },
          ].map((link) => (
            <Link key={link.href} href={link.href}>
              <PaperCard shadow="soft" className="p-4 hover:shadow-gold transition cursor-pointer text-center">
                <p className="text-sm font-[family-name:var(--font-serif)] text-ink-faded hover:text-ink">
                  {link.label}
                </p>
              </PaperCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
