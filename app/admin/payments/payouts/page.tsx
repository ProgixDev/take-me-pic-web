import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { PayoutsClient } from "@/components/admin/payments/PayoutsClient";
import { getPayoutsReadModel } from "@/lib/admin/payments";

export const dynamic = "force-dynamic";

const NOT_CONFIGURED = "Stripe n'est pas configuré (STRIPE_SECRET_KEY absent). Les versements apparaîtront une fois la clé en place.";

export default async function PayoutsPage() {
  const result = await getPayoutsReadModel();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Versements"
        eyebrow="payouts Stripe"
        breadcrumb={[{ href: "/admin", label: "Admin" }, { href: "/admin/payments", label: "Paiements" }, { label: "Versements" }]}
        message={result.kind === "not_configured" ? NOT_CONFIGURED : queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <PayoutsClient payouts={result.data} />;
}
