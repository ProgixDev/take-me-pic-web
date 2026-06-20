import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { PaymentsClient } from "@/components/admin/payments/PaymentsClient";
import { getPaymentsReadModel } from "@/lib/admin/payments";

export const dynamic = "force-dynamic";

const NOT_CONFIGURED = "Stripe n'est pas configuré (STRIPE_SECRET_KEY absent). Les paiements apparaîtront une fois la clé en place.";

export default async function PaymentsPage() {
  const result = await getPaymentsReadModel();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Paiements"
        eyebrow="transactions Stripe"
        breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Paiements" }]}
        message={result.kind === "not_configured" ? NOT_CONFIGURED : queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <PaymentsClient charges={result.data} />;
}
