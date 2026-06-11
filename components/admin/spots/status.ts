import type { SpotStatus } from "@/lib/admin/spots";

export const SPOT_STATUS_LABEL: Record<SpotStatus, string> = {
  approved: "validé",
  pending: "en attente",
  rejected: "rejeté",
};

export const SPOT_STATUS_TONE: Record<SpotStatus, "green" | "gold" | "red"> = {
  approved: "green",
  pending: "gold",
  rejected: "red",
};

export function actionErrorMessage(result: { kind: string; message?: string }) {
  if (result.kind === "unauthenticated") return "Session Supabase manquante. Reconnecte-toi.";
  if (result.kind === "unauthorized") return "Ce compte n'a pas les droits staff pour cette action.";
  return result.message ?? "L'action de modération a échoué.";
}

export function formatDate(value: string | null) {
  if (!value) return "—";
  return value.replace("T", " ").slice(0, 16);
}

export function profileName(profile: { firstName: string; lastName: string | null } | null) {
  if (!profile) return "Profil supprimé";
  return [profile.firstName, profile.lastName].filter(Boolean).join(" ");
}
