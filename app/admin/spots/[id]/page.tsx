import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { SpotDetailClient } from "@/components/admin/spots/SpotDetailClient";
import { getSpotDetail } from "@/lib/admin/spots";

export const dynamic = "force-dynamic";

export default async function SpotDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getSpotDetail(Number(id));

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Détail du spot"
        eyebrow="détail du spot"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/spots", label: "Spots" },
          { label: `Spot #${id}` },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <SpotDetailClient detail={result.data} />;
}
