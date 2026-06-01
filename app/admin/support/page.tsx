"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Clock, CheckCircle, AlertCircle, BarChart2 } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  DataTable,
  Column,
  Badge,
  Chip,
  Avatar,
  StatCard,
  useToast,
} from "@/components/ui";
import { tickets, Ticket, fmtNum } from "@/lib/data";

type StatusFilter = "tous" | Ticket["status"];
type PriorityFilter = "tous" | Ticket["priority"];

const STATUS_TONE: Record<Ticket["status"], "red" | "gold" | "green"> = {
  ouvert: "red",
  "en cours": "gold",
  résolu: "green",
};

const PRIORITY_TONE: Record<Ticket["priority"], "red" | "neutral" | "gold"> = {
  haute: "red",
  normale: "gold",
  basse: "neutral",
};

const CATEGORY_TONE: Record<Ticket["category"], "blue" | "gold" | "red" | "neutral" | "green"> = {
  compte: "blue",
  paiement: "gold",
  sécurité: "red",
  technique: "neutral",
  autre: "neutral",
};

export default function SupportPage() {
  const router = useRouter();
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("tous");

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const statusOk = statusFilter === "tous" || t.status === statusFilter;
      const priorityOk = priorityFilter === "tous" || t.priority === priorityFilter;
      return statusOk && priorityOk;
    });
  }, [statusFilter, priorityFilter]);

  const ouverts = tickets.filter((t) => t.status === "ouvert").length;
  const enCours = tickets.filter((t) => t.status === "en cours").length;
  const résolus = tickets.filter((t) => t.status === "résolu").length;

  const columns: Column<Ticket>[] = [
    {
      key: "id",
      header: "ID",
      cell: (row) => (
        <span className="font-[family-name:var(--font-mono)] text-[12px] text-ink-faded">
          {row.id}
        </span>
      ),
      sortValue: (row) => row.id,
    },
    {
      key: "subject",
      header: "Sujet",
      cell: (row) => (
        <span className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">
          {row.subject}
        </span>
      ),
      sortValue: (row) => row.subject,
    },
    {
      key: "user",
      header: "Utilisateur",
      cell: (row) => (
        <span className="flex items-center gap-2">
          <Avatar src={row.user.avatar} size={28} />
          <span className="font-[family-name:var(--font-serif)] text-[13px] truncate max-w-[120px]">
            {row.user.firstName} {row.user.lastName}
          </span>
        </span>
      ),
      sortValue: (row) => `${row.user.firstName} ${row.user.lastName}`,
    },
    {
      key: "category",
      header: "Catégorie",
      cell: (row) => (
        <Badge tone={CATEGORY_TONE[row.category]}>
          {row.category}
        </Badge>
      ),
      sortValue: (row) => row.category,
    },
    {
      key: "priority",
      header: "Priorité",
      cell: (row) => (
        <Badge tone={PRIORITY_TONE[row.priority]} dot>
          {row.priority}
        </Badge>
      ),
      sortValue: (row) => row.priority,
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
      key: "updated",
      header: "Mis à jour",
      cell: (row) => (
        <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
          {row.updated}
        </span>
      ),
      sortValue: (row) => row.updated,
    },
  ];

  const statusChips: { key: StatusFilter; label: string }[] = [
    { key: "tous", label: "Tous" },
    { key: "ouvert", label: "Ouverts" },
    { key: "en cours", label: "En cours" },
    { key: "résolu", label: "Résolus" },
  ];

  const priorityChips: { key: PriorityFilter; label: string }[] = [
    { key: "tous", label: "Toutes priorités" },
    { key: "haute", label: "Haute" },
    { key: "normale", label: "Normale" },
    { key: "basse", label: "Basse" },
  ];

  return (
    <AdminPage
      title="Support utilisateurs"
      eyebrow="tickets & demandes"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { label: "Support" },
      ]}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Ouverts"
          value={ouverts}
          tone="red"
          icon={<AlertCircle size={18} />}
        />
        <StatCard
          label="En cours"
          value={enCours}
          tone="gold"
          icon={<MessageSquare size={18} />}
        />
        <StatCard
          label="Résolus"
          value={résolus}
          delta="+3 ce jour"
          tone="green"
          icon={<CheckCircle size={18} />}
        />
        <StatCard
          label="Temps moyen"
          value="4 h 12"
          delta="-18 min"
          tone="blue"
          icon={<Clock size={18} />}
        />
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mr-1">
            Statut :
          </span>
          {statusChips.map((c) => (
            <Chip
              key={c.key}
              color={
                statusFilter === c.key
                  ? "ink"
                  : c.key === "ouvert"
                  ? "red"
                  : c.key === "en cours"
                  ? "gold"
                  : c.key === "résolu"
                  ? "green"
                  : "ink"
              }
              variant={statusFilter === c.key ? "filled" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(c.key)}
            >
              {c.label}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mr-1">
            Priorité :
          </span>
          {priorityChips.map((c) => (
            <Chip
              key={c.key}
              color={
                priorityFilter === c.key
                  ? "ink"
                  : c.key === "haute"
                  ? "red"
                  : c.key === "normale"
                  ? "gold"
                  : "ink"
              }
              variant={priorityFilter === c.key ? "filled" : "outline"}
              size="sm"
              onClick={() => setPriorityFilter(c.key)}
            >
              {c.label}
            </Chip>
          ))}
          <span className="ml-auto font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
            {filtered.length} ticket{filtered.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <DataTable<Ticket & Record<string, unknown>>
        columns={columns as Column<Ticket & Record<string, unknown>>[]}
        rows={filtered as (Ticket & Record<string, unknown>)[]}
        onRowClick={(row) => router.push(`/admin/support/${(row as unknown as Ticket).id}`)}
        searchable
        searchPlaceholder="rechercher par sujet, utilisateur…"
        pageSize={10}
        empty="Aucun ticket ne correspond."
      />
    </AdminPage>
  );
}
