"use server";

import { refresh } from "next/cache";

import { getStaffSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type StaffDenial = { kind: "unauthenticated" } | { kind: "unauthorized" };

export type SubscriptionActionResult =
  | { kind: "ok" }
  | StaffDenial
  | { kind: "error"; message: string };

// DB enum subscription_status. We display French labels in the UI.
export type SubscriptionStatus = "active" | "in_grace" | "expired" | "cancelled" | "paused";
export type StoreKind = "apple" | "google";
export type PremiumPlan = "monthly" | "annual";

export type SubscriptionEntitlements = {
  adFree: boolean;
  profileBoost: boolean;
  exclusiveSpots: boolean;
};

export type SubscriptionRow = {
  id: number;
  userId: string;
  userName: string;
  username: string | null;
  avatarUrl: string | null;
  // Display label derived from product_id (e.g. "Mensuel" / "Annuel").
  plan: string;
  productId: string;
  store: StoreKind;
  status: SubscriptionStatus;
  // French display label for the status enum.
  statusLabel: string;
  entitlements: SubscriptionEntitlements;
  currentPeriodEnd: string | null;
  createdAt: string;
};

export type SubscriptionListResult =
  | { kind: "ok"; data: SubscriptionRow[] }
  | StaffDenial
  | { kind: "error"; message: string };

export type SubscriptionResult =
  | { kind: "ok"; data: SubscriptionRow }
  | StaffDenial
  | { kind: "not_found" }
  | { kind: "error"; message: string };

type DbError = { code?: string; message?: string };

function mapDbError(error: DbError, fallback: string): { kind: "unauthorized" } | { kind: "error"; message: string } {
  console.error("[admin/subscriptions-actions]", fallback, error.code ?? "", error.message ?? "");
  if (error.code === "42501") return { kind: "unauthorized" };
  return { kind: "error", message: fallback };
}

async function requireStaff(): Promise<StaffDenial | null> {
  const session = await getStaffSession();
  if (session.kind === "unauthenticated") return { kind: "unauthenticated" };
  if (session.kind !== "staff") return { kind: "unauthorized" };
  return null;
}

const DAY_MS = 86_400_000;

export const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: "Actif",
  in_grace: "Période de grâce",
  expired: "Expiré",
  cancelled: "Annulé",
  paused: "En pause",
};

function statusLabel(status: string): string {
  return STATUS_LABELS[status as SubscriptionStatus] ?? status;
}

// Map RevenueCat/StoreKit product ids to a human label. New plans fall back to
// the raw product id so nothing is hidden.
function planLabel(productId: string): string {
  if (/monthly/i.test(productId)) return "Mensuel";
  if (/annual|yearly/i.test(productId)) return "Annuel";
  return productId;
}

function parseEntitlements(raw: unknown): SubscriptionEntitlements {
  const obj = (raw ?? {}) as Record<string, unknown>;
  return {
    adFree: obj.ad_free !== false,
    profileBoost: obj.profile_boost !== false,
    exclusiveSpots: obj.exclusive_spots !== false,
  };
}

const PROFILE_SELECT = "id, user_id, store, product_id, status, entitlements, current_period_end, created_at, profiles(first_name, last_name, username, avatar_url)";

type ProfileJoin = {
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
};

function mapRow(r: Record<string, unknown>): SubscriptionRow {
  const profile = r.profiles as ProfileJoin | ProfileJoin[] | null;
  const p = Array.isArray(profile) ? profile[0] : profile;
  const fullName = [p?.first_name, p?.last_name].filter(Boolean).join(" ").trim();
  const status = r.status as SubscriptionStatus;
  const productId = (r.product_id as string) ?? "";
  return {
    id: r.id as number,
    userId: r.user_id as string,
    userName: fullName || p?.username || "Utilisateur inconnu",
    username: p?.username ?? null,
    avatarUrl: p?.avatar_url ?? null,
    plan: planLabel(productId),
    productId,
    store: (r.store as StoreKind) ?? "apple",
    status,
    statusLabel: statusLabel(status),
    entitlements: parseEntitlements(r.entitlements),
    currentPeriodEnd: (r.current_period_end as string | null) ?? null,
    createdAt: r.created_at as string,
  };
}

// List every subscription with its owner profile. Staff RLS (private.is_staff())
// grants the read; the owner self-read policy is for the mobile client.
export async function getSubscriptions(): Promise<SubscriptionListResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select(PROFILE_SELECT)
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) return mapDbError(error, "Impossible de charger les abonnements.");

  const rows = ((data ?? []) as Record<string, unknown>[]).map(mapRow);
  return { kind: "ok", data: rows };
}

export async function getSubscription(id: number): Promise<SubscriptionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  if (!Number.isInteger(id)) return { kind: "not_found" };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select(PROFILE_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) return mapDbError(error, "Impossible de charger cet abonnement.");
  if (!data) return { kind: "not_found" };

  return { kind: "ok", data: mapRow(data as Record<string, unknown>) };
}

// Loose uuid-ish check — the DB enforces the real FK/type, this just stops
// obviously-bad input round-tripping.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type GrantPremiumInput = { userId: string; plan: PremiumPlan };

// Grant comp/support Premium by writing a synthetic subscription row. Premium is
// StoreKit/RevenueCat-driven; until RevenueCat is wired, staff grants create an
// 'apple' subscription with all entitlements on. The DB trigger flips
// profiles.is_premium — never set it here. revenuecat_id stays null (no receipt).
export async function grantPremium(input: GrantPremiumInput): Promise<SubscriptionActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const userId = input.userId?.trim();
  if (!userId || !UUID_RE.test(userId)) {
    return { kind: "error", message: "L'identifiant utilisateur (UUID) est invalide." };
  }
  if (input.plan !== "monthly" && input.plan !== "annual") {
    return { kind: "error", message: "Formule invalide." };
  }

  const days = input.plan === "annual" ? 365 : 30;
  const periodEnd = new Date(Date.now() + days * DAY_MS).toISOString();

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("subscriptions").insert({
    user_id: userId,
    store: "apple",
    product_id: `tmp_premium_${input.plan}`,
    status: "active",
    entitlements: { ad_free: true, profile_boost: true, exclusive_spots: true },
    current_period_end: periodEnd,
    revenuecat_id: null,
  });
  if (error) return mapDbError(error, "Impossible d'accorder le Premium.");

  refresh();
  return { kind: "ok" };
}

export type RevokePremiumInput = { id: number };

// Revoke a granted subscription: mark it cancelled and end the period now, so it
// is no longer active. The trigger clears profiles.is_premium when the user has
// no other active subscription.
export async function revokePremium(input: RevokePremiumInput): Promise<SubscriptionActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  if (!Number.isInteger(input.id)) {
    return { kind: "error", message: "Abonnement introuvable." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("subscriptions")
    .update({ status: "cancelled", current_period_end: new Date().toISOString() })
    .eq("id", input.id);
  if (error) return mapDbError(error, "Impossible de révoquer le Premium.");

  refresh();
  return { kind: "ok" };
}
