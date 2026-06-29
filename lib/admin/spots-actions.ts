"use server";

import { refresh } from "next/cache";

import { getStaffSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SpotActionResult =
  | { kind: "ok" }
  | { kind: "unauthenticated" }
  | { kind: "unauthorized" }
  | { kind: "error"; message: string };

export type SpotDecision = "approved" | "rejected";

const SPOT_DECISIONS: SpotDecision[] = ["approved", "rejected"];

type RpcError = { code?: string; message?: string };

function mapRpcError(error: RpcError, fallback: string): SpotActionResult {
  console.error("[admin/spots-actions]", fallback, error.code ?? "", error.message ?? "");

  if (error.code === "42501") {
    return { kind: "unauthorized" };
  }

  if (error.code === "P0002") {
    return { kind: "error", message: "La cible de l'action est introuvable." };
  }

  if (error.code === "P0001") {
    return { kind: "error", message: "L'action est en conflit avec l'état actuel." };
  }

  return { kind: "error", message: fallback };
}

async function requireStaff(): Promise<SpotActionResult | null> {
  const session = await getStaffSession();

  if (session.kind === "unauthenticated") {
    return { kind: "unauthenticated" };
  }

  if (session.kind !== "staff") {
    return { kind: "unauthorized" };
  }

  return null;
}

export type SpotCreateInput = {
  name: string;
  city?: string | null;
  bestTime?: string | null;
  heroUrl?: string | null;
  isSponsored?: boolean;
  // Geo coordinates → written to the `location` geography(point,4326) so the spot
  // can be surfaced by proximity. Both required together; omit for no location.
  lat?: number | null;
  lng?: number | null;
  // Bookable experience tied to the spot (title + price in cents) → drives the
  // mobile spot-detail "réserver" CTA. Title + price required when bookable.
  bookable?: boolean;
  bookingTitle?: string | null;
  bookingPriceCents?: number | null;
};

// Create a spot from the admin console. It lands in the moderation queue
// (status defaults to 'pending'); a staff member then approves it via
// reviewSpot before the community (and the mobile app) can see it. RLS
// (spots_insert) requires created_by = auth.uid(), so we stamp the staff uid.
export async function createSpot(input: SpotCreateInput): Promise<SpotActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const name = input.name?.trim();
  if (!name) {
    return { kind: "error", message: "Le nom du spot est obligatoire." };
  }

  // Coordinates are optional but, when present, must be a valid pair.
  const { lat, lng } = input;
  const hasLat = lat != null && Number.isFinite(lat);
  const hasLng = lng != null && Number.isFinite(lng);
  if (hasLat !== hasLng) {
    return { kind: "error", message: "Latitude et longitude doivent être renseignées ensemble." };
  }
  if (hasLat && (lat! < -90 || lat! > 90 || lng! < -180 || lng! > 180)) {
    return { kind: "error", message: "Coordonnées hors limites (lat ±90, lng ±180)." };
  }

  // A bookable spot needs a title + a positive price.
  const bookable = input.bookable ?? false;
  const bookingTitle = input.bookingTitle?.trim() || null;
  const bookingPriceCents = input.bookingPriceCents ?? null;
  if (bookable) {
    if (!bookingTitle) {
      return { kind: "error", message: "Un spot réservable doit avoir un intitulé d'expérience." };
    }
    if (bookingPriceCents == null || !Number.isFinite(bookingPriceCents) || bookingPriceCents <= 0) {
      return { kind: "error", message: "Le prix de la réservation doit être un montant positif." };
    }
  }

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData.user?.id;
  if (!uid) {
    return { kind: "unauthenticated" };
  }

  // PostGIS geography point as EWKT (WKT order is lng lat); accepted by geography_in.
  const location = hasLat ? `SRID=4326;POINT(${lng} ${lat})` : null;

  const { error } = await supabase.from("spots").insert({
    name,
    city: input.city?.trim() || null,
    best_time: input.bestTime?.trim() || null,
    hero_url: input.heroUrl?.trim() || null,
    is_sponsored: input.isSponsored ?? false,
    location,
    bookable,
    booking_title: bookable ? bookingTitle : null,
    booking_price_cents: bookable ? bookingPriceCents : null,
    created_by: uid,
  });

  if (error) {
    return mapRpcError(error, "Impossible de créer ce spot.");
  }

  refresh();
  return { kind: "ok" };
}

export async function reviewSpot(
  spotId: number,
  decision: SpotDecision,
  reason?: string,
): Promise<SpotActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  if (!Number.isInteger(spotId) || !SPOT_DECISIONS.includes(decision)) {
    return { kind: "error", message: "Requête de modération invalide." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_review_spot", {
    target_spot_id: spotId,
    decision,
    reason: reason?.trim() || null,
  });

  if (error) {
    return mapRpcError(
      error,
      decision === "approved" ? "Impossible d'approuver ce spot." : "Impossible de rejeter ce spot.",
    );
  }

  refresh();
  return { kind: "ok" };
}

// Permanently delete a spot from the admin console. Staff-only and audited via
// the `admin_delete_spot` RPC (SECURITY DEFINER). Child rows (spot_photos,
// spot_tips, saved_spots) cascade; itinerary/post links are nulled by their FKs.
export async function deleteSpot(spotId: number, reason?: string): Promise<SpotActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  if (!Number.isInteger(spotId)) {
    return { kind: "error", message: "Identifiant de spot invalide." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("admin_delete_spot", {
    target_spot_id: spotId,
    reason: reason?.trim() || null,
  });

  if (error) {
    return mapRpcError(error, "Impossible de supprimer ce spot.");
  }

  refresh();
  return { kind: "ok" };
}
