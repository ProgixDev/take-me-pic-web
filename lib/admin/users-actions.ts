"use server";

import { refresh } from "next/cache";

import { getStaffSession } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type StaffDenial = { kind: "unauthenticated" } | { kind: "unauthorized" };

export type UserActionResult =
  | { kind: "ok" }
  | StaffDenial
  | { kind: "error"; message: string };

type DbError = { code?: string; message?: string };

function mapDbError(error: DbError, fallback: string): { kind: "unauthorized" } | { kind: "error"; message: string } {
  console.error("[admin/users-actions]", fallback, error.code ?? "", error.message ?? "");
  if (error.code === "42501") return { kind: "unauthorized" };
  return { kind: "error", message: fallback };
}

async function requireStaff(): Promise<StaffDenial | null> {
  const session = await getStaffSession();
  if (session.kind === "unauthenticated") return { kind: "unauthenticated" };
  if (session.kind !== "staff") return { kind: "unauthorized" };
  return null;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const norm = (v: string | undefined): string | null => {
  const t = v?.trim();
  return t ? t : null;
};

export type UpdateUserProfileInput = {
  userId: string;
  firstName: string;
  lastName: string;
  bio: string;
  city: string;
  phone: string;
};

// Update the editable profile fields staff are allowed to correct. Identity
// (email) lives in auth.users, and account state (status / verification /
// premium) is managed through bans, the verification queue and subscriptions —
// so none of those are free-edited here. Staff RLS (private.is_staff())
// authorises the write.
export async function updateUserProfile(input: UpdateUserProfileInput): Promise<UserActionResult> {
  const denied = await requireStaff();
  if (denied) return denied;

  const userId = input.userId?.trim();
  if (!userId || !UUID_RE.test(userId)) {
    return { kind: "error", message: "L'identifiant utilisateur (UUID) est invalide." };
  }

  const firstName = input.firstName?.trim();
  if (!firstName) {
    return { kind: "error", message: "Le prénom est obligatoire." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: norm(input.lastName),
      bio: norm(input.bio),
      city: norm(input.city),
      phone: norm(input.phone),
    })
    .eq("id", userId);

  if (error) return mapDbError(error, "Impossible d'enregistrer le profil.");

  refresh();
  return { kind: "ok" };
}
