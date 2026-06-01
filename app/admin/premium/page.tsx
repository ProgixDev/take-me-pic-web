"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Users, TrendingUp, Percent, Crown } from "lucide-react";
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
import { subscriptions, Subscription, fmtEur, fmtNum } from "@/lib/data";

type StatusFilter = "tous" | "actif" | "en essai" | "annulé" | "expiré";

const STATUS_TONE: Record<string, "green" | "gold" | "red" | "neutral"> = {
  actif: "green",
  "en essai": "gold",
  annulé: "red",
  expiré: "neutral",
};

const PLAN_TONE: Record<string, "blue" | "gold"> = {
  Mensuel: "blue",
  Annuel: "gold",
};

export default function PremiumPage() {
  const router = useRouter();
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");

  const filtered = useMemo(() => {
    if (statusFilter === "tous") return subscriptions;
    return subscriptions.filter((s) => s.status === statusFilter);
  }, [statusFilter]);

  const actifs = subscriptions.filter((s) => s.status === "actif").length;
  const enEssai = subscriptions.filter((s) => s.status === "en essai").length;
  const mrr = subscriptions
    .filter((s) => s.status === "actif" || s.status === "en essai")
    .reduce((sum, s) => sum + (s.plan === "Annuel" ? s.price / 12 : s.price), 0);
  const tauxConversion = Math.round(
    ((actifs / (subscriptions.length || 1)) * 100 * 10) / 10
  );

  const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
    { key: "tous", label: "Tous" },
    { key: "actif", label: "Actifs" },
    { key: "en essai", label: "En essai" },
    { key: "annulé", label: "Annulés" },
    { key: "expiré", label: "Expirés" },
  ];

  const columns: Column<Subscription>[] = [
    {
      key: "user",
      header: "Abonné",
      cell: (row) => (
        <span className="flex items-center gap-3">
          <Avatar src={row.user.avatar} size={34} ring={true} />
          <span className="flex flex-col min-w-0">
            <span className="font-semibold text-[14px] leading-tight truncate">
              {row.user.firstName} {row.user.lastName}
            </span>
            <span className="text-ink-faded text-[11px] font-[family-name:var(--font-mono)] truncate">
              {row.user.email}
            </span>
          </span>
        </span>
      ),
      sortValue: (row) => `${row.user.firstName} ${row.user.lastName}`,
    },
    {
      key: "plan",
      header: "Formule",
      cell: (row) => (
        <Badge tone={PLAN_TONE[row.plan] ?? "neutral"} dot>
          {row.plan}
        </Badge>
      ),
      sortValue: (row) => row.plan,
    },
    {
      key: "price",
      header: "Prix",
      align: "right",
      cell: (row) => (
        <span className="font-[family-name:var(--font-mono)] font-semibold text-[14px]">
          {fmtEur(row.price)}
        </span>
      ),
      sortValue: (row) => row.price,
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
      key: "started",
      header: "Début",
      cell: (row) => (
        <span className="text-[13px] text-ink-faded font-[family-name:var(--font-mono)]">
          {row.started}
        </span>
      ),
      sortValue: (row) => row.started,
    },
    {
      key: "renews",
      header: "Renouvellement",
      cell: (row) => (
        <span className="text-[13px] text-ink-faded font-[family-name:var(--font-mono)]">
          {row.renews}
        </span>
      ),
      sortValue: (row) => row.renews,
    },
  ];

  return (
    <AdminPage
      title="Abonnements Premium"
      eyebrow="première classe ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { label: "Premium" },
      ]}
      actions={
        <Button
          variant="gold"
          size="sm"
          icon={<Crown size={15} />}
          onClick={() => toast.push("Export CSV généré !", "ok")}
        >
          Exporter
        </Button>
      }
    >
      {/* KPI StatCards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Abonnés actifs"
          value={fmtNum(actifs)}
          delta="+21,0 %"
          icon={<Users size={18} />}
          tone="green"
        />
        <StatCard
          label="En essai"
          value={fmtNum(enEssai)}
          delta="+6 %"
          icon={<Crown size={18} />}
          tone="gold"
        />
        <StatCard
          label="MRR"
          value={fmtEur(Math.round(mrr))}
          delta="+8,4 %"
          icon={<TrendingUp size={18} />}
          tone="blue"
        />
        <StatCard
          label="Taux de conversion"
          value={`${tauxConversion} %`}
          delta="+3,2 %"
          icon={<Percent size={18} />}
          tone="ink"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 flex-wrap mb-4">
        {STATUS_FILTERS.map((f) => (
          <Chip
            key={f.key}
            color={
              statusFilter === f.key
                ? f.key === "tous"
                  ? "ink"
                  : f.key === "actif"
                  ? "green"
                  : f.key === "en essai"
                  ? "gold"
                  : "red"
                : "ink"
            }
            variant={statusFilter === f.key ? "filled" : "outline"}
            onClick={() => setStatusFilter(f.key)}
          >
            {f.label}
          </Chip>
        ))}
      </div>

      {/* DataTable */}
      <DataTable<Subscription>
        columns={columns}
        rows={filtered as unknown as Subscription[]}
        onRowClick={(row) => router.push(`/admin/premium/${row.id}`)}
        searchable
        searchPlaceholder="rechercher un abonné…"
        pageSize={12}
        empty="Aucun abonnement trouvé."
      />
    </AdminPage>
  );
}
