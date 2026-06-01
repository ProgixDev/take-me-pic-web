"use client";

import Link from "next/link";
import {
  Zap,
  Star,
  TrendingUp,
  Award,
  ChevronRight,
  Settings,
  Trophy,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  StatCard,
  Badge,
  PaperCard,
  Button,
  Stamp,
} from "@/components/ui";
import { analytics, badges, leaderboard, fmtNum } from "@/lib/data";

function rarityTone(r: string): "green" | "blue" | "gold" {
  if (r === "légendaire") return "gold";
  if (r === "rare") return "blue";
  return "green";
}

const totalKarma = leaderboard.reduce((sum, l) => sum + l.score, 0);
const avgKarmaPerSession = Math.round(
  analytics.kpis.karma / analytics.kpis.sessions
);

export default function KarmaPage() {
  return (
    <AdminPage
      title="Tableau de bord Karma"
      eyebrow="économie de l'entraide ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { label: "Karma" },
      ]}
      actions={
        <div className="flex gap-2">
          <Link href="/admin/karma/rules">
            <Button variant="paper" size="sm" icon={<Settings size={14} />}>
              Règles
            </Button>
          </Link>
          <Link href="/admin/badges">
            <Button variant="paper" size="sm" icon={<Award size={14} />}>
              Badges
            </Button>
          </Link>
          <Link href="/admin/leaderboard">
            <Button variant="gold" size="sm" icon={<Trophy size={14} />}>
              Classement
            </Button>
          </Link>
        </div>
      }
    >
      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        <StatCard
          label="Karma total distribué"
          value={fmtNum(analytics.kpis.karma)}
          delta={analytics.kpis.karmaDelta}
          tone="gold"
          icon={<Zap size={18} />}
        />
        <StatCard
          label="Moyenne par session"
          value={fmtNum(avgKarmaPerSession)}
          delta="+2 pts vs mois dernier"
          tone="green"
          icon={<TrendingUp size={18} />}
        />
        <StatCard
          label="Top gagnant"
          value={`${leaderboard[0].user.firstName} ${leaderboard[0].user.lastName}`}
          delta={`${fmtNum(leaderboard[0].score)} pts`}
          tone="gold"
          icon={<Star size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Karma Growth Chart */}
        <div className="lg:col-span-2">
          <PaperCard shadow="ink" className="p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-[family-name:var(--font-serif)] font-bold text-xl">
                Karma distribué par semaine
              </h2>
              <Stamp color="gold" size={60} fontSize={7} rotate={-8}>
                {`KARMA\n★\nECO`}
              </Stamp>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={analytics.growth} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8dcc8" />
                <XAxis
                  dataKey="m"
                  tick={{ fontFamily: "var(--font-type)", fontSize: 10, fill: "#7a6a5a" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontFamily: "var(--font-type)", fontSize: 10, fill: "#7a6a5a" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#f5efe6",
                    border: "1.5px solid #2a1f1a",
                    borderRadius: 4,
                    fontFamily: "var(--font-serif)",
                    fontSize: 13,
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(v: any) => `${fmtNum(Number(v) * 58)} pts`}
                  labelFormatter={(l) => `Semaine du ${l}`}
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#b8893a"
                  strokeWidth={2.5}
                  dot={{ fill: "#b8893a", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </PaperCard>
        </div>

        {/* Quick Nav */}
        <div className="space-y-4">
          <PaperCard shadow="gold" className="p-5">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-base mb-4">
              Gestion du système karma
            </h3>
            <div className="space-y-2">
              <Link
                href="/admin/karma/rules"
                className="flex items-center justify-between p-2.5 rounded-[4px] hover:bg-paper-warm transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Settings size={15} className="text-gold-deep" />
                  <span className="font-[family-name:var(--font-serif)] text-[14px]">
                    Règles de karma
                  </span>
                </div>
                <ChevronRight size={14} className="text-ink-faded group-hover:text-ink transition" />
              </Link>
              <Link
                href="/admin/badges"
                className="flex items-center justify-between p-2.5 rounded-[4px] hover:bg-paper-warm transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Award size={15} className="text-stamp-blue" />
                  <span className="font-[family-name:var(--font-serif)] text-[14px]">
                    Gestion des badges
                  </span>
                </div>
                <Badge tone="blue">{badges.length}</Badge>
              </Link>
              <Link
                href="/admin/leaderboard"
                className="flex items-center justify-between p-2.5 rounded-[4px] hover:bg-paper-warm transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Trophy size={15} className="text-gold-deep" />
                  <span className="font-[family-name:var(--font-serif)] text-[14px]">
                    Tableau d'honneur
                  </span>
                </div>
                <Badge tone="gold">{leaderboard.length}</Badge>
              </Link>
            </div>
          </PaperCard>

          {/* Top earners */}
          <PaperCard shadow="soft" className="p-5">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-base mb-3">
              Top 3 de la semaine
            </h3>
            <div className="space-y-2.5">
              {leaderboard.slice(0, 3).map((l, i) => (
                <div key={l.user.id} className="flex items-center gap-2.5">
                  <span className="text-lg">{["🥇", "🥈", "🥉"][i]}</span>
                  <span className="font-[family-name:var(--font-serif)] text-[13px] font-semibold flex-1 truncate">
                    {l.user.firstName} {l.user.lastName}
                  </span>
                  <span className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-widest text-gold-deep font-bold">
                    {fmtNum(l.score)} pts
                  </span>
                </div>
              ))}
            </div>
          </PaperCard>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-xl">
            Badges actifs
          </h2>
          <Link href="/admin/badges">
            <Button variant="paper" size="sm">
              Gérer les badges →
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {badges.map((badge) => (
            <PaperCard key={badge.id} shadow="soft" className="p-4 text-center">
              <div className="text-3xl mb-2">{badge.emoji}</div>
              <div className="font-[family-name:var(--font-serif)] font-bold text-[13px] mb-1 leading-tight">
                {badge.name}
              </div>
              <p className="font-[family-name:var(--font-serif)] text-[11px] text-ink-faded mb-2 leading-snug">
                {badge.description}
              </p>
              <Badge tone={rarityTone(badge.rarity)} className="text-[9px]">
                {badge.rarity}
              </Badge>
              <div className="mt-2 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded">
                {fmtNum(badge.holders)} porteurs
              </div>
            </PaperCard>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
