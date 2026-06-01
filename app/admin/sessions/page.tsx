"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle, Clock, XCircle, Download } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  DataTable,
  Column,
  Avatar,
  Badge,
  Chip,
  Button,
  StatCard,
  useToast,
} from "@/components/ui";
import { sessions, PhotoSession, fmtNum } from "@/lib/data";

type StatusFilter = "tous" | "completed" | "active" | "cancelled" | "pending";

const STATUS_TONE: Record<string, "green" | "blue" | "red" | "gold" | "neutral"> = {
  completed: "green",
  active: "blue",
  cancelled: "red",
  pending: "gold",
};

const STATUS_LABEL: Record<string, string> = {
  completed: "terminée",
  active: "en cours",
  cancelled: "annulée",
  pending: "en attente",
};

const FILTER_CHIPS: { key: StatusFilter; label: string }[] = [
  { key: "tous", label: "Toutes" },
  { key: "active", label: "En cours" },
  { key: "completed", label: "Terminées" },
  { key: "pending", label: "En attente" },
  { key: "cancelled", label: "Annulées" },
];

export default function SessionsPage() {
  const router = useRouter();
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");

  const filtered = useMemo(() => {
    if (statusFilter === "tous") return sessions;
    return sessions.filter((s) => s.status === statusFilter);
  }, [statusFilter]);

  const total = sessions.length;
  const actives = sessions.filter((s) => s.status === "active").length;
  const terminees = sessions.filter((s) => s.status === "completed").length;
  const annulees = sessions.filter((s) => s.status === "cancelled").length;
  const tauxAnnulation = total > 0 ? Math.round((annulees / total) * 100) : 0;

  const columns: Column<PhotoSession>[] = [
    {
      key: "id",
      header: "ID",
      cell: (row) => (
        <span className="font-[family-name:var(--font-mono)] text-[12px] text-ink-faded">
          {row.id}
        </span>
      ),
      sortValue: (row) => row.id,
    },
    {
      key: "requester",
      header: "Demandeur",
      cell: (row) => (
        <span className="flex items-center gap-2.5">
          <Avatar src={row.requester.avatar} size={32} />
          <span className="flex flex-col min-w-0">
            <span className="font-semibold text-[13px] leading-tight truncate">
              {row.requester.firstName} {row.requester.lastName}
            </span>
            <span className="text-ink-faded text-[11px] font-[family-name:var(--font-type)] truncate">
              {row.requester.username}
            </span>
          </span>
        </span>
      ),
      sortValue: (row) => `${row.requester.firstName} ${row.requester.lastName}`,
    },
    {
      key: "photographer",
      header: "Photographe",
      cell: (row) => (
        <span className="flex items-center gap-2.5">
          <Avatar src={row.photographer.avatar} size={32} />
          <span className="flex flex-col min-w-0">
            <span className="font-semibold text-[13px] leading-tight truncate">
              {row.photographer.firstName} {row.photographer.lastName}
            </span>
            <span className="text-ink-faded text-[11px] font-[family-name:var(--font-type)] truncate">
              {row.photographer.username}
            </span>
          </span>
        </span>
      ),
      sortValue: (row) => `${row.photographer.firstName} ${row.photographer.lastName}`,
    },
    {
      key: "spot",
      header: "Spot · Ville",
      cell: (row) => (
        <span className="flex flex-col">
          <span className="text-[13px] font-medium">{row.spot}</span>
          <span className="text-ink-faded text-[11px]">{row.city}</span>
        </span>
      ),
      sortValue: (row) => row.city,
    },
    {
      key: "status",
      header: "Statut",
      cell: (row) => (
        <Badge tone={STATUS_TONE[row.status] ?? "neutral"} dot>
          {STATUS_LABEL[row.status]}
        </Badge>
      ),
      sortValue: (row) => row.status,
    },
    {
      key: "photos",
      header: "Photos",
      align: "center",
      cell: (row) => (
        <span className="font-[family-name:var(--font-serif)] font-bold text-[14px]">
          {row.photos}
        </span>
      ),
      sortValue: (row) => row.photos,
    },
    {
      key: "karmaAwarded",
      header: "Karma",
      align: "right",
      cell: (row) => (
        <span className="font-[family-name:var(--font-serif)] font-bold text-gold-deep">
          +{row.karmaAwarded}
        </span>
      ),
      sortValue: (row) => row.karmaAwarded,
    },
    {
      key: "rating",
      header: "Note",
      align: "center",
      cell: (row) =>
        row.rating != null ? (
          <span className="flex items-center gap-1 justify-center">
            <span className="text-gold-deep">★</span>
            <span className="font-[family-name:var(--font-serif)] text-[13px]">
              {row.rating.toFixed(1)}
            </span>
          </span>
        ) : (
          <span className="text-ink-faded text-[12px]">—</span>
        ),
      sortValue: (row) => row.rating ?? 0,
    },
    {
      key: "date",
      header: "Date",
      cell: (row) => (
        <span className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded">
          {row.date}
        </span>
      ),
      sortValue: (row) => row.date,
    },
  ];

  return (
    <AdminPage
      title="Sessions photo"
      eyebrow="les rencontres"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { label: "Sessions" },
      ]}
      actions={
        <Button
          variant="paper"
          size="sm"
          icon={<Download size={14} />}
          onClick={() => toast.push("Export CSV en cours…", "info")}
        >
          Exporter
        </Button>
      }
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Sessions totales"
          value={fmtNum(total)}
          delta="+8,1 %"
          tone="ink"
          icon={<Camera size={18} />}
        />
        <StatCard
          label="En cours"
          value={fmtNum(actives)}
          tone="blue"
          icon={<Clock size={18} />}
        />
        <StatCard
          label="Terminées"
          value={fmtNum(terminees)}
          delta="+11,3 %"
          tone="green"
          icon={<CheckCircle size={18} />}
        />
        <StatCard
          label="Taux d'annulation"
          value={`${tauxAnnulation} %`}
          delta="-2,1 %"
          tone="red"
          icon={<XCircle size={18} />}
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mr-1">
          Filtrer :
        </span>
        {FILTER_CHIPS.map((f) => (
          <Chip
            key={f.key}
            color={
              statusFilter === f.key
                ? "ink"
                : f.key === "cancelled"
                ? "red"
                : f.key === "active"
                ? "blue"
                : f.key === "completed"
                ? "green"
                : f.key === "pending"
                ? "gold"
                : "ink"
            }
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

      {/* Table */}
      <DataTable<PhotoSession>
        columns={columns}
        rows={filtered as PhotoSession[] & Record<string, unknown>[]}
        onRowClick={(row) => router.push(`/admin/sessions/${row.id}`)}
        searchable
        searchPlaceholder="rechercher par spot, ville, ID…"
        pageSize={12}
        empty="Aucune session ne correspond à ce filtre."
      />
    </AdminPage>
  );
}
