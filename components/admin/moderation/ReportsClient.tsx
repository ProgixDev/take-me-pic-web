"use client";

import { useMemo, useState, useTransition } from "react";
import { Flag } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Avatar, Badge, Button, Chip, DataTable, useToast, type Column } from "@/components/ui";
import { banUser, updateReportStatus, type ReportDecisionStatus } from "@/lib/admin/moderation-actions";
import type { ReportReadModel } from "@/lib/admin/moderation";

type StatusFilter = "tous" | ReportReadModel["status"];
type TargetFilter = "tous" | ReportReadModel["targetType"];

function statusTone(status: ReportReadModel["status"]): "red" | "blue" | "green" | "neutral" {
  if (status === "open") return "red";
  if (status === "reviewing") return "blue";
  if (status === "resolved") return "green";
  return "neutral";
}

function statusLabel(status: ReportReadModel["status"]) {
  if (status === "open") return "Ouvert";
  if (status === "reviewing") return "En cours";
  if (status === "resolved") return "Résolu";
  return "Ignoré";
}

function targetLabel(targetType: ReportReadModel["targetType"]) {
  if (targetType === "user") return "Utilisateur";
  if (targetType === "post") return "Publication";
  if (targetType === "comment") return "Commentaire";
  if (targetType === "session") return "Session";
  if (targetType === "conversation") return "Conversation";
  if (targetType === "message") return "Message";
  return "Cible";
}

function actionErrorMessage(result: { kind: string; message?: string }) {
  if (result.kind === "unauthenticated") return "Session Supabase manquante. Reconnecte-toi.";
  if (result.kind === "unauthorized") return "Ce compte n'a pas les droits staff pour cette action.";
  return result.message ?? "L'action de modération a échoué.";
}

function ReportRowActions({ report }: { report: ReportReadModel }) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  if (report.status === "resolved" || report.status === "dismissed") {
    return <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">—</span>;
  }

  const decide = (status: ReportDecisionStatus, successMessage: string) => {
    startTransition(async () => {
      const result = await updateReportStatus(report.id, status);
      if (result.kind === "ok") {
        toast.push(successMessage, "ok");
      } else {
        toast.push(actionErrorMessage(result), "err");
      }
    });
  };

  const ban = () => {
    if (!report.reportedUserId) return;
    startTransition(async () => {
      const result = await banUser(report.reportedUserId!, `Signalement #${report.id} : ${report.reason}`, {
        sourceReportId: report.id,
      });
      if (result.kind === "ok") {
        toast.push("Utilisateur banni.", "ok");
      } else {
        toast.push(actionErrorMessage(result), "err");
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {report.status === "open" && (
        <Button variant="paper" size="sm" disabled={pending} onClick={() => decide("reviewing", "Signalement en cours d'examen.")}>
          Examiner
        </Button>
      )}
      <Button variant="ink" size="sm" disabled={pending} onClick={() => decide("resolved", "Signalement résolu.")}>
        Résoudre
      </Button>
      <Button variant="ghost" size="sm" disabled={pending} onClick={() => decide("dismissed", "Signalement ignoré.")}>
        Ignorer
      </Button>
      {report.targetType === "user" && report.reportedUserId && (
        <Button variant="danger" size="sm" disabled={pending} onClick={ban}>
          Bannir
        </Button>
      )}
    </div>
  );
}

const columns: Column<ReportReadModel>[] = [
  {
    key: "reporter",
    header: "Signalé par",
    cell: (row) => (
      <div className="flex items-center gap-2">
        <Avatar src={row.reporter?.avatarUrl ?? undefined} size={24} />
        <span className="font-[family-name:var(--font-serif)] text-[13px]">
          {row.reporter ? [row.reporter.firstName, row.reporter.lastName].filter(Boolean).join(" ") || row.reporter.username : "Signalement anonyme"}
        </span>
      </div>
    ),
    sortValue: (row) => row.reporter?.username ?? "",
  },
  {
    key: "target",
    header: "Cible",
    cell: (row) => (
      <div className="flex flex-col gap-0.5">
        <Badge tone="neutral">{targetLabel(row.targetType)}</Badge>
        <span className="font-[family-name:var(--font-serif)] text-[13px]">{row.targetLabel}</span>
      </div>
    ),
    sortValue: (row) => row.targetLabel,
  },
  {
    key: "reason",
    header: "Motif",
    cell: (row) => <span className="font-[family-name:var(--font-serif)] text-[13px]">{row.reason}</span>,
    sortValue: (row) => row.reason,
  },
  {
    key: "status",
    header: "Statut",
    cell: (row) => (
      <Badge tone={statusTone(row.status)} dot>
        {statusLabel(row.status)}
      </Badge>
    ),
    sortValue: (row) => row.status,
  },
  {
    key: "resolvedAt",
    header: "Résolu le",
    cell: (row) => (
      <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
        {row.resolvedAt ?? "—"}
      </span>
    ),
    sortValue: (row) => row.resolvedAt ?? row.createdAt,
  },
  {
    key: "createdAt",
    header: "Créé le",
    cell: (row) => (
      <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
        {row.createdAt}
      </span>
    ),
    sortValue: (row) => row.createdAt,
  },
  {
    key: "actions",
    header: "Actions",
    cell: (row) => <ReportRowActions report={row} />,
  },
];

export function ReportsClient({ reports }: { reports: ReportReadModel[] }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");
  const [targetFilter, setTargetFilter] = useState<TargetFilter>("tous");

  const filtered = useMemo(() => {
    return reports.filter((report) => {
      const matchesStatus = statusFilter === "tous" || report.status === statusFilter;
      const matchesTarget = targetFilter === "tous" || report.targetType === targetFilter;
      return matchesStatus && matchesTarget;
    });
  }, [reports, statusFilter, targetFilter]);

  const openCount = reports.filter((report) => report.status === "open").length;
  const reviewingCount = reports.filter((report) => report.status === "reviewing").length;

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Ouverts
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-stamp-red">
            {openCount}
          </div>
        </div>
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            En cours
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-stamp-blue">
            {reviewingCount}
          </div>
        </div>
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Cibles utilisateurs
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-gold-deep">
            {reports.filter((report) => report.targetType === "user").length}
          </div>
        </div>
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Total
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl">
            {reports.length}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {(["tous", "open", "reviewing", "resolved", "dismissed"] as const).map((status) => (
          <Chip
            key={status}
            color="ink"
            variant={statusFilter === status ? "filled" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status)}
          >
            {status === "tous" ? "Tous" : statusLabel(status)}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {(["tous", "user", "post", "comment", "session", "conversation", "message"] as const).map((targetType) => (
          <Chip
            key={targetType}
            color="ink"
            variant={targetFilter === targetType ? "filled" : "outline"}
            size="sm"
            onClick={() => setTargetFilter(targetType)}
          >
            {targetType === "tous" ? "Toutes cibles" : targetLabel(targetType)}
          </Chip>
        ))}
      </div>

      <DataTable<ReportReadModel>
        columns={columns}
        rows={filtered}
        searchable
        searchPlaceholder="rechercher un signalement…"
        pageSize={10}
        empty="Aucun signalement ne correspond aux filtres."
      />
    </AdminPage>
  );
}
