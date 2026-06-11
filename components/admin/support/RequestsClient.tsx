"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Inbox, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTable, type Column, Avatar, Badge, Chip, StatCard, fmtNum } from "@/components/ui";
import type { HelpRequestListItem, HelpRequestStatus } from "@/lib/admin/support";
import { STATUS_LABEL, STATUS_TONE, formatDateTime } from "@/components/admin/support/status";

type StatusFilter = "tous" | HelpRequestStatus;

function ParticipantCell({ profile, fallback }: { profile: HelpRequestListItem["requester"]; fallback: string }) {
  return (
    <span className="flex items-center gap-2.5">
      <Avatar src={profile?.avatarUrl ?? undefined} size={30} />
      <span className="flex flex-col min-w-0">
        <span className="font-semibold text-[13px] leading-tight truncate">
          {profile ? [profile.firstName, profile.lastName].filter(Boolean).join(" ") : fallback}
        </span>
        <span className="text-ink-faded text-[11px] font-[family-name:var(--font-type)]">
          {profile?.username ?? "—"}
        </span>
      </span>
    </span>
  );
}

const columns: Column<HelpRequestListItem>[] = [
  {
    key: "id",
    header: "Réf.",
    cell: (row) => (
      <span className="font-[family-name:var(--font-mono)] text-[12px] text-ink-faded">#{row.id}</span>
    ),
    sortValue: (row) => row.id,
  },
  {
    key: "requester",
    header: "Demandeur",
    cell: (row) => <ParticipantCell profile={row.requester} fallback="Profil supprimé" />,
    sortValue: (row) => row.requester?.username ?? "",
  },
  {
    key: "helper",
    header: "Photographe",
    cell: (row) =>
      row.helper ? (
        <ParticipantCell profile={row.helper} fallback="Profil supprimé" />
      ) : (
        <span className="text-ink-faded text-[12px]">non assigné</span>
      ),
    sortValue: (row) => row.helper?.username ?? "",
  },
  {
    key: "peopleCount",
    header: "Pers.",
    align: "center",
    cell: (row) => <span className="font-[family-name:var(--font-serif)] text-[13px]">{row.peopleCount}</span>,
    sortValue: (row) => row.peopleCount,
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
    key: "createdAt",
    header: "Créée le",
    cell: (row) => (
      <span className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded">
        {formatDateTime(row.createdAt)}
      </span>
    ),
    sortValue: (row) => row.createdAt,
  },
  {
    key: "expiresAt",
    header: "Expiration",
    cell: (row) => (
      <span className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded">
        {formatDateTime(row.expiresAt)}
      </span>
    ),
    sortValue: (row) => row.expiresAt ?? "",
  },
];

const FILTER_CHIPS: { key: StatusFilter; label: string }[] = [
  { key: "tous", label: "Toutes" },
  { key: "requested", label: "Demandées" },
  { key: "accepted", label: "Acceptées" },
  { key: "in_session", label: "En session" },
  { key: "completed", label: "Terminées" },
  { key: "rated", label: "Évaluées" },
  { key: "cancelled", label: "Annulées" },
  { key: "expired", label: "Expirées" },
];

export function RequestsClient({ requests }: { requests: HelpRequestListItem[] }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");

  const filtered = useMemo(() => {
    if (statusFilter === "tous") return requests;
    return requests.filter((r) => r.status === statusFilter);
  }, [requests, statusFilter]);

  const enAttente = requests.filter((r) => r.status === "requested").length;
  const actives = requests.filter((r) => r.status === "accepted" || r.status === "in_session").length;
  const expirees = requests.filter((r) => r.status === "expired" || r.status === "cancelled").length;

  return (
    <AdminPage
      title="Demandes photo"
      eyebrow="les plis envoyés"
      breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Demandes" }]}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Demandes totales" value={fmtNum(requests.length)} tone="ink" icon={<Inbox size={18} />} />
        <StatCard label="En attente" value={fmtNum(enAttente)} tone="gold" icon={<Clock size={18} />} />
        <StatCard label="Actives" value={fmtNum(actives)} tone="blue" icon={<CheckCircle size={18} />} />
        <StatCard label="Expirées / annulées" value={fmtNum(expirees)} tone="red" icon={<AlertCircle size={18} />} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mr-1">
          Filtrer :
        </span>
        {FILTER_CHIPS.map((f) => (
          <Chip
            key={f.key}
            color={statusFilter === f.key ? "ink" : f.key === "cancelled" || f.key === "expired" ? "red" : "ink"}
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
        onRowClick={(row) => router.push(`/admin/requests/${row.id}`)}
        searchable
        searchPlaceholder="rechercher par demandeur, photographe…"
        pageSize={12}
        empty="Aucune demande ne correspond à ce filtre."
      />
    </AdminPage>
  );
}
