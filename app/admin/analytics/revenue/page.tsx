import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { RevenueClient } from "@/components/admin/analytics/RevenueClient";
import { getAnalyticsOverview } from "@/lib/admin/analytics";

export const dynamic = "force-dynamic";

export default async function RevenuePage() {
  const result = await getAnalyticsOverview();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Revenus"
        eyebrow="la caisse enregistreuse ✦"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/analytics", label: "Analytics" },
          { label: "Revenus" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <RevenueClient overview={result.data} />;
}
