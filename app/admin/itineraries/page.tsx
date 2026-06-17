import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { ItinerariesClient } from "@/components/admin/itineraries/ItinerariesClient";
import { getTemplates } from "@/lib/admin/itinerary-templates-actions";

export const dynamic = "force-dynamic";

export default async function ItinerariesPage() {
  const result = await getTemplates();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Itinéraires"
        eyebrow="curation de modèles"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { label: "Itinéraires" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <ItinerariesClient templates={result.data} />;
}
