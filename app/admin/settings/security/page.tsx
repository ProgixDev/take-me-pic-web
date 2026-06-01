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
  Save,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Button,
  PaperCard,
  Select,
  Toggle,
  Modal,
  DataTable,
  type Column,
  Badge,
  Stamp,
  useToast,
} from "@/components/ui";

/* ── Shared settings sub-nav ─────────────────────────────────────── */
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
              active
                ? "bg-ink text-paper-warm shadow-ink-sm"
                : "text-ink hover:bg-paper-warm"
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

/* ── Mock active sessions ─────────────────────────────────────────── */
type SessionRow = {
  id: string;
  user: string;
  device: string;
  location: string;
  ip: string;
  started: string;
  current: boolean;
};

const MOCK_SESSIONS: SessionRow[] = [
  { id: "ses1", user: "Claire Bernard", device: "MacBook Pro — Chrome 124", location: "Paris, FR", ip: "92.168.1.45", started: "il y a 12 min", current: true },
  { id: "ses2", user: "Claire Bernard", device: "iPhone 15 — Safari", location: "Paris, FR", ip: "92.168.1.46", started: "il y a 2 h", current: false },
  { id: "ses3", user: "Marc Olivier", device: "Windows 11 — Edge", location: "Lyon, FR", ip: "82.64.12.18", started: "il y a 3 h", current: false },
  { id: "ses4", user: "Inès Rahmouni", device: "Android — Chrome", location: "Marrakech, MA", ip: "196.12.44.7", started: "il y a 5 h", current: false },
  { id: "ses5", user: "Léo Margaux", device: "MacBook Air — Firefox", location: "Lisbonne, PT", ip: "87.54.23.9", started: "hier", current: false },
];

/* ── Page ─────────────────────────────────────────────────────────── */
export default function SecuritySettingsPage() {
  const { push } = useToast();

  const [twoFA, setTwoFA] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("8h");
  const [minLength, setMinLength] = useState(true);
  const [uppercase, setUppercase] = useState(true);
  const [specialChars, setSpecialChars] = useState(true);
  const [bruteForce, setBruteForce] = useState(true);

  const [sessions, setSessions] = useState<SessionRow[]>(MOCK_SESSIONS);
  const [revokeTarget, setRevokeTarget] = useState<SessionRow | null>(null);
  const [showResetAll, setShowResetAll] = useState(false);

  function revoke(s: SessionRow) {
    setSessions((prev) => prev.filter((x) => x.id !== s.id));
    setRevokeTarget(null);
    push(`Session de ${s.user} révoquée ✓`, "ok");
  }

  function resetAll() {
    setSessions((prev) => prev.filter((s) => s.current));
    setShowResetAll(false);
    push("Toutes les sessions externes ont été révoquées ✓", "ok");
  }

  const columns: Column<SessionRow>[] = [
    {
      key: "user",
      header: "Utilisateur",
      cell: (row) => (
        <span className="flex flex-col">
          <span className="font-semibold text-[13px]">{row.user}</span>
          <span className="text-[11px] text-ink-faded font-[family-name:var(--font-mono)]">{row.ip}</span>
        </span>
      ),
    },
    {
      key: "device",
      header: "Appareil",
      cell: (row) => (
        <span className="font-[family-name:var(--font-serif)] text-[13px]">{row.device}</span>
      ),
    },
    {
      key: "location",
      header: "Localisation",
      cell: (row) => (
        <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">{row.location}</span>
      ),
    },
    {
      key: "started",
      header: "Démarré",
      cell: (row) => (
        <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">{row.started}</span>
      ),
    },
    {
      key: "status",
      header: "Statut",
      cell: (row) =>
        row.current ? (
          <Badge tone="green" dot>Session active</Badge>
        ) : (
          <Badge tone="neutral">inactive</Badge>
        ),
    },
    {
      key: "action",
      header: "",
      align: "right",
      cell: (row) =>
        row.current ? null : (
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={12} />}
            onClick={(e) => { e.stopPropagation(); setRevokeTarget(row); }}
          >
            Révoquer
          </Button>
        ),
    },
  ];

  return (
    <AdminPage
      title="Sécurité"
      eyebrow="protection ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/settings", label: "Paramètres" },
        { label: "Sécurité" },
      ]}
      actions={
        <Button variant="gold" size="sm" icon={<Save size={14} />} onClick={() => push("Paramètres de sécurité enregistrés ✓", "ok")}>
          Enregistrer
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
          {/* 2FA & Session */}
          <PaperCard shadow="soft" className="p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Authentification & sessions</div>
                <h2 className="font-[family-name:var(--font-serif)] font-bold text-xl mt-0.5">Contrôles d'accès</h2>
              </div>
              <Stamp color="red" shape="octagon" size={50} rotate={5} fontSize={9}>Sécurité</Stamp>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[var(--ink-line)]">
                <div>
                  <p className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">Authentification à deux facteurs (2FA)</p>
                  <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded mt-0.5">Obligatoire pour tous les admins</p>
                </div>
                <Toggle checked={twoFA} onChange={setTwoFA} />
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">Expiration de session</p>
                  <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded mt-0.5">Durée avant déconnexion automatique</p>
                </div>
                <Select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-36"
                >
                  <option value="1h">1 heure</option>
                  <option value="4h">4 heures</option>
                  <option value="8h">8 heures</option>
                  <option value="24h">24 heures</option>
                  <option value="7d">7 jours</option>
                </Select>
              </div>
            </div>
          </PaperCard>

          {/* Password policy */}
          <PaperCard shadow="soft" className="p-6">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-4">Politique de mot de passe</div>
            <div className="space-y-4">
              {[
                { label: "Longueur minimale (8 caractères)", sub: "Refuser les mots de passe trop courts", state: minLength, set: setMinLength },
                { label: "Majuscules obligatoires", sub: "Au moins une lettre majuscule", state: uppercase, set: setUppercase },
                { label: "Caractères spéciaux", sub: "Au moins un symbole (!@#$…)", state: specialChars, set: setSpecialChars },
                { label: "Protection contre la force brute", sub: "Blocage après 5 tentatives échouées", state: bruteForce, set: setBruteForce },
              ].map(({ label, sub, state, set }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b last:border-0 border-[var(--ink-line)]">
                  <div>
                    <p className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">{label}</p>
                    <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded mt-0.5">{sub}</p>
                  </div>
                  <Toggle checked={state} onChange={set} />
                </div>
              ))}
            </div>
          </PaperCard>

          {/* Active sessions */}
          <PaperCard shadow="soft" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Administration</div>
                <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mt-0.5">Sessions actives ({sessions.length})</h3>
              </div>
              <Button
                variant="danger"
                size="sm"
                icon={<AlertTriangle size={13} />}
                onClick={() => setShowResetAll(true)}
              >
                Tout révoquer
              </Button>
            </div>
            <DataTable<SessionRow & Record<string, unknown>>
              columns={columns as Column<SessionRow & Record<string, unknown>>[]}
              rows={sessions as (SessionRow & Record<string, unknown>)[]}
              pageSize={10}
              empty="Aucune session active."
            />
          </PaperCard>
        </div>
      </div>

      {/* Revoke confirm modal */}
      <Modal
        open={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        title="Révoquer la session"
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setRevokeTarget(null)}>Annuler</Button>
            <Button variant="danger" size="sm" onClick={() => revokeTarget && revoke(revokeTarget)}>
              Oui, révoquer
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[14px] leading-relaxed">
          Confirmer la révocation de la session de{" "}
          <strong>{revokeTarget?.user}</strong> sur{" "}
          <em>{revokeTarget?.device}</em> ?
        </p>
      </Modal>

      {/* Reset all modal */}
      <Modal
        open={showResetAll}
        onClose={() => setShowResetAll(false)}
        title="Révoquer toutes les sessions"
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setShowResetAll(false)}>Annuler</Button>
            <Button variant="danger" size="sm" onClick={resetAll}>
              Oui, tout révoquer
            </Button>
          </>
        }
      >
        <div className="flex flex-col items-center gap-3 py-2">
          <AlertTriangle size={36} className="text-stamp-red" />
          <p className="font-[family-name:var(--font-serif)] text-[14px] leading-relaxed text-center">
            Cette action va déconnecter <strong>toutes les sessions actives</strong>{" "}
            (sauf la vôtre). Les admins devront se reconnecter.
          </p>
        </div>
      </Modal>
    </AdminPage>
  );
}
