"use client";

import { useState } from "react";
import { Edit2, Globe, FileText, CheckCircle } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  DataTable,
  Column,
  Badge,
  Button,
  StatCard,
  useToast,
} from "@/components/ui";

type PageStatus = "publié" | "brouillon" | "archivé";

interface StaticPage {
  id: string;
  name: string;
  slug: string;
  section: string;
  status: PageStatus;
  lastUpdated: string;
  author: string;
  wordCount: number;
}

const STATIC_PAGES: StaticPage[] = [
  { id: "p1", name: "Accueil", slug: "/", section: "Marketing", status: "publié", lastUpdated: "28 mai 2026", author: "Claire Bernard", wordCount: 420 },
  { id: "p2", name: "Comment ça marche", slug: "/how-it-works", section: "Marketing", status: "publié", lastUpdated: "25 mai 2026", author: "Léo Margaux", wordCount: 680 },
  { id: "p3", name: "À propos", slug: "/about", section: "Marketing", status: "publié", lastUpdated: "20 mai 2026", author: "Claire Bernard", wordCount: 510 },
  { id: "p4", name: "Tarifs", slug: "/pricing", section: "Marketing", status: "publié", lastUpdated: "18 mai 2026", author: "Marc Olivier", wordCount: 340 },
  { id: "p5", name: "Blog", slug: "/blog", section: "Marketing", status: "publié", lastUpdated: "15 mai 2026", author: "Inès Rahmouni", wordCount: 180 },
  { id: "p6", name: "Communauté", slug: "/community", section: "Marketing", status: "publié", lastUpdated: "12 mai 2026", author: "Inès Rahmouni", wordCount: 300 },
  { id: "p7", name: "Offres d'emploi", slug: "/careers", section: "Marketing", status: "publié", lastUpdated: "10 mai 2026", author: "Yasmine Karam", wordCount: 220 },
  { id: "p8", name: "Presse", slug: "/press", section: "Marketing", status: "publié", lastUpdated: "8 mai 2026", author: "Marc Olivier", wordCount: 190 },
  { id: "p9", name: "Centre d'aide", slug: "/help", section: "Support", status: "publié", lastUpdated: "5 mai 2026", author: "Yasmine Karam", wordCount: 450 },
  { id: "p10", name: "Charte de confiance", slug: "/trust", section: "Légal", status: "publié", lastUpdated: "1 mai 2026", author: "Claire Bernard", wordCount: 1200 },
  { id: "p11", name: "Conditions d'utilisation", slug: "/terms", section: "Légal", status: "publié", lastUpdated: "28 avr. 2026", author: "Claire Bernard", wordCount: 3400 },
  { id: "p12", name: "Politique de confidentialité", slug: "/privacy", section: "Légal", status: "publié", lastUpdated: "28 avr. 2026", author: "Claire Bernard", wordCount: 2800 },
  { id: "p13", name: "Page de téléchargement", slug: "/download", section: "Marketing", status: "publié", lastUpdated: "22 avr. 2026", author: "Sami Belkacem", wordCount: 260 },
  { id: "p14", name: "Page 404", slug: "/404", section: "Système", status: "publié", lastUpdated: "15 avr. 2026", author: "Léo Margaux", wordCount: 80 },
  { id: "p15", name: "Stories – Accueil", slug: "/stories", section: "Marketing", status: "publié", lastUpdated: "10 avr. 2026", author: "Inès Rahmouni", wordCount: 310 },
  { id: "p16", name: "Page d'annonce v2", slug: "/launch-v2", section: "Marketing", status: "brouillon", lastUpdated: "28 mai 2026", author: "Sami Belkacem", wordCount: 140 },
  { id: "p17", name: "Partenariats", slug: "/partners", section: "Marketing", status: "brouillon", lastUpdated: "20 mai 2026", author: "Marc Olivier", wordCount: 90 },
  { id: "p18", name: "Ancienne page d'accueil", slug: "/home-v1", section: "Archivé", status: "archivé", lastUpdated: "1 janv. 2026", author: "Léo Margaux", wordCount: 320 },
];

const STATUS_TONE: Record<PageStatus, "green" | "gold" | "neutral"> = {
  publié: "green",
  brouillon: "gold",
  archivé: "neutral",
};

const SECTION_TONE: Record<string, "blue" | "green" | "gold" | "neutral" | "red"> = {
  Marketing: "blue",
  Support: "green",
  Légal: "gold",
  Système: "neutral",
  Archivé: "neutral",
};

export default function StaticPagesPage() {
  const toast = useToast();
  const [sectionFilter, setSectionFilter] = useState<string>("tous");

  const sections = ["tous", ...Array.from(new Set(STATIC_PAGES.map((p) => p.section)))];

  const filtered =
    sectionFilter === "tous"
      ? STATIC_PAGES
      : STATIC_PAGES.filter((p) => p.section === sectionFilter);

  const publiées = STATIC_PAGES.filter((p) => p.status === "publié").length;
  const brouillons = STATIC_PAGES.filter((p) => p.status === "brouillon").length;

  const columns: Column<StaticPage>[] = [
    {
      key: "name",
      header: "Nom de la page",
      cell: (row) => (
        <span className="flex items-center gap-2">
          <FileText size={14} className="text-ink-faded shrink-0" />
          <span className="font-[family-name:var(--font-serif)] font-semibold text-[15px]">
            {row.name}
          </span>
        </span>
      ),
      sortValue: (row) => row.name,
    },
    {
      key: "slug",
      header: "URL",
      cell: (row) => (
        <span className="font-[family-name:var(--font-mono)] text-[12px] text-ink-faded">
          {row.slug}
        </span>
      ),
    },
    {
      key: "section",
      header: "Section",
      cell: (row) => (
        <Badge tone={SECTION_TONE[row.section] ?? "neutral"}>
          {row.section}
        </Badge>
      ),
      sortValue: (row) => row.section,
    },
    {
      key: "status",
      header: "Statut",
      cell: (row) => (
        <Badge tone={STATUS_TONE[row.status]} dot>
          {row.status}
        </Badge>
      ),
      sortValue: (row) => row.status,
    },
    {
      key: "wordCount",
      header: "Mots",
      align: "right",
      cell: (row) => (
        <span className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded">
          {row.wordCount.toLocaleString("fr-FR")}
        </span>
      ),
      sortValue: (row) => row.wordCount,
    },
    {
      key: "lastUpdated",
      header: "Dernière modif.",
      cell: (row) => (
        <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
          {row.lastUpdated}
        </span>
      ),
      sortValue: (row) => row.lastUpdated,
    },
    {
      key: "author",
      header: "Auteur",
      cell: (row) => (
        <span className="font-[family-name:var(--font-serif)] text-[13px]">
          {row.author}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          icon={<Edit2 size={13} />}
          onClick={(e) => {
            e.stopPropagation();
            toast.push(`Modification de la page « ${row.name} ».`, "info");
          }}
        >
          modifier
        </Button>
      ),
    },
  ];

  return (
    <AdminPage
      title="Pages statiques"
      eyebrow="CMS marketing"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/content", label: "Contenu" },
        { label: "Pages" },
      ]}
      actions={
        <Button
          variant="gold"
          size="sm"
          icon={<Globe size={14} />}
          onClick={() => toast.push("Nouvelle page — éditeur ouvert.", "info")}
        >
          Nouvelle page
        </Button>
      }
    >
      {/* CMS gap documented (TASK-008): marketing/legal pages are Next.js
          routes + i18n files, not database rows. */}
      <div className="mb-4 p-3 bg-gold-light/15 border-[1.5px] border-dashed border-gold-deep/40 rounded-[4px]">
        <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink">
          <strong>Aperçu local</strong> — ces pages sont des routes Next.js et des fichiers i18n,
          pas des enregistrements backend. Les modifier passe par le code du site ; un CMS dédié
          reste à décider.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Pages total"
          value={STATIC_PAGES.length}
          tone="ink"
          icon={<FileText size={18} />}
        />
        <StatCard
          label="Publiées"
          value={publiées}
          tone="green"
          icon={<CheckCircle size={18} />}
        />
        <StatCard
          label="Brouillons"
          value={brouillons}
          tone="gold"
        />
        <StatCard
          label="Sections"
          value={sections.length - 1}
          tone="blue"
          icon={<Globe size={18} />}
        />
      </div>

      {/* Section filter */}
      <div className="flex flex-wrap items-center gap-2 mb-5 overflow-x-auto pb-1">
        <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mr-1 shrink-0">
          Section :
        </span>
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => setSectionFilter(s)}
            className={`px-3 py-1.5 rounded-[4px] border-[1.5px] font-[family-name:var(--font-serif)] text-[13px] font-semibold transition cursor-pointer shrink-0 ${
              sectionFilter === s
                ? "bg-ink text-paper-warm border-ink"
                : "bg-card border-ink text-ink hover:bg-paper-warm"
            }`}
          >
            {s === "tous" ? "Toutes" : s}
          </button>
        ))}
        <span className="ml-auto font-[family-name:var(--font-type)] text-[11px] text-ink-faded shrink-0">
          {filtered.length} page{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      <DataTable<StaticPage & Record<string, unknown>>
        columns={columns as Column<StaticPage & Record<string, unknown>>[]}
        rows={filtered as (StaticPage & Record<string, unknown>)[]}
        searchable
        searchPlaceholder="rechercher par nom, URL, auteur…"
        pageSize={12}
        empty="Aucune page ne correspond."
      />
    </AdminPage>
  );
}
