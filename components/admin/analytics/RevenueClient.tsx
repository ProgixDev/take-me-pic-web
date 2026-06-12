"use client";

import { Euro, TrendingUp, CreditCard, CalendarCheck } from "lucide-react";
import {
  AreaChart,
  Area,
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
import { StatCard, PaperCard, Badge, Stamp } from "@/components/ui";
import { fmtNum } from "@/lib/data";
import type { AnalyticsOverview } from "@/lib/admin/analytics";
import {
  PALETTE,
  CHART_TOOLTIP_STYLE,
  AXIS_TICK,
  AXIS_TICK_SM,
  withMonthLabels,
  fmtEurCents,
} from "@/components/admin/analytics/shared";

const PIE_COLORS = [PALETTE.gold, PALETTE.blue];

const BOOKING_STATUS_TONE: Record<string, "green" | "gold" | "red" | "blue"> = {
  confirmed: "green",
  pending: "gold",
  cancelled: "red",
  refunded: "blue",
};

const BOOKING_STATUS_LABEL: Record<string, string> = {
  confirmed: "confirmée",
  pending: "en attente",
  cancelled: "annulée",
  refunded: "remboursée",
};

export function RevenueClient({ overview }: { overview: AnalyticsOverview }) {
  const { revenue } = overview;
  const monthly = withMonthLabels(overview.monthly);

  const split = [
    { name: "Commission plateforme", value: revenue.commissionCents / 100 },
    { name: "Reversé partenaires", value: (revenue.bookingsRevenueCents - revenue.commissionCents) / 100 },
  ].filter((s) => s.value > 0);

  return (
    <AdminPage
      title="Revenus"
      eyebrow="la caisse enregistreuse ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/analytics", label: "Analytics" },
        { label: "Revenus" },
      ]}
    >
      {/* Pricing gap: subscription prices live in RevenueCat, not the DB. */}
      <div className="mb-6 p-3 bg-gold-light/15 border-[1.5px] border-dashed border-gold-deep/40 rounded-[4px]">
        <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink">
          <strong>Revenus réservations uniquement</strong> — les prix d'abonnement vivent dans
          RevenueCat, pas dans la base : MRR/ARR/ARPU ne sont pas calculables ici (ADR-0008).
          Les abonnements apparaissent en compteurs d'actifs.
        </p>
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
        <StatCard
          label="Revenu réservations"
          value={fmtEurCents(revenue.bookingsRevenueCents)}
          icon={<Euro size={16} />}
          tone="gold"
        />
        <StatCard
          label="Commission plateforme"
          value={fmtEurCents(revenue.commissionCents)}
          icon={<TrendingUp size={16} />}
          tone="green"
        />
        <StatCard
          label="Réservations confirmées"
          value={fmtNum(revenue.bookingsConfirmed)}
          icon={<CalendarCheck size={16} />}
          tone="blue"
        />
        <StatCard
          label="Abonnés actifs"
          value={fmtNum(revenue.subsActive + revenue.subsInGrace)}
          icon={<CreditCard size={16} />}
          tone="ink"
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly revenue */}
        <PaperCard shadow="soft" className="p-5 relative">
          <div className="absolute top-4 right-4">
            <Stamp color="green" shape="rect" size={52} rotate={4} fontSize={8}>
              {"REVENU\nLIVE"}
            </Stamp>
          </div>
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-1">
            Évolution mensuelle
          </h3>
          <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-4">
            Réservations confirmées par mois (€, 6 derniers mois).
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthly} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PALETTE.green} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={PALETTE.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,31,26,0.1)" />
              <XAxis dataKey="m" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK_SM} tickFormatter={(v) => `${Number(v) / 100}€`} />
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                formatter={(v) => [fmtEurCents(Number(v ?? 0)), "Revenus"]}
              />
              <Area
                type="monotone"
                dataKey="bookingRevenueCents"
                name="Revenus €"
                stroke={PALETTE.green}
                fill="url(#gRev)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: PALETTE.green }}
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </PaperCard>

        {/* Split + subscriptions */}
        <PaperCard shadow="soft" className="p-5">
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-1">
            Répartition des montants
          </h3>
          <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-4">
            Commission plateforme vs montant reversé (réservations confirmées).
          </p>
          {split.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center">
              <p className="font-[family-name:var(--font-hand)] text-xl text-ink-faded">
                Aucune réservation confirmée pour le moment.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={split}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={42}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={4}
                >
                  {split.map((_, i) => (
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

          <div className="mt-4 pt-4 border-t border-dashed border-[var(--ink-line)] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
                Abonnements actifs
              </span>
              <span className="font-[family-name:var(--font-serif)] font-bold text-[14px]">
                {fmtNum(revenue.subsActive)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
                En période de grâce
              </span>
              <span className="font-[family-name:var(--font-serif)] font-bold text-[14px]">
                {fmtNum(revenue.subsInGrace)}
              </span>
            </div>
            {revenue.subsByStore.map((s) => (
              <div key={s.store} className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
                  {s.store === "apple" ? "App Store" : s.store === "google" ? "Google Play" : s.store}
                </span>
                <span className="font-[family-name:var(--font-serif)] font-bold text-[14px]">
                  {fmtNum(s.count)}
                </span>
              </div>
            ))}
          </div>
        </PaperCard>
      </div>

      {/* Recent bookings */}
      <PaperCard shadow="soft" className="p-5">
        <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-1">
          Transactions récentes
        </h3>
        <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mb-4">
          Dernières réservations.
        </p>
        {revenue.recentBookings.length === 0 ? (
          <p className="font-[family-name:var(--font-hand)] text-xl text-ink-faded py-6 text-center">
            Aucune réservation pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-[1.5px] border-dashed border-[var(--ink-line)]">
                  {["ID", "Utilisateur", "Titre", "Montant", "Statut", "Date"].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {revenue.recentBookings.map((b) => (
                  <tr key={b.id} className="border-b border-[var(--ink-line)] last:border-0 hover:bg-paper-warm/70 transition">
                    <td className="px-3 py-2.5 font-[family-name:var(--font-mono)] text-[12px] text-ink-faded">#{b.id}</td>
                    <td className="px-3 py-2.5 font-[family-name:var(--font-serif)] text-[13px]">{b.username ?? "—"}</td>
                    <td className="px-3 py-2.5 font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">{b.title ?? "—"}</td>
                    <td className="px-3 py-2.5 font-[family-name:var(--font-serif)] font-bold text-[13px] text-stamp-green">
                      {fmtEurCents(b.amountCents)}
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge tone={BOOKING_STATUS_TONE[b.status] ?? "neutral"} dot>
                        {BOOKING_STATUS_LABEL[b.status] ?? b.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5 font-[family-name:var(--font-type)] text-[12px] text-ink-faded">
                      {b.createdAt.slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PaperCard>
    </AdminPage>
  );
}
