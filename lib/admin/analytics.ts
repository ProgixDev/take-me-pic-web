import "server-only";

import {
  mapQueryError,
  requireStaffSession,
  type ModerationQueryResult,
} from "@/lib/admin/moderation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Typed projection of the admin_analytics_overview() jsonb document (ADR-0008).

export type AnalyticsTotals = {
  users: number;
  premiumUsers: number;
  bannedUsers: number;
  requestsTotal: number;
  sessionsEngaged: number;
  sessionPhotos: number;
  posts: number;
  spotsApproved: number;
  karmaTotal: number;
  ratingsCount: number;
  ratingsAvg: number;
};

export type MonthlyPoint = {
  month: string;
  newUsers: number;
  requests: number;
  posts: number;
  bookingRevenueCents: number;
};

export type WeekdayPoint = { dow: number; requests: number };
export type HourlyPoint = { hour: number; requests: number };
export type CityPoint = { city: string; users: number };

export type ActivityWindows = {
  requests7d: number;
  requests30d: number;
  messages30d: number;
  posts30d: number;
};

export type RecentBooking = {
  id: number;
  title: string | null;
  username: string | null;
  amountCents: number;
  status: string;
  createdAt: string;
};

export type RevenueAggregates = {
  bookingsRevenueCents: number;
  commissionCents: number;
  bookingsConfirmed: number;
  bookingsPending: number;
  subsActive: number;
  subsInGrace: number;
  subsByStore: { store: string; count: number }[];
  recentBookings: RecentBooking[];
};

export type AnalyticsOverview = {
  totals: AnalyticsTotals;
  monthly: MonthlyPoint[];
  weekday: WeekdayPoint[];
  hourly: HourlyPoint[];
  cities: CityPoint[];
  activity: ActivityWindows;
  revenue: RevenueAggregates;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function num(value: any): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toOverview(raw: any): AnalyticsOverview {
  const totals = raw?.totals ?? {};
  const activity = raw?.activity ?? {};
  const revenue = raw?.revenue ?? {};

  return {
    totals: {
      users: num(totals.users),
      premiumUsers: num(totals.premium_users),
      bannedUsers: num(totals.banned_users),
      requestsTotal: num(totals.requests_total),
      sessionsEngaged: num(totals.sessions_engaged),
      sessionPhotos: num(totals.session_photos),
      posts: num(totals.posts),
      spotsApproved: num(totals.spots_approved),
      karmaTotal: num(totals.karma_total),
      ratingsCount: num(totals.ratings_count),
      ratingsAvg: num(totals.ratings_avg),
    },
    monthly: ((raw?.monthly ?? []) as any[]).map((m) => ({
      month: String(m.month ?? ""),
      newUsers: num(m.new_users),
      requests: num(m.requests),
      posts: num(m.posts),
      bookingRevenueCents: num(m.booking_revenue_cents),
    })),
    weekday: ((raw?.weekday ?? []) as any[]).map((d) => ({
      dow: num(d.dow),
      requests: num(d.requests),
    })),
    hourly: ((raw?.hourly ?? []) as any[]).map((h) => ({
      hour: num(h.hour),
      requests: num(h.requests),
    })),
    cities: ((raw?.cities ?? []) as any[]).map((c) => ({
      city: String(c.city ?? "—"),
      users: num(c.users),
    })),
    activity: {
      requests7d: num(activity.requests_7d),
      requests30d: num(activity.requests_30d),
      messages30d: num(activity.messages_30d),
      posts30d: num(activity.posts_30d),
    },
    revenue: {
      bookingsRevenueCents: num(revenue.bookings_revenue_cents),
      commissionCents: num(revenue.commission_cents),
      bookingsConfirmed: num(revenue.bookings_confirmed),
      bookingsPending: num(revenue.bookings_pending),
      subsActive: num(revenue.subs_active),
      subsInGrace: num(revenue.subs_in_grace),
      subsByStore: ((revenue.subs_by_store ?? []) as any[]).map((s) => ({
        store: String(s.store ?? "—"),
        count: num(s.count),
      })),
      recentBookings: ((revenue.recent_bookings ?? []) as any[]).map((b) => ({
        id: num(b.id),
        title: b.title != null ? String(b.title) : null,
        username: b.username != null ? String(b.username) : null,
        amountCents: num(b.amount_cents),
        status: String(b.status ?? "—"),
        createdAt: String(b.created_at ?? ""),
      })),
    },
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getAnalyticsOverview(): Promise<ModerationQueryResult<AnalyticsOverview>> {
  const guard = await requireStaffSession();
  if (guard.kind !== "ok") return { kind: guard.kind };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("admin_analytics_overview");

  if (error) return mapQueryError(error, "Impossible de charger les analytics.");

  return { kind: "ok", data: toOverview(data) };
}
