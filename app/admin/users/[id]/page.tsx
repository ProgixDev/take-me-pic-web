import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { UserDetailClient } from "@/components/admin/users/UserDetailClient";
import { getUserDetailReadModel } from "@/lib/admin/users";

export const dynamic = "force-dynamic";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getUserDetailReadModel(id);

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Profil utilisateur"
        eyebrow="profil utilisateur"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/users", label: "Utilisateurs" },
          { label: "Profil" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <UserDetailClient user={result.data} />;
}
