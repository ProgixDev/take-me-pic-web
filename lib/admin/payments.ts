import "server-only";

import { requireStaffSession, type ModerationQueryResult } from "@/lib/admin/moderation";
import { getStripe, stripeConfigured } from "@/lib/stripe";

// Stripe handles real-world bookings / B2B only (subscriptions are Apple/Google
// IAP), so these admin views reflect booking charges, their refunds, connect
// payouts and B2B invoices. Every read is env-gated: until STRIPE_SECRET_KEY is
// set the pages render a "non configuré" state rather than fake data.
export type PaymentsResult<T> = ModerationQueryResult<T> | { kind: "not_configured" };

export type AdminCharge = {
  id: string;
  amount: number; // major units
  currency: string;
  status: string;
  description: string | null;
  customerName: string | null;
  customerEmail: string | null;
  cardBrand: string | null;
  cardLast4: string | null;
  refunded: boolean;
  amountRefunded: number;
  receiptUrl: string | null;
  createdAt: string;
};

export type AdminRefund = {
  id: string;
  amount: number;
  currency: string;
  status: string | null;
  reason: string | null;
  chargeId: string | null;
  createdAt: string;
};

export type AdminPayout = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  arrivalDate: string;
  createdAt: string;
};

export type AdminInvoice = {
  id: string;
  number: string | null;
  amountDue: number;
  amountPaid: number;
  currency: string;
  status: string | null;
  customerEmail: string | null;
  hostedInvoiceUrl: string | null;
  createdAt: string;
};

const toMajor = (cents: number | null | undefined): number => (cents ?? 0) / 100;
const toIso = (unixSeconds: number | null | undefined): string =>
  unixSeconds ? new Date(unixSeconds * 1000).toISOString() : "";

async function guard(): Promise<{ kind: "ok" } | { kind: "unauthenticated" } | { kind: "unauthorized" } | { kind: "not_configured" }> {
  const session = await requireStaffSession();
  if (session.kind !== "ok") return { kind: session.kind };
  if (!stripeConfigured() || !getStripe()) return { kind: "not_configured" };
  return { kind: "ok" };
}

function errored(scope: string, e: unknown): { kind: "error"; message: string } {
  console.error(`[admin/payments] ${scope}`, e);
  return { kind: "error", message: "Erreur Stripe — réessaie plus tard." };
}

export async function getPaymentsReadModel(): Promise<PaymentsResult<AdminCharge[]>> {
  const g = await guard();
  if (g.kind !== "ok") return g;
  const stripe = getStripe()!;
  try {
    const res = await stripe.charges.list({ limit: 100 });
    return { kind: "ok", data: res.data.map(mapCharge) };
  } catch (e) {
    return errored("charges.list", e);
  }
}

export async function getPaymentDetail(chargeId: string): Promise<PaymentsResult<AdminCharge> | { kind: "not_found" }> {
  const g = await guard();
  if (g.kind !== "ok") return g;
  const stripe = getStripe()!;
  try {
    const charge = await stripe.charges.retrieve(chargeId);
    return { kind: "ok", data: mapCharge(charge) };
  } catch (e) {
    if ((e as { statusCode?: number })?.statusCode === 404) return { kind: "not_found" };
    return errored("charges.retrieve", e);
  }
}

export async function getRefundsReadModel(): Promise<PaymentsResult<AdminRefund[]>> {
  const g = await guard();
  if (g.kind !== "ok") return g;
  const stripe = getStripe()!;
  try {
    const res = await stripe.refunds.list({ limit: 100 });
    return {
      kind: "ok",
      data: res.data.map((r) => ({
        id: r.id,
        amount: toMajor(r.amount),
        currency: (r.currency ?? "eur").toUpperCase(),
        status: r.status ?? null,
        reason: r.reason ?? null,
        chargeId: typeof r.charge === "string" ? r.charge : (r.charge?.id ?? null),
        createdAt: toIso(r.created),
      })),
    };
  } catch (e) {
    return errored("refunds.list", e);
  }
}

export async function getPayoutsReadModel(): Promise<PaymentsResult<AdminPayout[]>> {
  const g = await guard();
  if (g.kind !== "ok") return g;
  const stripe = getStripe()!;
  try {
    const res = await stripe.payouts.list({ limit: 100 });
    return {
      kind: "ok",
      data: res.data.map((p) => ({
        id: p.id,
        amount: toMajor(p.amount),
        currency: (p.currency ?? "eur").toUpperCase(),
        status: p.status,
        method: p.method,
        arrivalDate: toIso(p.arrival_date),
        createdAt: toIso(p.created),
      })),
    };
  } catch (e) {
    return errored("payouts.list", e);
  }
}

export async function getInvoicesReadModel(): Promise<PaymentsResult<AdminInvoice[]>> {
  const g = await guard();
  if (g.kind !== "ok") return g;
  const stripe = getStripe()!;
  try {
    const res = await stripe.invoices.list({ limit: 100 });
    return {
      kind: "ok",
      data: res.data.map((inv) => ({
        id: inv.id ?? "",
        number: inv.number ?? null,
        amountDue: toMajor(inv.amount_due),
        amountPaid: toMajor(inv.amount_paid),
        currency: (inv.currency ?? "eur").toUpperCase(),
        status: inv.status ?? null,
        customerEmail: inv.customer_email ?? null,
        hostedInvoiceUrl: inv.hosted_invoice_url ?? null,
        createdAt: toIso(inv.created),
      })),
    };
  } catch (e) {
    return errored("invoices.list", e);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCharge(c: any): AdminCharge {
  const card = c.payment_method_details?.card;
  return {
    id: c.id,
    amount: toMajor(c.amount),
    currency: (c.currency ?? "eur").toUpperCase(),
    status: c.status,
    description: c.description ?? null,
    customerName: c.billing_details?.name ?? null,
    customerEmail: c.billing_details?.email ?? c.receipt_email ?? null,
    cardBrand: card?.brand ?? null,
    cardLast4: card?.last4 ?? null,
    refunded: Boolean(c.refunded),
    amountRefunded: toMajor(c.amount_refunded),
    receiptUrl: c.receipt_url ?? null,
    createdAt: toIso(c.created),
  };
}
