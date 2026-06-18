import { AdminPage } from "@/components/admin/AdminPage";
import { KarmaDashboardClient } from "@/components/admin/karma/KarmaDashboardClient";
import { getBadgesReadModel, getKarmaDashboard, getLeaderboardReadModel } from "@/lib/admin/karma";

export const dynamic = "force-dynamic";

function KarmaState({ message }: { message: string }) {
  return (
    <AdminPage
      title="Tableau de bord Karma"
      eyebrow="économie de l'entraide ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { label: "Karma" },
      ]}
    >
      <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-6 shadow-ink-sm">
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">{message}</p>
      </div>
    </AdminPage>
  );
}

export default async function KarmaPage() {
  const [dashboard, badges, leaderboard] = await Promise.all([
    getKarmaDashboard(),
    getBadgesReadModel(),
    getLeaderboardReadModel(),
  ]);

  const first = [dashboard, badges, leaderboard].find((r) => r.kind !== "ok");
  if (first && first.kind === "unauthenticated")
    return <KarmaState message="Session Supabase manquante. Reconnecte-toi pour ouvrir la console." />;
  if (first && first.kind === "unauthorized")
    return <KarmaState message="Ce compte n'a pas les droits staff pour lire le karma." />;
  if (first && first.kind === "error") return <KarmaState message={first.message} />;

  // All three are ok past this point.
  const dash = dashboard.kind === "ok" ? dashboard.data : null;
  const badgeRows = badges.kind === "ok" ? badges.data : [];
  const leaderRows = leaderboard.kind === "ok" ? leaderboard.data : [];
  if (!dash) return <KarmaState message="Données de karma indisponibles." />;

  return (
    <KarmaDashboardClient
      dashboard={dash}
      badges={badgeRows}
      topEarners={leaderRows.slice(0, 3)}
      leaderboardCount={leaderRows.length}
    />
  );
}
