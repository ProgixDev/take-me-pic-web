import { AdminPage } from "@/components/admin/AdminPage";
import { KarmaRulesClient } from "@/components/admin/karma/KarmaRulesClient";
import { getKarmaRules } from "@/lib/admin/karma";

export const dynamic = "force-dynamic";

function RulesState({ message }: { message: string }) {
  return (
    <AdminPage
      title="Règles de karma"
      eyebrow="éditeur des règles d'attribution ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/karma", label: "Karma" },
        { label: "Règles" },
      ]}
    >
      <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-6 shadow-ink-sm">
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">{message}</p>
      </div>
    </AdminPage>
  );
}

export default async function KarmaRulesPage() {
  const result = await getKarmaRules();

  if (result.kind === "unauthenticated")
    return <RulesState message="Session Supabase manquante. Reconnecte-toi pour ouvrir la console." />;
  if (result.kind === "unauthorized")
    return <RulesState message="Ce compte n'a pas les droits staff pour éditer les règles." />;
  if (result.kind === "error") return <RulesState message={result.message} />;

  return <KarmaRulesClient rules={result.data} />;
}
