import { AdminPage } from "@/components/admin/AdminPage";

export default function Loading() {
  return (
    <AdminPage title="Paramètres" eyebrow="la régie" breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Paramètres" }]}>
      <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-6 shadow-ink-sm">
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">Chargement des données…</p>
      </div>
    </AdminPage>
  );
}
