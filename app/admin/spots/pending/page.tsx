import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { PendingSpotsClient } from "@/components/admin/spots/PendingSpotsClient";
import { getPendingSpotsReadModel } from "@/lib/admin/spots";

export const dynamic = "force-dynamic";

export default async function PendingSpotsPage() {
  const result = await getPendingSpotsReadModel();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="File d'attente — Spots"
        eyebrow="en attente de validation"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/spots", label: "Spots" },
          { label: "En attente" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <PendingSpotsClient spots={result.data} />;
}
