"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Euro, Users, Camera, Heart, Star } from "lucide-react";
import {
  AreaChart,
  Area,
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
import { StatCard, Tabs, PaperCard, Stamp } from "@/components/ui";
import { fmtNum } from "@/lib/data";
import type { AnalyticsOverview } from "@/lib/admin/analytics";
import {
  PALETTE,
  CHART_TOOLTIP_STYLE,
  AXIS_TICK,
  AXIS_TICK_SM,
  withMonthLabels,
  weekdaySeries,
  fmtEurCents,
} from "@/components/admin/analytics/shared";

const CHART_TABS = [
  { key: "croissance", label: "Croissance" },
  { key: "revenus", label: "Revenus" },
  { key: "engagement", label: "Engagement" },
];

const PIE_COLORS = [PALETTE.gold, PALETTE.blue];

export function OverviewClient({ overview }: { overview: AnalyticsOverview }) {
  const [tab, setTab] = useState("croissance");

  const { totals, revenue, activity } = overview;
  const monthly = withMonthLabels(overview.monthly);
  const weekdays = weekdaySeries(overview.weekday);

  // Platform revenue is the commission; the rest of the booking amount goes
  // to the partner.
  const revenueSplit = [
    { name: "Commission plateforme", value: revenue.commissionCents / 100 },
    { name: "Reversé partenaires", value: (revenue.bookingsRevenueCents - revenue.commissionCents) / 100 },
  ].filter((s) => s.value > 0);

  return (
    <AdminPage
      title="Analytics"
      eyebrow="données & insights ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { label: "Analytics" },
      ]}
    >
      {/* KPI StatCards — live aggregates from admin_analytics_overview() */}
      <section className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-8 stagger">
        <StatCard label="Utilisateurs" value={fmtNum(totals.users)} icon={<Users size={16} />} tone="ink" />
        <StatCard label="Sessions" value={fmtNum(totals.sessionsEngaged)} icon={<Camera size={16} />} tone="blue" />
        <StatCard label="Photos de session" value={fmtNum(totals.sessionPhotos)} icon={<Star size={16} />} tone="gold" />
        <StatCard label="Revenus (réserv.)" value={fmtEurCents(revenue.bookingsRevenueCents)} icon={<Euro size={16} />} tone="green" />
        <StatCard label="Premium" value={fmtNum(totals.premiumUsers)} icon={<TrendingUp size={16} />} tone="blue" />
        <StatCard label="Karma" value={fmtNum(totals.karmaTotal)} icon={<Heart size={16} />} tone="gold" />
      </section>

      {/* Tabs + chart area */}
      <PaperCard shadow="soft" className="p-5">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <Tabs tabs={CHART_TABS} value={tab} onChange={setTab} />
          <Stamp color="gold" shape="rect" size={44} rotate={-2} fontSize={9}>
            LIVE
          </Stamp>
        </div>

        {tab === "croissance" && (
          <div>
            <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-4">
              Nouveaux inscrits et demandes photo par mois (6 derniers mois).
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthly} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PALETTE.ink} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={PALETTE.ink} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PALETTE.blue} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={PALETTE.blue} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" />
                <XAxis dataKey="m" tick={AXIS_TICK} />
                <YAxis tick={AXIS_TICK_SM} allowDecimals={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-type)" }} />
                <Area type="monotone" dataKey="newUsers" name="Nouveaux inscrits" stroke={PALETTE.ink} fill="url(#gUsers)" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Area type="monotone" dataKey="requests" name="Demandes" stroke={PALETTE.blue} fill="url(#gRequests)" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {tab === "revenus" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-4">
                Revenu des réservations confirmées par mois (€).
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthly} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PALETTE.green} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={PALETTE.green} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" />
                  <XAxis dataKey="m" tick={AXIS_TICK} />
                  <YAxis tick={AXIS_TICK_SM} tickFormatter={(v) => `${Number(v) / 100}€`} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={(v) => fmtEurCents(Number(v ?? 0))} />
                  <Area type="monotone" dataKey="bookingRevenueCents" name="Revenus" stroke={PALETTE.green} fill="url(#gRevenue)" strokeWidth={2.5} dot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-4">
                Répartition commission / reversé sur les réservations confirmées.
              </p>
              {revenueSplit.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center">
                  <p className="font-[family-name:var(--font-hand)] text-xl text-ink-faded">
                    Aucune réservation confirmée pour le moment.
                  </p>
                </div>
              ) : (
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
                    <Tooltip
                      contentStyle={CHART_TOOLTIP_STYLE}
                      formatter={(v) => fmtEurCents(Number(v ?? 0) * 100)}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-type)" }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}

        {tab === "engagement" && (
          <div>
            <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-4">
              Demandes photo par jour de semaine (90 derniers jours) —{" "}
              {fmtNum(activity.requests30d)} demandes sur 30 jours.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weekdays} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" vertical={false} />
                <XAxis dataKey="day" tick={AXIS_TICK} />
                <YAxis tick={AXIS_TICK_SM} allowDecimals={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="value" name="Demandes" fill={PALETTE.gold} radius={[4, 4, 0, 0]} />
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
          <Link key={item.href} href={item.href}>
            <PaperCard shadow="soft" className="p-4 flex flex-col items-center gap-2 text-center cursor-pointer hover:-translate-y-0.5 transition-transform">
              <div className={`text-${item.color === "ink" ? "ink" : `stamp-${item.color}`}`}>
                {item.icon}
              </div>
              <span className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">{item.label}</span>
            </PaperCard>
          </Link>
        ))}
      </div>
    </AdminPage>
  );
}
