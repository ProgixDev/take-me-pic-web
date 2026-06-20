import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { SupportClient } from "@/components/admin/support/SupportClient";
import { getSupportTicketsReadModel } from "@/lib/admin/support-tickets";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const result = await getSupportTicketsReadModel();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Support"
        eyebrow="tickets & demandes"
        breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Support" }]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <SupportClient tickets={result.data} />;
}
