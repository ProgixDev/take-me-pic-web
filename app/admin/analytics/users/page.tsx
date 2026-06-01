"use client";

import { useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Download,
  MapPin,
} from "lucide-react";
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
  Legend,
} from "recharts";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  StatCard,
  Button,
  PaperCard,
  Chip,
  Badge,
  Stamp,
  useToast,
} from "@/components/ui";
import { analytics, users, fmtNum } from "@/lib/data";

const PALETTE = {
  gold: "#b8893a",
  ink: "#2a1f1a",
  blue: "#2a4f76",
  green: "#3f6b3f",
  red: "#a8362e",
  sunset: "#d77032",
};

// New vs returning derived from growth (fabricated split for demo)
const newVsReturning = analytics.growth.map((g) => ({
  m: g.m,
  nouveaux: Math.round(g.users * 0.32),
  retour: Math.round(g.users * 0.68),
}));

export default function UserAnalyticsPage() {
  const { push } = useToast();
  const [sortCity, setSortCity] = useState<"value" | "city">("value");

  const totalUsers = analytics.kpis.users;
  const premiumUsers = analytics.kpis.premium;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const bannedUsers = users.filter((u) => u.status === "banned").length;

  const sortedCities = [...analytics.byCity].sort((a, b) =>
    sortCity === "value" ? b.value - a.value : a.city.localeCompare(b.city)
  );
  const maxCityValue = Math.max(...sortedCities.map((c) => c.value));

  return (
    <AdminPage
      title="Analytiques utilisateurs"
      eyebrow="qui voyage avec nous ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/analytics", label: "Analytics" },
        { label: "Utilisateurs" },
      ]}
      actions={
        <Button
          variant="paper"
          size="sm"
          icon={<Download size={14} />}
          onClick={() => push("Export utilisateurs en cours…", "info")}
        >
          Exporter
        </Button>
      }
    >
      {/* KPIs */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 stagger">
        <StatCard
          label="Total utilisateurs"
          value={fmtNum(totalUsers)}
          delta={analytics.kpis.usersDelta}
          icon={<Users size={16} />}
          tone="ink"
        />
        <StatCard
          label="Comptes actifs"
          value={fmtNum(activeUsers)}
          delta="+8,2 %"
          icon={<UserCheck size={16} />}
          tone="green"
        />
        <StatCard
          label="Premium"
          value={fmtNum(premiumUsers)}
          delta={analytics.kpis.premiumDelta}
          icon={<TrendingUp size={16} />}
          tone="blue"
        />
        <StatCard
          label="Bannis"
          value={fmtNum(bannedUsers)}
          delta="-2,1 %"
          icon={<UserX size={16} />}
          tone="red"
        />
      </section>

      {/* Croissance utilisateurs — AreaChart */}
      <PaperCard shadow="soft" className="p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
              Croissance des inscriptions
            </p>
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mt-0.5">
              Nouveaux inscrits par mois
            </h3>
          </div>
          <Stamp color="ink" shape="circle" size={56} rotate={-5} fontSize={8}>
            {"INSCRIP-\nTIONS"}
          </Stamp>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={analytics.growth} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gua" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PALETTE.ink} stopOpacity={0.2} />
                <stop offset="95%" stopColor={PALETTE.ink} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" />
            <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
            <YAxis tick={{ fontSize: 10, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: "#fbf6e9", border: "1.5px solid #2a1f1a", borderRadius: 4, fontSize: 12 }} formatter={(v) => fmtNum(Number(v ?? 0))} />
            <Area type="monotone" dataKey="users" name="Utilisateurs" stroke={PALETTE.ink} fill="url(#gua)" strokeWidth={2.5} dot={{ r: 4, fill: PALETTE.ink }} activeDot={{ r: 6 }} />
          </AreaChart>
        </ResponsiveContainer>
      </PaperCard>

      {/* New vs Returning */}
      <PaperCard shadow="soft" className="p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
              Profil d&apos;engagement
            </p>
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mt-0.5">
              Nouveaux vs. utilisateurs de retour
            </h3>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={newVsReturning} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" vertical={false} />
            <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
            <YAxis tick={{ fontSize: 10, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: "#fbf6e9", border: "1.5px solid #2a1f1a", borderRadius: 4, fontSize: 12 }} formatter={(v) => fmtNum(Number(v ?? 0))} />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-type)" }} />
            <Bar dataKey="nouveaux" name="Nouveaux" fill={PALETTE.blue} radius={[3, 3, 0, 0]} stackId="a" />
            <Bar dataKey="retour" name="De retour" fill={PALETTE.gold} radius={[3, 3, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </PaperCard>

      {/* Top villes table */}
      <PaperCard shadow="soft" className="p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
              Répartition géographique
            </p>
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mt-0.5 flex items-center gap-2">
              <MapPin size={16} className="text-stamp-blue" />
              Top villes
            </h3>
          </div>
          <div className="flex gap-2">
            <Chip
              color={sortCity === "value" ? "ink" : "blue"}
              variant={sortCity === "value" ? "filled" : "outline"}
              size="sm"
              mono
              onClick={() => setSortCity("value")}
            >
              Par volume
            </Chip>
            <Chip
              color={sortCity === "city" ? "ink" : "blue"}
              variant={sortCity === "city" ? "filled" : "outline"}
              size="sm"
              mono
              onClick={() => setSortCity("city")}
            >
              A–Z
            </Chip>
          </div>
        </div>
        <div className="space-y-2.5">
          {sortedCities.map((c, i) => {
            const pct = Math.round((c.value / maxCityValue) * 100);
            const share = ((c.value / totalUsers) * 100).toFixed(1);
            return (
              <div key={c.city} className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded w-4 text-right shrink-0">
                  {i + 1}
                </span>
                <span className="font-[family-name:var(--font-serif)] font-semibold text-[13px] w-24 shrink-0">
                  {c.city}
                </span>
                <div className="flex-1 h-2 rounded-full bg-paper overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: i === 0 ? PALETTE.gold : i < 3 ? PALETTE.blue : PALETTE.ink }}
                  />
                </div>
                <span className="font-[family-name:var(--font-type)] text-[11px] text-ink w-12 text-right shrink-0">
                  {fmtNum(c.value)}
                </span>
                <Badge tone={i === 0 ? "gold" : i < 3 ? "blue" : "neutral"} className="shrink-0">
                  {share} %
                </Badge>
              </div>
            );
          })}
        </div>
      </PaperCard>
    </AdminPage>
  );
}
