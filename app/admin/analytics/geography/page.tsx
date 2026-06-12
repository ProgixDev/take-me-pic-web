import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { GeographyClient } from "@/components/admin/analytics/GeographyClient";
import { getAnalyticsOverview } from "@/lib/admin/analytics";

export const dynamic = "force-dynamic";

export default async function GeographyPage() {
  const result = await getAnalyticsOverview();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Géographie"
        eyebrow="où voyage la communauté ✦"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/analytics", label: "Analytics" },
          { label: "Géographie" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <GeographyClient overview={result.data} />;
}
