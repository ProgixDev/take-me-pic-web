import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { SessionsClient } from "@/components/admin/support/SessionsClient";
import { getSessionsReadModel } from "@/lib/admin/support";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const result = await getSessionsReadModel();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Sessions photo"
        eyebrow="les rencontres"
        breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Sessions" }]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <SessionsClient sessions={result.data} />;
}
