import { AdminPage } from "@/components/admin/AdminPage";
import { AuditLogClient } from "@/components/admin/moderation/AuditLogClient";
import { getAuditLogReadModel } from "@/lib/admin/moderation";

export const dynamic = "force-dynamic";

function AuditLogState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <AdminPage
      title={title}
      eyebrow="traçabilité & sécurité"
      breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Journal d'audit" }]}
    >
      <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-6 shadow-ink-sm">
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">{message}</p>
      </div>
    </AdminPage>
  );
}

export default async function AuditLogPage() {
  const result = await getAuditLogReadModel();

  if (result.kind === "unauthenticated") {
    return <AuditLogState title="Journal d'audit" message="Session Supabase manquante. Reconnecte-toi pour ouvrir la console." />;
  }

  if (result.kind === "unauthorized") {
    return <AuditLogState title="Journal d'audit" message="Ce compte n'a pas les droits staff pour lire le journal d'audit." />;
  }

  if (result.kind === "error") {
    return <AuditLogState title="Journal d'audit" message={result.message} />;
  }

  return <AuditLogClient entries={result.data} />;
}
