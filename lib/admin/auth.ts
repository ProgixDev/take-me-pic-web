import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type StaffRole = "moderator" | "admin" | "super_admin";

export type StaffSession =
  | {
      kind: "staff";
      userId: string;
      email: string | null;
      roles: StaffRole[];
    }
  | { kind: "unauthenticated" }
  | { kind: "unauthorized" };

const STAFF_ROLES: StaffRole[] = ["moderator", "admin", "super_admin"];

type UserRoleRow = {
  role: string;
};

function isStaffRole(role: string): role is StaffRole {
  return (STAFF_ROLES as string[]).includes(role);
}

export async function getStaffSession(): Promise<StaffSession> {
  const supabase = await createSupabaseServerClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;

  if (claimsError || !claims?.sub) {
    return { kind: "unauthenticated" };
  }

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", claims.sub);

  if (error) {
    return { kind: "unauthorized" };
  }

  const roles = ((data ?? []) as UserRoleRow[])
    .map((row) => row.role)
    .filter(isStaffRole);

  if (roles.length === 0) {
    return { kind: "unauthorized" };
  }

  return {
    kind: "staff",
    userId: claims.sub,
    email: typeof claims.email === "string" ? claims.email : null,
    roles,
  };
}

export function hasStaffRole(
  session: StaffSession,
  roles: readonly StaffRole[] = STAFF_ROLES,
) {
  return session.kind === "staff" && session.roles.some((role) => roles.includes(role));
}
