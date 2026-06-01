"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { MapPin, Shield, Bell, Users, Share2, AlertTriangle } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Avatar,
  Badge,
  Button,
  PaperCard,
  Polaroid,
  Stamp,
  Tape,
  Toggle,
  useToast,
} from "@/components/ui";
import { users } from "@/lib/data";

/* ── Synthesize family data (same logic as family/page.tsx) ─────────────── */
const FAMILY_NAMES = [
  "Famille Bernard",
  "Famille Rahmouni",
  "Famille Oliveira",
  "Famille Nakamura",
  "Famille García",
  "Famille Rossi",
  "Famille Andersen",
  "Famille Cohen",
];
const CITIES_LIST = ["Paris", "Lisbonne", "Marrakech", "Barcelone", "Rome", "Tokyo", "Lyon", "Berlin"];
const MEMBER_ROLES = [
  ["Parent", "Parent", "Enfant", "Enfant"],
  ["Parent", "Parent", "Enfant"],
  ["Parent", "Parent", "Enfant", "Adolescent"],
  ["Parent", "Parent", "Enfant"],
  ["Parent", "Enfant", "Enfant", "Enfant"],
  ["Parent", "Parent", "Adolescent"],
  ["Parent", "Parent", "Enfant", "Enfant"],
  ["Parent", "Parent", "Enfant"],
];

const familyGroups = FAMILY_NAMES.map((name, i) => {
  const memberCount = MEMBER_ROLES[i].length;
  const memberUsers = Array.from({ length: memberCount }, (_, j) => users[(i * 5 + j) % users.length]);
  return {
    id: `fam-${i + 1}`,
    name,
    city: CITIES_LIST[i % CITIES_LIST.length],
    members: memberUsers.map((u, j) => ({
      user: u,
      role: MEMBER_ROLES[i][j],
      // Fake pin positions for the map block
      pinX: 20 + ((j * 23 + i * 7) % 60),
      pinY: 20 + ((j * 17 + i * 11) % 55),
    })),
    active: i % 4 !== 3,
    sharing: i % 2 === 0,
    alerts: i % 3 !== 2,
    gpsEphemeral: i % 2 === 1,
    notifications: i % 3 !== 1,
    joined: `2025-${String((i % 11) + 1).padStart(2, "0")}-${String((i * 3 + 1) % 27 + 1).padStart(2, "0")}`,
  };
});

const getFamily = (id: string) => familyGroups.find((f) => f.id === id) ?? familyGroups[0];

export default function FamilyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const family = getFamily(id);

  const [sharing, setSharing] = useState(family.sharing);
  const [alerts, setAlerts] = useState(family.alerts);
  const [gpsEphemeral, setGpsEphemeral] = useState(family.gpsEphemeral);
  const [notifications, setNotifications] = useState(family.notifications);

  return (
    <AdminPage
      title={family.name}
      eyebrow="groupe famille"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/family", label: "Famille" },
        { label: family.name },
      ]}
      actions={
        <Badge tone={family.active ? "green" : "neutral"} dot>
          {family.active ? "mode famille actif" : "inactif"}
        </Badge>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column: Members + map */}
        <div className="xl:col-span-2 space-y-6">
          {/* Members list */}
          <PaperCard shadow="ink" className="p-5 relative overflow-hidden">
            <div className="absolute top-0 right-4">
              <Tape color="cream" rotate={-4} width={64} height={20} />
            </div>
            <div className="flex items-center gap-2 mb-5">
              <Users size={16} className="text-ink-faded" />
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg">
                Membres du groupe
              </h3>
              <span className="ml-auto font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.1em] text-ink-faded">
                {family.members.length} membre{family.members.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="space-y-3">
              {family.members.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 bg-paper-warm/50 rounded-[4px] border-[1.5px] border-[var(--ink-line)]"
                >
                  <Avatar
                    src={m.user.avatar}
                    size={44}
                    ring={m.role === "Parent"}
                    online={i === 0}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-[family-name:var(--font-serif)] font-bold text-[14px] leading-tight">
                      {m.user.firstName} {m.user.lastName}
                    </p>
                    <p className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.08em] text-ink-faded mt-0.5">
                      {m.user.username}
                    </p>
                    <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded">
                      {m.user.email}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <Badge
                      tone={
                        m.role === "Parent"
                          ? "blue"
                          : m.role === "Adolescent"
                          ? "gold"
                          : "neutral"
                      }
                    >
                      {m.role}
                    </Badge>
                    {m.user.verification === "verified" && (
                      <Badge tone="green">
                        <Shield size={9} className="mr-0.5" />
                        sécurisé
                      </Badge>
                    )}
                    {m.user.premium && <Badge tone="gold">premium</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </PaperCard>

          {/* Map-hand block with member pins */}
          <PaperCard shadow="gold" className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-ink-faded" />
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg">
                Carte de groupe
              </h3>
              {sharing ? (
                <Badge tone="green" dot className="ml-auto">
                  partage actif
                </Badge>
              ) : (
                <Badge tone="neutral" className="ml-auto">
                  partage désactivé
                </Badge>
              )}
            </div>

            {/* Map hand block */}
            <div className="map-hand relative rounded-[4px] h-56 overflow-hidden border-[1.5px] border-ink">
              {/* City label */}
              <div className="absolute top-2 left-2 z-10">
                <Stamp color="blue" shape="rect" size={36} rotate={-2} fontSize={8}>
                  {family.city.toUpperCase()}
                </Stamp>
              </div>

              {/* Member pins */}
              {family.members.map((m, i) => (
                <div
                  key={i}
                  className="absolute z-10 flex flex-col items-center"
                  style={{ left: `${m.pinX}%`, top: `${m.pinY}%` }}
                >
                  <Avatar src={m.user.avatar} size={28} ring={m.role === "Parent"} />
                  <div className="w-0.5 h-3 bg-ink opacity-70" />
                  <div className="w-2 h-2 rounded-full bg-ink" />
                  <p className="font-[family-name:var(--font-hand)] text-[10px] mt-0.5 bg-card/90 px-1 rounded whitespace-nowrap">
                    {m.user.firstName}
                  </p>
                </div>
              ))}
            </div>
            <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[12px] mt-3">
              Positions simulées — le partage GPS réel est éphémère et s&apos;arrête en fin de session.
            </p>
          </PaperCard>

          {/* Polaroid gallery strip */}
          <div>
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-base mb-3">
              Souvenirs du groupe
            </h3>
            <div className="flex gap-4 flex-wrap">
              {family.members.slice(0, 4).map((m, i) => (
                <Polaroid
                  key={i}
                  src={`https://picsum.photos/seed/${family.id}-mem${i}/300/300`}
                  caption={`${m.user.firstName} · ${family.city}`}
                  width={120}
                  height={120}
                  tilt={i % 2 === 0 ? 2 : -1.5}
                  captionSize={11}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Settings */}
        <div className="space-y-5">
          {/* Group info */}
          <PaperCard shadow="soft" className="p-5 relative overflow-hidden">
            <div className="absolute top-1 right-1 opacity-60">
              <Stamp color="ink" shape="circle" size={56} rotate={10} fontSize={8}>
                {family.active ? "actif" : "inactif"}
              </Stamp>
            </div>
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-base mb-3">
              Informations
            </h3>
            <dl className="space-y-2 text-[13px]">
              {[
                { label: "Groupe", value: family.name },
                { label: "Ville principale", value: `${family.city}` },
                { label: "Membres", value: `${family.members.length} personnes` },
                { label: "Inscrit depuis", value: family.joined },
              ].map((row) => (
                <div key={row.label} className="flex justify-between gap-2">
                  <dt className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded self-center">
                    {row.label}
                  </dt>
                  <dd className="font-[family-name:var(--font-serif)] font-semibold text-right">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </PaperCard>

          {/* Settings toggles */}
          <PaperCard shadow="ink" className="p-5">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-base mb-4">
              Paramètres du groupe
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Partage de position",
                  desc: "Les membres voient la position des autres en temps réel.",
                  icon: <Share2 size={14} />,
                  value: sharing,
                  onChange: (v: boolean) => {
                    setSharing(v);
                    toast.push(v ? "Partage GPS activé." : "Partage GPS désactivé.", "info");
                  },
                },
                {
                  label: "Alertes de sécurité",
                  desc: "Notifications push si un membre sort de la zone.",
                  icon: <AlertTriangle size={14} />,
                  value: alerts,
                  onChange: (v: boolean) => {
                    setAlerts(v);
                    toast.push(v ? "Alertes activées." : "Alertes désactivées.", "info");
                  },
                },
                {
                  label: "GPS éphémère",
                  desc: "La position n'est partagée que pendant une session active.",
                  icon: <MapPin size={14} />,
                  value: gpsEphemeral,
                  onChange: (v: boolean) => {
                    setGpsEphemeral(v);
                    toast.push(v ? "Mode GPS éphémère activé." : "GPS permanent activé.", "info");
                  },
                },
                {
                  label: "Notifications push",
                  desc: "Résumé quotidien des activités du groupe.",
                  icon: <Bell size={14} />,
                  value: notifications,
                  onChange: (v: boolean) => {
                    setNotifications(v);
                    toast.push(v ? "Notifications activées." : "Notifications désactivées.", "info");
                  },
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-start gap-3 p-3 bg-paper-warm/50 rounded-[4px] border-[1.5px] border-[var(--ink-line)]"
                >
                  <span className="text-ink-faded mt-0.5">{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">
                      {s.label}
                    </p>
                    <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[12px] mt-0.5 leading-snug">
                      {s.desc}
                    </p>
                  </div>
                  <Toggle checked={s.value} onChange={s.onChange} />
                </div>
              ))}
            </div>
          </PaperCard>

          {/* Danger zone */}
          <PaperCard shadow="red" className="p-5">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-base mb-3 text-stamp-red">
              Zone sensible
            </h3>
            <Button
              variant="danger"
              size="sm"
              full
              onClick={() => toast.push(`Le groupe ${family.name} a été dissous.`, "err")}
            >
              Dissoudre le groupe famille
            </Button>
          </PaperCard>
        </div>
      </div>
    </AdminPage>
  );
}
