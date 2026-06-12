import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { ComposeClient } from "@/components/admin/notifications/ComposeClient";
import { requireStaffSession } from "@/lib/admin/moderation";

export const dynamic = "force-dynamic";

export default async function NewNotificationPage() {
  const guard = await requireStaffSession();

  if (guard.kind !== "ok") {
    return (
      <AdminQueryState
        title="Composer une notification"
        eyebrow="envoi individuel"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/notifications", label: "Notifications" },
          { label: "Nouvelle" },
        ]}
        message={queryStateMessage(guard.kind)}
      />
    );
  }

  return <ComposeClient />;
}
