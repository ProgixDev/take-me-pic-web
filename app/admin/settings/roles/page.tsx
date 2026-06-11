import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { RolesClient } from "@/components/admin/settings/RolesClient";
import { getStaffRoster } from "@/lib/admin/users";

export const dynamic = "force-dynamic";

export default async function RolesSettingsPage() {
  const result = await getStaffRoster();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Rôles & permissions"
        eyebrow="accès admin ✦"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/settings", label: "Paramètres" },
          { label: "Rôles & permissions" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <RolesClient roster={result.data} />;
}
