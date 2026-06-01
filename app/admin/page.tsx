"use client";

import Link from "next/link";
import {
  Users,
  Camera,
  TrendingUp,
  Euro,
  Star,
  Heart,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Bell,
  ArrowRight,
  RefreshCw,
  Download,
  Zap,
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
  Badge,
  Stamp,
  PaperCard,
  Chip,
  useToast,
} from "@/components/ui";
import {
  analytics,
  adminNotifications,
  reports,
  spots,
  users,
  fmtNum,
  fmtEur,
} from "@/lib/data";

const PALETTE = {
  gold: "#b8893a",
  ink: "#2a1f1a",
  blue: "#2a4f76",
  green: "#3f6b3f",
  red: "#a8362e",
  sunset: "#d77032",
};

function notifIcon(kind: string) {
  switch (kind) {
    case "report": return <AlertTriangle size={14} className="text-stamp-red" />;
    case "payment": return <Euro size={14} className="text-stamp-blue" />;
    case "spot": return <MapPin size={14} className="text-stamp-green" />;
    case "community": return <Camera size={14} className="text-sunset" />;
    case "badge": return <Star size={14} className="text-gold-deep" />;
    default: return <Bell size={14} className="text-ink-faded" />;
  }
}

export default function AdminDashboard() {
  const { push } = useToast();
  const { kpis, growth, byCity, engagement } = analytics;

  const openReports = reports.filter((r) => r.status === "open").length;
  const pendingSpots = spots.filter((s) => s.status === "pending").length;
  const pendingVerif = users.filter((u) => u.verification === "partial").length;

  return (
    <AdminPage
      title="Tableau de bord"
      eyebrow="vue d'ensemble ✦"
      breadcrumb={[{ label: "Admin" }, { label: "Tableau de bord" }]}
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
            onClick={() => push("Export CSV en cours…", "info")}
          >
            Exporter
          </Button>
        </>
      }
    >
      {/* ── KPI Row ── */}
      <section className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mb-8 stagger">
        <StatCard
          label="Utilisateurs"
          value={fmtNum(kpis.users)}
          delta={kpis.usersDelta}
          icon={<Users size={16} />}
          tone="ink"
        />
        <StatCard
          label="Sessions"
          value={fmtNum(kpis.sessions)}
          delta={kpis.sessionsDelta}
          icon={<Camera size={16} />}
          tone="blue"
        />
        <StatCard
          label="Photos prises"
          value={fmtNum(kpis.photos)}
          delta={kpis.photosDelta}
          icon={<Star size={16} />}
          tone="gold"
        />
        <StatCard
          label="Revenus"
          value={fmtEur(kpis.revenue)}
          delta={kpis.revenueDelta}
          icon={<Euro size={16} />}
          tone="green"
        />
        <StatCard
          label="Premium"
          value={fmtNum(kpis.premium)}
          delta={kpis.premiumDelta}
          icon={<TrendingUp size={16} />}
          tone="blue"
        />
        <StatCard
          label="Karma total"
          value={`${(kpis.karma / 1_000_000).toFixed(1)} M`}
          delta={kpis.karmaDelta}
          icon={<Heart size={16} />}
          tone="gold"
        />
      </section>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Growth chart — 2/3 width */}
        <PaperCard shadow="soft" className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
                Croissance mensuelle
              </p>
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mt-0.5">
                Utilisateurs &amp; Sessions
              </h3>
            </div>
            <Stamp color="blue" shape="rect" size={48} rotate={3} fontSize={9}>
              2026
            </Stamp>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={growth} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PALETTE.ink} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={PALETTE.ink} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PALETTE.blue} stopOpacity={0.22} />
                  <stop offset="95%" stopColor={PALETTE.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
              <Tooltip
                contentStyle={{ background: "#fbf6e9", border: "1.5px solid #2a1f1a", borderRadius: 4, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-type)" }} />
              <Area type="monotone" dataKey="users" name="Utilisateurs" stroke={PALETTE.ink} fill="url(#gradUsers)" strokeWidth={2} dot={{ r: 3, fill: PALETTE.ink }} />
              <Area type="monotone" dataKey="sessions" name="Sessions" stroke={PALETTE.blue} fill="url(#gradSessions)" strokeWidth={2} dot={{ r: 3, fill: PALETTE.blue }} />
            </AreaChart>
          </ResponsiveContainer>
        </PaperCard>

        {/* Engagement bar — 1/3 width */}
        <PaperCard shadow="soft" className="p-5">
          <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-1">
            Engagement hebdo
          </p>
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-4">
            Sessions / jour
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={engagement} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
              <Tooltip
                contentStyle={{ background: "#fbf6e9", border: "1.5px solid #2a1f1a", borderRadius: 4, fontSize: 12 }}
              />
              <Bar dataKey="value" name="Engagement %" fill={PALETTE.gold} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </PaperCard>
      </div>

      {/* ── Sessions par ville ── */}
      <PaperCard shadow="soft" className="p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
              Répartition géographique
            </p>
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mt-0.5">
              Sessions par ville
            </h3>
          </div>
          <Link href="/admin/analytics/geography">
            <Button variant="ghost" size="sm" trailing={<ArrowRight size={13} />}>
              Voir la carte
            </Button>
          </Link>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={byCity} layout="vertical" margin={{ top: 0, right: 12, left: 40, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: "#6e5d4e", fontFamily: "var(--font-type)" }} />
            <YAxis type="category" dataKey="city" tick={{ fontSize: 11, fill: "#2a1f1a", fontFamily: "var(--font-type)" }} width={72} />
            <Tooltip
              contentStyle={{ background: "#fbf6e9", border: "1.5px solid #2a1f1a", borderRadius: 4, fontSize: 12 }}
            />
            <Bar dataKey="value" name="Sessions" fill={PALETTE.blue} radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </PaperCard>

      {/* ── Bottom row: À traiter + Dernières activités ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* À traiter */}
        <PaperCard shadow="soft" className="p-5">
          <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">
            À traiter maintenant
          </p>
          <div className="space-y-3">
            <Link href="/admin/moderation" className="flex items-center justify-between p-3 rounded-[4px] bg-stamp-red/8 border border-stamp-red/25 hover:bg-stamp-red/12 transition group">
              <div className="flex items-center gap-2.5">
                <AlertTriangle size={15} className="text-stamp-red" />
                <span className="font-[family-name:var(--font-serif)] text-[13px] font-semibold">Signalements ouverts</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="red" dot>{openReports}</Badge>
                <ArrowRight size={13} className="text-ink-faded group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            <Link href="/admin/users/verification" className="flex items-center justify-between p-3 rounded-[4px] bg-stamp-blue/8 border border-stamp-blue/25 hover:bg-stamp-blue/12 transition group">
              <div className="flex items-center gap-2.5">
                <Users size={15} className="text-stamp-blue" />
                <span className="font-[family-name:var(--font-serif)] text-[13px] font-semibold">Vérifications en attente</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="blue" dot>{pendingVerif}</Badge>
                <ArrowRight size={13} className="text-ink-faded group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>

            <Link href="/admin/spots/pending" className="flex items-center justify-between p-3 rounded-[4px] bg-stamp-green/8 border border-stamp-green/25 hover:bg-stamp-green/12 transition group">
              <div className="flex items-center gap-2.5">
                <MapPin size={15} className="text-stamp-green" />
                <span className="font-[family-name:var(--font-serif)] text-[13px] font-semibold">Spots à valider</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="green" dot>{pendingSpots}</Badge>
                <ArrowRight size={13} className="text-ink-faded group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </div>
        </PaperCard>

        {/* Dernières activités — 2/3 */}
        <PaperCard shadow="soft" className="p-5 lg:col-span-2">
          <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">
            Dernières activités
          </p>
          <div className="space-y-2">
            {adminNotifications.map((n) => (
              <div key={n.id} className="flex items-start gap-3 py-2.5 border-b border-[var(--ink-line)] last:border-0">
                <div className="w-7 h-7 rounded-full bg-paper flex items-center justify-center border border-[var(--ink-line)] shrink-0 mt-0.5">
                  {notifIcon(n.kind)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-[family-name:var(--font-serif)] text-[13px] leading-snug">{n.body}</p>
                  {n.meta && (
                    <Chip color="red" variant="dashed" size="sm" mono className="mt-1">
                      {n.meta}
                    </Chip>
                  )}
                </div>
                <span className="font-[family-name:var(--font-type)] text-[10px] text-ink-faded shrink-0 mt-0.5">{n.time}</span>
              </div>
            ))}
          </div>
        </PaperCard>
      </div>

      {/* ── Quick Actions ── */}
      <PaperCard shadow="none" border className="p-4">
        <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">
          Actions rapides
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/users">
            <Button variant="paper" size="sm" icon={<Users size={13} />}>Gérer les utilisateurs</Button>
          </Link>
          <Link href="/admin/sessions">
            <Button variant="paper" size="sm" icon={<Camera size={13} />}>Voir les sessions</Button>
          </Link>
          <Link href="/admin/payments">
            <Button variant="paper" size="sm" icon={<Euro size={13} />}>Paiements</Button>
          </Link>
          <Link href="/admin/analytics">
            <Button variant="paper" size="sm" icon={<TrendingUp size={13} />}>Analytics</Button>
          </Link>
          <Button
            variant="paper"
            size="sm"
            icon={<CheckCircle size={13} />}
            onClick={() => push("Vérification de santé lancée…", "info")}
          >
            Vérifier la santé
          </Button>
          <Button
            variant="gold"
            size="sm"
            icon={<Zap size={13} />}
            onClick={() => push("Rapport hebdo généré ✓", "ok")}
          >
            Rapport hebdo
          </Button>
        </div>
      </PaperCard>
    </AdminPage>
  );
}
