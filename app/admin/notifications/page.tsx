import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { NotificationsClient } from "@/components/admin/notifications/NotificationsClient";
import { getNotificationsOverview } from "@/lib/admin/notifications";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const result = await getNotificationsOverview();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Centre de notifications"
        eyebrow="alertes & messages"
        breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Notifications" }]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <NotificationsClient overview={result.data} />;
}
