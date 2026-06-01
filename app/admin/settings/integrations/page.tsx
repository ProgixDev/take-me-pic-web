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
  Wrench,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Button,
  PaperCard,
  Badge,
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
type Integration = {
  id: string;
  name: string;
  description: string;
  category: string;
  emoji: string;
  connected: boolean;
  lastSync?: string;
};

const INITIAL_INTEGRATIONS: Integration[] = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Paiements, abonnements et remboursements en ligne",
    category: "Paiements",
    emoji: "💳",
    connected: true,
    lastSync: "il y a 2 min",
  },
  {
    id: "firebase",
    name: "Firebase",
    description: "Push notifications et authentification mobile",
    category: "Mobile",
    emoji: "🔥",
    connected: true,
    lastSync: "il y a 15 min",
  },
  {
    id: "twilio",
    name: "Twilio",
    description: "SMS de vérification et alertes de sécurité",
    category: "Communications",
    emoji: "📱",
    connected: true,
    lastSync: "il y a 1 h",
  },
  {
    id: "mailgun",
    name: "Mailgun",
    description: "Envoi d'e-mails transactionnels et marketing",
    category: "Communications",
    emoji: "📧",
    connected: false,
  },
  {
    id: "mapbox",
    name: "Mapbox",
    description: "Cartes interactives et géolocalisation des spots",
    category: "Cartographie",
    emoji: "🗺️",
    connected: true,
    lastSync: "il y a 30 min",
  },
  {
    id: "sentry",
    name: "Sentry",
    description: "Monitoring des erreurs et performances applicatives",
    category: "Monitoring",
    emoji: "🐛",
    connected: true,
    lastSync: "il y a 5 min",
  },
];

const CATEGORIES = ["Paiements", "Mobile", "Communications", "Cartographie", "Monitoring"];

/* ── Page ─────────────────────────────────────────────────────────── */
export default function IntegrationsSettingsPage() {
  const { push } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);

  function toggleIntegration(id: string) {
    setIntegrations((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const connected = !i.connected;
        const lastSync = connected ? "il y a quelques secondes" : undefined;
        push(
          connected
            ? `${i.name} connecté avec succès ✓`
            : `${i.name} déconnecté`,
          connected ? "ok" : "info"
        );
        return { ...i, connected, lastSync };
      })
    );
  }

  function configure(name: string) {
    push(`Configuration de ${name} ouverte (demo) ✓`, "info");
  }

  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <AdminPage
      title="Intégrations"
      eyebrow="connexions externes ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/settings", label: "Paramètres" },
        { label: "Intégrations" },
      ]}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-52 shrink-0">
          <PaperCard shadow="soft" className="p-3">
            <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.12em] text-ink-faded px-3 pb-2">Sections</div>
            <SettingsNav />
          </PaperCard>
        </aside>

        <div className="flex-1 min-w-0 space-y-5">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
              <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Connectées</div>
              <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-stamp-green mt-1">{connectedCount}</div>
            </div>
            <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
              <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Déconnectées</div>
              <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-ink-faded mt-1">{integrations.length - connectedCount}</div>
            </div>
            <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
              <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Total</div>
              <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl mt-1">{integrations.length}</div>
            </div>
          </div>

          {/* Cards by category */}
          {CATEGORIES.map((cat) => {
            const catIntegrations = integrations.filter((i) => i.category === cat);
            if (catIntegrations.length === 0) return null;
            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">{cat}</div>
                  <div className="flex-1 h-px bg-[var(--ink-line)]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {catIntegrations.map((integ) => (
                    <PaperCard key={integ.id} shadow="soft" className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl shrink-0">{integ.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className="font-[family-name:var(--font-serif)] font-bold text-[16px]">{integ.name}</h3>
                            <Badge tone={integ.connected ? "green" : "neutral"} dot>
                              {integ.connected ? "Connecté" : "Inactif"}
                            </Badge>
                          </div>
                          <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded leading-relaxed mb-3">
                            {integ.description}
                          </p>
                          {integ.connected && integ.lastSync && (
                            <p className="font-[family-name:var(--font-type)] text-[10px] text-stamp-green mb-3">
                              Dernière synchro : {integ.lastSync}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <Toggle
                              checked={integ.connected}
                              onChange={() => toggleIntegration(integ.id)}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              icon={<Wrench size={13} />}
                              onClick={() => configure(integ.name)}
                            >
                              Configurer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </PaperCard>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Footer stamp */}
          <div className="flex justify-center pt-2">
            <Stamp color="green" shape="circle" size={64} rotate={-5} fontSize={8}>
              {"Tout\nconnecté"}
            </Stamp>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
