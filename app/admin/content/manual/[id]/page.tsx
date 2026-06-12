import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { ManualDetailClient } from "@/components/admin/content/ManualDetailClient";
import { getManualTipDetail } from "@/lib/admin/content";

export const dynamic = "force-dynamic";

export default async function ManualTipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getManualTipDetail(Number(id));

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Secret du manuel"
        eyebrow="éditeur du manuel"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/content", label: "Contenu" },
          { href: "/admin/content/manual", label: "Manuel" },
          { label: `Secret #${id}` },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <ManualDetailClient tip={result.data} />;
}
