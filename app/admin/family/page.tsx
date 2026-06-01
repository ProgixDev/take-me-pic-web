"use client";

import { useRouter } from "next/navigation";
import { Users, MapPin, Shield } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Avatar,
  Badge,
  Button,
  PaperCard,
  StatCard,
  Stamp,
  Tape,
  useToast,
} from "@/components/ui";
import { users, fmtNum } from "@/lib/data";

// Synthesize 8 family groups from the users array
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
    members: memberUsers.map((u, j) => ({ user: u, role: MEMBER_ROLES[i][j] })),
    active: i % 4 !== 3,
    sharing: i % 2 === 0,
    alerts: i % 3 !== 2,
    joined: `2025-${String((i % 11) + 1).padStart(2, "0")}-${String((i * 3 + 1) % 27 + 1).padStart(2, "0")}`,
  };
});

export default function FamilyPage() {
  const router = useRouter();
  const toast = useToast();

  const totalGroups = familyGroups.length;
  const activeGroups = familyGroups.filter((f) => f.active).length;
  const sharingGroups = familyGroups.filter((f) => f.sharing).length;
  const totalMembers = familyGroups.reduce((acc, f) => acc + f.members.length, 0);

  return (
    <AdminPage
      title="Comptes Famille"
      eyebrow="mode famille"
      breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Famille" }]}
      actions={
        <Button
          variant="paper"
          size="sm"
          onClick={() => toast.push("Export des groupes en cours…", "info")}
        >
          Exporter
        </Button>
      }
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Groupes famille"
          value={fmtNum(totalGroups)}
          tone="ink"
          icon={<Users size={18} />}
        />
        <StatCard
          label="Groupes actifs"
          value={fmtNum(activeGroups)}
          delta="+3 ce mois"
          tone="green"
          icon={<Shield size={18} />}
        />
        <StatCard
          label="Partage de position"
          value={fmtNum(sharingGroups)}
          tone="blue"
          icon={<MapPin size={18} />}
        />
        <StatCard
          label="Membres au total"
          value={fmtNum(totalMembers)}
          tone="gold"
          icon={<Users size={18} />}
        />
      </div>

      {/* Family cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {familyGroups.map((group, gi) => (
          <PaperCard
            key={group.id}
            shadow="ink"
            className="p-5 relative overflow-hidden cursor-pointer hover:shadow-gold transition"
            onClick={() => router.push(`/admin/family/${group.id}`)}
          >
            {/* Decorative tape */}
            <div className="absolute top-0 right-6">
              <Tape color={gi % 3 === 0 ? "cream" : gi % 3 === 1 ? "blue" : "red"} rotate={gi % 2 === 0 ? 4 : -3} width={56} height={18} />
            </div>

            {/* Stamp for active groups */}
            {group.active && (
              <div className="absolute top-2 left-2 opacity-70">
                <Stamp color="green" shape="circle" size={42} rotate={-8} fontSize={7}>
                  {"mode\nfamille"}
                </Stamp>
              </div>
            )}

            {/* Header */}
            <div className="mt-3 mb-4">
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg leading-tight">
                {group.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={12} className="text-ink-faded" />
                <span className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded">
                  {group.city}
                </span>
                <span className="mx-1 text-ink-faded/40">·</span>
                <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.08em] text-ink-faded">
                  depuis {group.joined}
                </span>
              </div>
            </div>

            {/* Status badges */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              <Badge tone={group.active ? "green" : "neutral"} dot>
                {group.active ? "actif" : "inactif"}
              </Badge>
              {group.sharing && (
                <Badge tone="blue">
                  <MapPin size={9} className="mr-0.5" />
                  partage GPS
                </Badge>
              )}
              {group.alerts && (
                <Badge tone="gold">alertes activées</Badge>
              )}
            </div>

            {/* Members avatars */}
            <div className="flex flex-col gap-2">
              {group.members.map((m, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Avatar src={m.user.avatar} size={32} ring={m.role === "Parent"} />
                  <div className="flex-1 min-w-0">
                    <p className="font-[family-name:var(--font-serif)] text-[13px] font-semibold truncate">
                      {m.user.firstName} {m.user.lastName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge
                      tone={m.role === "Parent" ? "blue" : m.role === "Adolescent" ? "gold" : "neutral"}
                    >
                      {m.role}
                    </Badge>
                    {m.user.verification === "verified" && (
                      <Badge tone="green">sécurisé</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-dashed border-[var(--ink-line)] flex items-center justify-between">
              <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.08em] text-ink-faded">
                {group.members.length} membre{group.members.length > 1 ? "s" : ""}
              </span>
              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/admin/family/${group.id}`); }}>
                Voir le détail →
              </Button>
            </div>
          </PaperCard>
        ))}
      </div>
    </AdminPage>
  );
}
