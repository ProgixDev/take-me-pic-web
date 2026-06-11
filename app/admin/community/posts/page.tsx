import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { PostsClient } from "@/components/admin/community/PostsClient";
import { getCommunityPostsReadModel } from "@/lib/admin/community";

export const dynamic = "force-dynamic";

export default async function PostsModerationPage() {
  const result = await getCommunityPostsReadModel();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Publications communauté"
        eyebrow="modération des posts"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/community", label: "Communauté" },
          { label: "Publications" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <PostsClient posts={result.data} />;
}
