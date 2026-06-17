"use server";

import { refresh } from "next/cache";

import { getStaffSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type StaffDenial = { kind: "unauthenticated" } | { kind: "unauthorized" };

export type CampaignActionResult =
  | { kind: "ok"; id?: number }
  | StaffDenial
  | { kind: "error"; message: string };

export type CampaignRow = {
  id: number;
  name: string;
  businessName: string;
  spotId: number | null;
  city: string | null;
  startsAt: string;
  endsAt: string;
  status: string;
  isActive: boolean;
  createdAt: string;
};

export type CampaignListResult =
  | { kind: "ok"; data: CampaignRow[] }
  | StaffDenial
  | { kind: "error"; message: string };

type RpcError = { code?: string; message?: string };

function mapRpcError(error: RpcError, fallback: string): { kind: "unauthorized" } | { kind: "error"; message: string } {
  console.error("[admin/campaigns-actions]", fallback, error.code ?? "", error.message ?? "");
  if (error.code === "42501") return { kind: "unauthorized" };
  if (error.code === "P0001") return { kind: "error", message: error.message ?? fallback };
  return { kind: "error", message: fallback };
}

async function requireStaff(): Promise<StaffDenial | null> {
  const session = await getStaffSession();
  if (session.kind === "unauthenticated") return { kind: "unauthenticated" };
  if (session.kind !== "staff") return { kind: "unauthorized" };
  return null;
}

// Create a sponsored campaign (upserts the business by name). Lands as `active`
// by default with a 30-day window so it immediately drives mobile sponsorship;
// the window defaults are owned by the SECURITY DEFINER RPC.
export async function createCampaign(input: {
  businessName: string;
  name: string;
  spotId?: number | null;
  city?: string | null;
  status?: string;
}): Promise<CampaignActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const businessName = input.businessName?.trim();
  const name = input.name?.trim();
  if (!businessName || !name) {
    return { kind: "error", message: "Nom du partenaire et nom de la campagne requis." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("admin_create_campaign" as never, {
    p_business_name: businessName,
    p_name: name,
    p_spot_id: input.spotId ?? null,
    p_city: input.city?.trim() || null,
    p_status: input.status ?? "active",
  } as never);

  if (error) return mapRpcError(error as RpcError, "Impossible de créer la campagne.");
  refresh();
  return { kind: "ok", id: data as unknown as number };
}

export async function getCampaigns(): Promise<CampaignListResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("admin_list_campaigns" as never);
  if (error) return mapRpcError(error as RpcError, "Impossible de charger les campagnes.");

  const rows = ((data ?? []) as Record<string, unknown>[]).map((r) => ({
    id: r.id as number,
    name: r.name as string,
    businessName: r.business_name as string,
    spotId: (r.spot_id as number | null) ?? null,
    city: (r.city as string | null) ?? null,
    startsAt: r.starts_at as string,
    endsAt: r.ends_at as string,
    status: r.status as string,
    isActive: Boolean(r.is_active),
    createdAt: r.created_at as string,
  }));
  return { kind: "ok", data: rows };
}
