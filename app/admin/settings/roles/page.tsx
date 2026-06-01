"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Settings,
  Shield,
  Users,
  UserCheck,
  Key,
  Plug,
  CreditCard,
  Bell,
  Globe,
  Plus,
  Save,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Button,
  PaperCard,
  Badge,
  Input,
  Modal,
  Toggle,
  Stamp,
  useToast,
} from "@/components/ui";

/* ── Sub-nav ─────────────────────────────────────────────────────── */
const SETTINGS_NAV = [
  { href: "/admin/settings", label: "Général", icon: Settings },
  { href: "/admin/settings/security", label: "Sécurité", icon: Shield },
  { href: "/admin/settings/roles", label: "Rôles & permissions", icon: UserCheck },
  { href: "/admin/settings/team", label: "Équipe admin", icon: Users },
  { href: "/admin/settings/api-keys", label: "Clés API", icon: Key },
  { href: "/admin/settings/integrations", label: "Intégrations", icon: Plug },
  { href: "/admin/settings/billing", label: "Facturation", icon: CreditCard },
  { href: "/admin/settings/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/settings/localization", label: "Localisation", icon: Globe },
];

function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-0.5">
      {SETTINGS_NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[4px] font-[family-name:var(--font-serif)] text-[13px] font-semibold transition-all ${
              active ? "bg-ink text-paper-warm shadow-ink-sm" : "text-ink hover:bg-paper-warm"
            }`}
          >
            <Icon size={14} className={active ? "text-gold-light" : "text-ink-faded"} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

/* ── Data ─────────────────────────────────────────────────────────── */
type Permission = {
  key: string;
  label: string;
  category: string;
};

const PERMISSIONS: Permission[] = [
  { key: "view_users", label: "Voir les utilisateurs", category: "Utilisateurs" },
  { key: "edit_users", label: "Modifier les utilisateurs", category: "Utilisateurs" },
  { key: "ban_users", label: "Suspendre / Bannir", category: "Utilisateurs" },
  { key: "view_reports", label: "Voir les signalements", category: "Modération" },
  { key: "resolve_reports", label: "Résoudre les signalements", category: "Modération" },
  { key: "delete_content", label: "Supprimer du contenu", category: "Modération" },
  { key: "view_payments", label: "Voir les paiements", category: "Finances" },
  { key: "refund", label: "Effectuer des remboursements", category: "Finances" },
  { key: "manage_spots", label: "Gérer les spots", category: "Contenu" },
  { key: "publish_content", label: "Publier du contenu", category: "Contenu" },
  { key: "view_analytics", label: "Voir les analytics", category: "Analytics" },
  { key: "export_data", label: "Exporter les données", category: "Analytics" },
  { key: "manage_settings", label: "Modifier les paramètres", category: "Admin" },
  { key: "manage_roles", label: "Gérer les rôles", category: "Admin" },
  { key: "manage_api_keys", label: "Gérer les clés API", category: "Admin" },
];

type Role = {
  id: string;
  name: string;
  tone: "red" | "blue" | "gold" | "green" | "neutral";
  perms: Set<string>;
  members: number;
};

const INIT_ROLES: Role[] = [
  {
    id: "admin",
    name: "Admin",
    tone: "red",
    perms: new Set(PERMISSIONS.map((p) => p.key)),
    members: 2,
  },
  {
    id: "mod",
    name: "Modérateur",
    tone: "blue",
    perms: new Set(["view_users", "edit_users", "ban_users", "view_reports", "resolve_reports", "delete_content", "manage_spots", "view_analytics"]),
    members: 3,
  },
  {
    id: "support",
    name: "Support",
    tone: "gold",
    perms: new Set(["view_users", "view_reports", "view_payments", "view_analytics"]),
    members: 5,
  },
  {
    id: "readonly",
    name: "Lecture seule",
    tone: "neutral",
    perms: new Set(["view_users", "view_reports", "view_payments", "view_analytics"]),
    members: 1,
  },
];

/* ── Page ─────────────────────────────────────────────────────────── */
export default function RolesSettingsPage() {
  const { push } = useToast();
  const [roles, setRoles] = useState<Role[]>(INIT_ROLES);
  const [selectedRole, setSelectedRole] = useState<string>("admin");
  const [showCreate, setShowCreate] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

  const currentRole = roles.find((r) => r.id === selectedRole)!;
  const categories = [...new Set(PERMISSIONS.map((p) => p.category))];

  function togglePerm(roleId: string, permKey: string) {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== roleId) return r;
        const perms = new Set(r.perms);
        if (perms.has(permKey)) perms.delete(permKey);
        else perms.add(permKey);
        return { ...r, perms };
      })
    );
  }

  function createRole() {
    if (!newRoleName.trim()) return;
    const id = newRoleName.toLowerCase().replace(/\s+/g, "-");
    setRoles((prev) => [
      ...prev,
      { id, name: newRoleName.trim(), tone: "green", perms: new Set(), members: 0 },
    ]);
    push(`Rôle « ${newRoleName} » créé ✓`, "ok");
    setNewRoleName("");
    setShowCreate(false);
    setSelectedRole(id);
  }

  return (
    <AdminPage
      title="Rôles & permissions"
      eyebrow="accès admin ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/settings", label: "Paramètres" },
        { label: "Rôles & permissions" },
      ]}
      actions={
        <Button variant="gold" size="sm" icon={<Plus size={14} />} onClick={() => setShowCreate(true)}>
          Créer un rôle
        </Button>
      }
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-52 shrink-0">
          <PaperCard shadow="soft" className="p-3">
            <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.12em] text-ink-faded px-3 pb-2">Sections</div>
            <SettingsNav />
          </PaperCard>
        </aside>

        <div className="flex-1 min-w-0 space-y-5">
          {/* Role selector */}
          <PaperCard shadow="soft" className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Sélectionner un rôle</div>
                <h2 className="font-[family-name:var(--font-serif)] font-bold text-xl mt-0.5">Matrice des permissions</h2>
              </div>
              <Stamp color="blue" shape="rect" size={50} rotate={3} fontSize={9}>Rôles</Stamp>
            </div>
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`px-4 py-2 rounded-[4px] border-[1.5px] font-[family-name:var(--font-serif)] text-[13px] font-semibold transition cursor-pointer flex items-center gap-2 ${
                    selectedRole === r.id
                      ? "bg-ink text-paper-warm border-ink"
                      : "bg-card border-ink text-ink hover:bg-paper-warm"
                  }`}
                >
                  <Badge tone={r.tone}>{r.name}</Badge>
                  <span className="text-[11px] opacity-70">{r.members} membres</span>
                </button>
              ))}
            </div>
          </PaperCard>

          {/* Permission matrix */}
          {currentRole && (
            <PaperCard shadow="soft" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg">
                  Permissions — <Badge tone={currentRole.tone}>{currentRole.name}</Badge>
                </h3>
                <Button
                  variant="gold"
                  size="sm"
                  icon={<Save size={13} />}
                  onClick={() => push(`Permissions du rôle « ${currentRole.name} » enregistrées ✓`, "ok")}
                >
                  Enregistrer
                </Button>
              </div>

              <div className="space-y-5">
                {categories.map((cat) => (
                  <div key={cat}>
                    <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mb-2 pb-1 border-b border-[var(--ink-line)]">
                      {cat}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PERMISSIONS.filter((p) => p.category === cat).map((p) => {
                        const enabled = currentRole.perms.has(p.key);
                        const locked = currentRole.id === "admin";
                        return (
                          <div
                            key={p.key}
                            className="flex items-center justify-between p-3 rounded-[4px] bg-paper border border-[var(--ink-line)]"
                          >
                            <span className="font-[family-name:var(--font-serif)] text-[13px]">{p.label}</span>
                            <Toggle
                              checked={locked ? true : enabled}
                              onChange={() => !locked && togglePerm(currentRole.id, p.key)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </PaperCard>
          )}
        </div>
      </div>

      {/* Create role modal */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Créer un nouveau rôle"
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setShowCreate(false)}>Annuler</Button>
            <Button variant="gold" size="sm" onClick={createRole} disabled={!newRoleName.trim()}>
              Créer le rôle
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded mb-4">
          Donnez un nom au rôle. Vous pourrez configurer ses permissions juste après.
        </p>
        <Input
          label="Nom du rôle"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          placeholder="ex. Éditeur, Analyste…"
          autoFocus
        />
      </Modal>
    </AdminPage>
  );
}
