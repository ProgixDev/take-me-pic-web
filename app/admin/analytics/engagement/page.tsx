"use client";

import { useState } from "react";
import {
  Heart,
  Activity,
  Users,
  Repeat,
  Download,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  StatCard,
  Button,
  PaperCard,
  Stamp,
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

// DAU / WAU derived stats
const DAU = Math.round(analytics.kpis.sessions * 0.18);
const WAU = Math.round(analytics.kpis.sessions * 0.68);
const MAU = analytics.kpis.sessions;
const dauWauRatio = ((DAU / WAU) * 100).toFixed(1);

// Hourly activity distribution (illustrative)
const hourlyActivity = [
  { h: "6h", v: 12 }, { h: "8h", v: 32 }, { h: "9h", v: 48 },
  { h: "10h", v: 58 }, { h: "12h", v: 64 }, { h: "14h", v: 55 },
  { h: "16h", v: 62 }, { h: "18h", v: 82 }, { h: "19h", v: 96 },
  { h: "20h", v: 88 }, { h: "21h", v: 74 }, { h: "22h", v: 48 },
  { h: "23h", v: 24 },
];

export default function EngagementPage() {
  const { push } = useToast();
  const [view, setView] = useState<"semaine" | "heure">("semaine");

  const { engagement, retention } = analytics;

  const avgEngagement = Math.round(engagement.reduce((s, d) => s + d.value, 0) / engagement.length);
  const peakDay = engagement.reduce((a, b) => (a.value > b.value ? a : b));

  return (
    <AdminPage
      title="Engagement"
      eyebrow="activité & habitudes ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/analytics", label: "Analytics" },
        { label: "Engagement" },
      ]}
      actions={
        <Button
          variant="paper"
          size="sm"
          icon={<Download size={14} />}
          onClick={() => push("Export engagement en cours…", "info")}
        >
          Exporter
        </Button>
      }
    >
      {/* KPI StatCards — DAU / WAU */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 stagger">
        <StatCard
          label="DAU (Actifs / jour)"
          value={fmtNum(DAU)}
          delta="+6,4 %"
          icon={<Activity size={16} />}
          tone="ink"
        />
        <StatCard
          label="WAU (Actifs / sem.)"
          value={fmtNum(WAU)}
          delta="+9,1 %"
          icon={<Users size={16} />}
          tone="blue"
        />
        <StatCard
          label="MAU (Actifs / mois)"
          value={fmtNum(MAU)}
          delta={analytics.kpis.sessionsDelta}
          icon={<Repeat size={16} />}
          tone="gold"
        />
        <StatCard
          label="DAU / WAU"
          value={`${dauWauRatio} %`}
          delta="+1,8 pt"
          icon={<Heart size={16} />}
          tone="green"
        />
      </section>

      {/* Engagement hebdo + rétention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {/* Weekly engagement bar */}
        <PaperCard shadow="soft" className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
                Activité hebdomadaire
              </p>
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mt-0.5">
                Sessions par jour de semaine
              </h3>
            </div>
            <Stamp color="gold" shape="circle" size={52} rotate={4} fontSize={8}>
              {`MEIL:\n${peakDay.day.toUpperCase()}`}
            </Stamp>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={engagement} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
              <Tooltip contentStyle={{ background: "#fbf6e9", border: "1.5px solid #2a1f1a", borderRadius: 4, fontSize: 12 }} />
              <ReferenceLine y={avgEngagement} stroke={PALETTE.red} strokeDasharray="4 3" label={{ value: "moy.", fill: PALETTE.red, fontSize: 10 }} />
              <Bar
                dataKey="value"
                name="Engagement %"
                radius={[4, 4, 0, 0]}
                fill={PALETTE.gold}
              />
            </BarChart>
          </ResponsiveContainer>
        </PaperCard>

        {/* Retention curve */}
        <PaperCard shadow="soft" className="p-5">
          <div className="mb-4">
            <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
              Courbe de rétention
            </p>
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mt-0.5">
              Taux de retour après inscription
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={retention} margin={{ top: 4, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} tickFormatter={(v) => `${v}%`} />
              <Tooltip contentStyle={{ background: "#fbf6e9", border: "1.5px solid #2a1f1a", borderRadius: 4, fontSize: 12 }} formatter={(v) => `${v}%`} />
              <Line type="monotone" dataKey="value" name="Rétention %" stroke={PALETTE.blue} strokeWidth={2.5} dot={{ r: 5, fill: PALETTE.blue }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </PaperCard>
      </div>

      {/* Hourly activity */}
      <PaperCard shadow="soft" className="p-5 mb-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
              Patterns temporels
            </p>
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mt-0.5 flex items-center gap-2">
              <Clock size={16} className="text-sunset" />
              Activité par heure de la journée
            </h3>
          </div>
          <div className="flex gap-2">
            <Chip color={view === "semaine" ? "ink" : "blue"} variant={view === "semaine" ? "filled" : "outline"} size="sm" mono onClick={() => setView("semaine")}>
              Semaine
            </Chip>
            <Chip color={view === "heure" ? "ink" : "blue"} variant={view === "heure" ? "filled" : "outline"} size="sm" mono onClick={() => setView("heure")}>
              Horaire
            </Chip>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data={(view === "heure" ? hourlyActivity : engagement) as any[]}
            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" vertical={false} />
            <XAxis dataKey={view === "heure" ? "h" : "day"} tick={{ fontSize: 11, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
            <YAxis tick={{ fontSize: 10, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
            <Tooltip contentStyle={{ background: "#fbf6e9", border: "1.5px solid #2a1f1a", borderRadius: 4, fontSize: 12 }} />
            <Bar dataKey="v" name="Index activité" fill={PALETTE.sunset} radius={[3, 3, 0, 0]} hide={view !== "heure"} />
            <Bar dataKey="value" name="Engagement %" fill={PALETTE.gold} radius={[3, 3, 0, 0]} hide={view !== "semaine"} />
          </BarChart>
        </ResponsiveContainer>
      </PaperCard>

      {/* Insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Pic d'activité",
            value: "19h – 20h",
            sub: "L'heure dorée de la communauté",
            color: "text-sunset",
            stamp: { color: "gold" as const, text: "PRIME\nTIME" },
          },
          {
            label: "Jour le plus actif",
            value: "Samedi",
            sub: `Engagement à ${peakDay.value}%`,
            color: "text-stamp-blue",
            stamp: { color: "blue" as const, text: "SAM\n★" },
          },
          {
            label: "Durée moy. session",
            value: "12 min",
            sub: "+2 min vs mois précédent",
            color: "text-stamp-green",
            stamp: { color: "green" as const, text: "12\nMIN" },
          },
        ].map((insight) => (
          <PaperCard key={insight.label} shadow="soft" className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-1">
                  {insight.label}
                </p>
                <p className={`font-[family-name:var(--font-serif)] font-extrabold text-[28px] leading-none ${insight.color}`}>
                  {insight.value}
                </p>
                <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[12px] mt-1">
                  {insight.sub}
                </p>
              </div>
              <Stamp color={insight.stamp.color} shape="circle" size={48} rotate={-6} fontSize={9}>
                {insight.stamp.text}
              </Stamp>
            </div>
          </PaperCard>
        ))}
      </div>
    </AdminPage>
  );
}
