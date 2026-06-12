import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { UserDetailClient } from "@/components/admin/users/UserDetailClient";
import { getUserReputation } from "@/lib/admin/reputation";
import { getUserDetailReadModel } from "@/lib/admin/users";

export const dynamic = "force-dynamic";

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [result, reputation] = await Promise.all([
    getUserDetailReadModel(id),
    getUserReputation(id),
  ]);

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

  return <UserDetailClient user={result.data} reputation={reputation} />;
}
