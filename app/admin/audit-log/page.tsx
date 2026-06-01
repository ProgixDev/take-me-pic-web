"use client";

import { useState, useMemo } from "react";
import { Download, ShieldCheck, User, Settings, Clock } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  DataTable,
  Column,
  Badge,
  Chip,
  Button,
  StatCard,
  useToast,
} from "@/components/ui";
import { auditLog, fmtNum } from "@/lib/data";

type AuditEntry = typeof auditLog[number];

const ACTION_TONE: Record<string, "red" | "gold" | "green" | "neutral" | "blue"> = {
  "a validé un spot": "green",
  "a suspendu un compte": "red",
  "a remboursé un paiement": "gold",
  "a supprimé une publication": "red",
  "a modifié un rôle": "blue",
  "a résolu un signalement": "green",
};

const ACTOR_COLORS: Record<string, string> = {
  "Claire B.": "text-stamp-green",
  "système": "text-ink-faded",
  "Marc O.": "text-stamp-blue",
  "Inès R.": "text-gold-deep",
};

const ACTORS = ["tous", "Claire B.", "système", "Marc O.", "Inès R."];

export default function AuditLogPage() {
  const toast = useToast();
  const [actorFilter, setActorFilter] = useState("tous");

  const filtered = useMemo(() => {
    if (actorFilter === "tous") return auditLog;
    return auditLog.filter((e) => e.actor === actorFilter);
  }, [actorFilter]);

  const byActor = useMemo(() => {
    const counts: Record<string, number> = {};
    auditLog.forEach((e) => {
      counts[e.actor] = (counts[e.actor] ?? 0) + 1;
    });
    return counts;
  }, []);

  const columns: Column<AuditEntry>[] = [
    {
      key: "time",
      header: "Horodatage",
      cell: (row) => (
        <span className="font-[family-name:var(--font-mono)] text-[12px] text-ink-faded whitespace-nowrap">
          {row.time}
        </span>
      ),
      sortValue: (row) => row.time,
    },
    {
      key: "actor",
      header: "Acteur",
      cell: (row) => (
        <span className={`font-[family-name:var(--font-serif)] font-semibold text-[14px] ${ACTOR_COLORS[row.actor] ?? "text-ink"}`}>
          {row.actor === "système" ? (
            <span className="flex items-center gap-1">
              <Settings size={12} className="opacity-60" />
              {row.actor}
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <User size={12} className="opacity-60" />
              {row.actor}
            </span>
          )}
        </span>
      ),
      sortValue: (row) => row.actor,
    },
    {
      key: "action",
      header: "Action",
      cell: (row) => (
        <Badge tone={ACTION_TONE[row.action] ?? "neutral"}>
          {row.action}
        </Badge>
      ),
      sortValue: (row) => row.action,
    },
    {
      key: "target",
      header: "Cible",
      cell: (row) => (
        <span className="font-[family-name:var(--font-mono)] text-[13px] text-ink">
          {row.target}
        </span>
      ),
      sortValue: (row) => row.target,
    },
    {
      key: "ip",
      header: "Adresse IP",
      cell: (row) => (
        <span className="font-[family-name:var(--font-mono)] text-[12px] text-ink-faded">
          {row.ip}
        </span>
      ),
      sortValue: (row) => row.ip,
    },
  ];

  return (
    <AdminPage
      title="Journal d'audit"
      eyebrow="traçabilité & sécurité"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { label: "Journal d'audit" },
      ]}
      actions={
        <Button
          variant="paper"
          size="sm"
          icon={<Download size={14} />}
          onClick={() => toast.push("Export du journal d'audit en cours…", "info")}
        >
          Exporter CSV
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Entrées total"
          value={fmtNum(auditLog.length)}
          tone="ink"
          icon={<ShieldCheck size={18} />}
        />
        <StatCard
          label="Actions critiques"
          value={auditLog.filter((e) => e.action === "a suspendu un compte" || e.action === "a supprimé une publication").length}
          tone="red"
        />
        <StatCard
          label="Actions système"
          value={byActor["système"] ?? 0}
          icon={<Settings size={18} />}
        />
        <StatCard
          label="Aujourd'hui"
          value={auditLog.filter((e) => e.time.includes("2026-05-30")).length}
          tone="gold"
          icon={<Clock size={18} />}
        />
      </div>

      {/* Actor filter */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mr-1">
          Acteur :
        </span>
        {ACTORS.map((a) => (
          <Chip
            key={a}
            color={actorFilter === a ? "ink" : a === "système" ? "ink" : "blue"}
            variant={actorFilter === a ? "filled" : "outline"}
            size="sm"
            onClick={() => setActorFilter(a)}
          >
            {a === "tous" ? "Tous" : a}
            {a !== "tous" && byActor[a] !== undefined && (
              <span className="ml-1 opacity-70 text-[10px]">({byActor[a]})</span>
            )}
          </Chip>
        ))}
        <span className="ml-auto font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
          {filtered.length} entrée{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      <DataTable<AuditEntry & Record<string, unknown>>
        columns={columns as Column<AuditEntry & Record<string, unknown>>[]}
        rows={filtered as (AuditEntry & Record<string, unknown>)[]}
        searchable
        searchPlaceholder="rechercher acteur, action, cible, IP…"
        pageSize={15}
        empty="Aucune entrée dans le journal."
      />
    </AdminPage>
  );
}
