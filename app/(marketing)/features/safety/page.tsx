"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  MapPinOff,
  Flag,
  Lock,
  CheckCircle2,
  AlertTriangle,
  UserX,
  FileText,
  Eye,
} from "lucide-react";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import {
  PaperCard,
  Stamp,
  Tape,
  SectionHeading,
  Badge,
  Avatar,
  useToast,
} from "@/components/ui";
import { users } from "@/lib/data";
import { useT } from "@/i18n/I18nProvider";

export default function SafetyPage() {
  const t = useT();
  const { push } = useToast();
  const [gpsState, setGpsState] = useState(0);
  const [reportTarget, setReportTarget] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");

  const STRENGTHS = [
    { icon: <Shield size={18} />, title: t("Vérification d'identité"), body: t("Email, téléphone et selfie de vérification en 3 étapes. Tu sais toujours à qui tu as affaire.") },
    { icon: <MapPinOff size={18} />, title: t("GPS éphémère"), body: t("Ta position n'est partagée que pendant une session active. Dès qu'elle se termine, elle disparaît.") },
    { icon: <Flag size={18} />, title: t("Signalement en un tap"), body: t("Signale tout comportement déplacé depuis la fiche utilisateur — notre équipe examine sous 24 h.") },
    { icon: <UserX size={18} />, title: t("Blocage immédiat"), body: t("Bloque quelqu'un en un tap : il ne pourra plus te voir, te contacter ou te trouver sur la carte.") },
    { icon: <Lock size={18} />, title: t("Galerie chiffrée"), body: t("Tes photos sont chiffrées de bout en bout — ni nous ni personne ne peut y accéder.") },
    { icon: <FileText size={18} />, title: t("Conformité RGPD"), body: t("Tu peux exporter ou supprimer toutes tes données en un clic depuis les réglages.") },
  ];

  const VERIFICATION_STEPS = [
    { n: "01", icon: "📧", label: t("Adresse e-mail"), d: t("Confirmation par lien dans ta boîte mail.") },
    { n: "02", icon: "📱", label: t("Numéro de téléphone"), d: t("Code SMS — assure un compte unique par personne.") },
    { n: "03", icon: "🤳", label: t("Selfie de vérification"), d: t("Un selfie comparé à ta photo de profil. Aucun document stocké.") },
  ];

  const GPS_STATES = [
    { state: t("Hors session"), color: "neutral" as const, desc: t("Ta position n'est visible de personne. Tu es invisible sur la carte."), icon: <MapPinOff size={16} /> },
    { state: t("En session"), color: "green" as const, desc: t("Position partagée uniquement avec la personne que tu aides, le temps de la session."), icon: <Eye size={16} /> },
    { state: t("Fin de session"), color: "blue" as const, desc: t("Dès que la session se termine, ta position est effacée de nos serveurs."), icon: <Lock size={16} /> },
  ];

  function handleReport() {
    if (!reportReason) {
      push(t("Sélectionne une raison avant d'envoyer."), "err");
      return;
    }
    push(t("Signalement envoyé. Notre équipe examine sous 24 h."), "ok");
    setReportTarget(null);
    setReportReason("");
  }

  return (
    <>
      <PageHero
        eyebrow={t("sécurité & confiance")}
        title={t("Un espace sûr,")}
        highlight={t("pour chaque voyage")}
        sub={t("Vérification d'identité, GPS éphémère, signalement en un tap et conformité RGPD complète. La confiance est au cœur de chaque rencontre sur Take Me Pic.")}
        stamp={"SAFE\n★\nTRUST"}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">

        {/* ── Section 1 : vérification ─────────────────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <SectionHeading
              eyebrow={t("identité vérifiée")}
              title={t("Tu sais toujours")}
              highlight={t("à qui tu parles")}
              sub={t("Avant qu'un membre apparaisse sur la carte publique, il doit passer par nos 3 étapes de vérification. Pas de compte anonyme, pas d'inconnu mystère.")}
            />
            <ul className="mt-6 space-y-2">
              {[
                t("Selfie comparé à la photo de profil"),
                t("Un seul compte par numéro de téléphone"),
                t("Badge « Vérifié » visible sur le profil"),
                t("Nouvelle vérification après suspension"),
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 font-[family-name:var(--font-serif)] text-[14px]">
                  <CheckCircle2 size={16} className="text-stamp-green shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <Tape color="blue" rotate={-3} className="absolute -top-3 left-1/3 z-10" />
            <PaperCard shadow="ink" className="p-5">
              <div className="font-[family-name:var(--font-hand)] text-xl text-gold-deep mb-4">
                {t("3 étapes · 3 minutes")}
              </div>
              <div className="space-y-4">
                {VERIFICATION_STEPS.map((step) => (
                  <div key={step.n} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-paper-warm border-[1.5px] border-ink flex items-center justify-center text-xl shrink-0">
                      {step.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-[family-name:var(--font-type)] text-[10px] text-ink-faded">{step.n}</span>
                        <span className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">{step.label}</span>
                      </div>
                      <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[13px]">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 bg-stamp-green/10 border border-stamp-green/30 rounded-[4px] p-3">
                <CheckCircle2 size={16} className="text-stamp-green shrink-0" />
                <span className="font-[family-name:var(--font-serif)] text-[13px] text-stamp-green font-semibold">
                  {t("Aucun document d'identité stocké sur nos serveurs.")}
                </span>
              </div>
              <Stamp color="green" size={52} fontSize={8} rotate={-6} className="absolute top-3 right-3">{`VÉRI\nFIÉ`}</Stamp>
            </PaperCard>
          </div>
        </section>

        {/* ── Section 2 : GPS éphémère ─────────────────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative order-2 md:order-1">
            <PaperCard shadow="gold" className="p-5">
              <div className="font-[family-name:var(--font-hand)] text-xl text-gold-deep mb-4">
                {t("état du GPS")}
              </div>
              <div className="space-y-3 mb-4">
                {GPS_STATES.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setGpsState(i)}
                    className={`w-full text-left p-3 rounded-[4px] border-[1.5px] transition cursor-pointer flex items-start gap-3 ${
                      gpsState === i ? "bg-ink text-paper-warm border-ink" : "bg-card border-ink hover:bg-paper-warm"
                    }`}
                  >
                    <span className={`mt-0.5 shrink-0 ${gpsState === i ? "text-gold-light" : "text-gold-deep"}`}>
                      {s.icon}
                    </span>
                    <div>
                      <div className="font-[family-name:var(--font-serif)] font-semibold text-[13px] mb-0.5">{s.state}</div>
                      <div className={`font-[family-name:var(--font-serif)] text-[12px] ${gpsState === i ? "text-paper-warm/70" : "text-ink-faded"}`}>
                        {s.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={GPS_STATES[gpsState].color} dot>
                  {GPS_STATES[gpsState].state}
                </Badge>
                <span className="font-[family-name:var(--font-serif)] text-ink-faded text-[12px]">
                  {t("état actuel de ta position")}
                </span>
              </div>
            </PaperCard>
          </div>

          <div className="order-1 md:order-2">
            <SectionHeading
              eyebrow={t("vie privée GPS")}
              title={t("Ta position,")}
              highlight={t("uniquement quand tu choisis")}
              sub={t("Ta localisation n'est jamais partagée en permanence. Elle apparaît uniquement pendant une session active et disparaît immédiatement après — sans laisser de trace.")}
            />
            <ul className="mt-6 space-y-2">
              {[
                t("Pas de suivi en arrière-plan"),
                t("Position effacée dès la fin de session"),
                t("Aucune vente de données de localisation"),
                t("Rayon affiché — pas le point GPS exact"),
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 font-[family-name:var(--font-serif)] text-[14px]">
                  <CheckCircle2 size={16} className="text-stamp-green shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Section 3 : signaler / bloquer ──────────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <SectionHeading
              eyebrow={t("signalement & blocage")}
              title={t("En cas de problème,")}
              highlight={t("agis en un tap")}
              sub={t("Un comportement déplacé ? Un faux profil ? Signale ou bloque immédiatement. Notre équipe Trust & Safety examine chaque signalement sous 24 heures.")}
            />
            <ul className="mt-6 space-y-2">
              {[
                t("Signalement depuis la fiche du membre"),
                t("Blocage immédiat — invisible l'un pour l'autre"),
                t("Traitement sous 24 h par notre équipe"),
                t("Suspension automatique à 3 signalements validés"),
                t("Aucune représaille possible"),
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 font-[family-name:var(--font-serif)] text-[14px]">
                  <CheckCircle2 size={16} className="text-stamp-green shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <Tape color="red" rotate={4} className="absolute -top-3 right-8 z-10" width={52} />
            <PaperCard shadow="ink" className="p-5">
              <div className="font-[family-name:var(--font-hand)] text-xl text-gold-deep mb-4">
                {t("signaler un membre")}
              </div>

              {/* Member list */}
              <div className="space-y-2 mb-4">
                {users.slice(0, 3).map((u) => (
                  <div key={u.id} className="flex items-center gap-3 p-2 rounded-[4px] border border-ink/10 hover:bg-paper-warm/50 transition">
                    <Avatar src={u.avatar} size={32} />
                    <div className="flex-1">
                      <div className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">
                        {u.firstName} {u.lastName}
                      </div>
                      <div className="font-[family-name:var(--font-serif)] text-ink-faded text-[11px]">{u.city}</div>
                    </div>
                    <button
                      onClick={() => setReportTarget(u.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-[4px] border-[1.5px] text-[11px] font-[family-name:var(--font-serif)] cursor-pointer transition ${
                        reportTarget === u.id
                          ? "bg-stamp-red text-paper-warm border-stamp-red"
                          : "border-stamp-red/50 text-stamp-red hover:bg-stamp-red/10"
                      }`}
                    >
                      <Flag size={12} />
                      {t("Signaler")}
                    </button>
                  </div>
                ))}
              </div>

              {reportTarget && (
                <div className="border-t border-ink/10 pt-4 animate-fade-up">
                  <div className="font-[family-name:var(--font-serif)] font-semibold text-[13px] mb-2">{t("Raison du signalement")}</div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {[t("Comportement déplacé"), t("Faux profil"), t("Harcèlement"), t("Spam")].map((r) => (
                      <button
                        key={r}
                        onClick={() => setReportReason(r)}
                        className={`px-3 py-1 rounded-full border text-[12px] font-[family-name:var(--font-serif)] cursor-pointer transition ${
                          reportReason === r
                            ? "bg-ink text-paper-warm border-ink"
                            : "border-ink/30 text-ink hover:bg-card"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleReport}
                      className="flex-1 h-10 rounded-[4px] bg-stamp-red text-paper-warm font-[family-name:var(--font-serif)] font-semibold text-[13px] cursor-pointer hover:brightness-110 transition"
                    >
                      {t("Envoyer le signalement")}
                    </button>
                    <button
                      onClick={() => { setReportTarget(null); setReportReason(""); }}
                      className="px-4 h-10 rounded-[4px] border-[1.5px] border-ink text-ink font-[family-name:var(--font-serif)] text-[13px] cursor-pointer hover:bg-paper-warm transition"
                    >
                      {t("Annuler")}
                    </button>
                  </div>
                </div>
              )}
            </PaperCard>
          </div>
        </section>

        {/* ── Section 4 : RGPD ─────────────────────────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative">
            <PaperCard shadow="gold" className="p-5">
              <div className="font-[family-name:var(--font-hand)] text-xl text-gold-deep mb-4">
                {t("tes droits RGPD")}
              </div>
              <div className="space-y-3">
                {[
                  { emoji: "📤", label: t("Exporter mes données"), d: t("Télécharge toutes tes données en JSON dans les réglages.") },
                  { emoji: "✏️", label: t("Corriger mes informations"), d: t("Modifie ou corrige n'importe quelle donnée à tout moment.") },
                  { emoji: "🗑️", label: t("Supprimer mon compte"), d: t("Suppression complète de toutes tes données en 30 jours.") },
                  { emoji: "🚫", label: t("Retirer mon consentement"), d: t("Désactive le marketing, les analytics ou le GPS à tout moment.") },
                ].map((r) => (
                  <div key={r.label} className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-full bg-paper-warm border border-ink/20 flex items-center justify-center text-lg shrink-0">
                      {r.emoji}
                    </div>
                    <div>
                      <div className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">{r.label}</div>
                      <div className="font-[family-name:var(--font-serif)] text-ink-faded text-[12px]">{r.d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Stamp color="blue" size={52} fontSize={8} rotate={6} className="absolute top-3 right-3">{`RGPD\n★\n2026`}</Stamp>
            </PaperCard>
          </div>

          <div>
            <SectionHeading
              eyebrow={t("transparence & droits")}
              title={t("Tes données,")}
              highlight={t("tu decides")}
              sub="We take the GDPR seriously. Every piece of data we hold is yours. You can export, correct or delete everything at any time — no hoops, no delays."
            />
            <ul className="mt-6 space-y-2">
              {[
                t("Données hébergées en Europe (UE)"),
                t("Aucune vente de données à des tiers"),
                t("Politique de confidentialité en français"),
                t("DPO joignable par e-mail en 48 h"),
                t("Audit de sécurité annuel par un tiers"),
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 font-[family-name:var(--font-serif)] text-[14px]">
                  <CheckCircle2 size={16} className="text-stamp-green shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/help/safety">
                <span className="inline-flex h-[52px] items-center gap-2 px-6 rounded-[4px] bg-ink text-paper-warm font-[family-name:var(--font-serif)] font-semibold shadow-ink-sm hover:brightness-110 transition">
                  {t("Centre d'aide sécurité")}
                </span>
              </Link>
              <Link href="/legal/privacy">
                <span className="inline-flex h-[52px] items-center gap-2 px-6 rounded-[4px] border-[1.5px] border-dashed border-ink/40 text-ink font-[family-name:var(--font-serif)] font-semibold hover:bg-card/60 transition">
                  {t("Politique de confidentialité")}
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Points forts ──────────────────────────────────── */}
        <section className="mb-24">
          <SectionHeading
            eyebrow={t("points forts")}
            title={t("Nos engagements")}
            highlight={t("sécurité & confiance")}
            center
            className="mb-10"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STRENGTHS.map((s, i) => (
              <PaperCard key={i} shadow="soft" tilt={i % 2 === 0 ? 0.3 : -0.3} className="p-5">
                <div className="w-9 h-9 rounded-full bg-gold-light/30 flex items-center justify-center text-gold-deep mb-3">
                  {s.icon}
                </div>
                <div className="font-[family-name:var(--font-serif)] font-bold text-[15px] mb-1 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-stamp-green shrink-0" />
                  {s.title}
                </div>
                <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[13px] leading-relaxed">
                  {s.body}
                </p>
              </PaperCard>
            ))}
          </div>
        </section>

        {/* ── Trust stats ───────────────────────────────────── */}
        <section className="mb-16">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { v: "< 24 h", l: t("délai de traitement d'un signalement") },
              { v: "100 %", l: t("des données hébergées en Europe") },
              { v: "0", l: t("vente de données à des tiers") },
            ].map((s) => (
              <PaperCard key={s.l} shadow="gold" className="py-8 px-4">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[clamp(22px,4vw,40px)] tracking-[-0.02em] text-gold-deep">
                  {s.v}
                </div>
                <div className="font-[family-name:var(--font-serif)] text-ink-faded text-[13px] mt-1">
                  {s.l}
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
