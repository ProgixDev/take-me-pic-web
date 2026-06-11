import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { HelpRequestDetailClient } from "@/components/admin/support/HelpRequestDetailClient";
import { getHelpRequestDetailReadModel } from "@/lib/admin/support";

export const dynamic = "force-dynamic";

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getHelpRequestDetailReadModel(Number(id));

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Session photo"
        eyebrow="revue de session"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/sessions", label: "Sessions" },
          { label: `#${id}` },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <HelpRequestDetailClient detail={result.data} variant="session" />;
}
