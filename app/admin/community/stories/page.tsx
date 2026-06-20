import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { StoriesClient } from "@/components/admin/community/StoriesClient";
import { getActiveStoriesReadModel } from "@/lib/admin/stories";

export const dynamic = "force-dynamic";

export default async function StoriesPage() {
  const result = await getActiveStoriesReadModel();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Stories actives"
        eyebrow="modération des stories"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/community", label: "Communauté" },
          { label: "Stories" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <StoriesClient stories={result.data} />;
}
