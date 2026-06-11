import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { PostDetailClient } from "@/components/admin/community/PostDetailClient";
import { getCommunityPostDetail } from "@/lib/admin/community";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getCommunityPostDetail(Number(id));

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Détail publication"
        eyebrow="modération"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/community", label: "Communauté" },
          { href: "/admin/community/posts", label: "Publications" },
          { label: `Post #${id}` },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <PostDetailClient detail={result.data} />;
}
