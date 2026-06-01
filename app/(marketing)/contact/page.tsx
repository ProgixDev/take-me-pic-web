"use client";

import { useState } from "react";
import { Send, Mail, Newspaper, HeadphonesIcon, MapPin, Clock, ArrowRight } from "lucide-react";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import {
  PaperCard,
  Input,
  Textarea,
  Select,
  Button,
  Stamp,
  Chip,
  SectionHeading,
  useToast,
} from "@/components/ui";
import { useT } from "@/i18n/I18nProvider";

const SUBJECTS = [
  "Support technique",
  "Questions sur l'abonnement",
  "Signalement urgent",
  "Presse & partenariats",
  "Suggestions & feedbacks",
  "Autre",
];

type FormFields = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const EMPTY: FormFields = { name: "", email: "", subject: "", message: "" };

export default function ContactPage() {
  const t = useT();
  const { push } = useToast();
  const [form, setForm] = useState<FormFields>(EMPTY);
  const [sending, setSending] = useState(false);

  function update(field: keyof FormFields, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      push(t("Merci de remplir tous les champs obligatoires."), "err");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm(EMPTY);
      push(t("Votre message a bien été envoyé ! Nous répondons sous 24 h. ✉️"), "ok");
    }, 1000);
  }

  return (
    <>
      <PageHero
        eyebrow={t("on vous écoute")}
        title={t("Contactez-nous")}
        highlight={t("avec plaisir")}
        sub={t("Une question, un retour, une idée ? Notre équipe est là pour vous — en français, évidemment.")}
        stamp={t("24H\n★\nRÉPONSE")}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* ── Contact Form (3/5) ── */}
          <div className="lg:col-span-3">
            <SectionHeading
              eyebrow={t("écrivez-nous")}
              title={t("Votre message")}
              sub={t("Nous répondons généralement sous 24 heures les jours ouvrés.")}
              className="mb-8"
            />

            <PaperCard shadow="ink" className="p-6 md:p-8">
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                  <Input
                    label={t("Votre nom *")}
                    placeholder={t("Claire Bernard")}
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    required
                  />
                  <Input
                    label={t("Votre e-mail *")}
                    type="email"
                    placeholder="claire@exemple.fr"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    required
                  />
                </div>

                <Select
                  label={t("Objet du message")}
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                >
                  <option value="">{t("— Choisissez un sujet —")}</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {t(s)}
                    </option>
                  ))}
                </Select>

                <Textarea
                  label={t("Votre message *")}
                  placeholder={t("Décrivez votre question ou situation en détail…")}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="min-h-[160px]"
                  required
                />

                <div className="flex items-center justify-between mt-2 flex-wrap gap-3">
                  <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[12px]">
                    {t("* champs obligatoires")}
                  </p>
                  <Button
                    variant="gold"
                    size="md"
                    type="submit"
                    disabled={sending}
                    icon={<Send size={16} />}
                  >
                    {sending ? t("Envoi en cours…") : t("Envoyer le message")}
                  </Button>
                </div>
              </form>
            </PaperCard>

            {/* Response time assurance */}
            <div className="mt-5 flex items-center gap-2 font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px]">
              <Clock size={13} />
              {t("Réponse garantie sous 24 h en jours ouvrés (souvent beaucoup plus vite).")}
            </div>
          </div>

          {/* ── Sidebar Channels (2/5) ── */}
          <aside className="lg:col-span-2 space-y-5">
            <SectionHeading
              eyebrow={t("nos canaux")}
              title={t("Nous trouver")}
              className="mb-2"
            />

            {/* Email support */}
            <PaperCard shadow="soft" className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-paper-warm border-[1.5px] border-[var(--ink-line)] flex items-center justify-center shrink-0">
                  <HeadphonesIcon size={18} className="text-gold-deep" />
                </div>
                <div className="flex-1">
                  <h4 className="font-[family-name:var(--font-serif)] font-bold text-[15px] text-ink mb-1">
                    {t("Support utilisateurs")}
                  </h4>
                  <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-2">
                    {t("Pour toute question liée à votre compte, vos photos ou votre abonnement.")}
                  </p>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-gold-deep" />
                    <a
                      href="mailto:support@takemepic.app"
                      className="font-[family-name:var(--font-type)] text-[12px] text-gold-deep hover:text-ink transition"
                    >
                      support@takemepic.app
                    </a>
                  </div>
                  <div className="mt-2">
                    <Chip color="green" variant="outline" size="sm">
                      {t("Temps de réponse moyen : 4 h")}
                    </Chip>
                  </div>
                </div>
              </div>
            </PaperCard>

            {/* Press */}
            <PaperCard shadow="soft" className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-paper-warm border-[1.5px] border-[var(--ink-line)] flex items-center justify-center shrink-0">
                  <Newspaper size={18} className="text-stamp-blue" />
                </div>
                <div className="flex-1">
                  <h4 className="font-[family-name:var(--font-serif)] font-bold text-[15px] text-ink mb-1">
                    {t("Relations presse")}
                  </h4>
                  <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-2">
                    {t("Interviews, communiqués, kit médias et demandes d'images.")}
                  </p>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-stamp-blue" />
                    <a
                      href="mailto:presse@takemepic.app"
                      className="font-[family-name:var(--font-type)] text-[12px] text-stamp-blue hover:text-ink transition"
                    >
                      presse@takemepic.app
                    </a>
                  </div>
                </div>
              </div>
            </PaperCard>

            {/* General */}
            <PaperCard shadow="soft" className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-paper-warm border-[1.5px] border-[var(--ink-line)] flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-ink-faded" />
                </div>
                <div className="flex-1">
                  <h4 className="font-[family-name:var(--font-serif)] font-bold text-[15px] text-ink mb-1">
                    {t("Contact général")}
                  </h4>
                  <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-2">
                    {t("Partenariats, investisseurs, candidatures spontanées.")}
                  </p>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-ink-faded" />
                    <a
                      href="mailto:hello@takemepic.app"
                      className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded hover:text-ink transition"
                    >
                      hello@takemepic.app
                    </a>
                  </div>
                </div>
              </div>
            </PaperCard>

            {/* Map-hand decorative block */}
            <PaperCard shadow="gold" className="overflow-hidden">
              <div className="map-hand p-6 relative min-h-[180px]">
                {/* Decorative pin */}
                <div className="absolute right-5 top-5">
                  <Stamp color="red" shape="circle" size={68} fontSize={8} rotate={8}>
                    {`PARIS\n✦\nFRANCE`}
                  </Stamp>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin size={16} className="text-stamp-red" />
                    <span className="font-[family-name:var(--font-hand)] text-lg text-ink">
                      {t("Notre bureau")}
                    </span>
                  </div>
                  <p className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded leading-relaxed">
                    42, rue du Faubourg Saint-Antoine<br />
                    75011 Paris, France
                  </p>
                  <div className="mt-4">
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-[family-name:var(--font-serif)] font-semibold text-[13px] text-stamp-red hover:text-ink transition"
                    >
                      {t("Ouvrir dans Maps")}
                      <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              </div>
            </PaperCard>

            {/* Help center link */}
            <PaperCard shadow="none" border className="p-5">
              <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-2">
                {t("Vous cherchez une réponse rapide ?")}
              </p>
              <a
                href="/help"
                className="inline-flex items-center gap-1.5 font-[family-name:var(--font-serif)] font-semibold text-[14px] text-gold-deep hover:text-ink transition"
              >
                {t("Consulter le centre d'aide")}
                <ArrowRight size={14} />
              </a>
            </PaperCard>
          </aside>
        </div>
      </div>

      <CtaBand />
    </>
  );
}
