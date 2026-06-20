import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { SupportTicketDetailClient } from "@/components/admin/support/SupportTicketDetailClient";
import { getSupportTicketDetailReadModel } from "@/lib/admin/support-tickets";

export const dynamic = "force-dynamic";

export default async function SupportTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getSupportTicketDetailReadModel(Number(id));

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Ticket de support"
        eyebrow="ticket"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/support", label: "Support" },
          { label: "Ticket" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <SupportTicketDetailClient ticket={result.data} />;
}
