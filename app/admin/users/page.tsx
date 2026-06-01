"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Users, UserCheck, Star, AlertTriangle, Download, UserPlus } from "lucide-react";
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
import { users, AdminUser, fmtNum } from "@/lib/data";

type StatusFilter = "tous" | "active" | "pending" | "suspended" | "banned";

const STATUS_TONE: Record<string, "green" | "gold" | "red" | "neutral"> = {
  active: "green",
  pending: "gold",
  suspended: "sunset" as "red",
  banned: "red",
};

const VERIF_TONE: Record<string, "green" | "gold" | "neutral"> = {
  verified: "green",
  partial: "gold",
  none: "neutral",
};

const STATUS_LABEL: Record<string, string> = {
  active: "actif",
  pending: "en attente",
  suspended: "suspendu",
  banned: "banni",
};

const VERIF_LABEL: Record<string, string> = {
  verified: "vérifié",
  partial: "partiel",
  none: "aucune",
};

export default function UsersPage() {
  const router = useRouter();
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");

  const filtered = useMemo(() => {
    if (statusFilter === "tous") return users;
    return users.filter((u) => u.status === statusFilter);
  }, [statusFilter]);

  const total = users.length;
  const actifs = users.filter((u) => u.status === "active").length;
  const premium = users.filter((u) => u.premium).length;
  const signales = users.filter((u) => u.reports > 0).length;

  const columns: Column<AdminUser>[] = [
    {
      key: "user",
      header: "Utilisateur",
      cell: (row) => (
        <span className="flex items-center gap-3">
          <Avatar src={row.avatar} size={36} ring={row.premium} />
          <span className="flex flex-col min-w-0">
            <span className="font-semibold text-[14px] leading-tight truncate">
              {row.firstName} {row.lastName}
            </span>
            <span className="text-ink-faded text-[12px] font-[family-name:var(--font-type)] truncate">
              {row.username}
            </span>
          </span>
        </span>
      ),
      sortValue: (row) => `${row.firstName} ${row.lastName}`,
    },
    {
      key: "email",
      header: "E-mail",
      cell: (row) => (
        <span className="text-[13px] text-ink-faded font-[family-name:var(--font-mono)]">
          {row.email}
        </span>
      ),
      sortValue: (row) => row.email,
    },
    {
      key: "city",
      header: "Ville",
      cell: (row) => (
        <span className="flex items-center gap-1.5">
          <span>{row.country}</span>
          <span className="text-[13px]">{row.city}</span>
        </span>
      ),
      sortValue: (row) => row.city,
    },
    {
      key: "karma",
      header: "Karma",
      align: "right",
      cell: (row) => (
        <span className="font-[family-name:var(--font-serif)] font-bold text-gold-deep">
          {fmtNum(row.karma)}
        </span>
      ),
      sortValue: (row) => row.karma,
    },
    {
      key: "status",
      header: "Statut",
      cell: (row) => (
        <Badge
          tone={
            row.status === "active"
              ? "green"
              : row.status === "pending"
              ? "gold"
              : row.status === "suspended"
              ? "sunset"
              : "red"
          }
          dot
        >
          {STATUS_LABEL[row.status]}
        </Badge>
      ),
      sortValue: (row) => row.status,
    },
    {
      key: "verification",
      header: "Vérification",
      cell: (row) => (
        <Badge
          tone={
            row.verification === "verified"
              ? "green"
              : row.verification === "partial"
              ? "gold"
              : "neutral"
          }
        >
          {VERIF_LABEL[row.verification]}
        </Badge>
      ),
      sortValue: (row) => row.verification,
    },
    {
      key: "reports",
      header: "Signalements",
      align: "center",
      cell: (row) =>
        row.reports > 0 ? (
          <Badge tone="red" dot>
            {row.reports}
          </Badge>
        ) : (
          <span className="text-ink-faded text-[12px]">—</span>
        ),
      sortValue: (row) => row.reports,
    },
  ];

  const filterChips: { key: StatusFilter; label: string }[] = [
    { key: "tous", label: "Tous" },
    { key: "active", label: "Actifs" },
    { key: "pending", label: "En attente" },
    { key: "suspended", label: "Suspendus" },
    { key: "banned", label: "Bannis" },
  ];

  return (
    <AdminPage
      title="Utilisateurs"
      eyebrow="les voyageurs"
      breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Utilisateurs" }]}
      actions={
        <>
          <Button
            variant="paper"
            size="sm"
            icon={<Download size={14} />}
            onClick={() => toast.push("Export CSV en cours…", "info")}
          >
            Exporter
          </Button>
          <Button
            variant="gold"
            size="sm"
            icon={<UserPlus size={14} />}
            onClick={() => router.push("/admin/users/new")}
          >
            Inviter
          </Button>
        </>
      }
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Utilisateurs total"
          value={fmtNum(total)}
          delta="+12,4 %"
          tone="ink"
          icon={<Users size={18} />}
        />
        <StatCard
          label="Comptes actifs"
          value={fmtNum(actifs)}
          delta="+8,1 %"
          tone="green"
          icon={<UserCheck size={18} />}
        />
        <StatCard
          label="Abonnés Premium"
          value={fmtNum(premium)}
          delta="+21,0 %"
          tone="gold"
          icon={<Star size={18} />}
        />
        <StatCard
          label="Signalés"
          value={fmtNum(signales)}
          tone="red"
          icon={<AlertTriangle size={18} />}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mr-1">
          Filtrer :
        </span>
        {filterChips.map((f) => (
          <Chip
            key={f.key}
            color={
              statusFilter === f.key
                ? "ink"
                : f.key === "banned"
                ? "red"
                : f.key === "suspended"
                ? "red"
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
      <DataTable<AdminUser & Record<string, unknown>>
        columns={columns as Column<AdminUser & Record<string, unknown>>[]}
        rows={filtered as (AdminUser & Record<string, unknown>)[]}
        onRowClick={(row) => router.push(`/admin/users/${row.id}`)}
        searchable
        searchPlaceholder="rechercher par nom, e-mail, ville…"
        pageSize={12}
        empty="Aucun utilisateur ne correspond à ce filtre."
      />
    </AdminPage>
  );
}
