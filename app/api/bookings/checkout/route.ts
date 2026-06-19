import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";
import { serviceClient } from "@/lib/supabase/service";
import { getSupabaseEnv } from "@/lib/supabase/env";

// Create a Stripe Checkout Session for a REAL-WORLD booking (mode: payment, NOT a
// subscription — digital subs go through IAP). The mobile app creates the pending
// booking first (bookingApi.createIntent), then calls this with the bookingId; we
// verify ownership, create the session, and return its URL to open. The webhook
// (/api/stripe/webhook) is the source of truth that flips the booking to
// confirmed. Env-gated: 503 until STRIPE_SECRET_KEY is set, so mobile falls back
// to the intent-only flow.
export async function POST(req: Request): Promise<Response> {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "stripe_not_configured" }, { status: 503 });

  // Authenticate the caller via their Supabase access token (Bearer).
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { supabaseUrl: supaUrl, supabasePublishableKey: supaKey } = getSupabaseEnv();
  const userClient = createClient(supaUrl, supaKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const uid = userData.user.id;

  const body = (await req.json().catch(() => null)) as { bookingId?: number | string } | null;
  const bookingId = Number(body?.bookingId);
  if (!Number.isInteger(bookingId)) return NextResponse.json({ error: "bad_request" }, { status: 400 });

  // Load + authorize the booking with the service role.
  const sb = serviceClient();
  const { data: booking, error: bErr } = await sb
    .from("bookings")
    .select("id, user_id, title, amount_cents, currency, status")
    .eq("id", bookingId)
    .maybeSingle();
  if (bErr || !booking) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (booking.user_id !== uid) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (booking.status !== "pending") return NextResponse.json({ error: "not_pending" }, { status: 409 });

  // success/cancel must be https — return to a web page that can deep-link back to
  // the app. The webhook (not this redirect) is authoritative for status.
  const base = process.env.NEXT_PUBLIC_APP_URL || supaUrl;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: (booking.currency as string) || "eur",
          unit_amount: booking.amount_cents as number,
          product_data: { name: booking.title as string },
        },
      },
    ],
    metadata: { bookingId: String(booking.id) },
    payment_intent_data: { metadata: { bookingId: String(booking.id) } },
    success_url: `${base}/booking/return?status=success&booking=${booking.id}`,
    cancel_url: `${base}/booking/return?status=cancel&booking=${booking.id}`,
  });

  // Stash the session id so the webhook can match (metadata.bookingId is primary).
  await sb.from("bookings").update({ stripe_payment_intent: session.id }).eq("id", booking.id);

  return NextResponse.json({ url: session.url, sessionId: session.id });
}
