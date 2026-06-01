"use client";

import { useState } from "react";
import { PageHero, Breadcrumb } from "@/components/marketing/MarketingBits";
import { Button, PaperCard, Stamp, Chip, Badge, Avatar } from "@/components/ui";
import { useToast } from "@/components/ui";
import { press, team } from "@/lib/data";
import { Download, Mail, ChevronRight, FileText, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useT } from "@/i18n/I18nProvider";

const MEDIA_MENTIONS = [
  { outlet: "Le Monde", type: "Quotidien national", article: "Ces applis qui révolutionnent le voyage en solo", date: "20 mai 2026", logo: "LM" },
  { outlet: "TechCrunch FR", type: "Média tech", article: "Take Me Pic raises €8M to build a photo-sharing travel community", date: "15 mai 2026", logo: "TC" },
  { outlet: "Libération", type: "Quotidien national", article: "Le karma du voyageur photographe", date: "10 avr. 2026", logo: "LB" },
  { outlet: "Forbes France", type: "Presse économique", article: "Les 25 startups françaises à suivre en 2026", date: "1 avr. 2026", logo: "FB" },
  { outlet: "Konbini", type: "Média millennial", article: "L'appli qui t'évite les selfies ratés en vacances", date: "18 mars 2026", logo: "KB" },
  { outlet: "L'Étudiant Voyageur", type: "Presse spécialisée", article: "Take Me Pic, la start-up de la photo entre voyageurs", date: "5 mars 2026", logo: "EV" },
];

const KIT_FILES = [
  { name: "Dossier de presse 2026", format: "PDF", size: "4,2 Mo" },
  { name: "Logos (SVG, PNG, couleur/blanc)", format: "ZIP", size: "2,1 Mo" },
  { name: "Photos d'application", format: "ZIP", size: "18 Mo" },
  { name: "Photos d'équipe haute résolution", format: "ZIP", size: "12 Mo" },
  { name: "Brand guidelines", format: "PDF", size: "3,8 Mo" },
  { name: "One-pager chiffres clés 2026", format: "PDF", size: "1,1 Mo" },
];

export default function PressPage() {
  const t = useT();
  const toast = useToast();
  const [downloadingKit, setDownloadingKit] = useState(false);

  function handleKitDownload() {
    setDownloadingKit(true);
    toast.push(t("Téléchargement du kit presse complet lancé (compressé en ZIP, 38 Mo)…"), "ok");
    setTimeout(() => setDownloadingKit(false), 3000);
  }

  function handleFileDownload(name: string) {
    toast.push(t("Téléchargement de « {{name}} » en cours…", { name }), "ok");
  }

  return (
    <div>
      <PageHero
        eyebrow={t("Relations presse")}
        title={t("Espace")}
        highlight={t("presse")}
        sub={t("Retrouvez ici tous les communiqués de presse, le kit média et nos contacts pour les journalistes. Nous répondons sous 24 h.")}
        stamp={`PRESSE\n★\n2026`}
      />

      <div className="mx-auto max-w-7xl px-5 py-12">
        <Breadcrumb items={[{ href: "/", label: t("Accueil") }, { label: t("Presse") }]} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-12">
            {/* Communiqués de presse */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-[family-name:var(--font-serif)] font-bold text-3xl">
                  {t("Communiqués de presse")}
                </h2>
                <Chip color="gold" variant="outline">{t("{{n}} communiqués", { n: press.length })}</Chip>
              </div>
              <div className="space-y-4">
                {press.map((article) => (
                  <PaperCard key={article.slug} shadow="soft" className="p-5 hover:shadow-gold transition cursor-pointer">
                    <Link href={`/press/${article.slug}`} className="group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText size={14} className="text-gold-deep" />
                            <span className="text-xs font-[family-name:var(--font-type)] text-ink-faded uppercase tracking-wider">
                              {t("Communiqué officiel")}
                            </span>
                          </div>
                          <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-2 group-hover:text-gold-deep transition">
                            {article.title}
                          </h3>
                          <p className="text-ink-faded font-[family-name:var(--font-serif)] text-sm mb-3">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-xs text-ink-faded font-[family-name:var(--font-type)]">
                              <Calendar size={11} />
                              {article.date}
                            </div>
                            <Badge tone="green" dot>{t("Officiel")}</Badge>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-ink-faded group-hover:text-gold-deep transition shrink-0 mt-2" />
                      </div>
                    </Link>
                  </PaperCard>
                ))}
              </div>
            </section>

            {/* Mentions médias */}
            <section>
              <h2 className="font-[family-name:var(--font-serif)] font-bold text-3xl mb-6">
                {t("On parle de nous")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {MEDIA_MENTIONS.map((m) => (
                  <PaperCard key={m.outlet} shadow="soft" className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-paper-warm border border-dashed border-[var(--ink-line)] rounded flex items-center justify-center shrink-0">
                        <span className="font-[family-name:var(--font-type)] font-bold text-xs text-ink-faded">
                          {m.logo}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold font-[family-name:var(--font-serif)] text-sm">{m.outlet}</p>
                        <p className="text-xs text-ink-faded font-[family-name:var(--font-type)] mb-1">{t(m.type)}</p>
                        <p className="text-sm font-[family-name:var(--font-serif)] text-ink-faded italic line-clamp-2">
                          &ldquo;{m.article}&rdquo;
                        </p>
                        <p className="text-xs text-ink-faded mt-1 font-[family-name:var(--font-type)]">{m.date}</p>
                      </div>
                    </div>
                  </PaperCard>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Kit presse */}
            <PaperCard shadow="gold" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg">{t("Kit presse")}</h3>
                <Stamp color="red" size={52} fontSize={8} rotate={-8}>{`KIT\n2026`}</Stamp>
              </div>
              <p className="text-ink-faded text-sm mb-4 font-[family-name:var(--font-serif)]">
                {t("Logos, photos, données clés, dossier de presse complet. Tout en un clic.")}
              </p>
              <Button
                variant="gold"
                full
                icon={<Download size={16} />}
                onClick={handleKitDownload}
                disabled={downloadingKit}
              >
                {downloadingKit ? t("Téléchargement…") : t("Télécharger le kit complet")}
              </Button>
              <div className="mt-4 space-y-2">
                {KIT_FILES.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => handleFileDownload(f.name)}
                    className="w-full flex items-center justify-between py-1.5 px-2 rounded hover:bg-paper-warm transition group"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <FileText size={13} className="text-gold-deep" />
                      <span className="font-[family-name:var(--font-serif)] group-hover:text-gold-deep transition">
                        {t(f.name)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-faded font-[family-name:var(--font-type)]">
                        {f.format} · {f.size}
                      </span>
                      <Download size={12} className="text-ink-faded group-hover:text-gold-deep transition" />
                    </div>
                  </button>
                ))}
              </div>
            </PaperCard>

            {/* Contact presse */}
            <PaperCard shadow="soft" className="p-6">
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-4">
                {t("Contact presse")}
              </h3>
              <div className="flex items-start gap-3 mb-4">
                <Avatar src={team[4].avatar} size={40} />
                <div>
                  <p className="font-semibold font-[family-name:var(--font-serif)]">{team[4].name}</p>
                  <p className="text-xs text-ink-faded font-[family-name:var(--font-type)]">{team[4].role}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm font-[family-name:var(--font-serif)]">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gold-deep" />
                  <a href="mailto:presse@takemepic.app" className="text-gold-deep underline">
                    presse@takemepic.app
                  </a>
                </div>
                <p className="text-ink-faded text-xs">
                  {t("Pour les demandes presse urgentes : réponse garantie sous 2 h ouvrées.")}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-dashed border-[var(--ink-line)]">
                <Button
                  variant="ghost"
                  size="sm"
                  full
                  icon={<Mail size={14} />}
                  onClick={() => toast.push(t("E-mail de contact presse ouvert."), "info")}
                >
                  {t("Écrire au service presse")}
                </Button>
              </div>
            </PaperCard>

            {/* Chiffres clés */}
            <PaperCard shadow="soft" className="p-6">
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-4">
                {t("Chiffres clés 2026")}
              </h3>
              <div className="space-y-3">
                {[
                  { label: t("Utilisateurs actifs"), value: "48 230" },
                  { label: t("Photos partagées"), value: "1 000 000+" },
                  { label: t("Pays représentés"), value: "42" },
                  { label: t("Spots photo validés"), value: "3 200" },
                  { label: t("Levée de fonds"), value: "8 M€" },
                  { label: t("Note App Store"), value: "4,8 ★" },
                ].map((kpi) => (
                  <div key={kpi.label} className="flex items-center justify-between text-sm">
                    <span className="text-ink-faded font-[family-name:var(--font-serif)]">{kpi.label}</span>
                    <span className="font-bold font-[family-name:var(--font-serif)]">{kpi.value}</span>
                  </div>
                ))}
              </div>
            </PaperCard>
          </aside>
        </div>
      </div>
    </div>
  );
}
