"use client";

import { PageHero } from "@/components/marketing/MarketingBits";
import { PaperCard, Stamp } from "@/components/ui";
import Link from "next/link";
import { useT } from "@/i18n/I18nProvider";

export default function DeleteAccountPage() {
  const t = useT();

  const DELETED_ITEMS = [
    t("Votre profil et vos identifiants de connexion"),
    t("Vos photos et messages vocaux"),
    t("Vos publications et commentaires"),
    t("Vos conversations et messages"),
    t("Vos réservations et l'historique de vos séances"),
    t("Votre karma et vos éléments enregistrés"),
  ];

  return (
    <div>
      <PageHero
        eyebrow={t("Documents légaux")}
        title={t("Supprimer votre")}
        highlight={t("compte")}
        sub={t("Vous pouvez supprimer définitivement votre compte Take Me Pic et toutes les données associées à tout moment.")}
        stamp={`SUPPR.\n🗑\n2026`}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">
        <article className="mx-auto max-w-prose">
          <div className="font-[family-name:var(--font-serif)] text-ink leading-relaxed space-y-12">

            <section id="in-app">
              <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">1</span>
                {t("Depuis l'application (le plus rapide)")}
              </h2>
              <ol className="space-y-3">
                {[
                  t("Ouvrez Take Me Pic et connectez-vous."),
                  t("Allez dans Réglages."),
                  t("Appuyez sur « Supprimer le compte » et confirmez."),
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 shrink-0 rounded-full bg-paper-warm text-gold-deep font-[family-name:var(--font-type)] text-xs font-bold">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="bg-paper-warm border-l-4 border-gold-deep p-5 rounded mt-4">
                <p className="text-sm text-ink-faded">
                  {t("Votre compte et vos données sont supprimés immédiatement.")}
                </p>
              </div>
            </section>

            <section id="no-app">
              <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">2</span>
                {t("Sans l'application")}
              </h2>
              <p className="mb-3">
                {t("Si l'application n'est plus installée, écrivez-nous depuis l'adresse e-mail de votre compte pour demander la suppression. Nous vérifions que vous en êtes le propriétaire et la réalisons sous 30 jours.")}
              </p>
              <PaperCard shadow="gold" className="p-6">
                <div className="flex items-start gap-4">
                  <div className="hidden sm:block">
                    <Stamp color="ink" size={72} fontSize={9} rotate={-5}>{`DATA\n★\nRGPD`}</Stamp>
                  </div>
                  <div>
                    <p className="font-semibold text-lg mb-2">{t("Demande de suppression")}</p>
                    <p><a href="mailto:privacy@takemepic.app" className="text-gold-deep font-semibold underline">privacy@takemepic.app</a></p>
                    <p className="text-sm text-ink-faded mt-2">{t("Objet : « Suppression de compte ». Réponse sous 30 jours.")}</p>
                  </div>
                </div>
              </PaperCard>
            </section>

            <section id="what">
              <h2 className="font-bold text-2xl mb-4 flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-light text-gold-deep font-[family-name:var(--font-type)] text-sm font-bold">3</span>
                {t("Ce qui est supprimé")}
              </h2>
              <p className="mb-4">
                {t("La suppression retire définitivement, de manière irréversible :")}
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {DELETED_ITEMS.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm bg-paper-warm p-3 rounded">
                    <span className="text-stamp-red">✓</span>
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-ink-faded">
                {t("Nous ne conservons aucune donnée personnelle après la suppression, sauf lorsque la loi l'exige (p. ex. justificatifs de transaction à des fins comptables), uniquement pour la durée légale et sans autre usage. Voir notre")}{" "}
                <Link href="/legal/privacy" className="text-gold-deep underline">{t("politique de confidentialité")}</Link>.
              </p>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
