import type { CommunityContentState } from "@/lib/admin/community";

export const STATE_LABEL: Record<CommunityContentState, string> = {
  published: "publié",
  flagged: "signalé",
  hidden: "masqué",
};

export const STATE_TONE: Record<CommunityContentState, "green" | "red" | "neutral"> = {
  published: "green",
  flagged: "red",
  hidden: "neutral",
};

export function actionErrorMessage(result: { kind: string; message?: string }) {
  if (result.kind === "unauthenticated") return "Session Supabase manquante. Reconnecte-toi.";
  if (result.kind === "unauthorized") return "Ce compte n'a pas les droits staff pour cette action.";
  return result.message ?? "L'action de modération a échoué.";
}

export function formatDate(value: string) {
  return value.replace("T", " ").slice(0, 16);
}
