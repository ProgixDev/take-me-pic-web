import { AdminPage } from "@/components/admin/AdminPage";
import { LeaderboardClient } from "@/components/admin/karma/LeaderboardClient";
import { getLeaderboardReadModel } from "@/lib/admin/karma";

export const dynamic = "force-dynamic";

function LeaderboardState({ message }: { message: string }) {
  return (
    <AdminPage
      title="Tableau d'honneur"
      eyebrow="les meilleurs de la communauté ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/karma", label: "Karma" },
        { label: "Classement" },
      ]}
    >
      <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-6 shadow-ink-sm">
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">{message}</p>
      </div>
    </AdminPage>
  );
}

export default async function LeaderboardPage() {
  const result = await getLeaderboardReadModel();

  if (result.kind === "unauthenticated")
    return <LeaderboardState message="Session Supabase manquante. Reconnecte-toi pour ouvrir la console." />;
  if (result.kind === "unauthorized")
    return <LeaderboardState message="Ce compte n'a pas les droits staff pour lire le classement." />;
  if (result.kind === "error") return <LeaderboardState message={result.message} />;

  return <LeaderboardClient rows={result.data} />;
}
