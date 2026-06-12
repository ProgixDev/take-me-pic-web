"use client";

import { useState } from "react";
import { Globe, MapPin, TrendingUp, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AdminPage } from "@/components/admin/AdminPage";
import { StatCard, PaperCard, Badge, Chip } from "@/components/ui";
import { fmtNum } from "@/lib/data";
import type { AnalyticsOverview } from "@/lib/admin/analytics";
import {
  PALETTE,
  CHART_TOOLTIP_STYLE,
  AXIS_TICK,
  AXIS_TICK_SM,
} from "@/components/admin/analytics/shared";

export function GeographyClient({ overview }: { overview: AnalyticsOverview }) {
  const [sort, setSort] = useState<"volume" | "az">("volume");

  const { totals } = overview;
  const cities = [...overview.cities].sort((a, b) =>
    sort === "volume" ? b.users - a.users : a.city.localeCompare(b.city),
  );
  const located = overview.cities.reduce((s, c) => s + c.users, 0);
  const topCity = [...overview.cities].sort((a, b) => b.users - a.users)[0] ?? null;
  const maxCity = Math.max(1, ...cities.map((c) => c.users));

  return (
    <AdminPage
      title="Géographie"
      eyebrow="où voyage la communauté ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/analytics", label: "Analytics" },
        { label: "Géographie" },
      ]}
    >
      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
        <StatCard label="Profils localisés" value={fmtNum(located)} icon={<Globe size={16} />} tone="ink" />
        <StatCard label="Ville n°1" value={topCity?.city ?? "—"} icon={<MapPin size={16} />} tone="gold" />
        <StatCard label="Villes couvertes" value={fmtNum(overview.cities.length)} icon={<TrendingUp size={16} />} tone="blue" />
        <StatCard label="Sans ville" value={fmtNum(Math.max(0, totals.users - located))} icon={<Users size={16} />} tone="ink" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City volume */}
        <PaperCard shadow="soft" className="p-5">
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-1">
            Volume par destination
          </h3>
          <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-4">
            Profils par ville (top {overview.cities.length || 0}).
          </p>
          {cities.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center">
              <p className="font-[family-name:var(--font-hand)] text-xl text-ink-faded">
                Aucun profil localisé pour le moment.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={cities} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" vertical={false} />
                <XAxis dataKey="city" tick={AXIS_TICK} />
                <YAxis tick={AXIS_TICK_SM} allowDecimals={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={(v) => fmtNum(Number(v ?? 0))} />
                <Bar dataKey="users" name="Profils" fill={PALETTE.blue} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </PaperCard>

        {/* Ranked table */}
        <PaperCard shadow="soft" className="p-5">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg">
              Classement des destinations
            </h3>
            <div className="flex gap-2">
              <Chip
                color="ink"
                variant={sort === "volume" ? "filled" : "outline"}
                size="sm"
                onClick={() => setSort("volume")}
              >
                Volume
              </Chip>
              <Chip
                color="ink"
                variant={sort === "az" ? "filled" : "outline"}
                size="sm"
                onClick={() => setSort("az")}
              >
                A–Z
              </Chip>
            </div>
          </div>
          <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-4">
            Part de chaque ville parmi les profils localisés.
          </p>
          {cities.length === 0 ? (
            <p className="font-[family-name:var(--font-hand)] text-xl text-ink-faded py-6 text-center">
              Aucune destination pour le moment.
            </p>
          ) : (
            <div className="space-y-2.5">
              {cities.map((c, i) => {
                const rank = i + 1;
                return (
                  <div key={c.city} className="flex items-center gap-3">
                    <span
                      className={`font-[family-name:var(--font-serif)] font-bold text-[14px] w-6 text-center shrink-0 ${
                        sort === "volume" && rank === 1
                          ? "text-gold-deep"
                          : sort === "volume" && rank <= 3
                          ? "text-stamp-blue"
                          : "text-ink-faded"
                      }`}
                    >
                      {rank}
                    </span>
                    <span className="font-[family-name:var(--font-serif)] font-semibold text-[14px] w-28 truncate shrink-0">
                      {c.city}
                    </span>
                    <div className="flex-1 h-3 bg-paper-warm rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          sort === "volume" && rank === 1 ? "bg-gold-deep" : "bg-stamp-blue/70"
                        }`}
                        style={{ width: `${(c.users / maxCity) * 100}%` }}
                      />
                    </div>
                    <span className="font-[family-name:var(--font-serif)] font-bold text-[13px] w-12 text-right shrink-0">
                      {fmtNum(c.users)}
                    </span>
                    <Badge tone={sort === "volume" && rank === 1 ? "gold" : "neutral"}>
                      {located > 0 ? `${((c.users / located) * 100).toFixed(1)} %` : "—"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </PaperCard>
      </div>
    </AdminPage>
  );
}
