"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle, Clock, Star } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTable, type Column, Avatar, Badge, Chip, StatCard, fmtNum } from "@/components/ui";
import type { HelpRequestListItem, HelpRequestStatus } from "@/lib/admin/support";
import { STATUS_LABEL, STATUS_TONE, formatDateTime } from "@/components/admin/support/status";

type StatusFilter = "tous" | HelpRequestStatus;

function ParticipantCell({ profile }: { profile: HelpRequestListItem["requester"] }) {
  return (
    <span className="flex items-center gap-2.5">
      <Avatar src={profile?.avatarUrl ?? undefined} size={32} />
      <span className="flex flex-col min-w-0">
        <span className="font-semibold text-[13px] leading-tight truncate">
          {profile ? [profile.firstName, profile.lastName].filter(Boolean).join(" ") : "Profil supprimé"}
        </span>
        <span className="text-ink-faded text-[11px] font-[family-name:var(--font-type)] truncate">
          {profile?.username ?? "—"}
        </span>
      </span>
    </span>
  );
}

const columns: Column<HelpRequestListItem>[] = [
  {
    key: "id",
    header: "ID",
    cell: (row) => (
      <span className="font-[family-name:var(--font-mono)] text-[12px] text-ink-faded">#{row.id}</span>
    ),
    sortValue: (row) => row.id,
  },
  {
    key: "requester",
    header: "Demandeur",
    cell: (row) => <ParticipantCell profile={row.requester} />,
    sortValue: (row) => row.requester?.username ?? "",
  },
  {
    key: "helper",
    header: "Photographe",
    cell: (row) => <ParticipantCell profile={row.helper} />,
    sortValue: (row) => row.helper?.username ?? "",
  },
  {
    key: "status",
    header: "Statut",
    cell: (row) => (
      <Badge tone={STATUS_TONE[row.status]} dot>
        {STATUS_LABEL[row.status]}
      </Badge>
    ),
    sortValue: (row) => row.status,
  },
  {
    key: "acceptedAt",
    header: "Acceptée le",
    cell: (row) => (
      <span className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded">
        {formatDateTime(row.acceptedAt)}
      </span>
    ),
    sortValue: (row) => row.acceptedAt ?? "",
  },
  {
    key: "sessionAt",
    header: "Session le",
    cell: (row) => (
      <span className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded">
        {formatDateTime(row.sessionAt)}
      </span>
    ),
    sortValue: (row) => row.sessionAt ?? "",
  },
  {
    key: "completedAt",
    header: "Terminée le",
    cell: (row) => (
      <span className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded">
        {formatDateTime(row.completedAt)}
      </span>
    ),
    sortValue: (row) => row.completedAt ?? "",
  },
];

const FILTER_CHIPS: { key: StatusFilter; label: string }[] = [
  { key: "tous", label: "Toutes" },
  { key: "accepted", label: "Acceptées" },
  { key: "in_session", label: "En session" },
  { key: "completed", label: "Terminées" },
  { key: "rated", label: "Évaluées" },
];

export function SessionsClient({ sessions }: { sessions: HelpRequestListItem[] }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");

  const filtered = useMemo(() => {
    if (statusFilter === "tous") return sessions;
    return sessions.filter((s) => s.status === statusFilter);
  }, [sessions, statusFilter]);

  const enCours = sessions.filter((s) => s.status === "accepted" || s.status === "in_session").length;
  const terminees = sessions.filter((s) => s.status === "completed").length;
  const evaluees = sessions.filter((s) => s.status === "rated").length;

  return (
    <AdminPage
      title="Sessions photo"
      eyebrow="les rencontres"
      breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Sessions" }]}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Sessions totales" value={fmtNum(sessions.length)} tone="ink" icon={<Camera size={18} />} />
        <StatCard label="En cours" value={fmtNum(enCours)} tone="blue" icon={<Clock size={18} />} />
        <StatCard label="Terminées" value={fmtNum(terminees)} tone="green" icon={<CheckCircle size={18} />} />
        <StatCard label="Évaluées" value={fmtNum(evaluees)} tone="gold" icon={<Star size={18} />} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mr-1">
          Filtrer :
        </span>
        {FILTER_CHIPS.map((f) => (
          <Chip
            key={f.key}
            color={statusFilter === f.key ? "ink" : "ink"}
            variant={statusFilter === f.key ? "filled" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(f.key)}
          >
            {f.label}
          </Chip>
        ))}
        <span className="ml-auto font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      <DataTable<HelpRequestListItem>
        columns={columns}
        rows={filtered}
        onRowClick={(row) => router.push(`/admin/sessions/${row.id}`)}
        searchable
        searchPlaceholder="rechercher par demandeur, photographe…"
        pageSize={12}
        empty="Aucune session ne correspond à ce filtre."
      />
    </AdminPage>
  );
}
