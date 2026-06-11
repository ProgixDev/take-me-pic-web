import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { TeamClient } from "@/components/admin/settings/TeamClient";
import { getStaffRoster } from "@/lib/admin/users";

export const dynamic = "force-dynamic";

export default async function TeamSettingsPage() {
  const result = await getStaffRoster();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Équipe admin"
        eyebrow="les gardiens ✦"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/settings", label: "Paramètres" },
          { label: "Équipe admin" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <TeamClient roster={result.data} />;
}
