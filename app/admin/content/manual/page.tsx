"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye, BookOpen } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  DataTable,
  Column,
  Badge,
  Chip,
  Button,
  PaperCard,
  Stamp,
  StatCard,
  useToast,
} from "@/components/ui";
import { guides, Guide, fmtNum } from "@/lib/data";

type StatusFilter = "tous" | "publié" | "brouillon";

const COLOR_CLASSES: Record<string, string> = {
  gold: "bg-gold-light/30 text-gold-deep border-gold-deep/40",
  blue: "bg-stamp-blue/15 text-stamp-blue border-stamp-blue/30",
  green: "bg-stamp-green/15 text-stamp-green border-stamp-green/30",
  sunset: "bg-sunset/15 text-sunset border-sunset/30",
};

export default function ManualPage() {
  const router = useRouter();
  const toast = useToast();
  const [filter, setFilter] = useState<StatusFilter>("tous");
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  const filtered = useMemo(() => {
    if (filter === "tous") return guides;
    return guides.filter((g) => g.status === filter);
  }, [filter]);

  const publiés = guides.filter((g) => g.status === "publié").length;
  const brouillons = guides.filter((g) => g.status === "brouillon").length;
  const totalVues = guides.reduce((acc, g) => acc + g.views, 0);

  const columns: Column<Guide>[] = [
    {
      key: "number",
      header: "N°",
      cell: (row) => (
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded-full border text-[12px] font-[family-name:var(--font-type)] font-bold uppercase tracking-[0.08em] ${COLOR_CLASSES[row.color]}`}
        >
          {row.number}
        </span>
      ),
      sortValue: (row) => row.number,
    },
    {
      key: "title",
      header: "Titre du secret",
      cell: (row) => (
        <span className="font-[family-name:var(--font-serif)] font-semibold text-[15px]">
          {row.title}
        </span>
      ),
      sortValue: (row) => row.title,
    },
    {
      key: "excerpt",
      header: "Extrait",
      cell: (row) => (
        <span className="text-ink-faded text-[13px] font-[family-name:var(--font-serif)] italic">
          {row.excerpt}
        </span>
      ),
    },
    {
      key: "status",
      header: "Statut",
      cell: (row) => (
        <Badge tone={row.status === "publié" ? "green" : "neutral"} dot>
          {row.status}
        </Badge>
      ),
      sortValue: (row) => row.status,
    },
    {
      key: "views",
      header: "Vues",
      align: "right",
      cell: (row) => (
        <span className="flex items-center justify-end gap-1.5 font-[family-name:var(--font-serif)] font-semibold text-gold-deep">
          <Eye size={13} className="opacity-70" />
          {row.status === "publié" ? fmtNum(row.views) : "—"}
        </span>
      ),
      sortValue: (row) => row.views,
    },
  ];

  const chips: { key: StatusFilter; label: string }[] = [
    { key: "tous", label: "Tous" },
    { key: "publié", label: "Publiés" },
    { key: "brouillon", label: "Brouillons" },
  ];

  return (
    <AdminPage
      title="Manuel du voyageur"
      eyebrow="les secrets photo"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/content", label: "Contenu" },
        { label: "Manuel" },
      ]}
      actions={
        <>
          <Button
            variant="paper"
            size="sm"
            onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
          >
            {viewMode === "table" ? "Vue cartes" : "Vue tableau"}
          </Button>
          <Button
            variant="gold"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => router.push("/admin/content/manual/new")}
          >
            + nouveau secret
          </Button>
        </>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Secrets total"
          value={guides.length}
          tone="ink"
          icon={<BookOpen size={18} />}
        />
        <StatCard
          label="Publiés"
          value={publiés}
          tone="green"
          icon={<Eye size={18} />}
        />
        <StatCard
          label="Brouillons"
          value={brouillons}
          tone="gold"
        />
        <StatCard
          label="Vues totales"
          value={fmtNum(totalVues)}
          delta="+14,3 %"
          tone="blue"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mr-1">
          Filtrer :
        </span>
        {chips.map((c) => (
          <Chip
            key={c.key}
            color={filter === c.key ? "ink" : c.key === "brouillon" ? "gold" : "ink"}
            variant={filter === c.key ? "filled" : "outline"}
            size="sm"
            onClick={() => setFilter(c.key)}
          >
            {c.label}
          </Chip>
        ))}
        <span className="ml-auto font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
          {filtered.length} secret{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Card view */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((guide) => (
            <PaperCard
              key={guide.id}
              shadow="ink"
              className="p-5 cursor-pointer hover:shadow-gold transition-all"
              onClick={() => router.push(`/admin/content/manual/${guide.id}`)}
            >
              <div className="flex items-start gap-3 mb-3">
                <span
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 text-[14px] font-[family-name:var(--font-type)] font-bold shrink-0 ${COLOR_CLASSES[guide.color]}`}
                >
                  {guide.number}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-[family-name:var(--font-serif)] font-bold text-[16px] leading-tight mb-0.5">
                    {guide.title}
                  </h3>
                  <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] leading-snug">
                    {guide.excerpt}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-[var(--ink-line)]">
                <Badge tone={guide.status === "publié" ? "green" : "neutral"} dot>
                  {guide.status}
                </Badge>
                {guide.status === "publié" && (
                  <span className="flex items-center gap-1 font-[family-name:var(--font-type)] text-[11px] text-gold-deep">
                    <Eye size={12} />
                    {fmtNum(guide.views)} vues
                  </span>
                )}
              </div>
            </PaperCard>
          ))}

          {/* New guide CTA card */}
          <PaperCard
            shadow="soft"
            border
            className="p-5 flex flex-col items-center justify-center text-center min-h-[160px] cursor-pointer border-dashed hover:shadow-gold transition-all"
            onClick={() => {
              toast.push("Nouveau secret — ouverture de l'éditeur.", "info");
              router.push("/admin/content/manual/new");
            }}
          >
            <div className="w-12 h-12 rounded-full bg-paper-warm border-[1.5px] border-dashed border-ink flex items-center justify-center mb-3">
              <Plus size={20} className="text-ink-faded" />
            </div>
            <p className="font-[family-name:var(--font-hand)] text-xl text-ink-faded">
              + nouveau secret
            </p>
          </PaperCard>
        </div>
      ) : (
        <DataTable<Guide & Record<string, unknown>>
          columns={columns as Column<Guide & Record<string, unknown>>[]}
          rows={filtered as (Guide & Record<string, unknown>)[]}
          onRowClick={(row) => router.push(`/admin/content/manual/${(row as unknown as Guide).id}`)}
          searchable
          searchPlaceholder="rechercher par titre, extrait…"
          pageSize={10}
          empty="Aucun secret ne correspond."
        />
      )}
    </AdminPage>
  );
}
