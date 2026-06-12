"use client";

import { useState } from "react";
import { Activity, MessageSquare, Users as UsersIcon, Camera } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { AdminPage } from "@/components/admin/AdminPage";
import { StatCard, PaperCard, Stamp, Chip } from "@/components/ui";
import { fmtNum } from "@/lib/data";
import type { AnalyticsOverview } from "@/lib/admin/analytics";
import {
  PALETTE,
  CHART_TOOLTIP_STYLE,
  AXIS_TICK,
  AXIS_TICK_SM,
  weekdaySeries,
  hourlySeries,
} from "@/components/admin/analytics/shared";

export function EngagementClient({ overview }: { overview: AnalyticsOverview }) {
  const [pattern, setPattern] = useState<"semaine" | "horaire">("semaine");

  const { activity } = overview;
  const weekdays = weekdaySeries(overview.weekday);
  const hours = hourlySeries(overview.hourly);

  const totalWeek = weekdays.reduce((s, d) => s + d.value, 0);
  const avgPerDay = totalWeek / 7;
  const peakDay = weekdays.reduce((a, b) => (a.value >= b.value ? a : b));

  return (
    <AdminPage
      title="Engagement"
      eyebrow="activité & habitudes ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/analytics", label: "Analytics" },
        { label: "Engagement" },
      ]}
    >
      {/* DAU/WAU/MAU need a per-user activity-event log that doesn't exist
          yet — shown here are real event counts instead. */}
      <div className="mb-6 p-3 bg-gold-light/15 border-[1.5px] border-dashed border-gold-deep/40 rounded-[4px]">
        <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink">
          <strong>Compteurs d'événements réels</strong> — les métriques DAU/WAU/MAU et la courbe de
          rétention demandent un journal d'activité par utilisateur qui n'existe pas encore côté
          backend (ADR-0008). En attendant, cette page mesure les événements bruts : demandes,
          messages et publications.
        </p>
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
        <StatCard label="Demandes (7 j)" value={fmtNum(activity.requests7d)} icon={<Activity size={16} />} tone="ink" />
        <StatCard label="Demandes (30 j)" value={fmtNum(activity.requests30d)} icon={<Camera size={16} />} tone="blue" />
        <StatCard label="Messages (30 j)" value={fmtNum(activity.messages30d)} icon={<MessageSquare size={16} />} tone="gold" />
        <StatCard label="Publications (30 j)" value={fmtNum(activity.posts30d)} icon={<UsersIcon size={16} />} tone="green" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly activity */}
        <PaperCard shadow="soft" className="p-5 relative">
          <div className="absolute top-4 right-4">
            <Stamp color="gold" shape="circle" size={56} rotate={8} fontSize={8}>
              {`MEIL:\n${peakDay.day.toUpperCase()}`}
            </Stamp>
          </div>
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-1">
            Activité hebdomadaire
          </h3>
          <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-4">
            Demandes photo par jour de semaine (90 derniers jours).
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weekdays} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" vertical={false} />
              <XAxis dataKey="day" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK_SM} allowDecimals={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <ReferenceLine y={avgPerDay} stroke={PALETTE.red} strokeDasharray="4 4" label={{ value: "moy.", fontSize: 10, fill: PALETTE.red }} />
              <Bar dataKey="value" name="Demandes" fill={PALETTE.gold} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </PaperCard>

        {/* Temporal patterns */}
        <PaperCard shadow="soft" className="p-5">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-1">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg">
              Patterns temporels
            </h3>
            <div className="flex gap-2">
              <Chip
                color="ink"
                variant={pattern === "semaine" ? "filled" : "outline"}
                size="sm"
                onClick={() => setPattern("semaine")}
              >
                Semaine
              </Chip>
              <Chip
                color="ink"
                variant={pattern === "horaire" ? "filled" : "outline"}
                size="sm"
                onClick={() => setPattern("horaire")}
              >
                Horaire
              </Chip>
            </div>
          </div>
          <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-4">
            {pattern === "horaire"
              ? "Demandes par heure de la journée (90 derniers jours)."
              : "Demandes par jour de semaine (90 derniers jours)."}
          </p>
          <ResponsiveContainer width="100%" height={260}>
            {pattern === "horaire" ? (
              <BarChart data={hours} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" vertical={false} />
                <XAxis dataKey="h" tick={AXIS_TICK_SM} interval={2} />
                <YAxis tick={AXIS_TICK_SM} allowDecimals={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="v" name="Demandes" fill={PALETTE.sunset} radius={[3, 3, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={weekdays} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" vertical={false} />
                <XAxis dataKey="day" tick={AXIS_TICK_SM} />
                <YAxis tick={AXIS_TICK_SM} allowDecimals={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="value" name="Demandes" fill={PALETTE.gold} radius={[3, 3, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </PaperCard>
      </div>
    </AdminPage>
  );
}
