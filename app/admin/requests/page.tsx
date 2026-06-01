"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Inbox, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  DataTable,
  Column,
  Avatar,
  Badge,
  Chip,
  StatCard,
} from "@/components/ui";
import { sessions, PhotoSession, fmtNum } from "@/lib/data";

// Derive requests from sessions — pending and active are "requests"
// We also synthesize a few extra request rows from sessions for variety.

type RequestStatus = "en attente" | "en cours" | "expiré" | "refusé";

interface PhotoRequest {
  id: string;
  requester: PhotoSession["requester"];
  photographer: PhotoSession["photographer"];
  spot: string;
  city: string;
  distance: string;
  status: RequestStatus;
  expires: string;
  sessionId: string;
}

function buildRequests(): PhotoRequest[] {
  const raw = sessions.filter((s) => s.status === "pending" || s.status === "active");
  // Pad with some synthesized entries from other sessions
  const extra = sessions
    .filter((s) => s.status === "completed" || s.status === "cancelled")
    .slice(0, 6);
  const all = [...raw, ...extra];

  const statusMap: Record<string, RequestStatus> = {
    pending: "en attente",
    active: "en cours",
    completed: "expiré",
    cancelled: "refusé",
  };

  const DISTANCES = ["0,3 km", "1,1 km", "0,7 km", "2,4 km", "0,5 km", "1,8 km", "3,2 km"];
  const EXPIRES = [
    "dans 45 min",
    "dans 2 h",
    "dans 12 min",
    "expiré il y a 3 h",
    "dans 1 h 20",
    "expiré il y a 10 h",
    "dans 8 h",
  ];

  return all.map((s, i) => ({
    id: `req_${i + 1}`,
    requester: s.requester,
    photographer: s.photographer,
    spot: s.spot,
    city: s.city,
    distance: DISTANCES[i % DISTANCES.length],
    status: statusMap[s.status],
    expires: EXPIRES[i % EXPIRES.length],
    sessionId: s.id,
  }));
}

const ALL_REQUESTS = buildRequests();

type StatusFilter = "tous" | "en attente" | "en cours" | "expiré" | "refusé";

const STATUS_TONE: Record<RequestStatus, "gold" | "blue" | "neutral" | "red"> = {
  "en attente": "gold",
  "en cours": "blue",
  "expiré": "neutral",
  "refusé": "red",
};

const FILTER_CHIPS: { key: StatusFilter; label: string }[] = [
  { key: "tous", label: "Toutes" },
  { key: "en attente", label: "En attente" },
  { key: "en cours", label: "En cours" },
  { key: "expiré", label: "Expirées" },
  { key: "refusé", label: "Refusées" },
];

export default function RequestsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");

  const filtered = useMemo(() => {
    if (statusFilter === "tous") return ALL_REQUESTS;
    return ALL_REQUESTS.filter((r) => r.status === statusFilter);
  }, [statusFilter]);

  const enAttente = ALL_REQUESTS.filter((r) => r.status === "en attente").length;
  const enCours = ALL_REQUESTS.filter((r) => r.status === "en cours").length;
  const expires = ALL_REQUESTS.filter((r) => r.status === "expiré").length;
  const total = ALL_REQUESTS.length;

  const columns: Column<PhotoRequest>[] = [
    {
      key: "id",
      header: "Réf.",
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
          <Avatar src={row.requester.avatar} size={30} />
          <span className="flex flex-col min-w-0">
            <span className="font-semibold text-[13px] leading-tight truncate">
              {row.requester.firstName} {row.requester.lastName}
            </span>
            <span className="text-ink-faded text-[11px] font-[family-name:var(--font-type)]">
              {row.requester.username}
            </span>
          </span>
        </span>
      ),
      sortValue: (row) => `${row.requester.firstName} ${row.requester.lastName}`,
    },
    {
      key: "photographer",
      header: "Photographe cible",
      cell: (row) => (
        <span className="flex items-center gap-2.5">
          <Avatar src={row.photographer.avatar} size={30} />
          <span className="flex flex-col min-w-0">
            <span className="font-semibold text-[13px] leading-tight truncate">
              {row.photographer.firstName} {row.photographer.lastName}
            </span>
            <span className="text-ink-faded text-[11px] font-[family-name:var(--font-type)]">
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
      key: "distance",
      header: "Distance",
      align: "center",
      cell: (row) => (
        <span className="font-[family-name:var(--font-hand)] text-[14px] text-stamp-blue">
          {row.distance}
        </span>
      ),
      sortValue: (row) => row.distance,
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
      key: "expires",
      header: "Expiration",
      cell: (row) => (
        <span
          className={`font-[family-name:var(--font-type)] text-[12px] ${
            row.expires.startsWith("expiré") ? "text-stamp-red" : "text-ink-faded"
          }`}
        >
          {row.expires}
        </span>
      ),
      sortValue: (row) => row.expires,
    },
  ];

  return (
    <AdminPage
      title="Demandes photo"
      eyebrow="les plis envoyés"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { label: "Demandes" },
      ]}
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Demandes totales"
          value={fmtNum(total)}
          delta="+14,2 %"
          tone="ink"
          icon={<Inbox size={18} />}
        />
        <StatCard
          label="En attente"
          value={fmtNum(enAttente)}
          tone="gold"
          icon={<Clock size={18} />}
        />
        <StatCard
          label="En cours"
          value={fmtNum(enCours)}
          tone="blue"
          icon={<CheckCircle size={18} />}
        />
        <StatCard
          label="Expirées"
          value={fmtNum(expires)}
          tone="red"
          icon={<AlertCircle size={18} />}
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
                : f.key === "expiré" || f.key === "refusé"
                ? "red"
                : f.key === "en attente"
                ? "gold"
                : f.key === "en cours"
                ? "blue"
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
      <DataTable<PhotoRequest>
        columns={columns}
        rows={filtered as PhotoRequest[] & Record<string, unknown>[]}
        onRowClick={(row) => router.push(`/admin/requests/${row.id}`)}
        searchable
        searchPlaceholder="rechercher par demandeur, spot, ville…"
        pageSize={12}
        empty="Aucune demande ne correspond à ce filtre."
      />
    </AdminPage>
  );
}
