"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flag } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTable, Badge, Chip, Avatar, type Column } from "@/components/ui";
import { reports, type Report } from "@/lib/data";

type StatusFilter = "tous" | Report["status"];
type SeverityFilter = "tous" | Report["severity"];

function severityTone(s: Report["severity"]): "red" | "gold" | "neutral" {
  if (s === "high") return "red";
  if (s === "medium") return "gold";
  return "neutral";
}

function statusTone(s: Report["status"]): "red" | "blue" | "green" | "neutral" {
  if (s === "open") return "red";
  if (s === "reviewing") return "blue";
  if (s === "resolved") return "green";
  return "neutral";
}

function typeTone(t: Report["type"]): "sunset" | "blue" | "gold" | "neutral" {
  if (t === "user") return "sunset";
  if (t === "post") return "blue";
  if (t === "comment") return "gold";
  return "neutral";
}

const STATUS_OPTIONS: { key: StatusFilter; label: string }[] = [
  { key: "tous", label: "Tous" },
  { key: "open", label: "Ouverts" },
  { key: "reviewing", label: "En cours" },
  { key: "resolved", label: "Résolus" },
  { key: "dismissed", label: "Ignorés" },
];

const SEVERITY_OPTIONS: { key: SeverityFilter; label: string }[] = [
  { key: "tous", label: "Toutes sévérités" },
  { key: "high", label: "Haute" },
  { key: "medium", label: "Moyenne" },
  { key: "low", label: "Basse" },
];

const columns: Column<Report>[] = [
  {
    key: "id",
    header: "ID",
    cell: (r) => (
      <span className="font-[family-name:var(--font-mono)] text-[12px] text-ink-faded">
        #{r.id}
      </span>
    ),
    sortValue: (r) => r.id,
  },
  {
    key: "type",
    header: "Type",
    cell: (r) => <Badge tone={typeTone(r.type)}>{r.type}</Badge>,
    sortValue: (r) => r.type,
  },
  {
    key: "reason",
    header: "Raison",
    cell: (r) => (
      <span className="font-[family-name:var(--font-serif)] text-[13px]">{r.reason}</span>
    ),
    sortValue: (r) => r.reason,
  },
  {
    key: "reporter",
    header: "Signalé par",
    cell: (r) => (
      <div className="flex items-center gap-2">
        <Avatar src={r.reporter.avatar} size={24} />
        <span className="font-[family-name:var(--font-serif)] text-[13px]">
          {r.reporter.firstName} {r.reporter.lastName}
        </span>
      </div>
    ),
    sortValue: (r) => r.reporter.lastName,
  },
  {
    key: "target",
    header: "Cible",
    cell: (r) => (
      <span className="font-[family-name:var(--font-hand)] text-base text-ink">
        {r.target}
      </span>
    ),
    sortValue: (r) => r.target,
  },
  {
    key: "severity",
    header: "Sévérité",
    cell: (r) => (
      <Badge tone={severityTone(r.severity)}>
        {r.severity === "high" ? "Haute" : r.severity === "medium" ? "Moyenne" : "Basse"}
      </Badge>
    ),
    sortValue: (r) => r.severity,
  },
  {
    key: "status",
    header: "Statut",
    cell: (r) => (
      <Badge tone={statusTone(r.status)} dot>
        {r.status === "open"
          ? "Ouvert"
          : r.status === "reviewing"
          ? "En cours"
          : r.status === "resolved"
          ? "Résolu"
          : "Ignoré"}
      </Badge>
    ),
    sortValue: (r) => r.status,
  },
  {
    key: "date",
    header: "Date",
    cell: (r) => (
      <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
        {r.date}
      </span>
    ),
    sortValue: (r) => r.date,
  },
];

export default function ReportsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("tous");

  const filtered = reports.filter((r) => {
    const matchStatus = statusFilter === "tous" || r.status === statusFilter;
    const matchSeverity = severityFilter === "tous" || r.severity === severityFilter;
    return matchStatus && matchSeverity;
  });

  return (
    <AdminPage
      title="Signalements"
      eyebrow="tableau de bord des signalements ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/moderation", label: "Modération" },
        { label: "Signalements" },
      ]}
      actions={
        <div className="flex items-center gap-1.5 font-[family-name:var(--font-type)] text-[11px] uppercase tracking-widest text-ink-faded">
          <Flag size={13} />
          {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
        </div>
      }
    >
      {/* Status filter chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        {STATUS_OPTIONS.map((opt) => (
          <Chip
            key={opt.key}
            color={statusFilter === opt.key ? "ink" : "ink"}
            variant={statusFilter === opt.key ? "filled" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(opt.key)}
          >
            {opt.label}
          </Chip>
        ))}
      </div>
      {/* Severity filter chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {SEVERITY_OPTIONS.map((opt) => (
          <Chip
            key={opt.key}
            color={
              opt.key === "high"
                ? "red"
                : opt.key === "medium"
                ? "gold"
                : "ink"
            }
            variant={severityFilter === opt.key ? "filled" : "outline"}
            size="sm"
            onClick={() => setSeverityFilter(opt.key)}
          >
            {opt.label}
          </Chip>
        ))}
      </div>

      <DataTable<Report>
        columns={columns}
        rows={filtered as Report[]}
        onRowClick={(r) => router.push(`/admin/moderation/reports/${r.id}`)}
        searchable
        searchPlaceholder="rechercher un signalement…"
        pageSize={10}
        empty="Aucun signalement ne correspond aux filtres."
      />
    </AdminPage>
  );
}
