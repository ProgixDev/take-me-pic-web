"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Button,
  PaperCard,
  Input,
  Select,
  Toggle,
  useToast,
  Stamp,
} from "@/components/ui";
import { useState } from "react";

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

export function SettingsNav() {
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

/* ── Page ─────────────────────────────────────────────────────────── */
export default function SettingsGeneralPage() {
  const { push } = useToast();

  const [appName, setAppName] = useState("Take Me Pic");
  const [supportEmail, setSupportEmail] = useState("support@takemepic.app");
  const [timezone, setTimezone] = useState("Europe/Paris");
  const [defaultLang, setDefaultLang] = useState("fr");
  const [maintenance, setMaintenance] = useState(false);
  const [openRegistrations, setOpenRegistrations] = useState(true);

  function handleSave() {
    push("Paramètres généraux enregistrés ✓", "ok");
  }

  return (
    <AdminPage
      title="Paramètres"
      eyebrow="configuration ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/settings", label: "Paramètres" },
        { label: "Général" },
      ]}
      actions={
        <Button variant="gold" size="sm" icon={<Save size={14} />} onClick={handleSave}>
          Enregistrer
        </Button>
      }
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sub-nav */}
        <aside className="lg:w-52 shrink-0">
          <PaperCard shadow="soft" className="p-3">
            <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.12em] text-ink-faded px-3 pb-2">
              Sections
            </div>
            <SettingsNav />
          </PaperCard>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Application */}
          <PaperCard shadow="soft" className="p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
                  Identité de l'application
                </div>
                <h2 className="font-[family-name:var(--font-serif)] font-bold text-xl mt-0.5">
                  Paramètres généraux
                </h2>
              </div>
              <Stamp color="gold" shape="circle" size={52} rotate={-4} fontSize={9}>
                Général
              </Stamp>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
              <Input
                label="Nom de l'application"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="Take Me Pic"
              />
              <Input
                label="E-mail de support"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="support@takemepic.app"
              />
              <Select
                label="Fuseau horaire"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="Europe/Paris">Europe/Paris (UTC+2)</option>
                <option value="Europe/London">Europe/London (UTC+1)</option>
                <option value="America/New_York">America/New_York (UTC-4)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                <option value="UTC">UTC</option>
              </Select>
              <Select
                label="Langue par défaut"
                value={defaultLang}
                onChange={(e) => setDefaultLang(e.target.value)}
              >
                <option value="fr">Français 🇫🇷</option>
                <option value="en">English 🇬🇧</option>
                <option value="ar">العربية 🇲🇦</option>
                <option value="es">Español 🇪🇸</option>
                <option value="pt">Português 🇵🇹</option>
              </Select>
            </div>
          </PaperCard>

          {/* Toggles */}
          <PaperCard shadow="soft" className="p-6">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-4">
              Modes & accès
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[var(--ink-line)]">
                <div>
                  <p className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">
                    Mode maintenance
                  </p>
                  <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded mt-0.5">
                    Rend l'application inaccessible aux utilisateurs non-admins
                  </p>
                </div>
                <Toggle checked={maintenance} onChange={setMaintenance} />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">
                    Inscriptions ouvertes
                  </p>
                  <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded mt-0.5">
                    Autoriser les nouveaux comptes à s'enregistrer
                  </p>
                </div>
                <Toggle checked={openRegistrations} onChange={setOpenRegistrations} />
              </div>
            </div>
          </PaperCard>

          {/* Danger zone */}
          <PaperCard shadow="soft" className="p-6 border-stamp-red/30">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-stamp-red mb-4">
              Zone sensible
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">
                  Vider le cache applicatif
                </p>
                <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded mt-0.5">
                  Force une réinitialisation des données en cache côté serveur
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => push("Cache vidé avec succès ✓", "ok")}
              >
                Vider le cache
              </Button>
            </div>
          </PaperCard>

          <div className="flex justify-end">
            <Button variant="gold" size="md" icon={<Save size={15} />} onClick={handleSave}>
              Enregistrer les paramètres
            </Button>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
