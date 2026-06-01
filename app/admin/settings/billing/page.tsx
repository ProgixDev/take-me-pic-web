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
  Download,
  Star,
  Euro,
  Users as UsersIcon,
  Camera,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Button,
  PaperCard,
  Badge,
  StatCard,
  DataTable,
  type Column,
  Ticket,
  Stamp,
  Tape,
  useToast,
} from "@/components/ui";
import { fmtEur } from "@/lib/data";

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

/* ── Mock invoices ────────────────────────────────────────────────── */
type Invoice = {
  id: string;
  number: string;
  date: string;
  description: string;
  amount: number;
  status: "payée" | "en attente" | "échouée";
};

const INVOICES: Invoice[] = [
  { id: "inv1", number: "INV-2026-006", date: "1 juin 2026", description: "Plan Entreprise — Juin 2026", amount: 490, status: "payée" },
  { id: "inv2", number: "INV-2026-005", date: "1 mai 2026", description: "Plan Entreprise — Mai 2026", amount: 490, status: "payée" },
  { id: "inv3", number: "INV-2026-004", date: "1 avr. 2026", description: "Plan Entreprise — Avril 2026", amount: 490, status: "payée" },
  { id: "inv4", number: "INV-2026-003", date: "1 mars 2026", description: "Plan Entreprise — Mars 2026", amount: 490, status: "payée" },
  { id: "inv5", number: "INV-2026-002", date: "1 fév. 2026", description: "Plan Entreprise — Février 2026", amount: 490, status: "payée" },
  { id: "inv6", number: "INV-2026-001", date: "1 janv. 2026", description: "Plan Entreprise — Janvier 2026 (proration)", amount: 327, status: "payée" },
  { id: "inv7", number: "INV-2025-012", date: "1 déc. 2025", description: "Plan Pro — Décembre 2025", amount: 149, status: "payée" },
];

/* ── Page ─────────────────────────────────────────────────────────── */
export default function BillingSettingsPage() {
  const { push } = useToast();

  const invoiceColumns: Column<Invoice>[] = [
    {
      key: "number",
      header: "N° Facture",
      cell: (row) => (
        <span className="font-[family-name:var(--font-mono)] text-[12px]">{row.number}</span>
      ),
    },
    {
      key: "date",
      header: "Date",
      cell: (row) => (
        <span className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded">{row.date}</span>
      ),
    },
    {
      key: "description",
      header: "Description",
      cell: (row) => (
        <span className="font-[family-name:var(--font-serif)] text-[13px]">{row.description}</span>
      ),
    },
    {
      key: "amount",
      header: "Montant",
      align: "right",
      cell: (row) => (
        <span className="font-[family-name:var(--font-serif)] font-bold text-[13px]">{fmtEur(row.amount)}</span>
      ),
      sortValue: (row) => row.amount,
    },
    {
      key: "status",
      header: "Statut",
      cell: (row) => (
        <Badge
          tone={row.status === "payée" ? "green" : row.status === "en attente" ? "gold" : "red"}
          dot
        >
          {row.status}
        </Badge>
      ),
    },
    {
      key: "download",
      header: "",
      align: "right",
      cell: (row) => (
        <Button
          variant="ghost"
          size="sm"
          icon={<Download size={13} />}
          onClick={(e) => {
            e.stopPropagation();
            push(`Téléchargement de ${row.number} en cours…`, "info");
          }}
        >
          PDF
        </Button>
      ),
    },
  ];

  return (
    <AdminPage
      title="Facturation"
      eyebrow="compte entreprise ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/settings", label: "Paramètres" },
        { label: "Facturation" },
      ]}
      actions={
        <Button
          variant="paper"
          size="sm"
          icon={<Download size={14} />}
          onClick={() => push("Export des factures en cours…", "info")}
        >
          Exporter tout
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
          {/* Current plan */}
          <PaperCard shadow="gold" className="p-6 relative overflow-hidden">
            <Tape color="cream" rotate={-2} className="absolute -top-1 left-8" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Plan actuel</div>
                <h2 className="font-[family-name:var(--font-serif)] font-bold text-2xl mt-1 text-gold-deep">
                  Entreprise ✦
                </h2>
                <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[13px] mt-1">
                  Accès illimité · SLA 99,9 % · Support dédié
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <Badge tone="green" dot>Actif</Badge>
                  <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
                    Prochain renouvellement : 1 juil. 2026
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-[family-name:var(--font-serif)] font-extrabold text-4xl text-gold-deep">490 €</div>
                <div className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">/ mois</div>
                <Button
                  variant="gold"
                  size="sm"
                  className="mt-3"
                  onClick={() => push("Demande de changement de plan envoyée ✓", "ok")}
                >
                  Changer de plan
                </Button>
              </div>
            </div>
            <Stamp color="gold" shape="octagon" size={64} rotate={8} fontSize={8} className="absolute bottom-3 right-3 opacity-30">
              Entreprise
            </Stamp>
          </PaperCard>

          {/* Payment method — ticket */}
          <div>
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">Moyen de paiement</div>
            <Ticket dark className="max-w-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.12em] opacity-60 mb-1">Carte principale</div>
                  <div className="font-[family-name:var(--font-mono)] text-[18px] font-bold tracking-[0.1em]">
                    •••• •••• •••• 4242
                  </div>
                  <div className="font-[family-name:var(--font-type)] text-[11px] opacity-70 mt-1">
                    Visa · Expire 09/2028
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-[family-name:var(--font-hand)] text-2xl text-gold-light">Claire B.</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-paper-warm border-paper-warm/30 hover:bg-paper-warm/10"
                    onClick={() => push("Mise à jour du moyen de paiement (demo) ✓", "info")}
                  >
                    Modifier
                  </Button>
                </div>
              </div>
            </Ticket>
          </div>

          {/* Usage stats */}
          <div>
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">Utilisation — mois en cours</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Utilisateurs actifs" value="48 230" delta="+12 %" tone="ink" icon={<UsersIcon size={15} />} />
              <StatCard label="Sessions ce mois" value="18 420" delta="+8 %" tone="blue" icon={<Camera size={15} />} />
              <StatCard label="Membres admin" value="11" tone="green" icon={<Star size={15} />} />
              <StatCard label="Revenus (juin)" value={fmtEur(64200)} delta="+5,3 %" tone="gold" icon={<Euro size={15} />} />
            </div>
          </div>

          {/* Invoices */}
          <PaperCard shadow="soft" className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Historique</div>
                <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mt-0.5">Factures</h3>
              </div>
            </div>
            <DataTable<Invoice & Record<string, unknown>>
              columns={invoiceColumns as Column<Invoice & Record<string, unknown>>[]}
              rows={INVOICES as (Invoice & Record<string, unknown>)[]}
              pageSize={7}
              empty="Aucune facture."
            />
          </PaperCard>
        </div>
      </div>
    </AdminPage>
  );
}
