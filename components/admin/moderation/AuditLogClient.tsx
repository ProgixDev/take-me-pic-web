"use client";

import { useMemo, useState } from "react";
import { Clock, Download, Settings, ShieldCheck, User } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Badge, Button, Chip, DataTable, StatCard, type Column, useToast } from "@/components/ui";
import type { AuditActionEntry } from "@/lib/admin/moderation";

function actorLabel(actor: AuditActionEntry["actor"]) {
  if (!actor) return "Système";
  return [actor.firstName, actor.lastName].filter(Boolean).join(" ") || actor.username;
}

const columns: Column<AuditActionEntry>[] = [
  {
    key: "createdAt",
    header: "Horodatage",
    cell: (row) => (
      <span className="font-[family-name:var(--font-mono)] text-[12px] text-ink-faded whitespace-nowrap">
        {row.createdAt}
      </span>
    ),
    sortValue: (row) => row.createdAt,
  },
  {
    key: "actor",
    header: "Acteur",
    cell: (row) => (
      <span className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">
        {row.actor ? (
          <span className="flex items-center gap-1">
            <User size={12} className="opacity-60" />
            {actorLabel(row.actor)}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-ink-faded">
            <Settings size={12} className="opacity-60" />
            Système
          </span>
        )}
      </span>
    ),
    sortValue: (row) => actorLabel(row.actor),
  },
  {
    key: "action",
    header: "Action",
    cell: (row) => <Badge tone="neutral">{row.action}</Badge>,
    sortValue: (row) => row.action,
  },
  {
    key: "targetType",
    header: "Cible",
    cell: (row) => (
      <span className="font-[family-name:var(--font-mono)] text-[13px] text-ink">
        {row.targetType ?? "—"} {row.targetId ? `#${row.targetId}` : ""}
      </span>
    ),
    sortValue: (row) => `${row.targetType ?? ""} ${row.targetId ?? ""}`,
  },
  {
    key: "detailText",
    header: "Détail",
    cell: (row) => (
      <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
        {row.detailText}
      </span>
    ),
    sortValue: (row) => row.detailText,
  },
];

export function AuditLogClient({ entries }: { entries: AuditActionEntry[] }) {
  const toast = useToast();
  const actorOptions = useMemo(() => {
    const labels = entries.map((entry) => actorLabel(entry.actor));
    return ["tous", ...Array.from(new Set(labels))];
  }, [entries]);
  const [actorFilter, setActorFilter] = useState("tous");

  const filtered = useMemo(() => {
    if (actorFilter === "tous") return entries;
    return entries.filter((entry) => actorLabel(entry.actor) === actorFilter);
  }, [actorFilter, entries]);

  const systemActions = entries.filter((entry) => !entry.actor).length;

  return (
    <AdminPage
      title="Journal d'audit"
      eyebrow="traçabilité & sécurité"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { label: "Journal d'audit" },
      ]}
      actions={
        <Button
          variant="paper"
          size="sm"
          icon={<Download size={14} />}
          onClick={() => toast.push("Export CSV en cours…", "info")}
        >
          Exporter CSV
        </Button>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Entrées total" value={String(entries.length)} tone="ink" icon={<ShieldCheck size={18} />} />
        <StatCard
          label="Actions critiques"
          value={String(entries.filter((entry) => /ban|suspend|delete|remove|revoke/i.test(entry.action)).length)}
          tone="red"
        />
        <StatCard label="Actions système" value={String(systemActions)} icon={<Settings size={18} />} />
        <StatCard
          label="Aujourd'hui"
          value={String(entries.filter((entry) => entry.createdAt.startsWith(new Date().toISOString().slice(0, 10))).length)}
          tone="gold"
          icon={<Clock size={18} />}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mr-1">
          Acteur :
        </span>
        {actorOptions.map((actor) => (
          <Chip
            key={actor}
            color="ink"
            variant={actorFilter === actor ? "filled" : "outline"}
            size="sm"
            onClick={() => setActorFilter(actor)}
          >
            {actor === "tous" ? "Tous" : actor}
          </Chip>
        ))}
        <span className="ml-auto font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
          {filtered.length} entrée{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      <DataTable<AuditActionEntry>
        columns={columns}
        rows={filtered}
        searchable
        searchPlaceholder="rechercher acteur, action, cible, détail…"
        pageSize={15}
        empty="Aucune entrée dans le journal."
      />
    </AdminPage>
  );
}
