"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Download, CreditCard, TrendingUp, AlertCircle, RotateCcw } from "lucide-react";
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
import { payments, Payment, fmtEur, fmtNum } from "@/lib/data";

type StatusFilter = "tous" | "réussi" | "en attente" | "échoué" | "remboursé";
type TypeFilter = "tous" | "abonnement" | "réservation" | "remboursement";

const STATUS_TONE: Record<string, "green" | "gold" | "red" | "neutral"> = {
  réussi: "green",
  "en attente": "gold",
  échoué: "red",
  remboursé: "neutral",
};

const TYPE_TONE: Record<string, "blue" | "gold" | "red" | "neutral"> = {
  abonnement: "gold",
  réservation: "blue",
  remboursement: "red",
};

export default function PaymentsPage() {
  const router = useRouter();
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("tous");

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const matchStatus = statusFilter === "tous" || p.status === statusFilter;
      const matchType = typeFilter === "tous" || p.type === typeFilter;
      return matchStatus && matchType;
    });
  }, [statusFilter, typeFilter]);

  const total = payments.reduce(
    (s, p) => s + (p.amount > 0 ? p.amount : 0),
    0
  );
  const reussis = payments.filter((p) => p.status === "réussi").length;
  const echoues = payments.filter((p) => p.status === "échoué").length;
  const rembourses = payments.filter((p) => p.status === "remboursé").length;

  const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
    { key: "tous", label: "Tous" },
    { key: "réussi", label: "Réussis" },
    { key: "en attente", label: "En attente" },
    { key: "échoué", label: "Échoués" },
    { key: "remboursé", label: "Remboursés" },
  ];

  const TYPE_FILTERS: { key: TypeFilter; label: string }[] = [
    { key: "tous", label: "Tous types" },
    { key: "abonnement", label: "Abonnements" },
    { key: "réservation", label: "Réservations" },
    { key: "remboursement", label: "Remboursements" },
  ];

  const columns: Column<Payment>[] = [
    {
      key: "id",
      header: "ID",
      cell: (row) => (
        <span className="font-[family-name:var(--font-mono)] text-[11px] text-ink-faded">
          {row.id}
        </span>
      ),
      sortValue: (row) => row.id,
    },
    {
      key: "user",
      header: "Utilisateur",
      cell: (row) => (
        <span className="flex items-center gap-2.5">
          <Avatar src={row.user.avatar} size={30} />
          <span className="font-[family-name:var(--font-serif)] text-[13px] font-semibold truncate">
            {row.user.firstName} {row.user.lastName}
          </span>
        </span>
      ),
      sortValue: (row) => `${row.user.firstName} ${row.user.lastName}`,
    },
    {
      key: "type",
      header: "Type",
      cell: (row) => (
        <Badge tone={TYPE_TONE[row.type] ?? "neutral"}>{row.type}</Badge>
      ),
      sortValue: (row) => row.type,
    },
    {
      key: "amount",
      header: "Montant",
      align: "right",
      cell: (row) => (
        <span
          className={`font-[family-name:var(--font-mono)] font-bold text-[14px] ${
            row.amount < 0 ? "text-stamp-red" : "text-ink"
          }`}
        >
          {fmtEur(row.amount)}
        </span>
      ),
      sortValue: (row) => row.amount,
    },
    {
      key: "method",
      header: "Méthode",
      cell: (row) => (
        <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
          {row.method}
        </span>
      ),
      sortValue: (row) => row.method,
    },
    {
      key: "status",
      header: "Statut",
      cell: (row) => (
        <Badge tone={STATUS_TONE[row.status] ?? "neutral"} dot>
          {row.status}
        </Badge>
      ),
      sortValue: (row) => row.status,
    },
    {
      key: "date",
      header: "Date",
      cell: (row) => (
        <span className="font-[family-name:var(--font-mono)] text-[12px] text-ink-faded">
          {row.date}
        </span>
      ),
      sortValue: (row) => row.date,
    },
  ];

  return (
    <AdminPage
      title="Paiements"
      eyebrow="suivi financier ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { label: "Paiements" },
      ]}
      actions={
        <Button
          variant="paper"
          size="sm"
          icon={<Download size={15} />}
          onClick={() => toast.push("Export CSV des paiements en cours…", "info")}
        >
          Exporter
        </Button>
      }
    >
      {/* KPI StatCards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Volume total"
          value={fmtEur(total)}
          delta="+5,3 %"
          icon={<TrendingUp size={18} />}
          tone="gold"
        />
        <StatCard
          label="Réussis"
          value={fmtNum(reussis)}
          delta="+8 %"
          icon={<CreditCard size={18} />}
          tone="green"
        />
        <StatCard
          label="Échoués"
          value={fmtNum(echoues)}
          delta="-2 %"
          icon={<AlertCircle size={18} />}
          tone="red"
        />
        <StatCard
          label="Remboursés"
          value={fmtNum(rembourses)}
          icon={<RotateCcw size={18} />}
          tone="ink"
        />
      </div>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap mb-3">
        {STATUS_FILTERS.map((f) => (
          <Chip
            key={f.key}
            color={
              statusFilter === f.key
                ? f.key === "réussi"
                  ? "green"
                  : f.key === "échoué"
                  ? "red"
                  : f.key === "en attente"
                  ? "gold"
                  : "ink"
                : "ink"
            }
            variant={statusFilter === f.key ? "filled" : "outline"}
            onClick={() => setStatusFilter(f.key)}
          >
            {f.label}
          </Chip>
        ))}
        <span className="w-px h-5 bg-[var(--ink-line)] self-center mx-1" />
        {TYPE_FILTERS.map((f) => (
          <Chip
            key={f.key}
            color={
              typeFilter === f.key
                ? f.key === "abonnement"
                  ? "gold"
                  : f.key === "réservation"
                  ? "blue"
                  : f.key === "remboursement"
                  ? "red"
                  : "ink"
                : "ink"
            }
            variant={typeFilter === f.key ? "filled" : "outline"}
            onClick={() => setTypeFilter(f.key)}
          >
            {f.label}
          </Chip>
        ))}
      </div>

      {/* DataTable */}
      <DataTable<Payment>
        columns={columns}
        rows={filtered as unknown as Payment[]}
        onRowClick={(row) => router.push(`/admin/payments/${row.id}`)}
        searchable
        searchPlaceholder="rechercher un paiement…"
        pageSize={12}
        empty="Aucun paiement trouvé."
      />
    </AdminPage>
  );
}
