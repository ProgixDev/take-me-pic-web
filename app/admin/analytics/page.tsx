"use client";

import { useState } from "react";
import {
  TrendingUp,
  Euro,
  Users,
  Camera,
  Heart,
  Star,
  Download,
  Calendar,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
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
  Tabs,
  Chip,
  PaperCard,
  Stamp,
  useToast,
} from "@/components/ui";
import { analytics, fmtNum, fmtEur } from "@/lib/data";

const PALETTE = {
  gold: "#b8893a",
  ink: "#2a1f1a",
  blue: "#2a4f76",
  green: "#3f6b3f",
  red: "#a8362e",
  sunset: "#d77032",
};

const DATE_RANGES = [
  { key: "7j", label: "7 jours" },
  { key: "30j", label: "30 jours" },
  { key: "90j", label: "90 jours" },
  { key: "1an", label: "1 an" },
];

const PIE_COLORS = [PALETTE.gold, PALETTE.blue, PALETTE.sunset];

const CHART_TABS = [
  { key: "croissance", label: "Croissance" },
  { key: "revenus", label: "Revenus" },
  { key: "engagement", label: "Engagement" },
];

export default function AnalyticsPage() {
  const { push } = useToast();
  const [tab, setTab] = useState("croissance");
  const [range, setRange] = useState("30j");

  const { kpis, growth, engagement, revenueSplit } = analytics;

  return (
    <AdminPage
      title="Analytics"
      eyebrow="données & insights ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { label: "Analytics" },
      ]}
      actions={
        <>
          <Button
            variant="paper"
            size="sm"
            icon={<Download size={14} />}
            onClick={() => push("Export des données en cours…", "info")}
          >
            Exporter
          </Button>
        </>
      }
    >
      {/* Date range selector */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Calendar size={14} className="text-ink-faded" />
        <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mr-1">
          Période :
        </span>
        {DATE_RANGES.map((dr) => (
          <Chip
            key={dr.key}
            color={range === dr.key ? "gold" : "ink"}
            variant={range === dr.key ? "filled" : "outline"}
            size="sm"
            mono
            onClick={() => setRange(dr.key)}
          >
            {dr.label}
          </Chip>
        ))}
      </div>

      {/* KPI StatCards */}
      <section className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-8 stagger">
        <StatCard label="Utilisateurs" value={fmtNum(kpis.users)} delta={kpis.usersDelta} icon={<Users size={16} />} tone="ink" />
        <StatCard label="Sessions" value={fmtNum(kpis.sessions)} delta={kpis.sessionsDelta} icon={<Camera size={16} />} tone="blue" />
        <StatCard label="Photos" value={fmtNum(kpis.photos)} delta={kpis.photosDelta} icon={<Star size={16} />} tone="gold" />
        <StatCard label="Revenus" value={fmtEur(kpis.revenue)} delta={kpis.revenueDelta} icon={<Euro size={16} />} tone="green" />
        <StatCard label="Premium" value={fmtNum(kpis.premium)} delta={kpis.premiumDelta} icon={<TrendingUp size={16} />} tone="blue" />
        <StatCard label="Karma" value={`${(kpis.karma / 1_000_000).toFixed(1)} M`} delta={kpis.karmaDelta} icon={<Heart size={16} />} tone="gold" />
      </section>

      {/* Tabs + chart area */}
      <PaperCard shadow="soft" className="p-5">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <Tabs tabs={CHART_TABS} value={tab} onChange={setTab} />
          <Stamp color="gold" shape="rect" size={44} rotate={-2} fontSize={9}>
            {range}
          </Stamp>
        </div>

        {tab === "croissance" && (
          <div>
            <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-4">
              Évolution des utilisateurs et des sessions de janvier à juin 2026.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={growth} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PALETTE.ink} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={PALETTE.ink} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PALETTE.blue} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={PALETTE.blue} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
                <YAxis tick={{ fontSize: 10, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
                <Tooltip contentStyle={{ background: "#fbf6e9", border: "1.5px solid #2a1f1a", borderRadius: 4, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-type)" }} />
                <Area type="monotone" dataKey="users" name="Utilisateurs" stroke={PALETTE.ink} fill="url(#gUsers)" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Area type="monotone" dataKey="sessions" name="Sessions" stroke={PALETTE.blue} fill="url(#gSessions)" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === "revenus" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-4">
                Évolution des revenus mensuels (€).
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={growth} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PALETTE.green} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={PALETTE.green} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" />
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip contentStyle={{ background: "#fbf6e9", border: "1.5px solid #2a1f1a", borderRadius: 4, fontSize: 12 }} formatter={(v) => fmtEur(Number(v ?? 0))} />
                  <Area type="monotone" dataKey="revenue" name="Revenus" stroke={PALETTE.green} fill="url(#gRevenue)" strokeWidth={2.5} dot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-4">
                Répartition des sources de revenus.
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueSplit}
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={55}
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={3}
                    label={({ name, percent }: { name?: string; percent?: number }) => `${(name ?? "").split(" ")[0]} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {revenueSplit.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#fbf6e9", border: "1.5px solid #2a1f1a", borderRadius: 4, fontSize: 12 }} formatter={(v) => fmtEur(Number(v ?? 0))} />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-type)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {tab === "engagement" && (
          <div>
            <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-4">
              Taux d&apos;engagement quotidien moyen (sessions actives / utilisateurs actifs × 100).
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagement} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
                <YAxis tick={{ fontSize: 10, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
                <Tooltip contentStyle={{ background: "#fbf6e9", border: "1.5px solid #2a1f1a", borderRadius: 4, fontSize: 12 }} />
                <Bar dataKey="value" name="Engagement %" fill={PALETTE.gold} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </PaperCard>

      {/* Sub-nav cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
        {[
          { href: "/admin/analytics/users", label: "Utilisateurs", icon: <Users size={16} />, color: "ink" as const },
          { href: "/admin/analytics/engagement", label: "Engagement", icon: <Heart size={16} />, color: "gold" as const },
          { href: "/admin/analytics/revenue", label: "Revenus", icon: <Euro size={16} />, color: "green" as const },
          { href: "/admin/analytics/geography", label: "Géographie", icon: <Camera size={16} />, color: "blue" as const },
          { href: "/admin/analytics/retention", label: "Rétention", icon: <TrendingUp size={16} />, color: "red" as const },
        ].map((item) => (
          <a key={item.href} href={item.href}>
            <PaperCard shadow="soft" className="p-4 flex flex-col items-center gap-2 text-center cursor-pointer hover:-translate-y-0.5 transition-transform">
              <div className={`text-${item.color === "ink" ? "ink" : `stamp-${item.color}`}`}>
                {item.icon}
              </div>
              <span className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">{item.label}</span>
            </PaperCard>
          </a>
        ))}
      </div>
    </AdminPage>
  );
}
