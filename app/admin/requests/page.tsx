import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { RequestsClient } from "@/components/admin/support/RequestsClient";
import { getHelpRequestsReadModel } from "@/lib/admin/support";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const result = await getHelpRequestsReadModel();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Demandes photo"
        eyebrow="les plis envoyés"
        breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Demandes" }]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <RequestsClient requests={result.data} />;
}
