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
  Copy,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Button,
  PaperCard,
  Badge,
  Input,
  Select,
  Modal,
  DataTable,
  type Column,
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
type ApiKey = {
  id: string;
  name: string;
  masked: string;
  environment: "live" | "test";
  created: string;
  lastUsed: string;
  status: "active" | "revoked";
};

const INITIAL_KEYS: ApiKey[] = [
  { id: "k1", name: "Production mobile app", masked: "sk_live_••••••••••••4a2f", environment: "live", created: "12 janv. 2026", lastUsed: "il y a 3 min", status: "active" },
  { id: "k2", name: "Webhook Stripe", masked: "sk_live_••••••••••••9b1c", environment: "live", created: "28 janv. 2026", lastUsed: "il y a 2 h", status: "active" },
  { id: "k3", name: "Serveur analytics", masked: "sk_live_••••••••••••7e4d", environment: "live", created: "3 fév. 2026", lastUsed: "hier", status: "active" },
  { id: "k4", name: "Intégration Sentry", masked: "sk_live_••••••••••••3f8a", environment: "live", created: "15 fév. 2026", lastUsed: "il y a 5 h", status: "active" },
  { id: "k5", name: "Test CI/CD", masked: "sk_test_••••••••••••2c1b", environment: "test", created: "1 mars 2026", lastUsed: "il y a 2 jours", status: "active" },
  { id: "k6", name: "Ancienne clé staging", masked: "sk_test_••••••••••••0a9e", environment: "test", created: "10 déc. 2025", lastUsed: "il y a 3 mois", status: "revoked" },
];

/* ── Page ─────────────────────────────────────────────────────────── */
export default function ApiKeysSettingsPage() {
  const { push } = useToast();
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [showGenerate, setShowGenerate] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<ApiKey | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnv, setNewKeyEnv] = useState<"live" | "test">("live");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showGenerated, setShowGenerated] = useState(false);

  function generateKey() {
    if (!newKeyName.trim()) return;
    const rand = Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 8);
    const full = `sk_${newKeyEnv}_${rand}`;
    const masked = `sk_${newKeyEnv}_••••••••••••${rand.slice(-4)}`;
    const created: ApiKey = {
      id: `k${Date.now()}`,
      name: newKeyName.trim(),
      masked,
      environment: newKeyEnv,
      created: "Maintenant",
      lastUsed: "Jamais",
      status: "active",
    };
    setKeys((prev) => [created, ...prev]);
    setGeneratedKey(full);
    setNewKeyName("");
    setShowGenerate(false);
  }

  function revokeKey(k: ApiKey) {
    setKeys((prev) => prev.map((x) => (x.id === k.id ? { ...x, status: "revoked" } : x)));
    setRevokeTarget(null);
    push(`Clé « ${k.name} » révoquée ✓`, "ok");
  }

  const columns: Column<ApiKey>[] = [
    {
      key: "name",
      header: "Nom",
      cell: (row) => (
        <span className="flex flex-col gap-0.5">
          <span className="font-semibold text-[13px]">{row.name}</span>
          <Badge tone={row.environment === "live" ? "red" : "gold"} className="w-fit">
            {row.environment}
          </Badge>
        </span>
      ),
      sortValue: (row) => row.name,
    },
    {
      key: "masked",
      header: "Clé",
      cell: (row) => (
        <span className="font-[family-name:var(--font-mono)] text-[12px] text-ink-faded">{row.masked}</span>
      ),
    },
    {
      key: "created",
      header: "Créée le",
      cell: (row) => (
        <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">{row.created}</span>
      ),
    },
    {
      key: "lastUsed",
      header: "Dernière utilisation",
      cell: (row) => (
        <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">{row.lastUsed}</span>
      ),
    },
    {
      key: "status",
      header: "Statut",
      cell: (row) => (
        <Badge tone={row.status === "active" ? "green" : "neutral"} dot>
          {row.status === "active" ? "Active" : "Révoquée"}
        </Badge>
      ),
      sortValue: (row) => row.status,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (row) =>
        row.status === "active" ? (
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={12} />}
            onClick={(e) => { e.stopPropagation(); setRevokeTarget(row); }}
          >
            Révoquer
          </Button>
        ) : null,
    },
  ];

  return (
    <AdminPage
      title="Clés API"
      eyebrow="authentification ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/settings", label: "Paramètres" },
        { label: "Clés API" },
      ]}
      actions={
        <Button variant="gold" size="sm" icon={<Plus size={14} />} onClick={() => setShowGenerate(true)}>
          Générer une clé
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
          {/* Warning */}
          <PaperCard shadow="soft" className="p-4 bg-stamp-red/5 border-stamp-red/25">
            <div className="flex items-start gap-3">
              <Key size={16} className="text-stamp-red shrink-0 mt-0.5" />
              <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink leading-relaxed">
                <strong>Attention :</strong> les clés API donnent un accès complet à votre compte.
                Ne les partagez jamais et stockez-les dans un gestionnaire de secrets.
              </p>
            </div>
          </PaperCard>

          {/* Table */}
          <PaperCard shadow="soft" className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Gestion</div>
                <h2 className="font-[family-name:var(--font-serif)] font-bold text-xl mt-0.5">
                  Clés API ({keys.filter((k) => k.status === "active").length} actives)
                </h2>
              </div>
              <Stamp color="ink" shape="rect" size={50} rotate={2} fontSize={8}>API Keys</Stamp>
            </div>
            <DataTable<ApiKey & Record<string, unknown>>
              columns={columns as Column<ApiKey & Record<string, unknown>>[]}
              rows={keys as (ApiKey & Record<string, unknown>)[]}
              searchable
              searchPlaceholder="rechercher une clé…"
              pageSize={10}
              empty="Aucune clé API."
            />
          </PaperCard>
        </div>
      </div>

      {/* Generate modal */}
      <Modal
        open={showGenerate}
        onClose={() => setShowGenerate(false)}
        title="Générer une nouvelle clé"
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setShowGenerate(false)}>Annuler</Button>
            <Button variant="gold" size="sm" onClick={generateKey} disabled={!newKeyName.trim()}>
              Générer
            </Button>
          </>
        }
      >
        <Input
          label="Nom de la clé"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          placeholder="ex. Serveur de production"
        />
        <Select
          label="Environnement"
          value={newKeyEnv}
          onChange={(e) => setNewKeyEnv(e.target.value as "live" | "test")}
        >
          <option value="live">Live (production)</option>
          <option value="test">Test</option>
        </Select>
      </Modal>

      {/* Generated key modal */}
      <Modal
        open={!!generatedKey}
        onClose={() => { setGeneratedKey(null); setShowGenerated(false); }}
        title="Clé générée — copiez-la maintenant"
        size="md"
        footer={
          <Button
            variant="gold"
            size="sm"
            onClick={() => { setGeneratedKey(null); setShowGenerated(false); }}
          >
            J'ai copié la clé
          </Button>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[13px] text-stamp-red font-semibold mb-3">
          Cette clé ne sera plus affichée en clair après fermeture.
        </p>
        <div className="flex items-center gap-2 bg-paper border-[1.5px] border-ink rounded-[4px] p-3">
          <code className="flex-1 font-[family-name:var(--font-mono)] text-[12px] text-ink-faded break-all">
            {generatedKey ? (showGenerated ? generatedKey : generatedKey.replace(/./g, "•").slice(0, -4) + generatedKey.slice(-4)) : ""}
          </code>
          <button
            onClick={() => setShowGenerated((v) => !v)}
            className="shrink-0 text-ink-faded hover:text-ink transition cursor-pointer"
          >
            {showGenerated ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button
            onClick={() => {
              if (generatedKey) navigator.clipboard.writeText(generatedKey).catch(() => {});
              push("Clé copiée dans le presse-papier ✓", "ok");
            }}
            className="shrink-0 text-ink-faded hover:text-ink transition cursor-pointer"
          >
            <Copy size={16} />
          </button>
        </div>
      </Modal>

      {/* Revoke confirm modal */}
      <Modal
        open={!!revokeTarget}
        onClose={() => setRevokeTarget(null)}
        title="Révoquer cette clé"
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setRevokeTarget(null)}>Annuler</Button>
            <Button variant="danger" size="sm" onClick={() => revokeTarget && revokeKey(revokeTarget)}>
              Oui, révoquer
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[14px] leading-relaxed">
          Révoquer la clé <strong>« {revokeTarget?.name} »</strong> ?
          Toutes les intégrations qui l'utilisent cesseront de fonctionner immédiatement.
        </p>
      </Modal>
    </AdminPage>
  );
}
