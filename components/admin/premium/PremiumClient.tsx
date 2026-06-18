"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Users, Crown, Layers, XCircle, Plus, Apple } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  DataTable,
  Column,
  Avatar,
  Badge,
  Chip,
  Button,
  StatCard,
  Modal,
  Input,
  Select,
  useToast,
} from "@/components/ui";
import {
  grantPremium,
  revokePremium,
  type SubscriptionRow,
  type SubscriptionStatus,
  type PremiumPlan,
  type SubscriptionActionResult,
} from "@/lib/admin/subscriptions-actions";

const ERROR_MESSAGES: Record<string, string> = {
  unauthenticated: "Session expirée — reconnecte-toi.",
  unauthorized: "Accès réservé au staff.",
};

function errText(result: SubscriptionActionResult): string {
  return result.kind === "error" ? result.message : ERROR_MESSAGES[result.kind] ?? "Erreur.";
}

type StatusFilter = "tous" | SubscriptionStatus;

const STATUS_TONE: Record<SubscriptionStatus, "green" | "gold" | "red" | "neutral" | "blue"> = {
  active: "green",
  in_grace: "gold",
  expired: "neutral",
  cancelled: "red",
  paused: "blue",
};

const PLAN_TONE: Record<string, "blue" | "gold" | "neutral"> = {
  Mensuel: "blue",
  Annuel: "gold",
};

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "tous", label: "Tous" },
  { key: "active", label: "Actifs" },
  { key: "in_grace", label: "Grâce" },
  { key: "cancelled", label: "Annulés" },
  { key: "expired", label: "Expirés" },
  { key: "paused", label: "En pause" },
];

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export function PremiumClient({ subscriptions }: { subscriptions: SubscriptionRow[] }) {
  const router = useRouter();
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");

  // Grant modal state.
  const [grantOpen, setGrantOpen] = useState(false);
  const [grantUserId, setGrantUserId] = useState("");
  const [grantPlan, setGrantPlan] = useState<PremiumPlan>("monthly");
  const [granting, setGranting] = useState(false);
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (statusFilter === "tous") return subscriptions;
    return subscriptions.filter((s) => s.status === statusFilter);
  }, [statusFilter, subscriptions]);

  const actifs = subscriptions.filter((s) => s.status === "active").length;
  const mensuels = subscriptions.filter((s) => s.status === "active" && s.plan === "Mensuel").length;
  const annuels = subscriptions.filter((s) => s.status === "active" && s.plan === "Annuel").length;

  const handleGrant = async () => {
    const userId = grantUserId.trim();
    if (!userId) {
      toast.push("Renseigne l'identifiant (UUID) de l'utilisateur.", "err");
      return;
    }
    setGranting(true);
    const result = await grantPremium({ userId, plan: grantPlan });
    setGranting(false);
    if (result.kind === "ok") {
      toast.push("Premium accordé.", "ok");
      setGrantOpen(false);
      setGrantUserId("");
      setGrantPlan("monthly");
      router.refresh();
      return;
    }
    toast.push(errText(result), "err");
  };

  const handleRevoke = async (row: SubscriptionRow) => {
    if (!window.confirm(`Révoquer le Premium de « ${row.userName} » ? L'accès sera coupé immédiatement.`)) return;
    setRevokingId(row.id);
    const result = await revokePremium({ id: row.id });
    setRevokingId(null);
    if (result.kind === "ok") {
      toast.push("Premium révoqué.", "ok");
      router.refresh();
      return;
    }
    toast.push(errText(result), "err");
  };

  const columns: Column<SubscriptionRow>[] = [
    {
      key: "user",
      header: "Abonné",
      cell: (row) => (
        <span className="flex items-center gap-3">
          <Avatar src={row.avatarUrl ?? undefined} size={34} ring />
          <span className="flex flex-col min-w-0">
            <span className="font-semibold text-[14px] leading-tight truncate">{row.userName}</span>
            <span className="text-ink-faded text-[11px] font-[family-name:var(--font-mono)] truncate">
              {row.username ? `@${row.username}` : row.userId.slice(0, 8)}
            </span>
          </span>
        </span>
      ),
      sortValue: (row) => row.userName,
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
      key: "store",
      header: "Boutique",
      cell: (row) => (
        <span className="flex items-center gap-1.5 text-[13px] text-ink-faded font-[family-name:var(--font-mono)]">
          <Apple size={12} /> {row.store === "apple" ? "Apple" : "Google"}
        </span>
      ),
      sortValue: (row) => row.store,
    },
    {
      key: "status",
      header: "Statut",
      cell: (row) => (
        <Badge tone={STATUS_TONE[row.status] ?? "neutral"} dot>
          {row.statusLabel}
        </Badge>
      ),
      sortValue: (row) => row.status,
    },
    {
      key: "periodEnd",
      header: "Fin de période",
      cell: (row) => (
        <span className="text-[13px] text-ink-faded font-[family-name:var(--font-mono)]">
          {fmtDate(row.currentPeriodEnd)}
        </span>
      ),
      sortValue: (row) => row.currentPeriodEnd ?? "",
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (row) =>
        row.status === "active" ? (
          <Button
            variant="danger"
            size="sm"
            icon={<XCircle size={13} />}
            disabled={revokingId === row.id}
            onClick={(e) => {
              e.stopPropagation();
              void handleRevoke(row);
            }}
          >
            {revokingId === row.id ? "…" : "Révoquer"}
          </Button>
        ) : null,
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
        <Button variant="gold" size="sm" icon={<Crown size={15} />} onClick={() => setGrantOpen(true)}>
          Accorder Premium
        </Button>
      }
    >
      {/* KPI StatCards — counts only; revenue lives in StoreKit/RevenueCat, not this table. */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Abonnés actifs" value={String(actifs)} icon={<Users size={18} />} tone="green" />
        <StatCard label="Mensuels actifs" value={String(mensuels)} icon={<Crown size={18} />} tone="blue" />
        <StatCard label="Annuels actifs" value={String(annuels)} icon={<Layers size={18} />} tone="gold" />
        <StatCard label="Total abonnements" value={String(subscriptions.length)} icon={<Crown size={18} />} tone="ink" />
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
                  : f.key === "active"
                  ? "green"
                  : f.key === "in_grace"
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
      <DataTable<SubscriptionRow>
        columns={columns}
        rows={filtered}
        onRowClick={(row) => router.push(`/admin/premium/${row.id}`)}
        searchable
        searchPlaceholder="rechercher un abonné…"
        pageSize={12}
        empty="Aucun abonnement trouvé."
      />

      {/* Grant modal */}
      <Modal
        open={grantOpen}
        onClose={() => setGrantOpen(false)}
        title="Accorder un Premium"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setGrantOpen(false)}>
              Annuler
            </Button>
            <Button variant="gold" size="sm" icon={<Plus size={14} />} onClick={handleGrant} disabled={granting}>
              {granting ? "Attribution…" : "Accorder"}
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded mb-4">
          Crée un abonnement de courtoisie/support. L'accès Premium s'active immédiatement (le statut « is_premium »
          du profil est synchronisé automatiquement). Le Premium payant reste géré par StoreKit / RevenueCat.
        </p>
        <Input
          label="Identifiant utilisateur (UUID) *"
          value={grantUserId}
          onChange={(e) => setGrantUserId(e.target.value)}
          placeholder="00000000-0000-0000-0000-000000000000"
        />
        <Select label="Formule" value={grantPlan} onChange={(e) => setGrantPlan(e.target.value as PremiumPlan)}>
          <option value="monthly">Mensuel (30 jours)</option>
          <option value="annual">Annuel (365 jours)</option>
        </Select>
      </Modal>
    </AdminPage>
  );
}
