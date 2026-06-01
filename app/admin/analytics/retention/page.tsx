"use client";

import { useState } from "react";
import {
  RefreshCw,
  TrendingDown,
  Users,
  Target,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  StatCard,
  Button,
  PaperCard,
  Stamp,
  Badge,
  Chip,
  useToast,
} from "@/components/ui";
import { analytics, fmtNum } from "@/lib/data";

const PALETTE = {
  gold: "#b8893a",
  ink: "#2a1f1a",
  blue: "#2a4f76",
  green: "#3f6b3f",
  red: "#a8362e",
  sunset: "#d77032",
};

// Cohort data: rows = cohorts (month), cols = week retention
const COHORT_MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai"];
const COHORT_WEEKS = ["S1", "S2", "S3", "S4", "S6", "S8", "S12"];

// Generate cohort values based on retention curve with slight variance per cohort
function cohortVal(base: number, cohortIdx: number): number {
  const variance = [1.0, 0.97, 1.04, 0.99, 1.06];
  const v = Math.round(base * (variance[cohortIdx % variance.length] ?? 1));
  return Math.min(100, Math.max(0, v));
}

const cohortGrid = COHORT_MONTHS.map((month, ci) =>
  COHORT_WEEKS.map((_, wi) => {
    const base = analytics.retention[wi]?.value ?? 0;
    return cohortVal(base, ci);
  })
);

function retentionColor(v: number): string {
  if (v >= 80) return "bg-stamp-green/80 text-paper-warm";
  if (v >= 60) return "bg-stamp-green/40 text-ink";
  if (v >= 40) return "bg-gold-light/60 text-ink";
  if (v >= 25) return "bg-sunset/40 text-ink";
  return "bg-stamp-red/30 text-stamp-red";
}

type Period = "7j" | "30j" | "90j";

export default function RetentionPage() {
  const { push } = useToast();
  const [period, setPeriod] = useState<Period>("30j");

  const { retention } = analytics;

  // Derived stats
  const week1 = retention[0].value;
  const week4 = retention[3].value;
  const week12 = retention[retention.length - 1].value;
  const churnRate = (100 - week4).toFixed(1);
  const churnMonthly = (100 - week12).toFixed(1);

  return (
    <AdminPage
      title="Rétention"
      eyebrow="fidélité & engagement long terme ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/analytics", label: "Analytics" },
        { label: "Rétention" },
      ]}
      actions={
        <>
          <Button
            variant="paper"
            size="sm"
            icon={<Download size={14} />}
            onClick={() => push("Export rétention en cours…", "info")}
          >
            Exporter
          </Button>
        </>
      }
    >
      {/* KPI StatCards — churn */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 stagger">
        <StatCard
          label="Rétention S1"
          value={`${week1} %`}
          delta="Base"
          icon={<Users size={16} />}
          tone="green"
        />
        <StatCard
          label="Rétention S4"
          value={`${week4} %`}
          delta="-53 pts vs S1"
          icon={<Target size={16} />}
          tone="blue"
        />
        <StatCard
          label="Rétention S12"
          value={`${week12} %`}
          delta="-66 pts vs S1"
          icon={<RefreshCw size={16} />}
          tone="gold"
        />
        <StatCard
          label="Churn mensuel"
          value={`${churnRate} %`}
          delta="-1,2 pt"
          icon={<TrendingDown size={16} />}
          tone="red"
        />
      </section>

      {/* Retention curve */}
      <PaperCard shadow="soft" className="p-5 mb-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
              Courbe de rétention
            </p>
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mt-0.5">
              Utilisateurs actifs après inscription
            </h3>
          </div>
          <div className="flex gap-2 items-center">
            {(["7j", "30j", "90j"] as Period[]).map((p) => (
              <Chip
                key={p}
                color={period === p ? "ink" : "blue"}
                variant={period === p ? "filled" : "outline"}
                size="sm"
                mono
                onClick={() => setPeriod(p)}
              >
                {p}
              </Chip>
            ))}
            <Stamp color="blue" shape="rect" size={44} rotate={3} fontSize={9}>
              {period}
            </Stamp>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={retention} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "#6e5d4e", fontFamily: "var(--font-type)" }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{ background: "#fbf6e9", border: "1.5px solid #2a1f1a", borderRadius: 4, fontSize: 12 }}
              formatter={(v) => [`${v ?? 0}%`, "Rétention"]}
            />
            <ReferenceLine y={50} stroke={PALETTE.red} strokeDasharray="4 3" label={{ value: "50%", fill: PALETTE.red, fontSize: 10, position: "right" }} />
            <ReferenceLine y={30} stroke={PALETTE.gold} strokeDasharray="4 3" label={{ value: "30%", fill: PALETTE.gold, fontSize: 10, position: "right" }} />
            <Line
              type="monotone"
              dataKey="value"
              name="Rétention %"
              stroke={PALETTE.blue}
              strokeWidth={3}
              dot={{ r: 6, fill: PALETTE.blue, stroke: "#fbf6e9", strokeWidth: 2 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </PaperCard>

      {/* Cohort table */}
      <PaperCard shadow="soft" className="p-5 mb-5">
        <div className="mb-4">
          <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
            Analyse cohorte
          </p>
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mt-0.5">
            Rétention par cohorte mensuelle (%)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] font-[family-name:var(--font-type)]">
            <thead>
              <tr>
                <th className="text-left pb-2 pr-4 text-ink-faded uppercase tracking-[0.08em] text-[10px] font-normal whitespace-nowrap">
                  Cohorte
                </th>
                {COHORT_WEEKS.map((w) => (
                  <th key={w} className="text-center pb-2 px-2 text-ink-faded uppercase tracking-[0.08em] text-[10px] font-normal whitespace-nowrap">
                    {w}
                  </th>
                ))}
                <th className="text-left pb-2 pl-4 text-ink-faded uppercase tracking-[0.08em] text-[10px] font-normal whitespace-nowrap">
                  Taille
                </th>
              </tr>
            </thead>
            <tbody>
              {COHORT_MONTHS.map((month, ci) => {
                const cohortSize = [3200, 4100, 5600, 6400, 6930][ci];
                return (
                  <tr key={month} className="border-t border-[var(--ink-line)]">
                    <td className="py-2.5 pr-4 font-[family-name:var(--font-serif)] font-bold text-[13px] whitespace-nowrap">
                      {month} 2026
                    </td>
                    {cohortGrid[ci].map((val, wi) => (
                      <td key={wi} className="py-2 px-1 text-center">
                        <span className={`inline-flex items-center justify-center rounded-[3px] text-[11px] font-bold px-1.5 py-0.5 min-w-[36px] ${retentionColor(val)}`}>
                          {val}%
                        </span>
                      </td>
                    ))}
                    <td className="py-2.5 pl-4 text-ink-faded font-[family-name:var(--font-serif)] text-[12px]">
                      {fmtNum(cohortSize)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <span className="font-[family-name:var(--font-type)] text-[10px] text-ink-faded uppercase tracking-[0.08em]">Légende :</span>
          {[
            { label: "≥ 80%", cls: "bg-stamp-green/80 text-paper-warm" },
            { label: "60–79%", cls: "bg-stamp-green/40 text-ink" },
            { label: "40–59%", cls: "bg-gold-light/60 text-ink" },
            { label: "25–39%", cls: "bg-sunset/40 text-ink" },
            { label: "< 25%", cls: "bg-stamp-red/30 text-stamp-red" },
          ].map((l) => (
            <span key={l.label} className={`inline-flex items-center rounded-[3px] text-[10px] font-bold px-2 py-0.5 ${l.cls}`}>
              {l.label}
            </span>
          ))}
        </div>
      </PaperCard>

      {/* Churn insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <PaperCard shadow="soft" className="p-4">
          <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-1">
            Churn mensuel estimé
          </p>
          <p className="font-[family-name:var(--font-serif)] font-extrabold text-[32px] leading-none text-stamp-red">
            {churnRate} %
          </p>
          <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[12px] mt-1">
            Après 4 semaines
          </p>
          <Badge tone="red" dot className="mt-2">À surveiller</Badge>
        </PaperCard>

        <PaperCard shadow="soft" className="p-4">
          <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-1">
            Churn S12
          </p>
          <p className="font-[family-name:var(--font-serif)] font-extrabold text-[32px] leading-none text-sunset">
            {churnMonthly} %
          </p>
          <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[12px] mt-1">
            Après 12 semaines
          </p>
          <Badge tone="gold" dot className="mt-2">Cible : {'<'}60%</Badge>
        </PaperCard>

        <PaperCard shadow="soft" className="p-4">
          <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-1">
            Utilisateurs fidèles (S12+)
          </p>
          <p className="font-[family-name:var(--font-serif)] font-extrabold text-[32px] leading-none text-stamp-green">
            {week12} %
          </p>
          <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[12px] mt-1">
            Le noyau dur de la communauté
          </p>
          <Badge tone="green" dot className="mt-2">Objectif atteint</Badge>
        </PaperCard>
      </div>
    </AdminPage>
  );
}
