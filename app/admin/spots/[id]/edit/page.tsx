import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { SpotEditClient } from "@/components/admin/spots/SpotEditClient";
import { getSpotDetail } from "@/lib/admin/spots";

export const dynamic = "force-dynamic";

export default async function SpotEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getSpotDetail(Number(id));

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Modifier le spot"
        eyebrow="édition du spot"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/spots", label: "Spots" },
          { label: "Modifier" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <SpotEditClient detail={result.data} />;
}
