"use client";

import { useState, useTransition } from "react";
import { ShieldOff, ShieldCheck, Star, Camera, Users, Heart, MapPin } from "lucide-react";
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
  Textarea,
  useToast,
  fmtNum,
} from "@/components/ui";
import { banUser, unbanUser } from "@/lib/admin/moderation-actions";
import type { UserDetailModel } from "@/lib/admin/users";

const STATUS_LABEL: Record<UserDetailModel["status"], string> = {
  active: "actif",
  suspended: "suspendu",
  banned: "banni",
};

const ROLE_LABEL: Record<string, string> = {
  moderator: "Modérateur",
  admin: "Admin",
  super_admin: "Super admin",
};

function actionErrorMessage(result: { kind: string; message?: string }) {
  if (result.kind === "unauthenticated") return "Session Supabase manquante. Reconnecte-toi.";
  if (result.kind === "unauthorized") return "Ce compte n'a pas les droits staff pour cette action.";
  return result.message ?? "L'action de modération a échoué.";
}

export function UserDetailClient({ user }: { user: UserDetailModel }) {
  const toast = useToast();
  const [tab, setTab] = useState("profil");
  const [banOpen, setBanOpen] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [pending, startTransition] = useTransition();

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  const handleBan = () => {
    startTransition(async () => {
      const result = await banUser(user.id, banReason);
      if (result.kind === "ok") {
        toast.push(`${user.firstName} est banni·e.`, "ok");
        setBanOpen(false);
        setBanReason("");
      } else {
        toast.push(actionErrorMessage(result), "err");
      }
    });
  };

  const handleUnban = () => {
    if (!user.activeBan) return;
    startTransition(async () => {
      const result = await unbanUser(user.activeBan!.id);
      if (result.kind === "ok") {
        toast.push("Ban levé.", "ok");
      } else {
        toast.push(actionErrorMessage(result), "err");
      }
    });
  };

  const openReports = user.reports.filter((r) => r.status === "open" || r.status === "reviewing").length;

  return (
    <AdminPage
      title={fullName}
      eyebrow="profil utilisateur"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/users", label: "Utilisateurs" },
        { label: fullName },
      ]}
      actions={
        user.activeBan ? (
          <Button variant="paper" size="sm" icon={<ShieldCheck size={14} />} disabled={pending} onClick={handleUnban}>
            Lever le ban
          </Button>
        ) : (
          <Button variant="danger" size="sm" icon={<ShieldOff size={14} />} onClick={() => setBanOpen(true)}>
            Bannir
          </Button>
        )
      }
    >
      <div className="relative rounded-[4px] overflow-hidden mb-8 border-[1.5px] border-ink shadow-ink-sm">
        <div
          className="h-52 bg-cover bg-center bg-paper-warm"
          style={user.coverUrl ? { backgroundImage: `url(${user.coverUrl})` } : undefined}
        />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-1/80 to-transparent" />
        <div className="absolute -bottom-10 left-6">
          <Polaroid
            src={user.avatarUrl ?? `https://api.dicebear.com/9.x/initials/svg?seed=${user.username}`}
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
        {user.isPremium && (
          <div className="absolute top-3 left-3">
            <Stamp color="gold" shape="circle" size={52} rotate={12} fontSize={9}>
              {"1ère\nclasse"}
            </Stamp>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-start justify-between gap-6 mb-6">
        <div>
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-2xl tracking-[-0.01em]">{fullName}</h2>
          <p className="font-[family-name:var(--font-type)] text-[12px] uppercase tracking-[0.1em] text-ink-faded mt-0.5">
            {user.username}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge tone={user.status === "active" ? "green" : user.status === "suspended" ? "sunset" : "red"} dot>
              {STATUS_LABEL[user.status]}
            </Badge>
            <Badge tone={user.verification === "verified" ? "green" : user.verification === "partial" ? "gold" : "neutral"}>
              {user.verification === "verified"
                ? "vérifié"
                : user.verification === "partial"
                ? "vérif. partielle"
                : "non vérifié"}
            </Badge>
            {user.isPremium && <Badge tone="gold">Premium</Badge>}
            {user.roles.map((role) => (
              <Badge key={role} tone="blue">
                {ROLE_LABEL[role] ?? role}
              </Badge>
            ))}
            {openReports > 0 && (
              <Badge tone="red">
                {openReports} signalement{openReports > 1 ? "s" : ""} actif{openReports > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
          {user.bio && (
            <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[14px] mt-3 max-w-sm">
              {user.bio}
            </p>
          )}
          {user.city && (
            <div className="flex items-center gap-1.5 mt-2 text-ink-faded">
              <MapPin size={13} />
              <span className="font-[family-name:var(--font-serif)] text-[13px]">{user.city}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {[
            { icon: <Star size={15} />, label: "Karma", value: fmtNum(user.karma), tone: "text-gold-deep" },
            { icon: <Camera size={15} />, label: "Photos", value: fmtNum(user.photosCount), tone: "text-stamp-blue" },
            { icon: <Users size={15} />, label: "Abonnés", value: fmtNum(user.followers), tone: "text-ink" },
            { icon: <Heart size={15} />, label: "Note", value: `${user.rating.toFixed(1)} ★`, tone: "text-sunset" },
          ].map((s) => (
            <PaperCard key={s.label} shadow="soft" className="p-3 text-center min-w-[90px]">
              <span className={`flex justify-center mb-1 ${s.tone}`}>{s.icon}</span>
              <div className={`font-[family-name:var(--font-serif)] font-bold text-xl ${s.tone}`}>{s.value}</div>
              <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.1em] text-ink-faded mt-0.5">
                {s.label}
              </div>
            </PaperCard>
          ))}
        </div>
      </div>

      {user.activeBan && (
        <PaperCard shadow="red" className="p-4 mb-6">
          <p className="font-[family-name:var(--font-serif)] text-[14px]">
            <strong>Ban actif</strong> — {user.activeBan.reason}
          </p>
          <p className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded mt-1">
            {user.activeBan.expiresAt ? `Expire le ${user.activeBan.expiresAt}` : "Permanent"}
            {user.activeBan.bannedBy ? ` · par ${user.activeBan.bannedBy.username}` : ""}
          </p>
        </PaperCard>
      )}

      <Tabs
        tabs={[
          { key: "profil", label: "Profil" },
          { key: "signalements", label: `Signalements (${user.reports.length})` },
        ]}
        value={tab}
        onChange={setTab}
        className="mb-5"
      />

      {tab === "profil" && (
        <PaperCard shadow="ink" className="p-5">
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-4">Informations du compte</h3>
          <div className="grid grid-cols-2 gap-3 text-[13px] font-[family-name:var(--font-serif)]">
            {[
              { label: "Inscrit·e", value: user.memberSince },
              { label: "Langues", value: user.languages.length ? user.languages.join(", ") : "—" },
              { label: "Âge", value: user.age != null ? String(user.age) : "—" },
              { label: "Téléphone", value: user.phone ?? "—" },
              { label: "E-mail confirmé", value: user.emailVerified ? "oui" : "non" },
              { label: "Téléphone vérifié", value: user.phoneVerified ? "oui" : "non" },
              { label: "Spots ajoutés", value: String(user.spotsCount) },
              { label: "Abonnements", value: fmtNum(user.following) },
            ].map((f) => (
              <div key={f.label} className="bg-paper-warm/60 rounded p-3">
                <span className="text-ink-faded text-[11px] font-[family-name:var(--font-type)] uppercase tracking-[0.08em] block mb-1">
                  {f.label}
                </span>
                <span className="font-semibold">{f.value}</span>
              </div>
            ))}
          </div>
        </PaperCard>
      )}

      {tab === "signalements" && (
        <PaperCard shadow="red" className="p-5">
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-4">Signalements reçus</h3>
          {user.reports.length === 0 ? (
            <p className="font-[family-name:var(--font-serif)] italic text-ink-faded">
              Aucun signalement pour cet utilisateur.
            </p>
          ) : (
            <div className="space-y-3">
              {user.reports.map((r) => (
                <div
                  key={r.id}
                  className="flex items-start gap-4 p-3 bg-paper-warm/50 rounded-[4px] border-[1.5px] border-[var(--ink-line)]"
                >
                  <Avatar src={r.reporter?.avatarUrl ?? undefined} size={32} />
                  <div className="flex-1 min-w-0">
                    <p className="font-[family-name:var(--font-serif)] text-[14px] font-semibold">{r.reason}</p>
                    <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded mt-0.5">
                      Signalé par {r.reporter ? r.reporter.username : "profil supprimé"} · {r.createdAt}
                    </p>
                  </div>
                  <Badge tone={r.status === "open" ? "red" : r.status === "reviewing" ? "blue" : "neutral"} dot>
                    {r.status === "open" ? "ouvert" : r.status === "reviewing" ? "en cours" : r.status === "resolved" ? "résolu" : "ignoré"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </PaperCard>
      )}

      <Modal
        open={banOpen}
        onClose={() => setBanOpen(false)}
        title="Bannir ce compte ?"
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setBanOpen(false)}>
              Annuler
            </Button>
            <Button variant="danger" size="sm" disabled={pending || banReason.trim().length === 0} onClick={handleBan}>
              Confirmer le ban
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded leading-relaxed mb-3">
          Le compte de <strong>{fullName}</strong> sera banni immédiatement et l&apos;action sera journalisée.
        </p>
        <Textarea
          label="Motif du ban"
          value={banReason}
          onChange={(e) => setBanReason(e.target.value)}
          placeholder="Motif obligatoire…"
          rows={3}
        />
      </Modal>
    </AdminPage>
  );
}
