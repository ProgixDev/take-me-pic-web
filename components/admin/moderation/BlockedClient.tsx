"use client";

import { useTransition } from "react";
import { Ban } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Avatar, Badge, Button, DataTable, useToast, type Column } from "@/components/ui";
import { unbanUser } from "@/lib/admin/moderation-actions";
import type { BanReadModel } from "@/lib/admin/moderation";

function isActiveBan(ban: BanReadModel) {
  return !ban.expiresAt || new Date(ban.expiresAt).getTime() > Date.now();
}

function BanRowActions({ ban }: { ban: BanReadModel }) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  if (!isActiveBan(ban)) {
    return <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">Expiré</span>;
  }

  const unban = () => {
    startTransition(async () => {
      const result = await unbanUser(ban.id);
      if (result.kind === "ok") {
        toast.push("Ban levé.", "ok");
      } else if (result.kind === "unauthenticated") {
        toast.push("Session Supabase manquante. Reconnecte-toi.", "err");
      } else if (result.kind === "unauthorized") {
        toast.push("Ce compte n'a pas les droits staff pour cette action.", "err");
      } else {
        toast.push(result.message, "err");
      }
    });
  };

  return (
    <Button variant="paper" size="sm" disabled={pending} onClick={unban}>
      Lever le ban
    </Button>
  );
}

function appealLabel(status: BanReadModel["appealStatus"]) {
  if (status === "open") return "Ouvert";
  if (status === "reviewing") return "En cours";
  if (status === "resolved") return "Résolu";
  if (status === "dismissed") return "Rejeté";
  return "—";
}

const columns: Column<BanReadModel>[] = [
  {
    key: "user",
    header: "Utilisateur",
    cell: (row) => (
      <div className="flex items-center gap-2.5">
        <Avatar src={row.user?.avatarUrl ?? undefined} size={32} />
        <div>
          <div className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">
            {row.user ? [row.user.firstName, row.user.lastName].filter(Boolean).join(" ") || row.user.username : "Profil supprimé"}
          </div>
          <div className="font-[family-name:var(--font-hand)] text-sm text-ink-faded">
            {row.user?.username ?? "—"}
          </div>
        </div>
      </div>
    ),
    sortValue: (row) => row.user?.username ?? "",
  },
  {
    key: "reason",
    header: "Motif",
    cell: (row) => (
      <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
        {row.reason}
      </span>
    ),
    sortValue: (row) => row.reason,
  },
  {
    key: "bannedBy",
    header: "Banni par",
    cell: (row) => (
      <span className="font-[family-name:var(--font-serif)] text-[13px]">
        {row.bannedBy ? [row.bannedBy.firstName, row.bannedBy.lastName].filter(Boolean).join(" ") || row.bannedBy.username : "Système"}
      </span>
    ),
    sortValue: (row) => row.bannedBy?.username ?? "",
  },
  {
    key: "appealStatus",
    header: "Appel",
    cell: (row) => (
      <Badge tone={row.appealStatus === "open" ? "gold" : row.appealStatus === "resolved" ? "green" : row.appealStatus === "dismissed" ? "red" : "neutral"}>
        {appealLabel(row.appealStatus)}
      </Badge>
    ),
    sortValue: (row) => row.appealStatus ?? "",
  },
  {
    key: "expiresAt",
    header: "Expiration",
    cell: (row) => (
      <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
        {row.expiresAt ?? "Permanent"}
      </span>
    ),
    sortValue: (row) => row.expiresAt ?? "9999-12-31",
  },
  {
    key: "createdAt",
    header: "Créé le",
    cell: (row) => (
      <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
        {row.createdAt}
      </span>
    ),
    sortValue: (row) => row.createdAt,
  },
  {
    key: "actions",
    header: "Actions",
    cell: (row) => <BanRowActions ban={row} />,
  },
];

export function BlockedClient({ bans }: { bans: BanReadModel[] }) {
  const bannedCount = bans.filter(isActiveBan).length;
  const temporaryCount = bans.filter((ban) => ban.expiresAt && new Date(ban.expiresAt).getTime() > Date.now()).length;

  return (
    <AdminPage
      title="Utilisateurs bloqués"
      eyebrow="liste noire & suspensions ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/moderation", label: "Modération" },
        { label: "Bloqués" },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Badge tone="red">{bannedCount} bannis</Badge>
          <Badge tone="sunset">{temporaryCount} temporaires</Badge>
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Bannis actifs
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-stamp-red">
            {bannedCount}
          </div>
        </div>
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Temporaires
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-sunset">
            {temporaryCount}
          </div>
        </div>
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Appels ouverts
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-gold-deep">
            {bans.filter((ban) => ban.appealStatus === "open").length}
          </div>
        </div>
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Total bans
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl">
            {bans.length}
          </div>
        </div>
      </div>

      <DataTable<BanReadModel>
        columns={columns}
        rows={bans}
        searchable
        searchPlaceholder="rechercher un utilisateur bloqué…"
        pageSize={10}
        empty="Aucun utilisateur bloqué."
      />

      <div className="mt-4 flex items-center gap-2 font-[family-name:var(--font-type)] text-[11px] uppercase tracking-widest text-ink-faded">
        <Ban size={13} />
        Lever un ban l'expire immédiatement et journalise l'action.
      </div>
    </AdminPage>
  );
}
