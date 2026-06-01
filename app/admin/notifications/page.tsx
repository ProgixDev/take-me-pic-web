"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Bell,
  AlertTriangle,
  CreditCard,
  MapPin,
  Users,
  Star,
  Flag,
  CheckCheck,
  Plus,
  Layers,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  PaperCard,
  Badge,
  Button,
  Chip,
  Avatar,
  StatCard,
  useToast,
} from "@/components/ui";
import { adminNotifications, AdminNotification } from "@/lib/data";

type KindFilter = "tous" | AdminNotification["kind"];

const KIND_META: Record<
  AdminNotification["kind"],
  { icon: React.ReactNode; label: string; tone: "red" | "gold" | "green" | "blue" | "neutral" }
> = {
  report: { icon: <Flag size={16} />, label: "Signalement", tone: "red" },
  payment: { icon: <CreditCard size={16} />, label: "Paiement", tone: "gold" },
  spot: { icon: <MapPin size={16} />, label: "Spot", tone: "green" },
  community: { icon: <Users size={16} />, label: "Communauté", tone: "blue" },
  badge: { icon: <Star size={16} />, label: "Badge", tone: "gold" },
  karma: { icon: <Star size={16} />, label: "Karma", tone: "gold" },
  request: { icon: <Bell size={16} />, label: "Demande", tone: "neutral" },
};

// Extend with more notifications for richness
const EXTENDED_NOTIFICATIONS: AdminNotification[] = [
  ...adminNotifications,
  { id: "n6", kind: "karma", body: "Pic de karma — 12 400 points distribués aujourd'hui", meta: "record mensuel", time: "il y a 3 h" },
  { id: "n7", kind: "request", body: "Nouvelle demande de partenariat reçue — Airbnb Expériences", time: "il y a 4 h" },
  { id: "n8", kind: "payment", body: "10 paiements validés cette heure — 498,90 €", time: "il y a 5 h" },
  { id: "n9", kind: "community", body: "Pic d'activité détecté à Lisbonne — +43 % de sessions", time: "hier" },
  { id: "n10", kind: "spot", body: "Spot « Miradouro da Graça » validé par la communauté", time: "hier" },
  { id: "n11", kind: "badge", body: "500ème badge Cœur d'or décerné — Claire B.", time: "il y a 2 jours" },
  { id: "n12", kind: "report", body: "Signalement prioritaire — faux profil détecté", meta: "à traiter", time: "il y a 2 jours" },
];

export default function NotificationsPage() {
  const toast = useToast();
  const [kindFilter, setKindFilter] = useState<KindFilter>("tous");
  const [read, setRead] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const list = EXTENDED_NOTIFICATIONS;
    if (kindFilter === "tous") return list;
    return list.filter((n) => n.kind === kindFilter);
  }, [kindFilter]);

  const unread = EXTENDED_NOTIFICATIONS.filter((n) => !read.has(n.id)).length;

  const markRead = (id: string) => {
    setRead((prev) => new Set([...prev, id]));
    toast.push("Notification marquée comme lue.", "ok");
  };

  const markAllRead = () => {
    setRead(new Set(EXTENDED_NOTIFICATIONS.map((n) => n.id)));
    toast.push("Toutes les notifications ont été marquées comme lues.", "ok");
  };

  const kindCounts = useMemo(() => {
    const counts: Partial<Record<KindFilter, number>> = { tous: EXTENDED_NOTIFICATIONS.length };
    EXTENDED_NOTIFICATIONS.forEach((n) => {
      counts[n.kind] = (counts[n.kind] ?? 0) + 1;
    });
    return counts;
  }, []);

  const filterChips: { key: KindFilter; label: string }[] = [
    { key: "tous", label: "Toutes" },
    { key: "report", label: "Signalements" },
    { key: "payment", label: "Paiements" },
    { key: "spot", label: "Spots" },
    { key: "community", label: "Communauté" },
    { key: "badge", label: "Badges" },
    { key: "karma", label: "Karma" },
    { key: "request", label: "Demandes" },
  ];

  return (
    <AdminPage
      title="Centre de notifications"
      eyebrow="alertes & messages"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { label: "Notifications" },
      ]}
      actions={
        <>
          {unread > 0 && (
            <Button
              variant="paper"
              size="sm"
              icon={<CheckCheck size={14} />}
              onClick={markAllRead}
            >
              Tout marquer lu
            </Button>
          )}
          <Link href="/admin/notifications/templates">
            <Button variant="paper" size="sm" icon={<Layers size={14} />}>
              Modèles
            </Button>
          </Link>
          <Link href="/admin/notifications/new">
            <Button variant="gold" size="sm" icon={<Plus size={14} />}>
              Nouvelle notification
            </Button>
          </Link>
        </>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Non lues"
          value={unread}
          tone={unread > 0 ? "red" : "green"}
          icon={<Bell size={18} />}
        />
        <StatCard
          label="Signalements actifs"
          value={EXTENDED_NOTIFICATIONS.filter((n) => n.kind === "report").length}
          tone="red"
          icon={<AlertTriangle size={18} />}
        />
        <StatCard
          label="Paiements à traiter"
          value={EXTENDED_NOTIFICATIONS.filter((n) => n.kind === "payment").length}
          tone="gold"
          icon={<CreditCard size={18} />}
        />
        <StatCard
          label="Spots en attente"
          value={EXTENDED_NOTIFICATIONS.filter((n) => n.kind === "spot").length}
          tone="blue"
          icon={<MapPin size={18} />}
        />
      </div>

      {/* Kind filter */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mr-1">
          Filtrer :
        </span>
        {filterChips.map((c) => (
          <Chip
            key={c.key}
            color={
              kindFilter === c.key
                ? "ink"
                : c.key === "report"
                ? "red"
                : c.key === "payment"
                ? "gold"
                : c.key === "spot"
                ? "green"
                : c.key === "community"
                ? "blue"
                : "ink"
            }
            variant={kindFilter === c.key ? "filled" : "outline"}
            size="sm"
            onClick={() => setKindFilter(c.key)}
          >
            {c.label}
            {kindCounts[c.key] !== undefined && (
              <span className="ml-1 opacity-70 text-[10px]">
                ({kindCounts[c.key]})
              </span>
            )}
          </Chip>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <PaperCard shadow="soft" className="p-8 text-center">
            <p className="font-[family-name:var(--font-hand)] text-2xl text-ink-faded">
              Aucune notification pour ce filtre.
            </p>
          </PaperCard>
        )}
        {filtered.map((notif) => {
          const meta = KIND_META[notif.kind];
          const isRead = read.has(notif.id);
          return (
            <PaperCard
              key={notif.id}
              shadow={isRead ? "soft" : "ink"}
              className={`p-4 transition-all ${isRead ? "opacity-60" : ""}`}
            >
              <div className="flex items-start gap-3">
                {/* Kind icon */}
                <div
                  className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center border-[1.5px] ${
                    meta.tone === "red"
                      ? "bg-stamp-red/10 border-stamp-red/30 text-stamp-red"
                      : meta.tone === "gold"
                      ? "bg-gold-light/20 border-gold-deep/30 text-gold-deep"
                      : meta.tone === "green"
                      ? "bg-stamp-green/10 border-stamp-green/30 text-stamp-green"
                      : meta.tone === "blue"
                      ? "bg-stamp-blue/10 border-stamp-blue/30 text-stamp-blue"
                      : "bg-paper-2 border-[var(--ink-line)] text-ink-faded"
                  }`}
                >
                  {meta.icon}
                </div>

                {/* Avatar */}
                {notif.avatar && (
                  <Avatar src={notif.avatar} size={32} className="shrink-0" />
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge tone={meta.tone === "neutral" ? "neutral" : meta.tone} className="mb-1">
                        {meta.label}
                      </Badge>
                      {!isRead && (
                        <span className="ml-2 inline-block w-2 h-2 rounded-full bg-stamp-red" />
                      )}
                      <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink leading-snug mt-0.5">
                        {notif.body}
                      </p>
                      {notif.meta && (
                        <p className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.08em] text-ink-faded mt-0.5">
                          {notif.meta}
                        </p>
                      )}
                    </div>
                    <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded whitespace-nowrap shrink-0">
                      {notif.time}
                    </span>
                  </div>

                  {/* Actions */}
                  {!isRead && (
                    <div className="mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<CheckCheck size={13} />}
                        onClick={() => markRead(notif.id)}
                      >
                        marquer comme lu
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </PaperCard>
          );
        })}
      </div>
    </AdminPage>
  );
}
