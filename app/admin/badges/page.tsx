import { AdminPage } from "@/components/admin/AdminPage";
import { BadgesClient } from "@/components/admin/karma/BadgesClient";
import { getBadgesReadModel } from "@/lib/admin/karma";

export const dynamic = "force-dynamic";

function BadgesState({ message }: { message: string }) {
  return (
    <AdminPage
      title="Gestion des badges"
      eyebrow="récompenses & distinctions ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/karma", label: "Karma" },
        { label: "Badges" },
      ]}
    >
      <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-6 shadow-ink-sm">
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">{message}</p>
      </div>
    </AdminPage>
  );
}

export default async function BadgesPage() {
  const result = await getBadgesReadModel();

  if (result.kind === "unauthenticated")
    return <BadgesState message="Session Supabase manquante. Reconnecte-toi pour ouvrir la console." />;
  if (result.kind === "unauthorized")
    return <BadgesState message="Ce compte n'a pas les droits staff pour gérer les badges." />;
  if (result.kind === "error") return <BadgesState message={result.message} />;

  return <BadgesClient badges={result.data} />;
}
