"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  MapPin,
  Shield,
  Eye,
  CheckCircle2,
  Heart,
  Bell,
  Lock,
} from "lucide-react";
import { PageHero, CtaBand } from "@/components/marketing/MarketingBits";
import {
  PaperCard,
  Stamp,
  Tape,
  Polaroid,
  Avatar,
  SectionHeading,
  Toggle,
  Badge,
} from "@/components/ui";
import { users } from "@/lib/data";
import { useT } from "@/i18n/I18nProvider";

const FAMILY_MEMBERS = [
  { name: "Papa", emoji: "👨", color: "bg-stamp-blue/20", online: true, location: "Alfama, Lisbonne" },
  { name: "Maman", emoji: "👩", color: "bg-stamp-red/20", online: true, location: "Miradouro, Lisbonne" },
  { name: "Lucas", emoji: "🧒", color: "bg-gold-light/30", online: true, location: "Tram 28, Lisbonne" },
  { name: "Chloé", emoji: "👧", color: "bg-stamp-green/20", online: false, location: "Café Lisboa" },
];

export default function FamilyPage() {
  const t = useT();
  const [sharingOn, setSharingOn] = useState(true);
  const [alertOn, setAlertOn] = useState(true);
  const [inviteOpen, setInviteOpen] = useState(false);

  const STRENGTHS = [
    { icon: <MapPin size={18} />, title: t("Carte partagée en famille"), body: t("Tous les membres de ton groupe apparaissent sur une même carte en temps réel. Plus de stress si l'un se perd.") },
    { icon: <Shield size={18} />, title: t("Mode enfant sécurisé"), body: t("Les comptes enfants ne peuvent contacter que les membres du groupe famille — aucun inconnu.") },
    { icon: <Bell size={18} />, title: t("Alertes de zone"), body: t("Reçois une notification si un enfant quitte la zone définie — plage, parc, musée.") },
    { icon: <Eye size={18} />, title: t("Photos de groupe faciles"), body: t("Un membre du groupe disponible peut proposer son aide pour les photos de famille.") },
    { icon: <Lock size={18} />, title: t("Galerie famille privée"), body: t("Les photos de session sont partagées dans un album chiffré, visible uniquement du groupe.") },
    { icon: <Heart size={18} />, title: t("Souvenirs ensemble"), body: t("À la fin du voyage, génère un album PDF des meilleures photos prises en famille avec TMP.") },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("fonctionnalité")}
        title={t("Album de famille")}
        highlight={t("voyagez ensemble")}
        sub={t("Mode famille pensé pour les parents voyageurs : carte partagée en temps réel, mode enfant sécurisé, alertes de zone et galerie privée pour vos souvenirs communs.")}
        stamp={t("FAMILLE\n★\nSECURE")}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">

        {/* ── Section 1 : carte famille ────────────────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <SectionHeading
              eyebrow={t("localisation partagée")}
              title={t("Savoir où sont")}
              highlight={t("les vôtres")}
              sub={t("Activez la carte partagée et voyez en temps réel où se trouvent les membres de votre groupe. Sécurisant sans être intrusif.")}
            />

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-4 bg-card border-[1.5px] border-ink rounded-[4px]">
                <div>
                  <div className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">{t("Partage de position")}</div>
                  <div className="font-[family-name:var(--font-serif)] text-ink-faded text-[12px]">{t("Visible uniquement du groupe")}</div>
                </div>
                <Toggle checked={sharingOn} onChange={setSharingOn} />
              </div>
              <div className="flex items-center justify-between p-4 bg-card border-[1.5px] border-ink rounded-[4px]">
                <div>
                  <div className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">{t("Alertes de zone")}</div>
                  <div className="font-[family-name:var(--font-serif)] text-ink-faded text-[12px]">{t("Notification si dépassement du périmètre")}</div>
                </div>
                <Toggle checked={alertOn} onChange={setAlertOn} />
              </div>
            </div>

            <button
              onClick={() => setInviteOpen(true)}
              className="mt-4 inline-flex h-[52px] items-center gap-2 px-6 rounded-[4px] bg-ink text-paper-warm font-[family-name:var(--font-serif)] font-semibold shadow-ink-sm hover:brightness-110 transition cursor-pointer"
            >
              <Users size={18} /> {t("Inviter la famille")}
            </button>

            {inviteOpen && (
              <PaperCard shadow="gold" className="mt-4 p-4 animate-fade-up">
                <div className="font-[family-name:var(--font-hand)] text-lg text-gold-deep mb-2">
                  {t("lien d'invitation généré ✿")}
                </div>
                <div className="font-[family-name:var(--font-type)] text-[11px] bg-paper-warm border border-ink/20 rounded-[2px] px-3 py-2 mb-2 break-all">
                  https://takemepic.app/family/join/abc123
                </div>
                <button
                  onClick={() => setInviteOpen(false)}
                  className="text-[12px] text-ink-faded font-[family-name:var(--font-serif)] underline cursor-pointer"
                >
                  {t("fermer")}
                </button>
              </PaperCard>
            )}
          </div>

          {/* Family map card */}
          <div className="relative">
            <Tape color="cream" rotate={2} className="absolute -top-3 left-1/3 z-10" />
            <PaperCard shadow="ink" className="overflow-hidden">
              <div className="relative h-56 map-hand">
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: "linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }} />
                {/* Member pins on the map */}
                {FAMILY_MEMBERS.map((m, i) => {
                  const positions = [
                    { top: "20%", left: "30%" },
                    { top: "35%", left: "60%" },
                    { top: "60%", left: "45%" },
                    { top: "55%", left: "22%" },
                  ];
                  const pos = positions[i];
                  return (
                    <div key={m.name} className="absolute" style={{ top: pos.top, left: pos.left, transform: "translate(-50%,-50%)" }}>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xl border-2 border-ink shadow-ink-sm ${m.online && sharingOn ? "" : "opacity-30"}`}>
                        {m.emoji}
                      </div>
                      {m.online && sharingOn && (
                        <div className="font-[family-name:var(--font-hand)] text-[10px] text-ink text-center mt-0.5 whitespace-nowrap">
                          {m.name}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="absolute bottom-2 right-2">
                  <Stamp color="blue" size={44} fontSize={8} rotate={6}>{t("CARTE\nFAMILLE")}</Stamp>
                </div>
              </div>
              <div className="p-4">
                <div className="font-[family-name:var(--font-hand)] text-lg text-gold-deep mb-3">
                  {t("les membres du groupe")}
                </div>
                <div className="space-y-2">
                  {FAMILY_MEMBERS.map((m) => (
                    <div key={m.name} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${m.color}`}>
                        {m.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">{m.name}</div>
                        <div className="font-[family-name:var(--font-serif)] text-ink-faded text-[11px]">
                          {sharingOn ? m.location : t("Position masquée")}
                        </div>
                      </div>
                      <Badge tone={m.online ? "green" : "neutral"} dot>
                        {m.online ? t("en ligne") : t("hors ligne")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </PaperCard>
          </div>
        </section>

        {/* ── Section 2 : mode enfant ──────────────────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative">
            <PaperCard shadow="gold" className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🧒</div>
                <div>
                  <div className="font-[family-name:var(--font-serif)] font-bold text-[16px]">{t("Mode enfant")}</div>
                  <Badge tone="green" dot>{t("actif")}</Badge>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: t("Contacts autorisés"), val: t("Famille uniquement") },
                  { label: t("Carte visible"), val: t("Zone définie") },
                  { label: t("Contenu communauté"), val: t("Masqué") },
                  { label: t("Photos envoyées à"), val: t("Album famille") },
                  { label: t("Publicités"), val: t("Désactivées") },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between items-center border-b border-ink/10 pb-2 last:border-0 last:pb-0">
                    <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">{r.label}</span>
                    <span className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">{r.val}</span>
                  </div>
                ))}
              </div>
              <Stamp color="green" size={52} fontSize={8} rotate={-6} className="absolute top-3 right-3">{`KID\n★\nSAFE`}</Stamp>
            </PaperCard>
            <Tape color="blue" rotate={5} className="absolute -bottom-3 -right-3" width={48} />
          </div>

          <div>
            <SectionHeading
              eyebrow={t("sécurité enfants")}
              title={t("Un mode pensé")}
              highlight={t("pour les plus jeunes")}
              sub={t("Le mode enfant isole le compte de toute interaction extérieure. Seuls les membres du groupe famille peuvent contacter l'enfant — pas d'inconnus, pas de risque.")}
            />
            <ul className="mt-6 space-y-2">
              {[
                t("Aucun contact possible avec des inconnus"),
                t("Photos partagées uniquement en famille"),
                t("Contenu communauté invisible"),
                t("Alerte si l'enfant quitte la zone"),
                t("Déconnexion impossible sans code parental"),
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 font-[family-name:var(--font-serif)] text-[14px]">
                  <CheckCircle2 size={16} className="text-stamp-green shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Section 3 : galerie de souvenirs ─────────────── */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <SectionHeading
              eyebrow={t("souvenirs")}
              title={t("Un album de famille")}
              highlight={t("qui se remplit tout seul")}
              sub={t("Chaque photo de session est automatiquement ajoutée à la galerie famille chiffrée. À la fin du voyage, exportez un album imprimable en un tap.")}
            />
            <ul className="mt-6 space-y-2">
              {[
                t("Album chiffré accessible uniquement au groupe"),
                t("Export PDF ou carnet imprimé (via partenaires)"),
                t("Tri automatique par jour et par lieu"),
                t("Commentaires de famille sur chaque photo"),
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 font-[family-name:var(--font-serif)] text-[14px]">
                  <CheckCircle2 size={16} className="text-stamp-green shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link href="/download">
                <span className="inline-flex h-[52px] items-center gap-2 px-6 rounded-[4px] bg-ink text-paper-warm font-[family-name:var(--font-serif)] font-semibold shadow-ink-sm hover:brightness-110 transition">
                  {t("Essayer le mode famille")}
                </span>
              </Link>
            </div>
          </div>

          <div className="relative">
            <Tape color="cream" rotate={-3} className="absolute -top-3 left-1/2 -translate-x-1/2 z-10" />
            <div className="flex flex-wrap gap-3 justify-center">
              <Polaroid
                src="https://picsum.photos/seed/family1/400/400"
                caption={t("Jour 1 · Lisbonne ♥")}
                width={145}
                tilt={-4}
                captionSize={12}
              />
              <Polaroid
                src="https://picsum.photos/seed/family2/400/400"
                caption={t("Alfama en famille")}
                width={130}
                tilt={5}
                captionSize={11}
              />
              <Polaroid
                src="https://picsum.photos/seed/family3/400/400"
                caption={t("Tram 28 ✿")}
                width={120}
                tilt={-2}
                captionSize={11}
              />
            </div>
          </div>
        </section>

        {/* ── Points forts ──────────────────────────────────── */}
        <section className="mb-24">
          <SectionHeading
            eyebrow={t("points forts")}
            title={t("L'album de famille,")}
            highlight={t("en détail")}
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

      </div>
      <CtaBand />
    </>
  );
}
