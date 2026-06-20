"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTable, type Column, Badge, Avatar, StatCard } from "@/components/ui";
import type {
  SupportTicketListItem,
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@/lib/admin/support-tickets";

const STATUS_LABEL: Record<TicketStatus, string> = { ouvert: "Ouvert", en_cours: "En cours", resolu: "Résolu" };
const STATUS_TONE: Record<TicketStatus, "red" | "gold" | "green"> = { ouvert: "red", en_cours: "gold", resolu: "green" };
const PRIORITY_LABEL: Record<TicketPriority, string> = { basse: "basse", normale: "normale", haute: "haute" };
const PRIORITY_TONE: Record<TicketPriority, "red" | "gold" | "neutral"> = { haute: "red", normale: "gold", basse: "neutral" };
const CATEGORY_LABEL: Record<TicketCategory, string> = {
  compte: "compte",
  paiement: "paiement",
  securite: "sécurité",
  technique: "technique",
  autre: "autre",
};
const CATEGORY_TONE: Record<TicketCategory, "blue" | "gold" | "red" | "neutral"> = {
  compte: "blue",
  paiement: "gold",
  securite: "red",
  technique: "neutral",
  autre: "neutral",
};

type StatusFilter = "tous" | TicketStatus;
type PriorityFilter = "tous" | TicketPriority;

function fullName(p: SupportTicketListItem["user"]): string {
  if (!p) return "Utilisateur inconnu";
  return [p.firstName, p.lastName].filter(Boolean).join(" ").trim() || p.username;
}

export function SupportClient({ tickets }: { tickets: SupportTicketListItem[] }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("tous");

  const filtered = useMemo(
    () =>
      tickets.filter(
        (t) =>
          (statusFilter === "tous" || t.status === statusFilter) &&
          (priorityFilter === "tous" || t.priority === priorityFilter),
      ),
    [tickets, statusFilter, priorityFilter],
  );

  const ouverts = tickets.filter((t) => t.status === "ouvert").length;
  const enCours = tickets.filter((t) => t.status === "en_cours").length;
  const résolus = tickets.filter((t) => t.status === "resolu").length;

  const columns: Column<SupportTicketListItem>[] = [
    { key: "id", header: "#", cell: (r) => <span className="font-[family-name:var(--font-type)] text-ink-faded">#{r.id}</span>, sortValue: (r) => r.id },
    { key: "subject", header: "Sujet", cell: (r) => <span className="font-[family-name:var(--font-serif)] font-semibold">{r.subject}</span>, sortValue: (r) => r.subject },
    {
      key: "user",
      header: "Utilisateur",
      cell: (r) => (
        <div className="flex items-center gap-2">
          <Avatar src={r.user?.avatarUrl ?? undefined} size={28} />
          <span className="font-[family-name:var(--font-serif)]">{fullName(r.user)}</span>
        </div>
      ),
      sortValue: (r) => fullName(r.user),
    },
    { key: "category", header: "Catégorie", cell: (r) => <Badge tone={CATEGORY_TONE[r.category]}>{CATEGORY_LABEL[r.category]}</Badge>, sortValue: (r) => r.category },
    { key: "priority", header: "Priorité", cell: (r) => <Badge tone={PRIORITY_TONE[r.priority]} dot>{PRIORITY_LABEL[r.priority]}</Badge>, sortValue: (r) => r.priority },
    { key: "status", header: "Statut", cell: (r) => <Badge tone={STATUS_TONE[r.status]} dot>{STATUS_LABEL[r.status]}</Badge>, sortValue: (r) => r.status },
    {
      key: "updatedAt",
      header: "Mis à jour",
      cell: (r) => <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">{new Date(r.updatedAt).toLocaleString("fr-FR")}</span>,
      sortValue: (r) => r.updatedAt,
    },
  ];

  return (
    <AdminPage
      title="Support"
      eyebrow="tickets & demandes"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { label: "Support" },
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total" value={tickets.length} icon={<MessageSquare size={16} />} />
        <StatCard label="Ouverts" value={ouverts} tone="red" icon={<AlertCircle size={16} />} />
        <StatCard label="En cours" value={enCours} tone="gold" icon={<Clock size={16} />} />
        <StatCard label="Résolus" value={résolus} tone="green" icon={<CheckCircle size={16} />} />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(["tous", "ouvert", "en_cours", "resolu"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-[4px] border-[1.5px] text-[12px] font-[family-name:var(--font-type)] uppercase tracking-widest ${
              statusFilter === s ? "border-ink bg-ink text-paper" : "border-[var(--ink-line)] text-ink-faded"
            }`}
          >
            {s === "tous" ? "Tous" : STATUS_LABEL[s as TicketStatus]}
          </button>
        ))}
        {(["tous", "haute", "normale", "basse"] as PriorityFilter[]).map((p) => (
          <button
            key={p}
            onClick={() => setPriorityFilter(p)}
            className={`px-3 py-1 rounded-[4px] border-[1.5px] text-[12px] font-[family-name:var(--font-type)] uppercase tracking-widest ${
              priorityFilter === p ? "border-gold-deep bg-gold-deep/15 text-gold-deep" : "border-[var(--ink-line)] text-ink-faded"
            }`}
          >
            {p === "tous" ? "Toutes priorités" : PRIORITY_LABEL[p as TicketPriority]}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        onRowClick={(row) => router.push(`/admin/support/${row.id}`)}
        searchPlaceholder="rechercher un ticket…"
        empty="Aucun ticket de support pour l'instant."
      />
    </AdminPage>
  );
}
