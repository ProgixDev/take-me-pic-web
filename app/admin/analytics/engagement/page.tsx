import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { EngagementClient } from "@/components/admin/analytics/EngagementClient";
import { getAnalyticsOverview } from "@/lib/admin/analytics";

export const dynamic = "force-dynamic";

export default async function EngagementPage() {
  const result = await getAnalyticsOverview();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Engagement"
        eyebrow="activité & habitudes ✦"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/analytics", label: "Analytics" },
          { label: "Engagement" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <EngagementClient overview={result.data} />;
}
