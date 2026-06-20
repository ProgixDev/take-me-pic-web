"use client";

import Link from "next/link";
import { Users, Camera, ImageIcon, Euro, Crown, Flag, ShieldCheck, MapPin, ChevronRight } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminPage } from "@/components/admin/AdminPage";
import { PaperCard, StatCard, fmtNum } from "@/components/ui";
import type { AnalyticsTotals, MonthlyPoint } from "@/lib/admin/analytics";
import type { AuditActionEntry } from "@/lib/admin/moderation";

export type DashboardData = {
  totals: AnalyticsTotals;
  revenueCents: number;
  monthly: MonthlyPoint[];
  openReports: number;
  pendingSpots: number;
  pendingVerif: number;
  recent: AuditActionEntry[];
};

const PALETTE = { ink: "#2b2b2b" };

function euros(cents: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(cents / 100);
}

function actorName(e: AuditActionEntry): string {
  if (!e.actor) return "Système";
  return [e.actor.firstName, e.actor.lastName].filter(Boolean).join(" ").trim() || e.actor.username;
}

export function DashboardClient({ data }: { data: DashboardData }) {
  const chart = data.monthly.map((m: MonthlyPoint) => ({ month: m.month, users: m.newUsers }));

  const queues = [
    { label: "Signalements ouverts", value: data.openReports, href: "/admin/moderation/reports", icon: <Flag size={16} />, tone: "stamp-red" },
    { label: "Vérifications en attente", value: data.pendingVerif, href: "/admin/users/verification", icon: <ShieldCheck size={16} />, tone: "stamp-blue" },
    { label: "Spots à valider", value: data.pendingSpots, href: "/admin/spots/pending", icon: <MapPin size={16} />, tone: "stamp-green" },
  ];

  return (
    <AdminPage title="Tableau de bord" eyebrow="vue d'ensemble" breadcrumb={[{ label: "Admin" }]}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <StatCard label="Utilisateurs" value={fmtNum(data.totals.users)} icon={<Users size={16} />} />
        <StatCard label="Sessions" value={fmtNum(data.totals.sessionsEngaged)} icon={<Camera size={16} />} />
        <StatCard label="Photos" value={fmtNum(data.totals.sessionPhotos)} icon={<ImageIcon size={16} />} />
        <StatCard label="Revenu réservations" value={euros(data.revenueCents)} icon={<Euro size={16} />} tone="gold" />
        <StatCard label="Premium" value={fmtNum(data.totals.premiumUsers)} icon={<Crown size={16} />} tone="gold" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth chart */}
        <PaperCard shadow="ink" className="p-5 lg:col-span-2">
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-4">Nouveaux utilisateurs / mois</h2>
          {chart.length === 0 ? (
            <p className="font-[family-name:var(--font-hand)] text-ink-faded py-12 text-center">Pas encore de données mensuelles.</p>
          ) : (
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <AreaChart data={chart} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PALETTE.ink} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={PALETTE.ink} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0001" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" name="Utilisateurs" stroke={PALETTE.ink} fill="url(#gradUsers)" strokeWidth={2} dot={{ r: 3, fill: PALETTE.ink }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </PaperCard>

        {/* Action queues */}
        <PaperCard shadow="ink" className="p-5">
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-4">À traiter</h2>
          <div className="space-y-2.5">
            {queues.map((q) => (
              <Link key={q.href} href={q.href} className="flex items-center justify-between p-3 rounded-[4px] bg-paper-warm border border-[var(--ink-line)] hover:border-ink transition group">
                <span className="flex items-center gap-2 font-[family-name:var(--font-serif)] text-[14px]">
                  {q.icon} {q.label}
                </span>
                <span className="flex items-center gap-1 font-[family-name:var(--font-serif)] font-bold">
                  {q.value}
                  <ChevronRight size={15} className="text-ink-faded group-hover:translate-x-0.5 transition" />
                </span>
              </Link>
            ))}
          </div>
        </PaperCard>
      </div>

      {/* Recent admin activity (audit log) */}
      <PaperCard shadow="soft" className="p-5 mt-6">
        <h2 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-4">Activité récente</h2>
        {data.recent.length === 0 ? (
          <p className="font-[family-name:var(--font-hand)] text-ink-faded py-6 text-center">Aucune action récente.</p>
        ) : (
          <ul className="divide-y divide-[var(--ink-line)]">
            {data.recent.map((e) => (
              <li key={e.id} className="py-2.5 flex items-center justify-between gap-4">
                <span className="font-[family-name:var(--font-serif)] text-[13px]">
                  <strong>{actorName(e)}</strong> · {e.action}
                  {e.targetType ? <span className="text-ink-faded"> ({e.targetType})</span> : null}
                </span>
                <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded whitespace-nowrap">
                  {e.createdAt ? new Date(e.createdAt).toLocaleString("fr-FR") : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </PaperCard>
    </AdminPage>
  );
}
