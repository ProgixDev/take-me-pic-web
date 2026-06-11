import type { HelpRequestStatus } from "@/lib/admin/support";

export const STATUS_LABEL: Record<HelpRequestStatus, string> = {
  requested: "demandée",
  accepted: "acceptée",
  in_session: "en session",
  completed: "terminée",
  rated: "évaluée",
  cancelled: "annulée",
  expired: "expirée",
};

export const STATUS_TONE: Record<HelpRequestStatus, "gold" | "blue" | "green" | "red" | "neutral"> = {
  requested: "gold",
  accepted: "blue",
  in_session: "blue",
  completed: "green",
  rated: "green",
  cancelled: "red",
  expired: "neutral",
};

export function formatDateTime(value: string | null) {
  if (!value) return "—";
  return value.replace("T", " ").slice(0, 16);
}
