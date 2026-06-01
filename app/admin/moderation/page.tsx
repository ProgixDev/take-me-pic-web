"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle,
  ChevronRight,
  Ban,
  Gavel,
  Flag,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  StatCard,
  Badge,
  PaperCard,
  Avatar,
  Chip,
  Button,
  Stamp,
} from "@/components/ui";
import { reports, users, fmtNum } from "@/lib/data";

function severityTone(s: string): "red" | "gold" | "neutral" {
  if (s === "high") return "red";
  if (s === "medium") return "gold";
  return "neutral";
}

function statusTone(s: string): "red" | "blue" | "green" | "neutral" {
  if (s === "open") return "red";
  if (s === "reviewing") return "blue";
  if (s === "resolved") return "green";
  return "neutral";
}

const openCount = reports.filter((r) => r.status === "open").length;
const reviewingCount = reports.filter((r) => r.status === "reviewing").length;
const resolvedCount = reports.filter((r) => r.status === "resolved").length;

const priorityQueue = [...reports]
  .filter((r) => r.status === "open" || r.status === "reviewing")
  .sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  })
  .slice(0, 6);

export default function ModerationPage() {
  return (
    <AdminPage
      title="Centre de modération"
      eyebrow="confiance & sécurité ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { label: "Modération" },
      ]}
      actions={
        <div className="flex gap-2">
          <Link href="/admin/moderation/blocked">
            <Button variant="paper" size="sm" icon={<Ban size={14} />}>
              Bloqués
            </Button>
          </Link>
          <Link href="/admin/moderation/appeals">
            <Button variant="paper" size="sm" icon={<Gavel size={14} />}>
              Appels
            </Button>
          </Link>
          <Link href="/admin/moderation/reports">
            <Button variant="ink" size="sm" icon={<Flag size={14} />}>
              Tous les signalements
            </Button>
          </Link>
        </div>
      }
    >
      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Signalements ouverts"
          value={fmtNum(openCount)}
          delta="+3 ce matin"
          tone="red"
          icon={<AlertTriangle size={18} />}
        />
        <StatCard
          label="En cours d'examen"
          value={fmtNum(reviewingCount)}
          tone="blue"
          icon={<Clock size={18} />}
        />
        <StatCard
          label="Résolus ce mois"
          value={fmtNum(resolvedCount)}
          delta="+12 %"
          tone="green"
          icon={<CheckCircle size={18} />}
        />
        <StatCard
          label="Temps moyen de réponse"
          value="4h 12min"
          delta="-18 min vs semaine passée"
          tone="gold"
          icon={<Shield size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Priority Queue */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-[family-name:var(--font-serif)] font-bold text-xl">
              File prioritaire
            </h2>
            <Link
              href="/admin/moderation/reports"
              className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-widest text-ink-faded hover:text-ink transition flex items-center gap-1"
            >
              Tout voir <ChevronRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {priorityQueue.map((report) => (
              <PaperCard
                key={report.id}
                shadow={report.severity === "high" ? "red" : report.severity === "medium" ? "gold" : "soft"}
                className="p-4"
              >
                <div className="flex items-start gap-3">
                  <Avatar
                    src={report.reporter.avatar}
                    size={32}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-[family-name:var(--font-serif)] font-semibold text-[14px] truncate">
                        {report.reporter.firstName} {report.reporter.lastName}
                      </span>
                      <Badge tone={severityTone(report.severity)}>
                        {report.severity === "high" ? "haute" : report.severity === "medium" ? "moyenne" : "basse"}
                      </Badge>
                      <Badge tone={statusTone(report.status)}>{report.status}</Badge>
                    </div>
                    <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded mb-1">
                      {report.reason} · cible :{" "}
                      <span className="font-semibold text-ink">{report.target}</span>
                    </p>
                    <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                      <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded">
                        {report.type} · {report.date}
                      </span>
                      <Link href={`/admin/moderation/reports/${report.id}`}>
                        <Button variant="ink" size="sm">
                          Examiner →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </PaperCard>
            ))}
          </div>
        </div>

        {/* Quick Links + Summary */}
        <div className="space-y-4">
          {/* Severity Breakdown */}
          <PaperCard shadow="gold" className="p-5">
            <div className="relative">
              <Stamp color="red" size={72} fontSize={8} rotate={12} className="absolute -top-2 -right-2 hidden md:block">
                {`URGENT\n★\nVIGIL`}
              </Stamp>
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-base mb-4">
                Répartition par sévérité
              </h3>
              <div className="space-y-3">
                {(["high", "medium", "low"] as const).map((sev) => {
                  const count = reports.filter((r) => r.severity === sev).length;
                  const pct = Math.round((count / reports.length) * 100);
                  return (
                    <div key={sev}>
                      <div className="flex justify-between mb-1">
                        <span className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-widest text-ink-faded">
                          {sev === "high" ? "Haute" : sev === "medium" ? "Moyenne" : "Basse"}
                        </span>
                        <span className="font-[family-name:var(--font-serif)] font-bold text-sm">
                          {count}
                        </span>
                      </div>
                      <div className="h-1.5 bg-paper-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            sev === "high"
                              ? "bg-stamp-red"
                              : sev === "medium"
                              ? "bg-gold-deep"
                              : "bg-stamp-green"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </PaperCard>

          {/* Quick Actions */}
          <PaperCard shadow="ink" className="p-5">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-base mb-4">
              Accès rapides
            </h3>
            <div className="space-y-2">
              <Link href="/admin/moderation/reports" className="flex items-center justify-between p-2.5 rounded-[4px] hover:bg-paper-warm transition group">
                <div className="flex items-center gap-2.5">
                  <Flag size={15} className="text-stamp-red" />
                  <span className="font-[family-name:var(--font-serif)] text-[14px]">
                    Tous les signalements
                  </span>
                </div>
                <ChevronRight size={14} className="text-ink-faded group-hover:text-ink transition" />
              </Link>
              <Link href="/admin/moderation/blocked" className="flex items-center justify-between p-2.5 rounded-[4px] hover:bg-paper-warm transition group">
                <div className="flex items-center gap-2.5">
                  <Ban size={15} className="text-stamp-blue" />
                  <span className="font-[family-name:var(--font-serif)] text-[14px]">
                    Utilisateurs bloqués
                  </span>
                </div>
                <Badge tone="blue" className="text-[10px]">
                  {users.filter((u) => u.status === "banned" || u.status === "suspended").length}
                </Badge>
              </Link>
              <Link href="/admin/moderation/appeals" className="flex items-center justify-between p-2.5 rounded-[4px] hover:bg-paper-warm transition group">
                <div className="flex items-center gap-2.5">
                  <Gavel size={15} className="text-gold-deep" />
                  <span className="font-[family-name:var(--font-serif)] text-[14px]">
                    Appels en attente
                  </span>
                </div>
                <Badge tone="gold">5</Badge>
              </Link>
            </div>
          </PaperCard>

          {/* Type distribution */}
          <PaperCard shadow="soft" className="p-5">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-base mb-4">
              Types de signalements
            </h3>
            <div className="flex flex-wrap gap-2">
              {(["user", "post", "comment", "spot"] as const).map((type) => {
                const count = reports.filter((r) => r.type === type).length;
                return (
                  <Chip key={type} color="ink" variant="outline" size="sm">
                    {type} ({count})
                  </Chip>
                );
              })}
            </div>
          </PaperCard>
        </div>
      </div>
    </AdminPage>
  );
}
