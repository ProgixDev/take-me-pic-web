import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { RefundsClient } from "@/components/admin/payments/RefundsClient";
import { getRefundsReadModel } from "@/lib/admin/payments";

export const dynamic = "force-dynamic";

const NOT_CONFIGURED = "Stripe n'est pas configuré (STRIPE_SECRET_KEY absent). Les remboursements apparaîtront une fois la clé en place.";

export default async function RefundsPage() {
  const result = await getRefundsReadModel();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Remboursements"
        eyebrow="remboursements Stripe"
        breadcrumb={[{ href: "/admin", label: "Admin" }, { href: "/admin/payments", label: "Paiements" }, { label: "Remboursements" }]}
        message={result.kind === "not_configured" ? NOT_CONFIGURED : queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <RefundsClient refunds={result.data} />;
}
