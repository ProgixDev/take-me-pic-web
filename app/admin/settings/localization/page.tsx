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
  Info,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Button,
  PaperCard,
  Badge,
  Toggle,
  Select,
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
type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  completion: number;
  active: boolean;
  rtl: boolean;
};

const INITIAL_LANGUAGES: Language[] = [
  { code: "fr", name: "Français", nativeName: "Français", flag: "🇫🇷", completion: 100, active: true, rtl: false },
  { code: "en", name: "Anglais", nativeName: "English", flag: "🇬🇧", completion: 97, active: true, rtl: false },
  { code: "ar", name: "Arabe", nativeName: "العربية", flag: "🇲🇦", completion: 82, active: true, rtl: true },
  { code: "es", name: "Espagnol", nativeName: "Español", flag: "🇪🇸", completion: 74, active: false, rtl: false },
  { code: "pt", name: "Portugais", nativeName: "Português", flag: "🇵🇹", completion: 68, active: false, rtl: false },
  { code: "it", name: "Italien", nativeName: "Italiano", flag: "🇮🇹", completion: 41, active: false, rtl: false },
  { code: "de", name: "Allemand", nativeName: "Deutsch", flag: "🇩🇪", completion: 35, active: false, rtl: false },
  { code: "ja", name: "Japonais", nativeName: "日本語", flag: "🇯🇵", completion: 22, active: false, rtl: false },
];

/* ── Page ─────────────────────────────────────────────────────────── */
export default function LocalizationSettingsPage() {
  const { push } = useToast();
  const [languages, setLanguages] = useState<Language[]>(INITIAL_LANGUAGES);
  const [defaultLang, setDefaultLang] = useState("fr");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [currencyFormat, setCurrencyFormat] = useState("EUR");
  const [numberLocale, setNumberLocale] = useState("fr-FR");

  function toggleLang(code: string) {
    if (code === "fr") return; // can't disable primary language
    setLanguages((prev) =>
      prev.map((l) => (l.code === code ? { ...l, active: !l.active } : l))
    );
  }

  function save() {
    push("Paramètres de localisation enregistrés ✓", "ok");
  }

  const activeCount = languages.filter((l) => l.active).length;

  return (
    <AdminPage
      title="Localisation"
      eyebrow="internationalisation ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/settings", label: "Paramètres" },
        { label: "Localisation" },
      ]}
      actions={
        <Button variant="gold" size="sm" icon={<Save size={14} />} onClick={save}>
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
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
              <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Langues actives</div>
              <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-stamp-green mt-1">{activeCount}</div>
            </div>
            <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
              <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Disponibles</div>
              <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl mt-1">{languages.length}</div>
            </div>
            <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
              <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">RTL supporté</div>
              <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-stamp-blue mt-1">Oui</div>
            </div>
          </div>

          {/* Languages */}
          <PaperCard shadow="soft" className="p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Traductions</div>
                <h2 className="font-[family-name:var(--font-serif)] font-bold text-xl mt-0.5">Langues supportées</h2>
              </div>
              <Stamp color="blue" shape="circle" size={52} rotate={4} fontSize={8}>i18n</Stamp>
            </div>

            <div className="space-y-0">
              {languages.map((lang, i) => (
                <div
                  key={lang.code}
                  className={`flex items-center gap-4 py-4 ${
                    i < languages.length - 1 ? "border-b border-[var(--ink-line)]" : ""
                  }`}
                >
                  <span className="text-2xl shrink-0">{lang.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">
                        {lang.name}
                      </span>
                      <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded italic">
                        {lang.nativeName}
                      </span>
                      {lang.rtl && (
                        <Badge tone="blue">RTL</Badge>
                      )}
                      {lang.code === defaultLang && (
                        <Badge tone="gold">Par défaut</Badge>
                      )}
                    </div>
                    {/* Completion bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-paper rounded-full overflow-hidden border border-[var(--ink-line)]">
                        <div
                          className={`h-full rounded-full transition-all ${
                            lang.completion === 100
                              ? "bg-stamp-green"
                              : lang.completion >= 70
                              ? "bg-gold-deep"
                              : "bg-stamp-red/60"
                          }`}
                          style={{ width: `${lang.completion}%` }}
                        />
                      </div>
                      <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded w-8 text-right">
                        {lang.completion}%
                      </span>
                    </div>
                  </div>
                  <Toggle
                    checked={lang.active}
                    onChange={() => toggleLang(lang.code)}
                  />
                </div>
              ))}
            </div>
          </PaperCard>

          {/* RTL note */}
          <PaperCard shadow="soft" className="p-4 bg-stamp-blue/5 border-stamp-blue/25">
            <div className="flex items-start gap-3">
              <Info size={16} className="text-stamp-blue shrink-0 mt-0.5" />
              <p className="font-[family-name:var(--font-serif)] text-[13px] leading-relaxed">
                <strong>Note RTL (arabe) :</strong> l'interface s'inverse automatiquement lorsqu'un utilisateur sélectionne l'arabe.
                Assurez-vous que vos composants personnalisés respectent la direction du texte via la propriété{" "}
                <code className="font-[family-name:var(--font-mono)] text-[12px] bg-paper px-1 rounded">dir="rtl"</code>.
              </p>
            </div>
          </PaperCard>

          {/* Formats */}
          <PaperCard shadow="soft" className="p-6">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-4">Formats régionaux</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5">
              <Select
                label="Langue par défaut"
                value={defaultLang}
                onChange={(e) => setDefaultLang(e.target.value)}
              >
                {languages.filter((l) => l.active).map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </Select>
              <Select
                label="Format de date"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (30/05/2026)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (05/30/2026)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2026-05-30)</option>
                <option value="D MMMM YYYY">D MMMM YYYY (30 mai 2026)</option>
              </Select>
              <Select
                label="Devise"
                value={currencyFormat}
                onChange={(e) => setCurrencyFormat(e.target.value)}
              >
                <option value="EUR">EUR — Euro (€)</option>
                <option value="USD">USD — Dollar américain ($)</option>
                <option value="GBP">GBP — Livre sterling (£)</option>
                <option value="MAD">MAD — Dirham marocain</option>
              </Select>
              <Select
                label="Format des nombres"
                value={numberLocale}
                onChange={(e) => setNumberLocale(e.target.value)}
              >
                <option value="fr-FR">Français (1 234,56)</option>
                <option value="en-US">Anglais US (1,234.56)</option>
                <option value="de-DE">Allemand (1.234,56)</option>
              </Select>
            </div>
          </PaperCard>

          <div className="flex justify-end">
            <Button variant="gold" size="md" icon={<Save size={15} />} onClick={save}>
              Enregistrer la localisation
            </Button>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
