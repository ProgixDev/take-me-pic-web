import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { PremiumClient } from "@/components/admin/premium/PremiumClient";
import { getSubscriptions } from "@/lib/admin/subscriptions-actions";

export const dynamic = "force-dynamic";

export default async function PremiumPage() {
  const result = await getSubscriptions();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Abonnements Premium"
        eyebrow="première classe ✦"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { label: "Premium" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <PremiumClient subscriptions={result.data} />;
}
