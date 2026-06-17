// Plain module (NOT "use server") — a server-action file may only export async
// functions, so the step-kind constant lives here and is shared by the actions
// and the client.
export type StepKind = "photo" | "coffee" | "ticket" | "walk" | "view";

export const STEP_KINDS: StepKind[] = ["photo", "coffee", "ticket", "walk", "view"];
