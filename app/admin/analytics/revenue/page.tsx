"use client";

import { useState } from "react";
import {
  Euro,
  TrendingUp,
  CreditCard,
  RefreshCw,
  Download,
  Star,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  StatCard,
  Button,
  PaperCard,
  Badge,
  Stamp,
  useToast,
} from "@/components/ui";
import { analytics, payments, fmtNum, fmtEur } from "@/lib/data";

const PALETTE = {
  gold: "#b8893a",
  ink: "#2a1f1a",
  blue: "#2a4f76",
  green: "#3f6b3f",
  red: "#a8362e",
  sunset: "#d77032",
};

const PIE_COLORS = [PALETTE.gold, PALETTE.blue, PALETTE.sunset];

// MRR / ARR
const MRR = Math.round(analytics.kpis.revenue / 6);
const ARR = MRR * 12;
const ARPU = Math.round(analytics.kpis.revenue / analytics.kpis.premium);

function statusTone(s: string): "green" | "gold" | "red" | "neutral" | "blue" {
  switch (s) {
    case "réussi": return "green";
    case "en attente": return "gold";
    case "échoué": return "red";
    case "remboursé": return "blue";
    default: return "neutral";
  }
}

function typeTone(t: string): "blue" | "gold" | "red" | "neutral" {
  switch (t) {
    case "abonnement": return "gold";
    case "réservation": return "blue";
    case "remboursement": return "red";
    default: return "neutral";
  }
}

export default function RevenuePage() {
  const { push } = useToast();

  const recentPayments = payments.slice(0, 12);

  return (
    <AdminPage
      title="Revenus"
      eyebrow="la caisse enregistreuse ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/analytics", label: "Analytics" },
        { label: "Revenus" },
      ]}
      actions={
        <>
          <Button
            variant="paper"
            size="sm"
            icon={<RefreshCw size={14} />}
            onClick={() => push("Données actualisées ✓", "ok")}
          >
            Actualiser
          </Button>
          <Button
            variant="gold"
            size="sm"
            icon={<Download size={14} />}
            onClick={() => push("Export revenus en cours…", "info")}
          >
            Exporter
          </Button>
        </>
      }
    >
      {/* KPI StatCards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 stagger">
        <StatCard
          label="MRR"
          value={fmtEur(MRR)}
          delta="+5,3 %"
          icon={<Euro size={16} />}
          tone="gold"
        />
        <StatCard
          label="ARR (estimé)"
          value={fmtEur(ARR)}
          delta="+5,3 %"
          icon={<TrendingUp size={16} />}
          tone="green"
        />
        <StatCard
          label="ARPU"
          value={fmtEur(ARPU)}
          delta="+2,8 %"
          icon={<Star size={16} />}
          tone="blue"
        />
        <StatCard
          label="Abonnés actifs"
          value={fmtNum(analytics.kpis.premium)}
          delta={analytics.kpis.premiumDelta}
          icon={<CreditCard size={16} />}
          tone="ink"
        />
      </section>

      {/* Revenue line + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {/* Revenue evolution */}
        <PaperCard shadow="soft" className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
                Évolution mensuelle
              </p>
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mt-0.5">
                Revenus 2026
              </h3>
            </div>
            <Stamp color="green" shape="rect" size={52} rotate={2} fontSize={9}>
              {"REVENU\n2026"}
            </Stamp>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={analytics.growth} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PALETTE.green} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={PALETTE.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: "#fbf6e9", border: "1.5px solid #2a1f1a", borderRadius: 4, fontSize: 12 }}
                formatter={(v) => [fmtEur(Number(v ?? 0)), "Revenus"]}
              />
              <Area type="monotone" dataKey="revenue" name="Revenus €" stroke={PALETTE.green} fill="url(#gRev)" strokeWidth={2.5} dot={{ r: 4, fill: PALETTE.green }} activeDot={{ r: 7 }} />
            </AreaChart>
          </ResponsiveContainer>
        </PaperCard>

        {/* Revenue split pie */}
        <PaperCard shadow="soft" className="p-5">
          <div className="mb-4">
            <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
              Répartition des sources
            </p>
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mt-0.5">
              Mix revenus
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={analytics.revenueSplit}
                cx="50%"
                cy="45%"
                outerRadius={95}
                innerRadius={48}
                dataKey="value"
                nameKey="name"
                paddingAngle={4}
              >
                {analytics.revenueSplit.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#fbf6e9", border: "1.5px solid #2a1f1a", borderRadius: 4, fontSize: 12 }}
                formatter={(v) => fmtEur(Number(v ?? 0))}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-type)" }}
                formatter={(value) => value.length > 22 ? value.slice(0, 22) + "…" : value}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend with totals */}
          <div className="mt-3 space-y-1.5 border-t border-[var(--ink-line)] pt-3">
            {analytics.revenueSplit.map((s, i) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">{s.name}</span>
                </div>
                <span className="font-[family-name:var(--font-serif)] font-bold text-[13px]">{fmtEur(s.value)}</span>
              </div>
            ))}
          </div>
        </PaperCard>
      </div>

      {/* Recent payments mini-table */}
      <PaperCard shadow="soft" className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
              Transactions récentes
            </p>
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mt-0.5">
              Derniers paiements
            </h3>
          </div>
          <Button
            variant="paper"
            size="sm"
            onClick={() => push("Voir tous les paiements…", "info")}
          >
            Voir tout
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] font-[family-name:var(--font-type)]">
            <thead>
              <tr className="border-b border-[var(--ink-line)]">
                {["ID", "Utilisateur", "Type", "Montant", "Méthode", "Statut", "Date"].map((h) => (
                  <th key={h} className="text-left pb-2 pr-3 text-ink-faded uppercase tracking-[0.08em] text-[10px] font-normal whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((p) => (
                <tr key={p.id} className="border-b border-[var(--ink-line)] last:border-0 hover:bg-paper-warm transition-colors">
                  <td className="py-2.5 pr-3 text-ink-faded">{p.id}</td>
                  <td className="py-2.5 pr-3 font-[family-name:var(--font-serif)] text-[12px] font-semibold whitespace-nowrap">
                    {p.user.firstName} {p.user.lastName}
                  </td>
                  <td className="py-2.5 pr-3">
                    <Badge tone={typeTone(p.type)}>{p.type}</Badge>
                  </td>
                  <td className={`py-2.5 pr-3 font-bold ${p.amount < 0 ? "text-stamp-red" : "text-stamp-green"}`}>
                    {fmtEur(p.amount)}
                  </td>
                  <td className="py-2.5 pr-3 text-ink-faded">{p.method}</td>
                  <td className="py-2.5 pr-3">
                    <Badge tone={statusTone(p.status)} dot>{p.status}</Badge>
                  </td>
                  <td className="py-2.5 text-ink-faded whitespace-nowrap">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PaperCard>
    </AdminPage>
  );
}
