import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { RetentionClient } from "@/components/admin/analytics/RetentionClient";
import { getRetentionReadModel } from "@/lib/admin/retention";

export const dynamic = "force-dynamic";

export default async function RetentionPage() {
  const result = await getRetentionReadModel();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Rétention"
        eyebrow="fidélité & engagement"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/analytics", label: "Analytics" },
          { label: "Rétention" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <RetentionClient model={result.data} />;
}
