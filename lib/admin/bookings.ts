import "server-only";

import { getStaffSession } from "@/lib/admin/auth";
import { serviceClient } from "@/lib/supabase/service";

export type AdminBookingStatus = "confirmée" | "en attente" | "annulée" | "remboursée";

export type AdminBooking = {
  id: string;
  user: { firstName: string; lastName: string; email: string; avatar: string | null; premium: boolean };
  experience: string;
  city: string;
  amount: number; // euros
  commission: number; // euros
  status: AdminBookingStatus;
  date: string;
};

export type AdminBookingsResult =
  | { kind: "ok"; data: AdminBooking[] }
  | { kind: "unauthenticated" }
  | { kind: "unauthorized" }
  | { kind: "error"; message: string };

const STATUS_LABEL: Record<string, AdminBookingStatus> = {
  confirmed: "confirmée",
  pending: "en attente",
  cancelled: "annulée",
  refunded: "remboursée",
};

// All bookings for the admin console. bookings_self RLS is per-user, so we read
// with the service role (server-only) after verifying the staff session — staff
// only READ here; status mutations stay webhook-owned.
export async function getBookings(): Promise<AdminBookingsResult> {
  const session = await getStaffSession();
  if (session.kind === "unauthenticated") return { kind: "unauthenticated" };
  if (session.kind !== "staff") return { kind: "unauthorized" };

  const supabase = serviceClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("id, title, amount_cents, commission_cents, currency, status, scheduled_for, created_at, profiles(first_name, username, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    console.error("[admin/bookings]", error.message);
    return { kind: "error", message: "Impossible de charger les réservations." };
  }

  const rows = ((data ?? []) as Record<string, unknown>[]).map((r) => {
    const p = r.profiles as { first_name?: string; username?: string; avatar_url?: string } | { first_name?: string; username?: string; avatar_url?: string }[] | null;
    const profile = Array.isArray(p) ? p[0] : p;
    const when = (r.scheduled_for as string | null) ?? (r.created_at as string);
    return {
      id: `bk_${r.id as number}`,
      user: {
        firstName: profile?.first_name ?? "—",
        lastName: "",
        email: profile?.username ? `@${profile.username}` : "",
        avatar: profile?.avatar_url ?? null,
        premium: false,
      },
      experience: r.title as string,
      city: "",
      amount: (r.amount_cents as number) / 100,
      commission: (r.commission_cents as number) / 100,
      status: STATUS_LABEL[r.status as string] ?? "en attente",
      date: new Date(when).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }),
    };
  });
  return { kind: "ok", data: rows };
}
