import { NextResponse } from "next/server";
import { serviceClient } from "@/lib/supabase/service";
import { getStripe } from "@/lib/stripe";

// Stripe webhook — SOURCE OF TRUTH for booking lifecycle (TASK-022). Stripe POSTs
// payment events; we flip the matching booking's status. The client never
// self-confirms.
//
// Auth: prefer real Stripe signature verification (STRIPE_WEBHOOK_SECRET). A
// shared WEBHOOK_TEST_SECRET header path stays for e2e without a live account —
// only usable when that env var is set, never in prod.
//
// Idempotent: Stripe retries on non-2xx, so we record processed event ids in
// `stripe_events` and skip replays. Service role bypasses RLS (server-only).

const STATUS_BY_EVENT: Record<string, "confirmed" | "cancelled" | "refunded"> = {
  "checkout.session.completed": "confirmed",
  "payment_intent.succeeded": "confirmed",
  "payment_intent.canceled": "cancelled",
  "checkout.session.expired": "cancelled",
  "charge.refunded": "refunded",
};

type EventObject = {
  id?: string;
  payment_intent?: string;
  metadata?: { bookingId?: string } | null;
};
type WebhookEvent = { id?: string; type?: string; data?: { object?: EventObject } };

export async function POST(req: Request): Promise<Response> {
  const raw = await req.text();

  // ── authorize + parse the event ─────────────────────────────────────────────
  let event: WebhookEvent | null = null;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = getStripe();
  const signature = req.headers.get("stripe-signature");

  if (webhookSecret && stripe && signature) {
    try {
      event = stripe.webhooks.constructEvent(raw, signature, webhookSecret) as unknown as WebhookEvent;
    } catch (err) {
      console.error("[stripe/webhook] signature verification failed:", (err as Error).message);
      return NextResponse.json({ error: "invalid signature" }, { status: 400 });
    }
  } else {
    // e2e test path — only when WEBHOOK_TEST_SECRET is configured.
    const testSecret = process.env.WEBHOOK_TEST_SECRET;
    const provided = req.headers.get("x-webhook-test-secret");
    if (!testSecret || provided !== testSecret) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    try {
      event = JSON.parse(raw) as WebhookEvent;
    } catch {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }
  }

  const status = event?.type ? STATUS_BY_EVENT[event.type] : undefined;
  const obj = event?.data?.object ?? {};
  const bookingId = obj.metadata?.bookingId;
  const paymentIntent = obj.payment_intent ?? obj.id; // stashed session id or PI id

  if (!status || (!bookingId && !paymentIntent)) {
    return NextResponse.json({ received: true, ignored: true });
  }

  const supabase = serviceClient();

  // ── idempotency: skip an event we've already applied ────────────────────────
  if (event?.id) {
    const { data: seen } = await supabase
      .from("stripe_events")
      .select("id")
      .eq("id", event.id)
      .maybeSingle();
    if (seen) return NextResponse.json({ received: true, skipped: true });
  }

  // ── flip the booking status ─────────────────────────────────────────────────
  const update: Record<string, unknown> = { status };
  // On confirm via Checkout, persist the real payment_intent for traceability.
  if (status === "confirmed" && obj.payment_intent) update.stripe_payment_intent = obj.payment_intent;

  let query = supabase.from("bookings").update(update).select("id, status");
  query = bookingId ? query.eq("id", Number(bookingId)) : query.eq("stripe_payment_intent", paymentIntent!);
  const { data, error } = await query;

  if (error) {
    console.error("[stripe/webhook]", error.message);
    return NextResponse.json({ error: "update failed" }, { status: 500 });
  }

  if (event?.id) {
    await supabase.from("stripe_events").insert({ id: event.id, type: event.type ?? null });
  }

  return NextResponse.json({ received: true, updated: data?.length ?? 0, status });
}
