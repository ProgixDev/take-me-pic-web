import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { UsersAnalyticsClient } from "@/components/admin/analytics/UsersAnalyticsClient";
import { getAnalyticsOverview } from "@/lib/admin/analytics";

export const dynamic = "force-dynamic";

export default async function UsersAnalyticsPage() {
  const result = await getAnalyticsOverview();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Analytiques utilisateurs"
        eyebrow="qui voyage avec nous ✦"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/analytics", label: "Analytics" },
          { label: "Utilisateurs" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <UsersAnalyticsClient overview={result.data} />;
}
