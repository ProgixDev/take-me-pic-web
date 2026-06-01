"use client";

import { useState } from "react";
import { useT } from "@/i18n/I18nProvider";
import { PageHero } from "@/components/marketing/MarketingBits";
import { Button, PaperCard, Stamp, Chip, Modal } from "@/components/ui";
import { useToast } from "@/components/ui";
import { ShieldCheck, Download, Trash2, FileEdit, Send, Eye, Pause, Mail } from "lucide-react";

const RIGHTS_DATA = [
  {
    id: "acces",
    icon: Eye,
    titleKey: "Droit d'accès",
    articleKey: "Art. 15 RGPD",
    color: "blue" as const,
    descriptionKey:
      "Vous avez le droit d'obtenir la confirmation que des données vous concernant sont traitées, et d'en recevoir une copie. Nous répondons dans un délai maximum de 30 jours.",
    howtoKey: "Envoyez une demande à dpo@takemepic.app avec l'objet « Demande d'accès ». Nous vous enverrons un export complet de toutes vos données.",
  },
  {
    id: "rectification",
    icon: FileEdit,
    titleKey: "Droit de rectification",
    articleKey: "Art. 16 RGPD",
    color: "gold" as const,
    descriptionKey:
      "Si vos données sont inexactes ou incomplètes, vous pouvez demander leur correction à tout moment. La plupart des informations de profil sont directement modifiables dans l'application.",
    howtoKey: "Modifiez votre profil dans l'app, ou contactez-nous pour les données non accessibles directement.",
  },
  {
    id: "effacement",
    icon: Trash2,
    titleKey: "Droit à l'effacement",
    articleKey: "Art. 17 RGPD",
    color: "red" as const,
    descriptionKey:
      "Vous pouvez demander la suppression de vos données personnelles (« droit à l'oubli »). Certaines données peuvent être conservées si une obligation légale l'impose (ex. données comptables 10 ans).",
    howtoKey: "Supprimez votre compte depuis Paramètres → Compte → Supprimer mon compte. La suppression est définitive après 30 jours.",
  },
  {
    id: "portabilite",
    icon: Download,
    titleKey: "Droit à la portabilité",
    articleKey: "Art. 20 RGPD",
    color: "green" as const,
    descriptionKey:
      "Vous pouvez recevoir vos données dans un format structuré, couramment utilisé et lisible par machine (JSON/CSV), afin de les transférer à un autre service.",
    howtoKey: "Depuis Paramètres → Confidentialité → Exporter mes données. L'export est disponible en 24 h.",
  },
  {
    id: "opposition",
    icon: Pause,
    titleKey: "Droit d'opposition",
    articleKey: "Art. 21 RGPD",
    color: "ink" as const,
    descriptionKey:
      "Vous pouvez vous opposer à tout moment au traitement de vos données fondé sur l'intérêt légitime de Take Me Pic, notamment à des fins de prospection commerciale.",
    howtoKey: "Désactivez les communications marketing depuis Paramètres → Notifications, ou contactez le DPO.",
  },
  {
    id: "limitation",
    icon: Pause,
    titleKey: "Droit à la limitation",
    articleKey: "Art. 18 RGPD",
    color: "blue" as const,
    descriptionKey:
      "Vous pouvez demander la limitation du traitement de vos données dans certains cas prévus par le RGPD (contestation d'exactitude, traitement illicite, opposition en cours).",
    howtoKey: "Contactez notre DPO en précisant les données concernées et la raison de votre demande.",
  },
];

export default function GdprPage() {
  const t = useT();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRight, setModalRight] = useState<(typeof RIGHTS_DATA)[0] & { title: string; article: string; description: string; howto: string } | null>(null);
  const [form, setForm] = useState({ type: "", message: "" });
  const [dataRequestSent, setDataRequestSent] = useState(false);

  const RIGHTS = RIGHTS_DATA.map((r) => ({
    ...r,
    title: t(r.titleKey),
    article: t(r.articleKey),
    description: t(r.descriptionKey),
    howto: t(r.howtoKey),
  }));

  function openModal(right: (typeof RIGHTS)[0]) {
    setModalRight(right);
    setModalOpen(true);
  }

  function handleDataRequest() {
    setDataRequestSent(true);
    toast.push(t("Votre demande d'export de données a été envoyée. Vous recevrez un e-mail sous 24 h."), "ok");
  }

  function handleFormSubmit() {
    if (!form.type || !form.message) {
      toast.push(t("Merci de remplir tous les champs avant d'envoyer."), "err");
      return;
    }
    toast.push(t("Demande « {{type}} » envoyée à notre DPO. Réponse sous 30 jours.", { type: form.type }), "ok");
    setForm({ type: "", message: "" });
  }

  return (
    <div>
      <PageHero
        eyebrow={t("Vos droits RGPD")}
        title={t("Règlement Général sur la")}
        highlight={t("Protection des Données")}
        sub={t("Take Me Pic respecte pleinement le RGPD. Cette page centralise l'exercice de tous vos droits en matière de données personnelles.")}
        stamp={`RGPD\n✓\n2026`}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">
        {/* Intro */}
        <div className="max-w-3xl mb-12">
          <PaperCard shadow="gold" className="p-6">
            <div className="flex items-start gap-4">
              <ShieldCheck size={32} className="text-gold-deep shrink-0 mt-1" />
              <div>
                <p className="font-semibold font-[family-name:var(--font-serif)] text-lg mb-2">
                  {t("Vos données vous appartiennent")}
                </p>
                <p className="text-ink-faded font-[family-name:var(--font-serif)]">
                  {t("Conformément au Règlement (UE) 2016/679 (RGPD), vous disposez de droits étendus sur vos données personnelles. Nous nous engageons à répondre à toutes vos demandes dans un délai maximum de")} <strong>{t("30 jours calendaires")}</strong>{t(", sans frais.")}
                </p>
              </div>
            </div>
          </PaperCard>
        </div>

        {/* Grille des droits */}
        <section className="mb-16">
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-3xl mb-8">
            {t("Vos six droits fondamentaux")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {RIGHTS.map((right) => {
              const Icon = right.icon;
              return (
                <PaperCard key={right.id} shadow="soft" className="p-5 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-paper-warm rounded">
                        <Icon size={18} className="text-gold-deep" />
                      </div>
                      <div>
                        <p className="font-semibold font-[family-name:var(--font-serif)]">{right.title}</p>
                        <Chip color={right.color} variant="outline" size="sm">{right.article}</Chip>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-ink-faded font-[family-name:var(--font-serif)] flex-1 mb-4">
                    {right.description}
                  </p>
                  <Button variant="ghost" size="sm" onClick={() => openModal(right)}>
                    {t("Comment exercer ce droit →")}
                  </Button>
                </PaperCard>
              );
            })}
          </div>
        </section>

        {/* Demander mes données */}
        <section className="mb-16">
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-3xl mb-6">
            {t("Demander mes données")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <PaperCard shadow="soft" className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Download size={24} className="text-gold-deep" />
                <h3 className="font-semibold font-[family-name:var(--font-serif)] text-lg">{t("Export de mes données")}</h3>
              </div>
              <p className="text-ink-faded text-sm mb-5 font-[family-name:var(--font-serif)]">
                {t("Téléchargez une copie complète de toutes les données que nous détenons sur vous : profil, karma, photos, sessions, messages. Format JSON et CSV.")}
              </p>
              <Button
                variant="gold"
                icon={<Download size={16} />}
                onClick={handleDataRequest}
                disabled={dataRequestSent}
              >
                {dataRequestSent ? t("Demande envoyée ✓") : t("Demander mes données")}
              </Button>
              {dataRequestSent && (
                <p className="text-xs text-ink-faded mt-2 font-[family-name:var(--font-type)]">
                  {t("Export disponible par e-mail sous 24 h")}
                </p>
              )}
            </PaperCard>

            <PaperCard shadow="soft" className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trash2 size={24} className="text-stamp-red" />
                <h3 className="font-semibold font-[family-name:var(--font-serif)] text-lg">{t("Supprimer mon compte")}</h3>
              </div>
              <p className="text-ink-faded text-sm mb-5 font-[family-name:var(--font-serif)]">
                {t("La suppression de compte entraîne la perte définitive de toutes vos données (karma, photos, badges) après un délai de rétractation de 30 jours.")}
              </p>
              <Button
                variant="danger"
                icon={<Trash2 size={16} />}
                onClick={() =>
                  toast.push(
                    t("Demande de suppression enregistrée. Votre compte sera supprimé dans 30 jours."),
                    "info"
                  )
                }
              >
                {t("Demander la suppression")}
              </Button>
            </PaperCard>
          </div>
        </section>

        {/* Formulaire de demande libre */}
        <section className="mb-16">
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-3xl mb-6">
            {t("Formulaire de demande RGPD")}
          </h2>
          <PaperCard shadow="soft" className="p-8 max-w-2xl">
            <p className="text-ink-faded font-[family-name:var(--font-serif)] mb-6">
              {t("Pour toute demande relative à vos droits, remplissez ce formulaire. Notre DPO vous répondra dans les 30 jours.")}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold font-[family-name:var(--font-type)] uppercase tracking-wider mb-2">
                  {t("Type de demande")}
                </label>
                <select
                  className="w-full border border-dashed border-[var(--ink-line)] rounded px-3 py-2 bg-paper font-[family-name:var(--font-serif)] text-sm"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="">{t("— Choisissez un type —")}</option>
                  <option value="Accès">{t("Droit d'accès (Art. 15)")}</option>
                  <option value="Rectification">{t("Droit de rectification (Art. 16)")}</option>
                  <option value="Effacement">{t("Droit à l'effacement (Art. 17)")}</option>
                  <option value="Portabilité">{t("Droit à la portabilité (Art. 20)")}</option>
                  <option value="Opposition">{t("Droit d'opposition (Art. 21)")}</option>
                  <option value="Limitation">{t("Droit à la limitation (Art. 18)")}</option>
                  <option value="Autre">{t("Autre question RGPD")}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold font-[family-name:var(--font-type)] uppercase tracking-wider mb-2">
                  {t("Votre message")}
                </label>
                <textarea
                  rows={4}
                  className="w-full border border-dashed border-[var(--ink-line)] rounded px-3 py-2 bg-paper font-[family-name:var(--font-serif)] text-sm resize-none"
                  placeholder={t("Décrivez votre demande en détail…")}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <Button
                variant="ink"
                icon={<Send size={16} />}
                onClick={handleFormSubmit}
              >
                {t("Envoyer au DPO")}
              </Button>
            </div>
          </PaperCard>
        </section>

        {/* Contact DPO */}
        <section className="mb-16">
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-3xl mb-6">
            {t("Contact DPO")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <PaperCard shadow="gold" className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Mail size={20} className="text-gold-deep" />
                <span className="font-semibold font-[family-name:var(--font-serif)]">{t("Délégué à la Protection des Données")}</span>
              </div>
              <p className="text-ink-faded text-sm mb-3 font-[family-name:var(--font-serif)]">
                {t("Pour toute question ou réclamation relative à vos données personnelles :")}
              </p>
              <a href="mailto:dpo@takemepic.app" className="text-gold-deep font-semibold underline">
                dpo@takemepic.app
              </a>
              <p className="text-xs text-ink-faded mt-2 font-[family-name:var(--font-type)]">{t("Réponse garantie sous 72 h ouvrées")}</p>
            </PaperCard>

            <PaperCard shadow="soft" className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck size={20} className="text-stamp-blue" />
                <span className="font-semibold font-[family-name:var(--font-serif)]">{t("Autorité de contrôle")}</span>
              </div>
              <p className="text-ink-faded text-sm mb-3 font-[family-name:var(--font-serif)]">
                {t("Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL :")}
              </p>
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noreferrer"
                className="text-gold-deep font-semibold underline"
              >
                www.cnil.fr
              </a>
              <p className="text-xs text-ink-faded mt-2 font-[family-name:var(--font-type)]">{t("Commission Nationale de l'Informatique et des Libertés")}</p>
            </PaperCard>
          </div>
        </section>
      </div>

      {/* Modal détail droit */}
      {modalRight && (
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={modalRight.title}
          size="md"
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>{t("Fermer")}</Button>
              <Button
                variant="gold"
                icon={<Send size={16} />}
                onClick={() => {
                  setModalOpen(false);
                  toast.push(t("Demande « {{title}} » transmise au DPO.", { title: modalRight.title }), "ok");
                }}
              >
                {t("Envoyer une demande")}
              </Button>
            </div>
          }
        >
          <div className="space-y-4 font-[family-name:var(--font-serif)]">
            <Chip color={modalRight.color} variant="outline">{modalRight.article}</Chip>
            <p className="text-ink-faded">{modalRight.description}</p>
            <div className="bg-paper-warm border-l-4 border-gold-deep p-4 rounded">
              <p className="font-semibold text-sm mb-1">{t("Comment exercer ce droit ?")}</p>
              <p className="text-sm text-ink-faded">{modalRight.howto}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
