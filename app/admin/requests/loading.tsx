import { AdminPage } from "@/components/admin/AdminPage";

export default function Loading() {
  return (
    <AdminPage title="Demandes" eyebrow="les plis envoyés" breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Demandes" }]}>
      <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-6 shadow-ink-sm">
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">Chargement des données…</p>
      </div>
    </AdminPage>
  );
}
