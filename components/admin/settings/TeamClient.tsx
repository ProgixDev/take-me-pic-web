"use client";

import { AdminPage } from "@/components/admin/AdminPage";
import { SettingsNav } from "@/components/admin/SettingsNav";
import { Avatar, Badge, DataTable, PaperCard, Stamp, type Column } from "@/components/ui";
import type { StaffRosterEntry } from "@/lib/admin/users";
import type { StaffRole } from "@/lib/admin/auth";

const ROLE_LABEL: Record<StaffRole, string> = {
  super_admin: "Super admin",
  admin: "Admin",
  moderator: "Modérateur",
};

const ROLE_TONE: Record<StaffRole, "red" | "gold" | "blue"> = {
  super_admin: "red",
  admin: "gold",
  moderator: "blue",
};

const columns: Column<StaffRosterEntry>[] = [
  {
    key: "member",
    header: "Membre",
    cell: (row) => (
      <span className="flex items-center gap-3">
        <Avatar src={row.profile?.avatarUrl ?? undefined} size={36} />
        <span className="flex flex-col">
          <span className="font-semibold text-[13px]">
            {row.profile ? [row.profile.firstName, row.profile.lastName].filter(Boolean).join(" ") : "Profil supprimé"}
          </span>
          <span className="text-[11px] text-ink-faded font-[family-name:var(--font-type)]">
            {row.profile?.username ?? row.userId.slice(0, 8)}
          </span>
        </span>
      </span>
    ),
    sortValue: (row) => row.profile?.username ?? "",
  },
  {
    key: "role",
    header: "Rôle",
    cell: (row) => <Badge tone={ROLE_TONE[row.role]}>{ROLE_LABEL[row.role]}</Badge>,
    sortValue: (row) => row.role,
  },
  {
    key: "grantedBy",
    header: "Attribué par",
    cell: (row) => (
      <span className="font-[family-name:var(--font-serif)] text-[13px]">
        {row.grantedBy ? row.grantedBy.username : "—"}
      </span>
    ),
    sortValue: (row) => row.grantedBy?.username ?? "",
  },
  {
    key: "grantedAt",
    header: "Depuis",
    cell: (row) => (
      <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">{row.grantedAt}</span>
    ),
    sortValue: (row) => row.grantedAt,
  },
];

export function TeamClient({ roster }: { roster: StaffRosterEntry[] }) {
  return (
    <AdminPage
      title="Équipe admin"
      eyebrow="les gardiens ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/settings", label: "Paramètres" },
        { label: "Équipe admin" },
      ]}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-52 shrink-0">
          <PaperCard shadow="soft" className="p-3">
            <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.12em] text-ink-faded px-3 pb-2">
              Sections
            </div>
            <SettingsNav />
          </PaperCard>
        </aside>

        <div className="flex-1 min-w-0 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(ROLE_LABEL) as StaffRole[]).map((role) => (
              <div key={role} className="bg-card border-[1.5px] border-ink rounded-[4px] p-3 shadow-ink-sm">
                <Badge tone={ROLE_TONE[role]} className="mb-2">
                  {ROLE_LABEL[role]}
                </Badge>
                <div className="font-[family-name:var(--font-serif)] font-extrabold text-2xl">
                  {roster.filter((entry) => entry.role === role).length}
                </div>
              </div>
            ))}
          </div>

          <PaperCard shadow="soft" className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
                  Lecture seule
                </div>
                <h2 className="font-[family-name:var(--font-serif)] font-bold text-xl mt-0.5">
                  Comptes staff ({roster.length})
                </h2>
              </div>
              <Stamp color="green" shape="circle" size={48} rotate={-3} fontSize={9}>
                Équipe
              </Stamp>
            </div>
            <DataTable<StaffRosterEntry>
              columns={columns}
              rows={roster}
              searchable
              searchPlaceholder="rechercher par nom ou pseudo…"
              pageSize={10}
              empty="Aucun compte staff. Attribue un rôle via une mutation backend auditée."
            />
            <p className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded mt-3">
              L&apos;invitation et la révocation passeront par des mutations auditées dédiées.
            </p>
          </PaperCard>
        </div>
      </div>
    </AdminPage>
  );
}
