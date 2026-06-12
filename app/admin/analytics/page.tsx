import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { OverviewClient } from "@/components/admin/analytics/OverviewClient";
import { getAnalyticsOverview } from "@/lib/admin/analytics";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const result = await getAnalyticsOverview();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Analytics"
        eyebrow="données & insights ✦"
        breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Analytics" }]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <OverviewClient overview={result.data} />;
}
