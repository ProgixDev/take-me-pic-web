import { NextResponse } from "next/server";
import { serviceClient } from "@/lib/supabase/service";

// RevenueCat webhook — keeps `subscriptions` (and, via the DB trigger,
// `profiles.is_premium`) in sync with store purchases. RevenueCat is the source
// of truth for Premium (StoreKit/Google Play); the mobile app only READS
// `subscriptions`. Premium is NEVER Stripe (App Store 3.1.1).
//
// Auth: RevenueCat sends the Authorization header you configure on the webhook —
// we require it to equal REVENUECAT_WEBHOOK_SECRET. Env-gated: 503 until set.
//
// Idempotent by construction: each event sets ABSOLUTE state (status + period),
// so replays converge to the same row (no increments).

// Event types that mean "entitlement is active right now".
const ACTIVE_EVENTS = new Set([
  "INITIAL_PURCHASE",
  "RENEWAL",
  "UNCANCELLATION",
  "PRODUCT_CHANGE",
  "NON_RENEWING_PURCHASE",
]);

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function mapStore(store?: string): "apple" | "google" {
  return store === "PLAY_STORE" ? "google" : "apple";
}

type RcEvent = {
  type?: string;
  app_user_id?: string;
  product_id?: string;
  entitlement_ids?: string[];
  store?: string;
  expiration_at_ms?: number;
};

export async function POST(req: Request): Promise<Response> {
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (req.headers.get("authorization") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as { event?: RcEvent } | null;
  const ev = body?.event;
  if (!ev?.type) return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (ev.type === "TEST") return NextResponse.json({ received: true, test: true });

  // app_user_id is the Supabase user id (set as RevenueCat appUserID at login).
  // Anonymous RC ids (pre-login) can't be mapped yet — ack and wait for the alias.
  const userId = ev.app_user_id;
  if (!userId || !UUID.test(userId)) {
    return NextResponse.json({ received: true, skipped: "no_user" });
  }

  // Desired status from the event. CANCELLATION keeps access until expiry, so it
  // does NOT downgrade status (a later EXPIRATION flips to expired).
  let status: "active" | "expired" | "in_grace" | "paused" | null = null;
  switch (ev.type) {
    case "EXPIRATION":
      status = "expired";
      break;
    case "BILLING_ISSUE":
      status = "in_grace";
      break;
    case "SUBSCRIPTION_PAUSED":
      status = "paused";
      break;
    case "CANCELLATION":
      status = null; // keep current access until period end
      break;
    default:
      if (ACTIVE_EVENTS.has(ev.type)) status = "active";
  }

  const sb = serviceClient();
  const { data: existing } = await sb
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Nothing to do: an unmapped event type, or a cancellation with no row.
  if (status === null && !(ev.type === "CANCELLATION" && existing)) {
    return NextResponse.json({ received: true, ignored: ev.type });
  }

  const isPremium = Array.isArray(ev.entitlement_ids) && ev.entitlement_ids.length > 0;
  const fields: Record<string, unknown> = {
    user_id: userId,
    store: mapStore(ev.store),
    product_id: ev.product_id ?? "premium",
    revenuecat_id: userId,
    entitlements: isPremium
      ? { ad_free: true, profile_boost: true, exclusive_spots: true }
      : { ad_free: false, profile_boost: false, exclusive_spots: false },
    current_period_end: ev.expiration_at_ms ? new Date(Number(ev.expiration_at_ms)).toISOString() : null,
    updated_at: new Date().toISOString(),
  };
  if (status) fields.status = status;

  if (existing) {
    const { error } = await sb.from("subscriptions").update(fields).eq("id", existing.id);
    if (error) {
      console.error("[revenuecat/webhook]", error.message);
      return NextResponse.json({ error: "update_failed" }, { status: 500 });
    }
  } else {
    const { error } = await sb.from("subscriptions").insert({ ...fields, status: status ?? "active" });
    if (error) {
      console.error("[revenuecat/webhook]", error.message);
      return NextResponse.json({ error: "insert_failed" }, { status: 500 });
    }
  }

  // The DB trigger recomputes profiles.is_premium from active subscriptions.
  return NextResponse.json({ received: true, type: ev.type, status: status ?? "unchanged" });
}
