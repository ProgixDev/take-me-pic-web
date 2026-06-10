import { AdminPage } from "@/components/admin/AdminPage";
import { BlockedClient } from "@/components/admin/moderation/BlockedClient";
import { getBansReadModel } from "@/lib/admin/moderation";

export const dynamic = "force-dynamic";

function BlockedState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <AdminPage
      title={title}
      eyebrow="liste noire & suspensions ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/moderation", label: "Modération" },
        { label: "Bloqués" },
      ]}
    >
      <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-6 shadow-ink-sm">
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">{message}</p>
      </div>
    </AdminPage>
  );
}

export default async function BlockedPage() {
  const result = await getBansReadModel();

  if (result.kind === "unauthenticated") {
    return <BlockedState title="Utilisateurs bloqués" message="Session Supabase manquante. Reconnecte-toi pour ouvrir la console." />;
  }

  if (result.kind === "unauthorized") {
    return <BlockedState title="Utilisateurs bloqués" message="Ce compte n'a pas les droits staff pour lire les bans." />;
  }

  if (result.kind === "error") {
    return <BlockedState title="Utilisateurs bloqués" message={result.message} />;
  }

  return <BlockedClient bans={result.data} />;
}
