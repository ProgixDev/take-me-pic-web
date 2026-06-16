import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { SponsoredClient } from "@/components/admin/sponsored/SponsoredClient";
import { getCampaigns } from "@/lib/admin/campaigns-actions";

export const dynamic = "force-dynamic";

export default async function SponsoredPage() {
  const result = await getCampaigns();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Campagnes sponsorisées"
        eyebrow="monétisation B2B"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { label: "Sponsorisé" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <SponsoredClient campaigns={result.data} />;
}
