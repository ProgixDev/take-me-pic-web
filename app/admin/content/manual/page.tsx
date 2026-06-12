import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { ManualClient } from "@/components/admin/content/ManualClient";
import { getManualTipsReadModel } from "@/lib/admin/content";

export const dynamic = "force-dynamic";

export default async function ManualPage() {
  const result = await getManualTipsReadModel();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Manuel du voyageur"
        eyebrow="les secrets photo"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/content", label: "Contenu" },
          { label: "Manuel" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <ManualClient tips={result.data} />;
}
