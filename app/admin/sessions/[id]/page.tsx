import { SessionDetailClient } from "@/components/admin/SessionDetailClient";
import { getSessionConversationSummary } from "@/lib/admin/session-conversations";
import { getSession } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = getSession(id);
  const conversationSummary = await getSessionConversationSummary(session.helpRequestId);

  return (
    <SessionDetailClient
      sessionId={id}
      conversationSummary={conversationSummary}
    />
  );
}
