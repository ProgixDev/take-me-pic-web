"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Users, UserCheck, Star, AlertTriangle } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTable, type Column, Avatar, Badge, Chip, StatCard, fmtNum } from "@/components/ui";
import type { UserListItem } from "@/lib/admin/users";

type StatusFilter = "tous" | UserListItem["status"];

const STATUS_LABEL: Record<UserListItem["status"], string> = {
  active: "actif",
  suspended: "suspendu",
  banned: "banni",
};

const VERIF_LABEL: Record<UserListItem["verification"], string> = {
  verified: "vérifié",
  partial: "partiel",
  none: "aucune",
};

export function UsersClient({ users }: { users: UserListItem[] }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");

  const filtered = useMemo(() => {
    if (statusFilter === "tous") return users;
    return users.filter((u) => u.status === statusFilter);
  }, [users, statusFilter]);

  const total = users.length;
  const actifs = users.filter((u) => u.status === "active").length;
  const premium = users.filter((u) => u.isPremium).length;
  const signales = users.filter((u) => u.openReports > 0).length;

  const columns: Column<UserListItem>[] = [
    {
      key: "user",
      header: "Utilisateur",
      cell: (row) => (
        <span className="flex items-center gap-3">
          <Avatar src={row.avatarUrl ?? undefined} size={36} ring={row.isPremium} />
          <span className="flex flex-col min-w-0">
            <span className="font-semibold text-[14px] leading-tight truncate">
              {[row.firstName, row.lastName].filter(Boolean).join(" ")}
            </span>
            <span className="text-ink-faded text-[12px] font-[family-name:var(--font-type)] truncate">
              {row.username}
            </span>
          </span>
        </span>
      ),
      sortValue: (row) => `${row.firstName} ${row.lastName ?? ""}`,
    },
    {
      key: "city",
      header: "Ville",
      cell: (row) => <span className="text-[13px]">{row.city ?? "—"}</span>,
      sortValue: (row) => row.city ?? "",
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
        <Badge tone={row.status === "active" ? "green" : row.status === "suspended" ? "sunset" : "red"} dot>
          {STATUS_LABEL[row.status]}
        </Badge>
      ),
      sortValue: (row) => row.status,
    },
    {
      key: "verification",
      header: "Vérification",
      cell: (row) => (
        <Badge tone={row.verification === "verified" ? "green" : row.verification === "partial" ? "gold" : "neutral"}>
          {VERIF_LABEL[row.verification]}
        </Badge>
      ),
      sortValue: (row) => row.verification,
    },
    {
      key: "openReports",
      header: "Signalements",
      align: "center",
      cell: (row) =>
        row.openReports > 0 ? (
          <Badge tone="red" dot>
            {row.openReports}
          </Badge>
        ) : (
          <span className="text-ink-faded text-[12px]">—</span>
        ),
      sortValue: (row) => row.openReports,
    },
  ];

  const filterChips: { key: StatusFilter; label: string }[] = [
    { key: "tous", label: "Tous" },
    { key: "active", label: "Actifs" },
    { key: "suspended", label: "Suspendus" },
    { key: "banned", label: "Bannis" },
  ];

  return (
    <AdminPage
      title="Utilisateurs"
      eyebrow="les voyageurs"
      breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Utilisateurs" }]}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Utilisateurs total" value={fmtNum(total)} tone="ink" icon={<Users size={18} />} />
        <StatCard label="Comptes actifs" value={fmtNum(actifs)} tone="green" icon={<UserCheck size={18} />} />
        <StatCard label="Abonnés Premium" value={fmtNum(premium)} tone="gold" icon={<Star size={18} />} />
        <StatCard label="Signalés" value={fmtNum(signales)} tone="red" icon={<AlertTriangle size={18} />} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mr-1">
          Filtrer :
        </span>
        {filterChips.map((f) => (
          <Chip
            key={f.key}
            color={statusFilter === f.key ? "ink" : f.key === "banned" || f.key === "suspended" ? "red" : "ink"}
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

      <DataTable<UserListItem>
        columns={columns}
        rows={filtered}
        onRowClick={(row) => router.push(`/admin/users/${row.id}`)}
        searchable
        searchPlaceholder="rechercher par nom, pseudo, ville…"
        pageSize={12}
        empty="Aucun utilisateur ne correspond à ce filtre."
      />
    </AdminPage>
  );
}
