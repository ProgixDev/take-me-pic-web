import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { DashboardClient, type DashboardData } from "@/components/admin/DashboardClient";
import { getAnalyticsOverview } from "@/lib/admin/analytics";
import { getModerationOverview, getAuditLogReadModel } from "@/lib/admin/moderation";
import { getVerificationQueue } from "@/lib/admin/users";
import { getPendingSpotsReadModel } from "@/lib/admin/spots";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [overview, moderation, verif, spots, audit] = await Promise.all([
    getAnalyticsOverview(),
    getModerationOverview(),
    getVerificationQueue(),
    getPendingSpotsReadModel(),
    getAuditLogReadModel(),
  ]);

  // Analytics is the core of the dashboard; if it can't load, show the state.
  if (overview.kind !== "ok") {
    return (
      <AdminQueryState
        title="Tableau de bord"
        eyebrow="vue d'ensemble"
        breadcrumb={[{ label: "Admin" }]}
        message={queryStateMessage(overview.kind, overview.kind === "error" ? overview.message : undefined)}
      />
    );
  }

  const data: DashboardData = {
    totals: overview.data.totals,
    revenueCents: overview.data.revenue.bookingsRevenueCents,
    monthly: overview.data.monthly,
    openReports: moderation.kind === "ok" ? moderation.data.counts.open : 0,
    pendingSpots: spots.kind === "ok" ? spots.data.length : 0,
    pendingVerif: verif.kind === "ok" ? verif.data.length : 0,
    recent: audit.kind === "ok" ? audit.data.slice(0, 8) : [],
  };

  return <DashboardClient data={data} />;
}
