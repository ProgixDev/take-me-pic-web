"use server";

import { refresh } from "next/cache";

import { getStaffSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type StaffDenial = { kind: "unauthenticated" } | { kind: "unauthorized" };

export type CampaignActionResult =
  | { kind: "ok" }
  | StaffDenial
  | { kind: "error"; message: string };

export type CampaignType = "spot" | "geo";

export type CampaignRow = {
  id: number;
  businessName: string;
  type: CampaignType;
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
const DEFAULT_RADIUS_M = 2000;

function computeActive(startsAt: string | null, endsAt: string | null): boolean {
  const now = Date.now();
  const startedOk = !startsAt || new Date(startsAt).getTime() <= now;
  const notEnded = !endsAt || new Date(endsAt).getTime() > now;
  return startedOk && notEnded;
}

// A campaign's window. `endsAt` is the validity end date (required by the form so a
// campaign can't run forever); `startsAt` defaults to now when omitted.
function resolveWindow(startsAt?: string | null, endsAt?: string | null): { starts_at: string; ends_at: string } {
  const start = startsAt ? new Date(startsAt) : new Date();
  const end = endsAt ? new Date(endsAt) : new Date(start.getTime() + 30 * DAY_MS);
  return { starts_at: start.toISOString(), ends_at: end.toISOString() };
}

// PostGIS geography point as EWKT — `geography_in` accepts this on insert/update,
// so we avoid a dedicated RPC. Note WKT order is (lng lat).
function geoPoint(lat: number, lng: number): string {
  return `SRID=4326;POINT(${lng} ${lat})`;
}

// Resolve (or create) the partner business by case-insensitive name.
async function resolveBusinessId(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  name: string
): Promise<{ id: number } | { error: ReturnType<typeof mapDbError> }> {
  const { data: existing, error: findErr } = await supabase
    .from("businesses")
    .select("id")
    .ilike("name", name)
    .limit(1)
    .maybeSingle();
  if (findErr) return { error: mapDbError(findErr, "Impossible de charger le partenaire.") };

  const found = (existing as { id: number } | null)?.id;
  if (found) return { id: found };

  const { data: created, error: bizErr } = await supabase
    .from("businesses")
    .insert({ name })
    .select("id")
    .single();
  if (bizErr) return { error: mapDbError(bizErr, "Impossible de créer le partenaire.") };
  return { id: (created as { id: number }).id };
}

export type CampaignInput = {
  businessName: string;
  type: CampaignType;
  // spot targeting
  spotId?: number | null;
  // geo targeting
  lat?: number | null;
  lng?: number | null;
  radiusM?: number | null;
  // validity window
  startsAt?: string | null;
  endsAt?: string | null;
};

function validateInput(input: CampaignInput): { kind: "error"; message: string } | null {
  if (!input.businessName?.trim()) return { kind: "error", message: "Le nom du partenaire est requis." };
  if (input.type === "spot") {
    if (input.spotId != null && !Number.isInteger(input.spotId)) {
      return { kind: "error", message: "L'ID du spot doit être un nombre." };
    }
  }
  if (input.type === "geo") {
    const { lat, lng } = input;
    if (lat == null || lng == null || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      return { kind: "error", message: "Latitude et longitude sont requises pour un ciblage géo." };
    }
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return { kind: "error", message: "Coordonnées hors limites (lat ±90, lng ±180)." };
    }
    if (input.radiusM != null && (!Number.isFinite(input.radiusM) || input.radiusM <= 0)) {
      return { kind: "error", message: "Le rayon doit être un nombre positif (mètres)." };
    }
  }
  return null;
}

// Build the spot/geo target columns for an insert or update. For geo updates with
// no new coords, omit `target_area` so the existing location is preserved.
function targetColumns(input: CampaignInput, opts: { keepGeoIfMissing?: boolean } = {}): Record<string, unknown> {
  if (input.type === "spot") {
    return { spot_id: input.spotId ?? null, target_area: null, target_radius_m: null };
  }
  const cols: Record<string, unknown> = { spot_id: null, target_radius_m: input.radiusM ?? DEFAULT_RADIUS_M };
  if (input.lat != null && input.lng != null) {
    cols.target_area = geoPoint(input.lat, input.lng);
  } else if (!opts.keepGeoIfMissing) {
    cols.target_area = null;
  }
  return cols;
}

// Create a sponsored campaign. The `businesses` / `sponsored_campaigns` tables
// already exist with a `*_staff` RLS policy, so staff write directly. A campaign
// is "active" while now() is within its window. Stripe billing (budget_cents /
// invoice) is handled separately (TASK-022).
export async function createCampaign(input: CampaignInput): Promise<CampaignActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const invalid = validateInput(input);
  if (invalid) return invalid;

  const supabase = await createSupabaseServerClient();

  const biz = await resolveBusinessId(supabase, input.businessName.trim());
  if ("error" in biz) return biz.error;

  const { error } = await supabase.from("sponsored_campaigns").insert({
    business_id: biz.id,
    ...targetColumns(input),
    ...resolveWindow(input.startsAt, input.endsAt),
  });
  if (error) return mapDbError(error, "Impossible de créer la campagne.");

  refresh();
  return { kind: "ok" };
}

// Update an existing campaign. Editing a geo campaign's location is optional — if
// lat/lng are left blank the current `target_area` is kept (we can't prefill the
// exact point through PostgREST, so blank = unchanged).
export async function updateCampaign(input: CampaignInput & { id: number }): Promise<CampaignActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  if (!input.businessName?.trim()) return { kind: "error", message: "Le nom du partenaire est requis." };
  // Spot edits always validate; geo edits validate only when new coords are given
  // (blank coords keep the current location).
  if (input.type === "spot" || (input.lat != null && input.lng != null)) {
    const invalid = validateInput(input);
    if (invalid) return invalid;
  }

  const supabase = await createSupabaseServerClient();

  const biz = await resolveBusinessId(supabase, input.businessName.trim());
  if ("error" in biz) return biz.error;

  const { error } = await supabase
    .from("sponsored_campaigns")
    .update({
      business_id: biz.id,
      ...targetColumns(input, { keepGeoIfMissing: true }),
      ...resolveWindow(input.startsAt, input.endsAt),
    })
    .eq("id", input.id);
  if (error) return mapDbError(error, "Impossible de mettre à jour la campagne.");

  refresh();
  return { kind: "ok" };
}

export async function deleteCampaign(id: number): Promise<CampaignActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("sponsored_campaigns").delete().eq("id", id);
  if (error) return mapDbError(error, "Impossible de supprimer la campagne.");

  refresh();
  return { kind: "ok" };
}

export async function getCampaigns(): Promise<CampaignListResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("sponsored_campaigns")
    .select("id, spot_id, target_area, target_radius_m, starts_at, ends_at, budget_cents, created_at, businesses(name)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return mapDbError(error, "Impossible de charger les campagnes.");

  const rows = ((data ?? []) as Record<string, unknown>[]).map((r) => {
    const business = r.businesses as { name?: string } | { name?: string }[] | null;
    const businessName = Array.isArray(business) ? business[0]?.name : business?.name;
    const isGeo = r.target_area != null;
    return {
      id: r.id as number,
      businessName: businessName ?? "—",
      type: (isGeo ? "geo" : "spot") as CampaignType,
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
