import { AdminPage } from "@/components/admin/AdminPage";

type Breadcrumb = { href?: string; label: string };

const KIND_MESSAGES: Record<string, string> = {
  unauthenticated: "Session Supabase manquante. Reconnecte-toi pour ouvrir la console.",
  unauthorized: "Ce compte n'a pas les droits staff pour consulter cette page.",
  not_found: "Cet enregistrement est introuvable.",
};

export function queryStateMessage(kind: string, errorMessage?: string) {
  return KIND_MESSAGES[kind] ?? errorMessage ?? "Le chargement a échoué.";
}

export function AdminQueryState({
  title,
  eyebrow,
  breadcrumb,
  message,
}: {
  title: string;
  eyebrow: string;
  breadcrumb: Breadcrumb[];
  message: string;
}) {
  return (
    <AdminPage title={title} eyebrow={eyebrow} breadcrumb={breadcrumb}>
      <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-6 shadow-ink-sm">
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">{message}</p>
      </div>
    </AdminPage>
  );
}
