"use server";

import { refresh } from "next/cache";

import { getStaffSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type StaffDenial = { kind: "unauthenticated" } | { kind: "unauthorized" };

export type CampaignActionResult =
  | { kind: "ok" }
  | StaffDenial
  | { kind: "error"; message: string };

export type CampaignRow = {
  id: number;
  businessName: string;
  spotId: number | null;
  radiusM: number | null;
  startsAt: string | null;
  endsAt: string | null;
  budgetCents: number;
  isActive: boolean;
  createdAt: string;
};

export type CampaignListResult =
  | { kind: "ok"; data: CampaignRow[] }
  | StaffDenial
  | { kind: "error"; message: string };

type DbError = { code?: string; message?: string };

function mapDbError(error: DbError, fallback: string): { kind: "unauthorized" } | { kind: "error"; message: string } {
  console.error("[admin/campaigns-actions]", fallback, error.code ?? "", error.message ?? "");
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

function computeActive(startsAt: string | null, endsAt: string | null): boolean {
  const now = Date.now();
  const startedOk = !startsAt || new Date(startsAt).getTime() <= now;
  const notEnded = !endsAt || new Date(endsAt).getTime() > now;
  return startedOk && notEnded;
}

// Create a sponsored campaign. The `businesses` / `sponsored_campaigns` tables
// already exist with a `*_staff` RLS policy, so staff write directly. A campaign
// is "active" while now() is within its window; we default to a 30-day window
// starting now so it drives mobile sponsorship immediately. Stripe billing
// (budget_cents / invoice) is handled separately (TASK-022).
export async function createCampaign(input: {
  businessName: string;
  spotId?: number | null;
  // Geo targeting (TASK-021): a campaign with a target point + radius is a geo ad.
  targetLat?: number | null;
  targetLng?: number | null;
  radiusM?: number | null;
  days?: number;
}): Promise<CampaignActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const businessName = input.businessName?.trim();
  if (!businessName) return { kind: "error", message: "Le nom du partenaire est requis." };

  const supabase = await createSupabaseServerClient();

  // Upsert the business by name (case-insensitive).
  const { data: existing, error: findErr } = await supabase
    .from("businesses")
    .select("id")
    .ilike("name", businessName)
    .limit(1)
    .maybeSingle();
  if (findErr) return mapDbError(findErr, "Impossible de charger le partenaire.");

  let businessId = (existing as { id: number } | null)?.id;
  if (!businessId) {
    const { data: created, error: bizErr } = await supabase
      .from("businesses")
      .insert({ name: businessName })
      .select("id")
      .single();
    if (bizErr) return mapDbError(bizErr, "Impossible de créer le partenaire.");
    businessId = (created as { id: number }).id;
  }

  const startsAt = new Date();
  const endsAt = new Date(startsAt.getTime() + (input.days ?? 30) * DAY_MS);
  const row: Record<string, unknown> = {
    business_id: businessId,
    spot_id: input.spotId ?? null,
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
  };
  // Geo ad: PostGIS geography point (EWKT, lng then lat) + radius.
  if (input.targetLat != null && input.targetLng != null) {
    row.target_area = `SRID=4326;POINT(${input.targetLng} ${input.targetLat})`;
    row.target_radius_m = input.radiusM ?? 2000;
  }
  const { error } = await supabase.from("sponsored_campaigns").insert(row);
  if (error) return mapDbError(error, "Impossible de créer la campagne.");

  refresh();
  return { kind: "ok" };
}

export async function getCampaigns(): Promise<CampaignListResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("sponsored_campaigns")
    .select("id, spot_id, target_radius_m, starts_at, ends_at, budget_cents, created_at, businesses(name)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return mapDbError(error, "Impossible de charger les campagnes.");

  const rows = ((data ?? []) as Record<string, unknown>[]).map((r) => {
    const business = r.businesses as { name?: string } | { name?: string }[] | null;
    const businessName = Array.isArray(business) ? business[0]?.name : business?.name;
    return {
      id: r.id as number,
      businessName: businessName ?? "—",
      spotId: (r.spot_id as number | null) ?? null,
      radiusM: (r.target_radius_m as number | null) ?? null,
      startsAt: (r.starts_at as string | null) ?? null,
      endsAt: (r.ends_at as string | null) ?? null,
      budgetCents: (r.budget_cents as number) ?? 0,
      isActive: computeActive((r.starts_at as string | null) ?? null, (r.ends_at as string | null) ?? null),
      createdAt: r.created_at as string,
    };
  });
  return { kind: "ok", data: rows };
}
