import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { PremiumDetailClient } from "@/components/admin/premium/PremiumDetailClient";
import { getSubscription } from "@/lib/admin/subscriptions-actions";

export const dynamic = "force-dynamic";

export default async function PremiumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getSubscription(Number(id));

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Détail abonnement"
        eyebrow="détail abonnement"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/premium", label: "Premium" },
          { label: "Abonnement" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <PremiumDetailClient sub={result.data} />;
}
