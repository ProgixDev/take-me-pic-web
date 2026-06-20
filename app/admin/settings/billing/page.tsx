import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { InvoicesClient } from "@/components/admin/payments/InvoicesClient";
import { getInvoicesReadModel } from "@/lib/admin/payments";

export const dynamic = "force-dynamic";

const NOT_CONFIGURED = "Stripe n'est pas configuré (STRIPE_SECRET_KEY absent). Les factures apparaîtront une fois la clé en place.";

export default async function BillingPage() {
  const result = await getInvoicesReadModel();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Facturation"
        eyebrow="factures Stripe"
        breadcrumb={[{ href: "/admin", label: "Admin" }, { href: "/admin/settings", label: "Réglages" }, { label: "Facturation" }]}
        message={result.kind === "not_configured" ? NOT_CONFIGURED : queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <InvoicesClient invoices={result.data} />;
}
