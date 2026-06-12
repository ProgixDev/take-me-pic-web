"use client";

import { useState } from "react";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AdminPage } from "@/components/admin/AdminPage";
import { StatCard, PaperCard, Badge, Chip, Stamp } from "@/components/ui";
import { fmtNum } from "@/lib/data";
import type { AnalyticsOverview } from "@/lib/admin/analytics";
import {
  PALETTE,
  CHART_TOOLTIP_STYLE,
  AXIS_TICK,
  AXIS_TICK_SM,
  withMonthLabels,
} from "@/components/admin/analytics/shared";

export function UsersAnalyticsClient({ overview }: { overview: AnalyticsOverview }) {
  const [citySort, setCitySort] = useState<"volume" | "az">("volume");

  const { totals } = overview;
  const monthly = withMonthLabels(overview.monthly);

  const cities = [...overview.cities].sort((a, b) =>
    citySort === "volume" ? b.users - a.users : a.city.localeCompare(b.city),
  );
  const maxCity = Math.max(1, ...cities.map((c) => c.users));

  return (
    <AdminPage
      title="Analytiques utilisateurs"
      eyebrow="qui voyage avec nous ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/analytics", label: "Analytics" },
        { label: "Utilisateurs" },
      ]}
    >
      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
        <StatCard label="Total utilisateurs" value={fmtNum(totals.users)} icon={<Users size={16} />} tone="ink" />
        <StatCard
          label="Comptes actifs"
          value={fmtNum(totals.users - totals.bannedUsers)}
          icon={<UserCheck size={16} />}
          tone="green"
        />
        <StatCard label="Premium" value={fmtNum(totals.premiumUsers)} icon={<TrendingUp size={16} />} tone="blue" />
        <StatCard label="Bannis" value={fmtNum(totals.bannedUsers)} icon={<UserX size={16} />} tone="red" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Growth */}
        <PaperCard shadow="soft" className="p-5 relative">
          <div className="absolute top-4 right-4">
            <Stamp color="ink" shape="circle" size={56} rotate={-6} fontSize={8}>
              {"INSCRIP-\nTIONS"}
            </Stamp>
          </div>
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-1">
            Croissance des inscriptions
          </h3>
          <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-4">
            Nouveaux inscrits par mois (6 derniers mois).
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthly} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gua" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PALETTE.ink} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={PALETTE.ink} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" />
              <XAxis dataKey="m" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK_SM} allowDecimals={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={(v) => fmtNum(Number(v ?? 0))} />
              <Area type="monotone" dataKey="newUsers" name="Nouveaux inscrits" stroke={PALETTE.ink} fill="url(#gua)" strokeWidth={2.5} dot={{ r: 4, fill: PALETTE.ink }} />
            </AreaChart>
          </ResponsiveContainer>
        </PaperCard>

        {/* Requests per month — replaces the mock "new vs returning" chart,
            which needs per-user activity history that doesn't exist yet. */}
        <PaperCard shadow="soft" className="p-5">
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-1">
            Activité photo
          </h3>
          <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-4">
            Demandes photo par mois (6 derniers mois).
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthly} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" vertical={false} />
              <XAxis dataKey="m" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK_SM} allowDecimals={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={(v) => fmtNum(Number(v ?? 0))} />
              <Bar dataKey="requests" name="Demandes" fill={PALETTE.blue} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </PaperCard>
      </div>

      {/* Top cities */}
      <PaperCard shadow="soft" className="p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg">
            Répartition géographique
          </h3>
          <div className="flex gap-2">
            <Chip
              color="ink"
              variant={citySort === "volume" ? "filled" : "outline"}
              size="sm"
              onClick={() => setCitySort("volume")}
            >
              Par volume
            </Chip>
            <Chip
              color="ink"
              variant={citySort === "az" ? "filled" : "outline"}
              size="sm"
              onClick={() => setCitySort("az")}
            >
              A–Z
            </Chip>
          </div>
        </div>
        <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-4">
          Top villes par profils localisés.
        </p>

        {cities.length === 0 ? (
          <p className="font-[family-name:var(--font-hand)] text-xl text-ink-faded py-6 text-center">
            Aucun profil localisé pour le moment.
          </p>
        ) : (
          <div className="space-y-2.5">
            {cities.map((c, i) => {
              const rank = i + 1;
              return (
                <div key={c.city} className="flex items-center gap-3">
                  <span className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded w-5 text-right shrink-0">
                    {rank}
                  </span>
                  <span className="font-[family-name:var(--font-serif)] font-semibold text-[14px] w-28 truncate shrink-0">
                    {c.city}
                  </span>
                  <div className="flex-1 h-3 bg-paper-warm rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        citySort === "volume" && rank === 1
                          ? "bg-gold-deep"
                          : citySort === "volume" && rank <= 3
                          ? "bg-stamp-blue"
                          : "bg-ink/50"
                      }`}
                      style={{ width: `${(c.users / maxCity) * 100}%` }}
                    />
                  </div>
                  <span className="font-[family-name:var(--font-serif)] font-bold text-[13px] w-14 text-right shrink-0">
                    {fmtNum(c.users)}
                  </span>
                  <Badge
                    tone={citySort === "volume" && rank === 1 ? "gold" : citySort === "volume" && rank <= 3 ? "blue" : "neutral"}
                  >
                    {totals.users > 0 ? `${((c.users / totals.users) * 100).toFixed(1)} %` : "—"}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </PaperCard>
    </AdminPage>
  );
}
