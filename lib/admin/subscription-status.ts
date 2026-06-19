import type { SubscriptionStatus } from "./subscriptions-actions";

// Plain module (NOT "use server") — a server-action file may only export async
// functions, so this status-label constant lives here.
export const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: "Actif",
  in_grace: "Période de grâce",
  expired: "Expiré",
  cancelled: "Annulé",
  paused: "En pause",
};
