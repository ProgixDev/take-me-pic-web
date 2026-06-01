"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageCircle,
  ShieldOff,
  Trash2,
  BadgeCheck,
  Star,
  Camera,
  Users,
  Heart,
  MapPin,
  Edit2,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Avatar,
  Badge,
  Button,
  Modal,
  PaperCard,
  Polaroid,
  Stamp,
  Tabs,
  Tape,
  useToast,
} from "@/components/ui";
import { getUser, users, fmtNum } from "@/lib/data";

// Grab some posts for activity tab
const SAMPLE_CAPTIONS = [
  "Heure dorée sur la place ✿",
  "Lumière du matin incroyable ☼",
  "Contre-jour maîtrisé 📸",
  "Le meilleur angle de la rue",
  "Portrait improvisé — merci à toi !",
];

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const user = getUser(id);

  const [tab, setTab] = useState("activite");
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Build fake reports for this user
  const userReports = Array.from({ length: Math.max(user.reports, 1) }, (_, i) => ({
    id: `r${i}`,
    reason: ["Comportement déplacé", "Faux profil", "Harcèlement", "Spam"][i % 4],
    reporter: users[(i * 6 + 3) % users.length],
    date: `2026-05-${String(12 + i).padStart(2, "0")}`,
    status: i === 0 ? "open" : "resolved",
  }));

  const statusTone =
    user.status === "active"
      ? "green"
      : user.status === "pending"
      ? "gold"
      : user.status === "suspended"
      ? "sunset"
      : "red";

  const verifTone =
    user.verification === "verified"
      ? "green"
      : user.verification === "partial"
      ? "gold"
      : "neutral";

  return (
    <AdminPage
      title={`${user.firstName} ${user.lastName}`}
      eyebrow="profil utilisateur"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/users", label: "Utilisateurs" },
        { label: `${user.firstName} ${user.lastName}` },
      ]}
      actions={
        <>
          <Button
            variant="paper"
            size="sm"
            icon={<MessageCircle size={14} />}
            onClick={() => toast.push(`Message envoyé à ${user.firstName}.`, "info")}
          >
            Envoyer un message
          </Button>
          <Button
            variant="paper"
            size="sm"
            icon={<BadgeCheck size={14} />}
            onClick={() => toast.push(`${user.firstName} est maintenant vérifié·e.`, "ok")}
          >
            Vérifier
          </Button>
          <Button
            variant="paper"
            size="sm"
            icon={<ShieldOff size={14} />}
            onClick={() => setSuspendOpen(true)}
          >
            Suspendre
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={14} />}
            onClick={() => setDeleteOpen(true)}
          >
            Supprimer
          </Button>
          <Link href={`/admin/users/${user.id}/edit`}>
            <Button variant="gold" size="sm" icon={<Edit2 size={14} />}>
              Modifier
            </Button>
          </Link>
        </>
      }
    >
      {/* Cover + Polaroid avatar */}
      <div className="relative rounded-[4px] overflow-hidden mb-8 border-[1.5px] border-ink shadow-ink-sm">
        <div
          className="h-52 bg-cover bg-center"
          style={{ backgroundImage: `url(${user.cover ?? `https://picsum.photos/seed/${user.id}/1200/400`})` }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-1/80 to-transparent" />
        <div className="absolute -bottom-10 left-6">
          <Polaroid
            src={user.avatar}
            caption={user.username}
            width={100}
            height={100}
            tilt={-2}
            captionSize={11}
          />
        </div>
        <div className="absolute top-3 right-3">
          <Tape color="cream" rotate={-5} width={80} height={22} />
        </div>
        {user.premium && (
          <div className="absolute top-3 left-3">
            <Stamp color="gold" shape="circle" size={52} rotate={12} fontSize={9}>
              {"1ère\nclasse"}
            </Stamp>
          </div>
        )}
      </div>

      {/* Profile info block */}
      <div className="mt-10 flex flex-wrap items-start justify-between gap-6 mb-6">
        <div>
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-2xl tracking-[-0.01em]">
            {user.firstName} {user.lastName}
          </h2>
          <p className="font-[family-name:var(--font-type)] text-[12px] uppercase tracking-[0.1em] text-ink-faded mt-0.5">
            {user.username}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge
              tone={statusTone === "sunset" ? "red" : (statusTone as "green" | "gold" | "red")}
              dot
            >
              {user.status === "active"
                ? "actif"
                : user.status === "pending"
                ? "en attente"
                : user.status === "suspended"
                ? "suspendu"
                : "banni"}
            </Badge>
            <Badge tone={verifTone as "green" | "gold" | "neutral"}>
              {user.verification === "verified"
                ? "vérifié"
                : user.verification === "partial"
                ? "vérif. partielle"
                : "non vérifié"}
            </Badge>
            {user.premium && <Badge tone="gold">Premium</Badge>}
            {user.reports > 0 && (
              <Badge tone="red">{user.reports} signalement{user.reports > 1 ? "s" : ""}</Badge>
            )}
          </div>
          <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[14px] mt-3 max-w-sm">
            {user.bio}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-ink-faded">
            <MapPin size={13} />
            <span className="font-[family-name:var(--font-serif)] text-[13px]">
              {user.country} {user.city}
            </span>
          </div>
        </div>

        {/* Stat strip */}
        <div className="flex flex-wrap gap-3">
          {[
            { icon: <Star size={15} />, label: "Karma", value: fmtNum(user.karma), tone: "text-gold-deep" },
            { icon: <Camera size={15} />, label: "Photos données", value: fmtNum(user.photosGiven), tone: "text-stamp-blue" },
            { icon: <Camera size={15} />, label: "Photos reçues", value: fmtNum(user.photosReceived), tone: "text-stamp-green" },
            { icon: <Users size={15} />, label: "Abonnés", value: fmtNum(user.followers), tone: "text-ink" },
            { icon: <Heart size={15} />, label: "Note", value: `${user.rating.toFixed(1)} ★`, tone: "text-sunset" },
          ].map((s) => (
            <PaperCard key={s.label} shadow="soft" className="p-3 text-center min-w-[90px]">
              <span className={`flex justify-center mb-1 ${s.tone}`}>{s.icon}</span>
              <div className={`font-[family-name:var(--font-serif)] font-bold text-xl ${s.tone}`}>
                {s.value}
              </div>
              <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.1em] text-ink-faded mt-0.5">
                {s.label}
              </div>
            </PaperCard>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { key: "activite", label: "Activité" },
          { key: "photos", label: "Photos" },
          { key: "signalements", label: `Signalements (${user.reports})` },
        ]}
        value={tab}
        onChange={setTab}
        className="mb-5"
      />

      {/* Tab: Activité */}
      {tab === "activite" && (
        <PaperCard shadow="ink" className="p-5">
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-4">
            Dernière activité
          </h3>
          <div className="space-y-3">
            {[
              { icon: "📸", text: `A pris une photo pour ${users[(users.indexOf(user) + 2) % users.length].firstName}`, time: "il y a 2 h" },
              { icon: "⭐", text: "A reçu une note 5 étoiles", time: "il y a 5 h" },
              { icon: "🗺️", text: `A ajouté le spot « ${["Pont des Arts", "Jemaa el-Fna", "Alfama"][users.indexOf(user) % 3]} »`, time: "hier" },
              { icon: "🤝", text: `S'est abonné·e à ${users[(users.indexOf(user) + 5) % users.length].firstName}`, time: "hier" },
              { icon: "🏅", text: "A débloqué le badge Œil de lynx", time: "il y a 3 jours" },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-dashed border-[var(--ink-line)] last:border-0">
                <span className="text-lg">{a.icon}</span>
                <span className="font-[family-name:var(--font-serif)] text-[14px] text-ink flex-1">
                  {a.text}
                </span>
                <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded whitespace-nowrap">
                  {a.time}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-[13px] font-[family-name:var(--font-serif)]">
            <div className="bg-paper-warm/60 rounded p-3">
              <span className="text-ink-faded text-[11px] font-[family-name:var(--font-type)] uppercase tracking-[0.08em] block mb-1">
                Inscrit·e
              </span>
              <span className="font-semibold">{user.joined}</span>
            </div>
            <div className="bg-paper-warm/60 rounded p-3">
              <span className="text-ink-faded text-[11px] font-[family-name:var(--font-type)] uppercase tracking-[0.08em] block mb-1">
                Dernière connexion
              </span>
              <span className="font-semibold">{user.lastSeen}</span>
            </div>
            <div className="bg-paper-warm/60 rounded p-3">
              <span className="text-ink-faded text-[11px] font-[family-name:var(--font-type)] uppercase tracking-[0.08em] block mb-1">
                Langues
              </span>
              <span className="font-semibold">{user.languages.join(" ")}</span>
            </div>
            <div className="bg-paper-warm/60 rounded p-3">
              <span className="text-ink-faded text-[11px] font-[family-name:var(--font-type)] uppercase tracking-[0.08em] block mb-1">
                Spots ajoutés
              </span>
              <span className="font-semibold">{user.spotsAdded}</span>
            </div>
          </div>
        </PaperCard>
      )}

      {/* Tab: Photos */}
      {tab === "photos" && (
        <div>
          <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[14px] mb-4">
            Les {user.photosGiven} photos prises par {user.firstName} pour d&apos;autres voyageurs.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, i) => (
              <Polaroid
                key={i}
                src={`https://picsum.photos/seed/${user.id}-photo${i}/400/400`}
                caption={SAMPLE_CAPTIONS[i % SAMPLE_CAPTIONS.length]}
                width={160}
                height={160}
                tilt={(i % 3 === 0 ? 1 : i % 3 === 1 ? -1.5 : 0.5)}
                captionSize={11}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab: Signalements */}
      {tab === "signalements" && (
        <PaperCard shadow="red" className="p-5">
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-4">
            Signalements reçus
          </h3>
          {user.reports === 0 ? (
            <p className="font-[family-name:var(--font-serif)] italic text-ink-faded">
              Aucun signalement actif pour cet utilisateur.
            </p>
          ) : (
            <div className="space-y-3">
              {userReports.map((r) => (
                <div
                  key={r.id}
                  className="flex items-start gap-4 p-3 bg-paper-warm/50 rounded-[4px] border-[1.5px] border-[var(--ink-line)]"
                >
                  <Avatar src={r.reporter.avatar} size={32} />
                  <div className="flex-1 min-w-0">
                    <p className="font-[family-name:var(--font-serif)] text-[14px] font-semibold">
                      {r.reason}
                    </p>
                    <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded mt-0.5">
                      Signalé par {r.reporter.firstName} {r.reporter.lastName} · {r.date}
                    </p>
                  </div>
                  <Badge tone={r.status === "open" ? "red" : "neutral"} dot>
                    {r.status === "open" ? "ouvert" : "résolu"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </PaperCard>
      )}

      {/* Suspend Modal */}
      <Modal
        open={suspendOpen}
        onClose={() => setSuspendOpen(false)}
        title="Suspendre ce compte ?"
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setSuspendOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setSuspendOpen(false);
                toast.push(`Le compte de ${user.firstName} a été suspendu.`, "err");
              }}
            >
              Confirmer la suspension
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded leading-relaxed">
          Le compte de <strong>{user.firstName} {user.lastName}</strong> sera suspendu immédiatement.
          L&apos;utilisateur·ice ne pourra plus se connecter jusqu&apos;à la levée de la mesure.
        </p>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Supprimer définitivement ?"
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setDeleteOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setDeleteOpen(false);
                toast.push(`Compte de ${user.firstName} supprimé.`, "err");
                router.push("/admin/users");
              }}
            >
              Supprimer définitivement
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded leading-relaxed">
          Cette action est <strong>irréversible</strong>. Toutes les données de{" "}
          <strong>{user.firstName} {user.lastName}</strong> seront effacées : photos, karma, sessions,
          avis.
        </p>
      </Modal>
    </AdminPage>
  );
}
