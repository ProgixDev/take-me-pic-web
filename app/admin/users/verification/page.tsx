import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { VerificationQueueClient } from "@/components/admin/users/VerificationQueueClient";
import { getVerificationQueue } from "@/lib/admin/users";

export const dynamic = "force-dynamic";

export default async function VerificationQueuePage() {
  const result = await getVerificationQueue();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="File de vérification"
        eyebrow="confiance & identité"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/users", label: "Utilisateurs" },
          { label: "Vérification" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <VerificationQueueClient queue={result.data} />;
}
