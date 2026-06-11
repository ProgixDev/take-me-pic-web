import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { CommentsClient } from "@/components/admin/community/CommentsClient";
import { getCommunityCommentsReadModel } from "@/lib/admin/community";

export const dynamic = "force-dynamic";

export default async function CommentsPage() {
  const result = await getCommunityCommentsReadModel();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Commentaires"
        eyebrow="modération"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/community", label: "Communauté" },
          { label: "Commentaires" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <CommentsClient comments={result.data} />;
}
