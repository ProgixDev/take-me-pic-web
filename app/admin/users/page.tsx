import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { UsersClient } from "@/components/admin/users/UsersClient";
import { getUsersReadModel } from "@/lib/admin/users";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const result = await getUsersReadModel();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Utilisateurs"
        eyebrow="les voyageurs"
        breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Utilisateurs" }]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <UsersClient users={result.data} />;
}
