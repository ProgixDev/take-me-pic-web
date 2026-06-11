import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { SpotsClient } from "@/components/admin/spots/SpotsClient";
import { getSpotsReadModel } from "@/lib/admin/spots";

export const dynamic = "force-dynamic";

export default async function SpotsPage() {
  const result = await getSpotsReadModel();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Spots photo"
        eyebrow="les meilleurs endroits"
        breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Spots" }]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <SpotsClient spots={result.data} />;
}
