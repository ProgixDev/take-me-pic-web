"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Bell,
  MapPin,
  Users,
  Star,
  Smartphone,
  Plus,
  Layers,
  Megaphone,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { PaperCard, Badge, Button, Chip, Avatar, StatCard } from "@/components/ui";
import type { NotificationKind, NotificationsOverview, NotificationListItem } from "@/lib/admin/notifications";
import { formatDateTime } from "@/components/admin/support/status";

type KindFilter = "tous" | NotificationKind;

const KIND_META: Record<
  NotificationKind,
  { icon: React.ReactNode; label: string; tone: "red" | "gold" | "green" | "blue" | "neutral" }
> = {
  request: { icon: <Bell size={16} />, label: "Demande", tone: "blue" },
  karma: { icon: <Star size={16} />, label: "Karma", tone: "gold" },
  community: { icon: <Users size={16} />, label: "Communauté", tone: "green" },
  badge: { icon: <Star size={16} />, label: "Badge", tone: "gold" },
  spot: { icon: <MapPin size={16} />, label: "Spot", tone: "green" },
  system: { icon: <Megaphone size={16} />, label: "Système", tone: "red" },
};

const FILTER_CHIPS: { key: KindFilter; label: string }[] = [
  { key: "tous", label: "Toutes" },
  { key: "request", label: "Demandes" },
  { key: "system", label: "Système" },
  { key: "karma", label: "Karma" },
  { key: "community", label: "Communauté" },
  { key: "badge", label: "Badges" },
  { key: "spot", label: "Spots" },
];

function recipientName(notif: NotificationListItem) {
  if (!notif.recipient) return "Profil supprimé";
  return notif.recipient.username;
}

export function NotificationsClient({ overview }: { overview: NotificationsOverview }) {
  const { notifications, pushStats } = overview;
  const [kindFilter, setKindFilter] = useState<KindFilter>("tous");

  const filtered = useMemo(() => {
    if (kindFilter === "tous") return notifications;
    return notifications.filter((n) => n.kind === kindFilter);
  }, [notifications, kindFilter]);

  const unread = notifications.filter((n) => n.readAt === null).length;
  const appleDevices = pushStats.find((s) => s.platform === "apple")?.deviceCount ?? 0;
  const googleDevices = pushStats.find((s) => s.platform === "google")?.deviceCount ?? 0;

  const kindCounts = useMemo(() => {
    const counts: Partial<Record<KindFilter, number>> = { tous: notifications.length };
    notifications.forEach((n) => {
      counts[n.kind] = (counts[n.kind] ?? 0) + 1;
    });
    return counts;
  }, [notifications]);

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
          label="Notifications (50 dern.)"
          value={notifications.length}
          tone="ink"
          icon={<Bell size={18} />}
        />
        <StatCard
          label="Non lues"
          value={unread}
          tone={unread > 0 ? "gold" : "green"}
          icon={<Bell size={18} />}
        />
        <StatCard
          label="Appareils iOS"
          value={appleDevices}
          tone="blue"
          icon={<Smartphone size={18} />}
        />
        <StatCard
          label="Appareils Android"
          value={googleDevices}
          tone="green"
          icon={<Smartphone size={18} />}
        />
      </div>

      {/* Kind filter */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mr-1">
          Filtrer :
        </span>
        {FILTER_CHIPS.map((c) => (
          <Chip
            key={c.key}
            color={kindFilter === c.key ? "ink" : c.key === "system" ? "red" : "ink"}
            variant={kindFilter === c.key ? "filled" : "outline"}
            size="sm"
            onClick={() => setKindFilter(c.key)}
          >
            {c.label}
            {kindCounts[c.key] !== undefined && (
              <span className="ml-1 opacity-70 text-[10px]">({kindCounts[c.key]})</span>
            )}
          </Chip>
        ))}
      </div>

      {/* Notification list — read-only inspection: the read state belongs to the
          recipient, staff never mutate it. */}
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
          const isRead = notif.readAt !== null;
          return (
            <PaperCard
              key={notif.id}
              shadow={isRead ? "soft" : "ink"}
              className={`p-4 transition-all ${isRead ? "opacity-70" : ""}`}
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

                {/* Recipient avatar */}
                <Avatar src={notif.recipient?.avatarUrl ?? undefined} size={32} className="shrink-0" />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge tone={meta.tone} className="mb-1">
                        {meta.label}
                      </Badge>
                      <Badge tone={isRead ? "neutral" : "gold"} className="mb-1 ml-2" dot>
                        {isRead ? "lue" : "non lue"}
                      </Badge>
                      {notif.dataType && (
                        <span className="ml-2 font-[family-name:var(--font-mono)] text-[10px] text-ink-faded">
                          {notif.dataType}
                        </span>
                      )}
                      <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink leading-snug mt-0.5">
                        {notif.body}
                      </p>
                      <p className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded mt-0.5">
                        {notif.recipient ? (
                          <Link
                            href={`/admin/users/${notif.recipient.id}`}
                            className="hover:underline text-stamp-blue"
                          >
                            {recipientName(notif)}
                          </Link>
                        ) : (
                          recipientName(notif)
                        )}
                      </p>
                    </div>
                    <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded whitespace-nowrap shrink-0">
                      {formatDateTime(notif.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </PaperCard>
          );
        })}
      </div>
    </AdminPage>
  );
}
