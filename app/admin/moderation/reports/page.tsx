import { AdminPage } from "@/components/admin/AdminPage";
import { ReportsClient } from "@/components/admin/moderation/ReportsClient";
import { getReportsReadModel } from "@/lib/admin/moderation";

export const dynamic = "force-dynamic";

function ReportsState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <AdminPage
      title={title}
      eyebrow="tableau de bord des signalements ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/moderation", label: "Modération" },
        { label: "Signalements" },
      ]}
    >
      <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-6 shadow-ink-sm">
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">{message}</p>
      </div>
    </AdminPage>
  );
}

export default async function ReportsPage() {
  const result = await getReportsReadModel();

  if (result.kind === "unauthenticated") {
    return <ReportsState title="Signalements" message="Session Supabase manquante. Reconnecte-toi pour ouvrir la console." />;
  }

  if (result.kind === "unauthorized") {
    return <ReportsState title="Signalements" message="Ce compte n'a pas les droits staff pour lire les signalements." />;
  }

  if (result.kind === "error") {
    return <ReportsState title="Signalements" message={result.message} />;
  }

  return <ReportsClient reports={result.data} />;
}
