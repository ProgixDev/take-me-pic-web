"use server";

import { refresh } from "next/cache";

import { getStaffSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { STEP_KINDS, type StepKind } from "@/lib/admin/itinerary-step-kinds";

type StaffDenial = { kind: "unauthenticated" } | { kind: "unauthorized" };

export type TemplateActionResult =
  | { kind: "ok" }
  | StaffDenial
  | { kind: "error"; message: string };

export type StepInput = {
  timeLabel?: string | null;
  title: string;
  subtitle?: string | null;
  kind: StepKind;
  priceCents?: number | null;
  spotId?: number | null;
};

export type TemplateRow = {
  id: number;
  title: string;
  areaLabel: string | null;
  city: string | null;
  radiusM: number | null;
  createdAt: string;
  stepCount: number;
};

export type TemplateListResult =
  | { kind: "ok"; data: TemplateRow[] }
  | StaffDenial
  | { kind: "error"; message: string };

type DbError = { code?: string; message?: string };

function mapDbError(error: DbError, fallback: string): { kind: "unauthorized" } | { kind: "error"; message: string } {
  console.error("[admin/itinerary-templates-actions]", fallback, error.code ?? "", error.message ?? "");
  if (error.code === "42501") return { kind: "unauthorized" };
  return { kind: "error", message: fallback };
}

async function requireStaff(): Promise<StaffDenial | null> {
  const session = await getStaffSession();
  if (session.kind === "unauthenticated") return { kind: "unauthenticated" };
  if (session.kind !== "staff") return { kind: "unauthorized" };
  return null;
}

const DEFAULT_RADIUS_M = 3000;

// PostGIS geography point as EWKT — `geography_in` accepts this on insert/update,
// so we avoid a dedicated RPC. Note WKT order is (lng lat).
function geoPoint(lat: number, lng: number): string {
  return `SRID=4326;POINT(${lng} ${lat})`;
}

export type TemplateCreateInput = {
  title: string;
  areaLabel?: string | null;
  city?: string | null;
  lat: number;
  lng: number;
  radiusM?: number | null;
  steps: StepInput[];
};

export type TemplateUpdateInput = {
  id: number;
  title: string;
  areaLabel?: string | null;
  city?: string | null;
  lat?: number | null;
  lng?: number | null;
  radiusM?: number | null;
  steps: StepInput[];
};

function validateCoords(lat: number, lng: number): { kind: "error"; message: string } | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { kind: "error", message: "Latitude et longitude sont requises." };
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return { kind: "error", message: "Coordonnées hors limites (lat ±90, lng ±180)." };
  }
  return null;
}

function validateSteps(steps: StepInput[]): { kind: "error"; message: string } | null {
  for (const [i, step] of steps.entries()) {
    if (!step.title?.trim()) {
      return { kind: "error", message: `L'étape ${i + 1} doit avoir un titre.` };
    }
    if (!STEP_KINDS.includes(step.kind)) {
      return { kind: "error", message: `L'étape ${i + 1} a un type invalide.` };
    }
  }
  return null;
}

// Map StepInput[] into row payloads for `itinerary_template_steps`, with
// position = array index. priceCents passes through for any kind (only
// meaningful for 'ticket', but we don't hard-fail).
function stepRows(templateId: number, steps: StepInput[]): Record<string, unknown>[] {
  return steps.map((step, index) => ({
    template_id: templateId,
    position: index,
    time_label: step.timeLabel?.trim() || null,
    title: step.title.trim(),
    subtitle: step.subtitle?.trim() || null,
    kind: step.kind,
    price_cents: step.priceCents ?? null,
    spot_id: step.spotId ?? null,
  }));
}

// List templates with their step counts. Step counts come from a second
// grouped query (simple/robust) rather than a PostgREST relation count.
export async function getTemplates(): Promise<TemplateListResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("itinerary_templates")
    .select("id, title, area_label, city, radius_m, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return mapDbError(error, "Impossible de charger les itinéraires.");

  const templates = (data ?? []) as Record<string, unknown>[];

  // Count steps grouped by template_id (second query keeps it robust).
  const { data: stepData, error: stepErr } = await supabase
    .from("itinerary_template_steps")
    .select("template_id")
    .limit(10000);
  if (stepErr) return mapDbError(stepErr, "Impossible de charger les étapes.");

  const counts = new Map<number, number>();
  for (const row of (stepData ?? []) as { template_id: number }[]) {
    counts.set(row.template_id, (counts.get(row.template_id) ?? 0) + 1);
  }

  const rows: TemplateRow[] = templates.map((t) => {
    const id = t.id as number;
    return {
      id,
      title: t.title as string,
      areaLabel: (t.area_label as string | null) ?? null,
      city: (t.city as string | null) ?? null,
      radiusM: (t.radius_m as number | null) ?? null,
      createdAt: t.created_at as string,
      stepCount: counts.get(id) ?? 0,
    };
  });

  return { kind: "ok", data: rows };
}

// Create a template (center = EWKT from lat/lng; required on create), then insert
// its steps with position = array index. The `itinerary_templates` /
// `itinerary_template_steps` tables already exist with staff-only write RLS, so
// staff write directly through the server client.
export async function createTemplate(input: TemplateCreateInput): Promise<TemplateActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const title = input.title?.trim();
  if (!title) return { kind: "error", message: "Le titre est requis." };

  const badCoords = validateCoords(input.lat, input.lng);
  if (badCoords) return badCoords;

  if (input.radiusM != null && (!Number.isFinite(input.radiusM) || input.radiusM <= 0)) {
    return { kind: "error", message: "Le rayon doit être un nombre positif (mètres)." };
  }

  const badStep = validateSteps(input.steps);
  if (badStep) return badStep;

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData.user?.id ?? null;

  const { data: created, error } = await supabase
    .from("itinerary_templates")
    .insert({
      title,
      area_label: input.areaLabel?.trim() || null,
      city: input.city?.trim() || null,
      center: geoPoint(input.lat, input.lng),
      radius_m: input.radiusM ?? DEFAULT_RADIUS_M,
      created_by: uid,
    })
    .select("id")
    .single();
  if (error) return mapDbError(error, "Impossible de créer l'itinéraire.");

  const templateId = (created as { id: number }).id;

  if (input.steps.length > 0) {
    const { error: stepErr } = await supabase
      .from("itinerary_template_steps")
      .insert(stepRows(templateId, input.steps));
    if (stepErr) return mapDbError(stepErr, "Impossible d'ajouter les étapes.");
  }

  refresh();
  return { kind: "ok" };
}

// Update template fields, then REPLACE steps: delete existing steps and re-insert
// from the array (simplest correct approach for an ordered list editor). Editing
// the center is optional — only set it when lat AND lng are both provided; blank
// keeps the current location (we can't prefill the exact point via PostgREST).
export async function updateTemplate(input: TemplateUpdateInput): Promise<TemplateActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const title = input.title?.trim();
  if (!title) return { kind: "error", message: "Le titre est requis." };

  const hasLat = input.lat != null;
  const hasLng = input.lng != null;
  if (hasLat !== hasLng) {
    return { kind: "error", message: "Renseigne latitude ET longitude (ou aucune)." };
  }
  if (hasLat && hasLng) {
    const badCoords = validateCoords(input.lat as number, input.lng as number);
    if (badCoords) return badCoords;
  }

  if (input.radiusM != null && (!Number.isFinite(input.radiusM) || input.radiusM <= 0)) {
    return { kind: "error", message: "Le rayon doit être un nombre positif (mètres)." };
  }

  const badStep = validateSteps(input.steps);
  if (badStep) return badStep;

  const supabase = await createSupabaseServerClient();

  const fields: Record<string, unknown> = {
    title,
    area_label: input.areaLabel?.trim() || null,
    city: input.city?.trim() || null,
    radius_m: input.radiusM ?? DEFAULT_RADIUS_M,
  };
  if (hasLat && hasLng) {
    fields.center = geoPoint(input.lat as number, input.lng as number);
  }

  const { error } = await supabase
    .from("itinerary_templates")
    .update(fields)
    .eq("id", input.id);
  if (error) return mapDbError(error, "Impossible de mettre à jour l'itinéraire.");

  // Replace steps: delete then re-insert.
  const { error: delErr } = await supabase
    .from("itinerary_template_steps")
    .delete()
    .eq("template_id", input.id);
  if (delErr) return mapDbError(delErr, "Impossible de mettre à jour les étapes.");

  if (input.steps.length > 0) {
    const { error: insErr } = await supabase
      .from("itinerary_template_steps")
      .insert(stepRows(input.id, input.steps));
    if (insErr) return mapDbError(insErr, "Impossible d'ajouter les étapes.");
  }

  refresh();
  return { kind: "ok" };
}

export async function deleteTemplate(id: number): Promise<TemplateActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const supabase = await createSupabaseServerClient();
  // Steps cascade via the FK ON DELETE CASCADE.
  const { error } = await supabase.from("itinerary_templates").delete().eq("id", id);
  if (error) return mapDbError(error, "Impossible de supprimer l'itinéraire.");

  refresh();
  return { kind: "ok" };
}

export type TemplateStepsResult =
  | { kind: "ok"; data: StepInput[] }
  | StaffDenial
  | { kind: "error"; message: string };

// A template's ordered steps — used to prefill the edit modal so saving an edit
// doesn't wipe steps (updateTemplate replaces all steps).
export async function getTemplateSteps(templateId: number): Promise<TemplateStepsResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("itinerary_template_steps")
    .select("time_label, title, subtitle, kind, price_cents, spot_id")
    .eq("template_id", templateId)
    .order("position", { ascending: true });
  if (error) return mapDbError(error, "Impossible de charger les étapes.");

  const steps = ((data ?? []) as Record<string, unknown>[]).map((r) => ({
    timeLabel: (r.time_label as string | null) ?? null,
    title: (r.title as string) ?? "",
    subtitle: (r.subtitle as string | null) ?? null,
    kind: (r.kind as StepKind) ?? "photo",
    priceCents: (r.price_cents as number | null) ?? null,
    spotId: (r.spot_id as number | null) ?? null,
  }));
  return { kind: "ok", data: steps };
}
