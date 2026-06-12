"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, BookOpen, Maximize2 } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTable, type Column, Badge, Button, PaperCard, StatCard } from "@/components/ui";
import type { ManualTip } from "@/lib/admin/content";

const COLOR_CLASSES: Record<string, string> = {
  gold: "bg-gold-light/30 text-gold-deep border-gold-deep/40",
  blue: "bg-stamp-blue/15 text-stamp-blue border-stamp-blue/30",
  green: "bg-stamp-green/15 text-stamp-green border-stamp-green/30",
  sunset: "bg-sunset/15 text-sunset border-sunset/30",
};

function colorClass(color: string) {
  return COLOR_CLASSES[color] ?? COLOR_CLASSES.gold;
}

function tipNumber(tip: ManualTip) {
  return String(tip.position).padStart(2, "0");
}

const columns: Column<ManualTip>[] = [
  {
    key: "position",
    header: "N°",
    cell: (row) => (
      <span
        className={`inline-flex items-center justify-center w-8 h-8 rounded-full border text-[12px] font-[family-name:var(--font-type)] font-bold uppercase tracking-[0.08em] ${colorClass(row.color)}`}
      >
        {tipNumber(row)}
      </span>
    ),
    sortValue: (row) => row.position,
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
    key: "body",
    header: "Extrait",
    cell: (row) => (
      <span className="text-ink-faded text-[13px] font-[family-name:var(--font-serif)] italic line-clamp-2">
        {row.body ?? "—"}
      </span>
    ),
  },
  {
    key: "big",
    header: "Format",
    cell: (row) => (
      <Badge tone={row.big ? "gold" : "neutral"}>{row.big ? "grand format" : "standard"}</Badge>
    ),
    sortValue: (row) => (row.big ? 1 : 0),
  },
];

export function ManualClient({ tips }: { tips: ManualTip[] }) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  const bigCount = tips.filter((t) => t.big).length;

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
        <Button
          variant="paper"
          size="sm"
          onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
        >
          {viewMode === "table" ? "Vue cartes" : "Vue tableau"}
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Secrets total" value={tips.length} tone="ink" icon={<BookOpen size={18} />} />
        <StatCard label="En ligne" value={tips.length} tone="green" icon={<Eye size={18} />} />
        <StatCard label="Grand format" value={bigCount} tone="gold" icon={<Maximize2 size={18} />} />
        <StatCard label="Standard" value={tips.length - bigCount} tone="blue" />
      </div>

      {/* Live-content note: framing_tips has no draft state — every row is
          visible in the app; creation/édition arrive avec les écritures de
          contenu. */}
      <div className="mb-5 p-3 bg-paper-warm/60 border-[1.5px] border-dashed border-[var(--ink-line)] rounded-[4px]">
        <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
          Lecture seule du contenu mobile (<code className="font-[family-name:var(--font-mono)] text-[12px]">framing_tips</code>)
          — pas d'état brouillon côté backend : chaque secret listé est en ligne dans l'app.
          La création et l'édition arrivent avec les écritures de contenu.
        </p>
      </div>

      {/* Card view */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tips.map((tip) => (
            <PaperCard
              key={tip.id}
              shadow="ink"
              className="p-5 cursor-pointer hover:shadow-gold transition-all"
              onClick={() => router.push(`/admin/content/manual/${tip.id}`)}
            >
              <div className="flex items-start gap-3 mb-3">
                <span
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full border-2 text-[14px] font-[family-name:var(--font-type)] font-bold shrink-0 ${colorClass(tip.color)}`}
                >
                  {tipNumber(tip)}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-[family-name:var(--font-serif)] font-bold text-[16px] leading-tight mb-0.5">
                    {tip.title}
                  </h3>
                  <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] leading-snug line-clamp-2">
                    {tip.body ?? "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-[var(--ink-line)]">
                <Badge tone="green" dot>
                  en ligne
                </Badge>
                <Badge tone={tip.big ? "gold" : "neutral"}>
                  {tip.big ? "grand format" : "standard"}
                </Badge>
              </div>
            </PaperCard>
          ))}
          {tips.length === 0 && (
            <div className="col-span-full py-12 text-center font-[family-name:var(--font-hand)] text-xl text-ink-faded">
              Aucun secret dans le manuel pour le moment.
            </div>
          )}
        </div>
      ) : (
        <DataTable<ManualTip>
          columns={columns}
          rows={tips}
          onRowClick={(row) => router.push(`/admin/content/manual/${row.id}`)}
          searchable
          searchPlaceholder="rechercher par titre, extrait…"
          pageSize={10}
          empty="Aucun secret ne correspond."
        />
      )}
    </AdminPage>
  );
}
