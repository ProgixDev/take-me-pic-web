import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { HelpRequestDetailClient } from "@/components/admin/support/HelpRequestDetailClient";
import { getSessionRatings } from "@/lib/admin/reputation";
import { getHelpRequestDetailReadModel } from "@/lib/admin/support";

export const dynamic = "force-dynamic";

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [result, ratings] = await Promise.all([
    getHelpRequestDetailReadModel(Number(id)),
    getSessionRatings(Number(id)),
  ]);

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Demande photo"
        eyebrow="revue de demande"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/requests", label: "Demandes" },
          { label: `#${id}` },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <HelpRequestDetailClient detail={result.data} variant="request" ratings={ratings} />;
}
