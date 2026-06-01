"use client";

import { useState } from "react";
import { Ban, UserCheck } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  DataTable,
  Badge,
  Avatar,
  Button,
  Modal,
  Stamp,
  useToast,
  type Column,
} from "@/components/ui";
import { users, type AdminUser } from "@/lib/data";

const blockedUsers = users.filter(
  (u) => u.status === "banned" || u.status === "suspended"
);

// Synthesize block reasons
const BLOCK_REASONS: Record<string, string> = {};
blockedUsers.forEach((u, i) => {
  BLOCK_REASONS[u.id] =
    [
      "Harcèlement répété envers d'autres membres",
      "Faux profil — identité non vérifiable",
      "Spam de messages commerciaux",
      "Comportement abusif signalé par 3+ utilisateurs",
      "Photo volée signalée et confirmée",
      "Contenu inapproprié à caractère offensant",
    ][i % 6];
});

const BLOCK_DATES: Record<string, string> = {};
blockedUsers.forEach((u, i) => {
  const day = String(((i * 7) % 27) + 1).padStart(2, "0");
  BLOCK_DATES[u.id] = `2026-04-${day}`;
});

interface BlockedRow extends AdminUser {
  blockReason: string;
  blockedAt: string;
}

const rows: BlockedRow[] = blockedUsers.map((u) => ({
  ...u,
  blockReason: BLOCK_REASONS[u.id],
  blockedAt: BLOCK_DATES[u.id],
}));

export default function BlockedPage() {
  const { push } = useToast();
  const [confirmUser, setConfirmUser] = useState<BlockedRow | null>(null);
  const [unblocked, setUnblocked] = useState<Set<string>>(new Set());

  function handleUnblock() {
    if (!confirmUser) return;
    setUnblocked((prev) => new Set([...prev, confirmUser.id]));
    push(`Compte ${confirmUser.username} débloqué avec succès.`, "ok");
    setConfirmUser(null);
  }

  const activeRows = rows.filter((r) => !unblocked.has(r.id));

  const columns: Column<BlockedRow>[] = [
    {
      key: "user",
      header: "Utilisateur",
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <Avatar src={r.avatar} size={32} />
          <div>
            <div className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">
              {r.firstName} {r.lastName}
            </div>
            <div className="font-[family-name:var(--font-hand)] text-sm text-ink-faded">
              {r.username}
            </div>
          </div>
        </div>
      ),
      sortValue: (r) => r.lastName,
    },
    {
      key: "status",
      header: "Statut",
      cell: (r) => (
        <Badge tone={r.status === "banned" ? "red" : "sunset"}>
          {r.status === "banned" ? "Banni" : "Suspendu"}
        </Badge>
      ),
      sortValue: (r) => r.status,
    },
    {
      key: "blockReason",
      header: "Motif",
      cell: (r) => (
        <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
          {r.blockReason}
        </span>
      ),
      sortValue: (r) => r.blockReason,
    },
    {
      key: "blockedAt",
      header: "Date de blocage",
      cell: (r) => (
        <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
          {r.blockedAt}
        </span>
      ),
      sortValue: (r) => r.blockedAt,
    },
    {
      key: "city",
      header: "Ville",
      cell: (r) => (
        <span className="font-[family-name:var(--font-serif)] text-[13px]">
          {r.country} {r.city}
        </span>
      ),
      sortValue: (r) => r.city,
    },
    {
      key: "actions",
      header: "Action",
      align: "right",
      cell: (r) => (
        <Button
          variant="gold"
          size="sm"
          icon={<UserCheck size={13} />}
          onClick={(e) => {
            e.stopPropagation();
            setConfirmUser(r);
          }}
        >
          Débloquer
        </Button>
      ),
    },
  ];

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
          <Badge tone="red">{activeRows.filter((r) => r.status === "banned").length} bannis</Badge>
          <Badge tone="sunset">
            {activeRows.filter((r) => r.status === "suspended").length} suspendus
          </Badge>
        </div>
      }
    >
      {/* Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm relative overflow-hidden">
          <Stamp color="red" size={56} fontSize={7} rotate={-8} className="absolute -right-2 top-1">
            {`BANNI\n✗`}
          </Stamp>
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Bannis
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-stamp-red">
            {activeRows.filter((r) => r.status === "banned").length}
          </div>
        </div>
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Suspendus
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-sunset">
            {activeRows.filter((r) => r.status === "suspended").length}
          </div>
        </div>
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Débloqués ce mois
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-stamp-green">
            {unblocked.size + 3}
          </div>
        </div>
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Total bloqués
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl">
            {activeRows.length}
          </div>
        </div>
      </div>

      <DataTable<BlockedRow>
        columns={columns}
        rows={activeRows as BlockedRow[]}
        searchable
        searchPlaceholder="rechercher un utilisateur bloqué…"
        pageSize={10}
        empty="Aucun utilisateur bloqué."
      />

      {/* Confirm Unblock Modal */}
      <Modal
        open={!!confirmUser}
        onClose={() => setConfirmUser(null)}
        title="Confirmer le déblocage"
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setConfirmUser(null)}>
              Annuler
            </Button>
            <Button variant="gold" size="sm" icon={<UserCheck size={14} />} onClick={handleUnblock}>
              Débloquer
            </Button>
          </>
        }
      >
        {confirmUser && (
          <div>
            <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink leading-relaxed mb-4">
              Vous êtes sur le point de débloquer le compte{" "}
              <strong>{confirmUser.username}</strong>. L'utilisateur retrouvera un
              accès complet à l'application.
            </p>
            <div className="flex items-center gap-3 p-3 bg-paper-warm rounded-[4px] border border-dashed border-[var(--ink-line)]">
              <Avatar src={confirmUser.avatar} size={40} />
              <div>
                <div className="font-[family-name:var(--font-serif)] font-semibold text-sm">
                  {confirmUser.firstName} {confirmUser.lastName}
                </div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mt-0.5">
                  Motif de blocage : {confirmUser.blockReason}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminPage>
  );
}
