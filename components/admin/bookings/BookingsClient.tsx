"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTable, Column, Avatar, Badge, Chip, StatCard } from "@/components/ui";
import type { AdminBooking } from "@/lib/admin/bookings";

function fmtEur(n: number): string {
  return `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}
function fmtNum(n: number): string {
  return n.toLocaleString("fr-FR");
}

type StatusFilter = "tous" | "confirmée" | "en attente" | "annulée" | "remboursée";

const STATUS_TONE: Record<string, "green" | "gold" | "red" | "neutral"> = {
  "confirmée": "green",
  "en attente": "gold",
  "annulée": "red",
  "remboursée": "neutral",
};

const FILTER_CHIPS: { key: StatusFilter; label: string }[] = [
  { key: "tous", label: "Toutes" },
  { key: "confirmée", label: "Confirmées" },
  { key: "en attente", label: "En attente" },
  { key: "annulée", label: "Annulées" },
  { key: "remboursée", label: "Remboursées" },
];

export function BookingsClient({ bookings }: { bookings: AdminBooking[] }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");

  const filtered = useMemo(() => {
    if (statusFilter === "tous") return bookings;
    return bookings.filter((b) => b.status === statusFilter);
  }, [statusFilter, bookings]);

  const total = bookings.length;
  const confirmees = bookings.filter((b) => b.status === "confirmée").length;
  const revenue = bookings.filter((b) => b.status === "confirmée").reduce((acc, b) => acc + b.amount, 0);
  const tauxConfirmation = total > 0 ? Math.round((confirmees / total) * 100) : 0;

  const columns: Column<AdminBooking>[] = [
    {
      key: "id",
      header: "Réf.",
      cell: (row) => <span className="font-[family-name:var(--font-mono)] text-[12px] text-ink-faded">{row.id}</span>,
      sortValue: (row) => row.id,
    },
    {
      key: "user",
      header: "Client",
      cell: (row) => (
        <span className="flex items-center gap-2.5">
          <Avatar src={row.user.avatar ?? undefined} size={32} ring={row.user.premium} />
          <span className="flex flex-col min-w-0">
            <span className="font-semibold text-[13px] leading-tight truncate">{row.user.firstName}</span>
            <span className="text-ink-faded text-[11px] font-[family-name:var(--font-type)] truncate">{row.user.email}</span>
          </span>
        </span>
      ),
      sortValue: (row) => row.user.firstName,
    },
    {
      key: "experience",
      header: "Expérience",
      cell: (row) => <span className="font-[family-name:var(--font-serif)] text-[13px]">{row.experience}</span>,
      sortValue: (row) => row.experience,
    },
    {
      key: "commission",
      header: "Commission",
      align: "right",
      cell: (row) => <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">{fmtEur(row.commission)}</span>,
      sortValue: (row) => row.commission,
    },
    {
      key: "amount",
      header: "Montant",
      align: "right",
      cell: (row) => <span className="font-[family-name:var(--font-serif)] font-bold text-[14px] text-gold-deep">{fmtEur(row.amount)}</span>,
      sortValue: (row) => row.amount,
    },
    {
      key: "status",
      header: "Statut",
      cell: (row) => <Badge tone={STATUS_TONE[row.status] ?? "neutral"} dot>{row.status}</Badge>,
      sortValue: (row) => row.status,
    },
    {
      key: "date",
      header: "Date",
      cell: (row) => <span className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded">{row.date}</span>,
      sortValue: (row) => row.date,
    },
  ];

  return (
    <AdminPage
      title="Réservations"
      eyebrow="les billets vendus"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { label: "Réservations" },
      ]}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Réservations totales" value={fmtNum(total)} tone="ink" icon={<ShoppingBag size={18} />} />
        <StatCard label="Confirmées" value={fmtNum(confirmees)} tone="green" icon={<CheckCircle size={18} />} />
        <StatCard label="Revenus (confirmés)" value={fmtEur(revenue)} tone="gold" icon={<TrendingUp size={18} />} />
        <StatCard label="Taux de confirmation" value={`${tauxConfirmation} %`} tone="blue" icon={<Clock size={18} />} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mr-1">Filtrer :</span>
        {FILTER_CHIPS.map((f) => (
          <Chip
            key={f.key}
            color={statusFilter === f.key ? "ink" : f.key === "annulée" ? "red" : f.key === "confirmée" ? "green" : f.key === "en attente" ? "gold" : "ink"}
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

      <DataTable<AdminBooking>
        columns={columns}
        rows={filtered}
        onRowClick={(row) => router.push(`/admin/bookings/${row.id.replace("bk_", "")}`)}
        searchable
        searchPlaceholder="rechercher par client, expérience…"
        pageSize={12}
        empty="Aucune réservation ne correspond à ce filtre."
      />
    </AdminPage>
  );
}
