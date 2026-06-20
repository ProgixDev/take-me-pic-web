import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { AppealsClient } from "@/components/admin/moderation/AppealsClient";
import { getAppealsReadModel } from "@/lib/admin/moderation";

export const dynamic = "force-dynamic";

export default async function AppealsPage() {
  const result = await getAppealsReadModel();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Appels de bannissement"
        eyebrow="révision des sanctions"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/moderation", label: "Modération" },
          { label: "Appels" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <AppealsClient appeals={result.data} />;
}
