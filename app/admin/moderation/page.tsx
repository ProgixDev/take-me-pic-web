import { AdminPage } from "@/components/admin/AdminPage";
import { ModerationOverviewClient } from "@/components/admin/moderation/ModerationOverviewClient";
import { getModerationOverview } from "@/lib/admin/moderation";

export const dynamic = "force-dynamic";

function ModerationState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <AdminPage title={title} eyebrow="confiance & sécurité ✦" breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Modération" }]}>
      <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-6 shadow-ink-sm">
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">{message}</p>
      </div>
    </AdminPage>
  );
}

export default async function ModerationPage() {
  const result = await getModerationOverview();

  if (result.kind === "unauthenticated") {
    return <ModerationState title="Modération" message="Session Supabase manquante. Reconnecte-toi pour ouvrir la console." />;
  }

  if (result.kind === "unauthorized") {
    return <ModerationState title="Modération" message="Ce compte n'a pas les droits staff pour lire la modération." />;
  }

  if (result.kind === "error") {
    return <ModerationState title="Modération" message={result.message} />;
  }

  return <ModerationOverviewClient reports={result.data.reports} counts={result.data.counts} />;
}
