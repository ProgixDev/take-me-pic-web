import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Stripe webhook — the SOURCE OF TRUTH for booking lifecycle (TASK-022). Stripe
// POSTs payment events here; we flip the matching booking's status. The client
// never self-confirms. Idempotent: replaying an event re-sets the same status.
//
// Auth: in production, verify the Stripe signature with STRIPE_WEBHOOK_SECRET.
// For e2e (no real Stripe account), a shared WEBHOOK_TEST_SECRET header is
// accepted — only when that env var is set, so it can't be used in prod.
//
// Status update bypasses RLS (bookings_self is per-user) via the service role,
// which is server-only and never exposed to the browser.

const STATUS_BY_EVENT: Record<string, "confirmed" | "cancelled" | "refunded"> = {
  "checkout.session.completed": "confirmed",
  "payment_intent.succeeded": "confirmed",
  "payment_intent.canceled": "cancelled",
  "checkout.session.expired": "cancelled",
  "charge.refunded": "refunded",
};

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase service-role config for the webhook.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function POST(req: Request): Promise<Response> {
  const raw = await req.text();

  // ── authorize the caller ──────────────────────────────────────────────────
  const testSecret = process.env.WEBHOOK_TEST_SECRET;
  const providedTest = req.headers.get("x-webhook-test-secret");
  const testAuthorized = Boolean(testSecret) && providedTest === testSecret;
  // (real Stripe signature verification with STRIPE_WEBHOOK_SECRET would also set
  //  `authorized` here; omitted until a live Stripe account is connected.)
  if (!testAuthorized) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let event: { type?: string; data?: { object?: { payment_intent?: string; id?: string } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const status = event.type ? STATUS_BY_EVENT[event.type] : undefined;
  const paymentIntent = event.data?.object?.payment_intent ?? event.data?.object?.id;
  if (!status || !paymentIntent) {
    // Unknown/irrelevant event — acknowledge so Stripe stops retrying.
    return NextResponse.json({ received: true, ignored: true });
  }

  const supabase = serviceClient();
  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("stripe_payment_intent", paymentIntent)
    .select("id, status");

  if (error) {
    console.error("[stripe/webhook]", error.message);
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true, updated: data?.length ?? 0, status });
}
