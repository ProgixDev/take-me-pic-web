"use client";

import { AdminPage } from "@/components/admin/AdminPage";
import { SettingsNav } from "@/components/admin/SettingsNav";
import { Avatar, Badge, PaperCard, Stamp } from "@/components/ui";
import type { StaffRosterEntry } from "@/lib/admin/users";
import type { StaffRole } from "@/lib/admin/auth";

const ROLE_META: Record<StaffRole, { label: string; tone: "red" | "blue" | "gold"; description: string }> = {
  super_admin: {
    label: "Super admin",
    tone: "red",
    description: "Accès staff complet. Réservé aux fondateurs et responsables techniques.",
  },
  admin: {
    label: "Admin",
    tone: "gold",
    description: "Opérations confiance & sécurité : modération, bans, journal d'audit.",
  },
  moderator: {
    label: "Modérateur",
    tone: "blue",
    description: "Traitement des signalements et inspection support.",
  },
};

const SHARED_CAPABILITIES = [
  "Lire les signalements, bans et journal d'audit",
  "Résoudre ou ignorer un signalement (audité)",
  "Bannir / lever un ban (audité)",
  "Consulter les profils et l'inspection support",
];

export function RolesClient({ roster }: { roster: StaffRosterEntry[] }) {
  const roles: StaffRole[] = ["super_admin", "admin", "moderator"];

  return (
    <AdminPage
      title="Rôles & permissions"
      eyebrow="accès admin ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/settings", label: "Paramètres" },
        { label: "Rôles & permissions" },
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
          <PaperCard shadow="soft" className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
                  État réel des accès
                </div>
                <h2 className="font-[family-name:var(--font-serif)] font-bold text-xl mt-0.5">Rôles staff</h2>
              </div>
              <Stamp color="blue" shape="rect" size={50} rotate={3} fontSize={9}>
                Rôles
              </Stamp>
            </div>
            <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded mb-4">
              Les rôles sont attribués en base (<code className="font-[family-name:var(--font-mono)] text-[12px]">user_roles</code>)
              et vérifiés côté serveur. Dans la phase actuelle, les trois rôles staff partagent les mêmes
              capacités effectives ; l&apos;attribution se fait par mutation auditée côté backend.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {roles.map((role) => {
                const members = roster.filter((entry) => entry.role === role);
                const meta = ROLE_META[role];
                return (
                  <div key={role} className="bg-paper border border-[var(--ink-line)] rounded-[4px] p-4">
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                    <div className="font-[family-name:var(--font-serif)] font-extrabold text-2xl mt-2">
                      {members.length}
                    </div>
                    <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded mt-1">
                      {meta.description}
                    </p>
                    {members.length > 0 && (
                      <div className="flex -space-x-2 mt-3">
                        {members.slice(0, 5).map((entry) => (
                          <Avatar key={entry.userId} src={entry.profile?.avatarUrl ?? undefined} size={26} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </PaperCard>

          <PaperCard shadow="soft" className="p-6">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-3">
              Capacités effectives (phase actuelle)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SHARED_CAPABILITIES.map((capability) => (
                <div
                  key={capability}
                  className="flex items-center gap-3 p-3 rounded-[4px] bg-paper border border-[var(--ink-line)]"
                >
                  <span className="text-stamp-green">✓</span>
                  <span className="font-[family-name:var(--font-serif)] text-[13px]">{capability}</span>
                </div>
              ))}
            </div>
            <p className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded mt-4">
              Une matrice de permissions par rôle nécessitera des capacités différenciées côté backend avant
              d&apos;être éditable ici.
            </p>
          </PaperCard>
        </div>
      </div>
    </AdminPage>
  );
}
