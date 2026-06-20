import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { UserEditClient } from "@/components/admin/users/UserEditClient";
import { getUserDetailReadModel } from "@/lib/admin/users";

export const dynamic = "force-dynamic";

export default async function UserEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getUserDetailReadModel(id);

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Modifier le profil"
        eyebrow="édition du profil"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/users", label: "Utilisateurs" },
          { label: "Modifier" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <UserEditClient user={result.data} />;
}
