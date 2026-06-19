import Stripe from "stripe";

// Stripe is used ONLY for real-world bookings (and B2B), never for digital
// subscriptions (those go through Apple/Google IAP — App Store 3.1.1). The client
// is null until STRIPE_SECRET_KEY is set, so every Stripe path is env-gated and
// the app degrades to intent-only until keys land.
let cached: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  // apiVersion omitted on purpose → uses the account's default, avoiding a pinned
  // literal that drifts with the SDK types.
  cached = key ? new Stripe(key, { typescript: true, appInfo: { name: "take-me-pic" } }) : null;
  return cached;
}

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
