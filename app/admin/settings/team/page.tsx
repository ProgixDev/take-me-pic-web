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
  UserPlus,
  Trash2,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Button,
  PaperCard,
  Badge,
  Avatar,
  Input,
  Select,
  Modal,
  DataTable,
  type Column,
  Stamp,
  useToast,
} from "@/components/ui";
import { team } from "@/lib/data";

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

/* ── Types & mock data ────────────────────────────────────────────── */
type RoleKey = "Admin" | "Modérateur" | "Support" | "Lecture seule";

const ROLE_TONE: Record<RoleKey, "red" | "blue" | "gold" | "neutral"> = {
  Admin: "red",
  Modérateur: "blue",
  Support: "gold",
  "Lecture seule": "neutral",
};

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: RoleKey;
  avatar: string;
  lastActive: string;
};

function buildEmail(name: string) {
  return name.toLowerCase().replace(/[^a-z ]/g, "").replace(" ", ".") + "@takemepic.app";
}

const LAST_ACTIVE = ["il y a 5 min", "il y a 1 h", "il y a 3 h", "hier", "il y a 2 jours"];
const ROLES: RoleKey[] = ["Admin", "Admin", "Modérateur", "Modérateur", "Support", "Support"];

const INITIAL_MEMBERS: TeamMember[] = team.map((m, i) => ({
  id: `tm${i}`,
  name: m.name,
  email: buildEmail(m.name),
  role: ROLES[i % ROLES.length],
  avatar: m.avatar,
  lastActive: LAST_ACTIVE[i % LAST_ACTIVE.length],
}));

/* ── Page ─────────────────────────────────────────────────────────── */
export default function TeamSettingsPage() {
  const { push } = useToast();
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [showInvite, setShowInvite] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<TeamMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<RoleKey>("Support");

  function handleInvite() {
    if (!inviteEmail.trim()) return;
    const newMember: TeamMember = {
      id: `tm${Date.now()}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      avatar: "https://i.pravatar.cc/300?img=60",
      lastActive: "Invitation envoyée",
    };
    setMembers((prev) => [...prev, newMember]);
    push(`Invitation envoyée à ${inviteEmail} ✓`, "ok");
    setInviteEmail("");
    setInviteRole("Support");
    setShowInvite(false);
  }

  function handleRemove(m: TeamMember) {
    setMembers((prev) => prev.filter((x) => x.id !== m.id));
    setRemoveTarget(null);
    push(`${m.name} a été retiré de l'équipe ✓`, "ok");
  }

  const columns: Column<TeamMember>[] = [
    {
      key: "member",
      header: "Membre",
      cell: (row) => (
        <span className="flex items-center gap-3">
          <Avatar src={row.avatar} size={36} />
          <span className="flex flex-col">
            <span className="font-semibold text-[13px]">{row.name}</span>
            <span className="text-[11px] text-ink-faded font-[family-name:var(--font-mono)]">{row.email}</span>
          </span>
        </span>
      ),
      sortValue: (row) => row.name,
    },
    {
      key: "role",
      header: "Rôle",
      cell: (row) => (
        <Badge tone={ROLE_TONE[row.role]}>{row.role}</Badge>
      ),
      sortValue: (row) => row.role,
    },
    {
      key: "lastActive",
      header: "Dernière activité",
      cell: (row) => (
        <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">{row.lastActive}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (row) =>
        row.name === "Claire Bernard" ? null : (
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={12} />}
            onClick={(e) => { e.stopPropagation(); setRemoveTarget(row); }}
          >
            Retirer
          </Button>
        ),
    },
  ];

  return (
    <AdminPage
      title="Équipe admin"
      eyebrow="les gardiens ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/settings", label: "Paramètres" },
        { label: "Équipe admin" },
      ]}
      actions={
        <Button variant="gold" size="sm" icon={<UserPlus size={14} />} onClick={() => setShowInvite(true)}>
          Inviter un membre
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
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(["Admin", "Modérateur", "Support", "Lecture seule"] as RoleKey[]).map((role) => {
              const count = members.filter((m) => m.role === role).length;
              return (
                <div key={role} className="bg-card border-[1.5px] border-ink rounded-[4px] p-3 shadow-ink-sm">
                  <Badge tone={ROLE_TONE[role]} className="mb-2">{role}</Badge>
                  <div className="font-[family-name:var(--font-serif)] font-extrabold text-2xl">{count}</div>
                </div>
              );
            })}
          </div>

          {/* Table */}
          <PaperCard shadow="soft" className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Gestion</div>
                <h2 className="font-[family-name:var(--font-serif)] font-bold text-xl mt-0.5">
                  Membres de l'équipe ({members.length})
                </h2>
              </div>
              <Stamp color="green" shape="circle" size={48} rotate={-3} fontSize={9}>Équipe</Stamp>
            </div>
            <DataTable<TeamMember & Record<string, unknown>>
              columns={columns as Column<TeamMember & Record<string, unknown>>[]}
              rows={members as (TeamMember & Record<string, unknown>)[]}
              searchable
              searchPlaceholder="rechercher par nom ou e-mail…"
              pageSize={10}
              empty="Aucun membre."
            />
          </PaperCard>
        </div>
      </div>

      {/* Invite modal */}
      <Modal
        open={showInvite}
        onClose={() => setShowInvite(false)}
        title="Inviter un membre"
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setShowInvite(false)}>Annuler</Button>
            <Button variant="gold" size="sm" onClick={handleInvite} disabled={!inviteEmail.trim()}>
              Envoyer l'invitation
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded mb-4">
          Un e-mail d'invitation sera envoyé avec un lien d'accès temporaire.
        </p>
        <Input
          label="Adresse e-mail"
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="collaborateur@exemple.fr"
        />
        <Select
          label="Rôle"
          value={inviteRole}
          onChange={(e) => setInviteRole(e.target.value as RoleKey)}
        >
          <option value="Admin">Admin</option>
          <option value="Modérateur">Modérateur</option>
          <option value="Support">Support</option>
          <option value="Lecture seule">Lecture seule</option>
        </Select>
      </Modal>

      {/* Remove confirm modal */}
      <Modal
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        title="Retirer ce membre"
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setRemoveTarget(null)}>Annuler</Button>
            <Button variant="danger" size="sm" onClick={() => removeTarget && handleRemove(removeTarget)}>
              Oui, retirer
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[14px] leading-relaxed">
          Retirer <strong>{removeTarget?.name}</strong> de l'équipe admin ?
          Cette action révoquera immédiatement son accès.
        </p>
      </Modal>
    </AdminPage>
  );
}
