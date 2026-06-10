"use client";

import Link from "next/link";
import { AlertTriangle, Ban, CheckCircle, ChevronRight, Clock, Flag, Shield } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Avatar, Badge, Button, PaperCard, Stamp, StatCard } from "@/components/ui";
import type { ReportReadModel } from "@/lib/admin/moderation";

function severityTone(status: ReportReadModel["status"]): "red" | "gold" | "neutral" | "blue" | "green" {
  if (status === "open") return "red";
  if (status === "reviewing") return "blue";
  if (status === "resolved") return "green";
  return "neutral";
}

function statusLabel(status: ReportReadModel["status"]) {
  if (status === "open") return "Ouvert";
  if (status === "reviewing") return "En cours";
  if (status === "resolved") return "Résolu";
  return "Ignoré";
}

function targetLabel(targetType: ReportReadModel["targetType"]) {
  if (targetType === "user") return "Utilisateur";
  if (targetType === "post") return "Publication";
  if (targetType === "comment") return "Commentaire";
  if (targetType === "session") return "Session";
  if (targetType === "conversation") return "Conversation";
  if (targetType === "message") return "Message";
  return "Cible";
}

export function ModerationOverviewClient({
  reports,
  counts,
}: {
  reports: ReportReadModel[];
  counts: {
    open: number;
    reviewing: number;
    resolved: number;
    dismissed: number;
  };
}) {
  const priorityQueue = reports.filter((report) => report.status === "open" || report.status === "reviewing").slice(0, 6);

  return (
    <AdminPage
      title="Centre de modération"
      eyebrow="confiance & sécurité ✦"
      breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Modération" }]}
      actions={
        <div className="flex gap-2">
          <Link href="/admin/moderation/blocked">
            <Button variant="paper" size="sm" icon={<Ban size={14} />}>
              Bloqués
            </Button>
          </Link>
          <Link href="/admin/moderation/appeals">
            <Button variant="paper" size="sm" icon={<Shield size={14} />}>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Signalements ouverts"
          value={String(counts.open)}
          tone="red"
          icon={<AlertTriangle size={18} />}
        />
        <StatCard
          label="En cours d'examen"
          value={String(counts.reviewing)}
          tone="blue"
          icon={<Clock size={18} />}
        />
        <StatCard
          label="Résolus"
          value={String(counts.resolved)}
          tone="green"
          icon={<CheckCircle size={18} />}
        />
        <StatCard
          label="Ignorés"
          value={String(counts.dismissed)}
          tone="gold"
          icon={<Shield size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
            {priorityQueue.length === 0 ? (
              <PaperCard shadow="soft" className="p-5">
                <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">
                  Aucune file prioritaire pour le moment.
                </p>
              </PaperCard>
            ) : (
              priorityQueue.map((report) => (
                <PaperCard
                  key={report.id}
                  shadow={report.status === "open" ? "red" : "gold"}
                  className="p-4"
                >
                  <div className="flex items-start gap-3">
                    <Avatar src={report.reporter?.avatarUrl ?? undefined} size={32} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-[family-name:var(--font-serif)] font-semibold text-[14px] truncate">
                          {report.reporter ? [report.reporter.firstName, report.reporter.lastName].filter(Boolean).join(" ") || report.reporter.username : "Signalement anonyme"}
                        </span>
                        <Badge tone={severityTone(report.status)}>{statusLabel(report.status)}</Badge>
                        <Badge tone="neutral">{targetLabel(report.targetType)}</Badge>
                      </div>
                      <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded mb-1">
                        {report.reason} · cible :{" "}
                        <span className="font-semibold text-ink">{report.targetLabel}</span>
                      </p>
                      <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                        <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded">
                          {report.createdAt}
                        </span>
                        <Link href="/admin/moderation/reports">
                          <Button variant="ink" size="sm">
                            Examiner →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </PaperCard>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <PaperCard shadow="gold" className="p-5">
            <div className="relative">
              <Stamp color="red" size={72} fontSize={8} rotate={12} className="absolute -top-2 -right-2 hidden md:block">
                {`URGENT\n★\nVIGIL`}
              </Stamp>
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-base mb-4">
                Répartition
              </h3>
              <div className="space-y-3">
                {(["open", "reviewing", "resolved"] as const).map((status) => {
                  const count = reports.filter((report) => report.status === status).length;
                  const pct = reports.length ? Math.round((count / reports.length) * 100) : 0;
                  return (
                    <div key={status}>
                      <div className="flex justify-between mb-1">
                        <span className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-widest text-ink-faded">
                          {statusLabel(status)}
                        </span>
                        <span className="font-[family-name:var(--font-serif)] font-bold text-sm">
                          {count}
                        </span>
                      </div>
                      <div className="h-1.5 bg-paper-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            status === "open"
                              ? "bg-stamp-red"
                              : status === "reviewing"
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

          <PaperCard shadow="ink" className="p-5">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-base mb-4">
              Accès rapides
            </h3>
            <div className="space-y-2">
              <Link href="/admin/moderation/reports" className="flex items-center justify-between p-2.5 rounded-[4px] hover:bg-paper-warm transition group">
                <div className="flex items-center gap-2.5">
                  <Flag size={15} className="text-stamp-red" />
                  <span className="font-[family-name:var(--font-serif)] text-[14px]">Signalements</span>
                </div>
                <ChevronRight size={14} className="opacity-40 group-hover:translate-x-0.5 transition" />
              </Link>
              <Link href="/admin/moderation/blocked" className="flex items-center justify-between p-2.5 rounded-[4px] hover:bg-paper-warm transition group">
                <div className="flex items-center gap-2.5">
                  <Ban size={15} className="text-stamp-blue" />
                  <span className="font-[family-name:var(--font-serif)] text-[14px]">Bloqués</span>
                </div>
                <ChevronRight size={14} className="opacity-40 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </PaperCard>
        </div>
      </div>
    </AdminPage>
  );
}
