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
  Mail,
  Smartphone,
  MessageSquare,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Button,
  PaperCard,
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
type NotifEvent = {
  id: string;
  category: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  slack: boolean;
};

const INITIAL_EVENTS: NotifEvent[] = [
  { id: "new_report", category: "Modération", label: "Nouveau signalement", description: "Un utilisateur a signalé du contenu ou un autre utilisateur", email: true, push: true, slack: true },
  { id: "report_escalated", category: "Modération", label: "Signalement escaladé", description: "Un signalement a atteint le seuil critique", email: true, push: true, slack: true },
  { id: "payment_failed", category: "Paiements", label: "Paiement échoué", description: "Un paiement a échoué (abonnement ou réservation)", email: true, push: true, slack: false },
  { id: "refund_requested", category: "Paiements", label: "Remboursement demandé", description: "Un utilisateur a demandé un remboursement", email: true, push: false, slack: true },
  { id: "new_user", category: "Utilisateurs", label: "Nouvel utilisateur", description: "Un nouveau compte a été créé", email: false, push: false, slack: false },
  { id: "user_verified", category: "Utilisateurs", label: "Utilisateur vérifié", description: "Un profil a été validé", email: false, push: false, slack: false },
  { id: "spot_pending", category: "Contenu", label: "Spot à valider", description: "Un nouveau spot photo est en attente de validation", email: true, push: false, slack: true },
  { id: "spot_approved", category: "Contenu", label: "Spot approuvé", description: "Un spot a été validé par un modérateur", email: false, push: false, slack: false },
  { id: "new_ticket", category: "Support", label: "Nouveau ticket support", description: "Un utilisateur a ouvert un ticket de support", email: true, push: true, slack: false },
  { id: "ticket_sla", category: "Support", label: "SLA ticket dépassé", description: "Un ticket n'a pas eu de réponse dans les délais", email: true, push: true, slack: true },
  { id: "premium_subscribed", category: "Abonnements", label: "Nouvel abonnement Premium", description: "Un utilisateur a souscrit à Première classe", email: false, push: false, slack: true },
  { id: "premium_cancelled", category: "Abonnements", label: "Annulation Premium", description: "Un abonnement Première classe a été résilié", email: true, push: false, slack: true },
  { id: "system_error", category: "Système", label: "Erreur système critique", description: "Une erreur de niveau ERROR ou CRITICAL est survenue", email: true, push: true, slack: true },
  { id: "deploy", category: "Système", label: "Déploiement effectué", description: "Un déploiement en production vient d'être réalisé", email: false, push: false, slack: true },
];

const CATEGORIES = ["Modération", "Paiements", "Utilisateurs", "Contenu", "Support", "Abonnements", "Système"];

type Channel = "email" | "push" | "slack";

/* ── Page ─────────────────────────────────────────────────────────── */
export default function NotificationsSettingsPage() {
  const { push } = useToast();
  const [events, setEvents] = useState<NotifEvent[]>(INITIAL_EVENTS);

  function toggle(id: string, channel: Channel) {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [channel]: !e[channel] } : e))
    );
  }

  function save() {
    push("Préférences de notification enregistrées ✓", "ok");
  }

  return (
    <AdminPage
      title="Notifications"
      eyebrow="préférences admin ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/settings", label: "Paramètres" },
        { label: "Notifications" },
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
          {/* Channel legend */}
          <PaperCard shadow="soft" className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">Canaux disponibles</div>
                <h2 className="font-[family-name:var(--font-serif)] font-bold text-xl mt-0.5">Préférences de notification</h2>
              </div>
              <Stamp color="blue" shape="rect" size={50} rotate={-3} fontSize={8}>Notifs</Stamp>
            </div>
            <div className="flex flex-wrap gap-6 mt-4">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-stamp-blue" />
                <span className="font-[family-name:var(--font-serif)] text-[13px] font-semibold">E-mail</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone size={16} className="text-stamp-green" />
                <span className="font-[family-name:var(--font-serif)] text-[13px] font-semibold">Push</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-gold-deep" />
                <span className="font-[family-name:var(--font-serif)] text-[13px] font-semibold">Slack</span>
              </div>
            </div>
          </PaperCard>

          {/* Events by category */}
          {CATEGORIES.map((cat) => {
            const catEvents = events.filter((e) => e.category === cat);
            return (
              <PaperCard key={cat} shadow="soft" className="p-5">
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3 pb-2 border-b border-[var(--ink-line)]">
                  {cat}
                </div>
                <div className="space-y-0">
                  {catEvents.map((event, i) => (
                    <div
                      key={event.id}
                      className={`flex items-center gap-4 py-3.5 ${
                        i < catEvents.length - 1 ? "border-b border-[var(--ink-line)]" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">{event.label}</p>
                        <p className="font-[family-name:var(--font-serif)] text-[11px] text-ink-faded mt-0.5 leading-relaxed">{event.description}</p>
                      </div>
                      {/* Email */}
                      <div className="flex flex-col items-center gap-1">
                        <Mail size={13} className="text-stamp-blue" />
                        <Toggle checked={event.email} onChange={() => toggle(event.id, "email")} />
                      </div>
                      {/* Push */}
                      <div className="flex flex-col items-center gap-1">
                        <Smartphone size={13} className="text-stamp-green" />
                        <Toggle checked={event.push} onChange={() => toggle(event.id, "push")} />
                      </div>
                      {/* Slack */}
                      <div className="flex flex-col items-center gap-1">
                        <MessageSquare size={13} className="text-gold-deep" />
                        <Toggle checked={event.slack} onChange={() => toggle(event.id, "slack")} />
                      </div>
                    </div>
                  ))}
                </div>
              </PaperCard>
            );
          })}

          <div className="flex justify-end">
            <Button variant="gold" size="md" icon={<Save size={15} />} onClick={save}>
              Enregistrer les préférences
            </Button>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
