"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Gavel } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  PaperCard,
  Badge,
  Avatar,
  Button,
  Modal,
  Stamp,
  Chip,
  useToast,
} from "@/components/ui";
import { users } from "@/lib/data";

interface Appeal {
  id: string;
  user: (typeof users)[0];
  banReason: string;
  bannedAt: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
}

const APPEALS: Appeal[] = [
  {
    id: "ap1",
    user: users.find((u) => u.status === "banned") ?? users[7],
    banReason: "Comportement abusif signalé par plusieurs utilisateurs",
    bannedAt: "2026-04-12",
    message:
      "Bonjour, je pense qu'il y a eu une erreur dans mon bannissement. Je n'ai jamais harcelé personne et mes échanges étaient toujours respectueux. Je demande une révision de cette décision, car j'utilise l'application depuis deux ans sans aucun problème antérieur. Je suis prêt à fournir toute preuve nécessaire.",
    status: "pending",
  },
  {
    id: "ap2",
    user: users.find((u) => u.status === "suspended") ?? users[16],
    banReason: "Spam de messages commerciaux",
    bannedAt: "2026-04-28",
    message:
      "J'admets avoir envoyé plusieurs messages pour présenter mon studio photo, mais je ne savais pas que c'était interdit. J'ai lu les règles depuis et je comprends. Cela ne se reproduira plus. Ma suspension m'empêche de continuer mon voyage photo et j'espère que vous pouvez lever la sanction.",
    status: "pending",
  },
  {
    id: "ap3",
    user: users[8 * 3] ?? users[2],
    banReason: "Faux profil — identité non vérifiable",
    bannedAt: "2026-05-01",
    message:
      "Mon compte a été banni car mes documents d'identité n'ont pas été acceptés. J'ai depuis scanné ma pièce d'identité en haute résolution et je la joins à cet appel. Je suis bien la personne que je prétends être et je peux organiser une vidéo de vérification si nécessaire.",
    status: "pending",
  },
  {
    id: "ap4",
    user: users[17 * 2 % users.length],
    banReason: "Photo volée — contenu signalé par l'auteur original",
    bannedAt: "2026-05-08",
    message:
      "La photo en question m'appartient bien, je l'ai prise moi-même au Pont des Arts en mars 2025. L'accusation est fausse. Je peux fournir les métadonnées EXIF originales de la photo pour prouver que j'en suis bien l'auteur. Je demande une révision urgente.",
    status: "pending",
  },
  {
    id: "ap5",
    user: users[(9 * 5) % users.length],
    banReason: "Contenu inapproprié partagé dans la communauté",
    bannedAt: "2026-05-15",
    message:
      "Je partageais une photo artistique qui, je le concède, était limite. Cependant, je ne pensais pas qu'elle violait les règles de la communauté. J'ai supprimé le contenu dès que j'en ai été informé. Je suis un membre actif depuis 18 mois et je contribue positivement à la communauté. Merci de reconsidérer.",
    status: "pending",
  },
  {
    id: "ap6",
    user: users[(11 * 4) % users.length],
    banReason: "Multi-comptes détectés",
    bannedAt: "2026-05-18",
    message:
      "Les deux comptes que vous avez associés appartiennent à moi et à ma femme. Nous utilisons souvent le même appareil, ce qui explique la détection d'activité similaire. Nous pouvons prouver que nous sommes deux personnes distinctes avec nos documents respectifs. Merci de lever le blocage.",
    status: "pending",
  },
];

export default function AppealsPage() {
  const { push } = useToast();
  const [statuses, setStatuses] = useState<Record<string, Appeal["status"]>>(
    Object.fromEntries(APPEALS.map((a) => [a.id, a.status]))
  );
  const [confirmAppeal, setConfirmAppeal] = useState<{
    appeal: Appeal;
    action: "accepted" | "rejected";
  } | null>(null);
  const [filterStatus, setFilterStatus] = useState<"tous" | "pending" | "accepted" | "rejected">("tous");

  function handleConfirm() {
    if (!confirmAppeal) return;
    const { appeal, action } = confirmAppeal;
    setStatuses((prev) => ({ ...prev, [appeal.id]: action }));
    if (action === "accepted") {
      push(`Appel de ${appeal.user.username} accepté — compte rétabli.`, "ok");
    } else {
      push(`Appel de ${appeal.user.username} rejeté.`, "info");
    }
    setConfirmAppeal(null);
  }

  const pendingCount = Object.values(statuses).filter((s) => s === "pending").length;
  const filteredAppeals = APPEALS.filter((a) =>
    filterStatus === "tous" ? true : statuses[a.id] === filterStatus
  );

  return (
    <AdminPage
      title="Appels en attente"
      eyebrow="révision des sanctions ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/moderation", label: "Modération" },
        { label: "Appels" },
      ]}
      actions={
        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <Badge tone="gold" dot>
              {pendingCount} en attente
            </Badge>
          )}
        </div>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            En attente
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-gold-deep">
            {pendingCount}
          </div>
        </div>
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Acceptés
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-stamp-green">
            {Object.values(statuses).filter((s) => s === "accepted").length}
          </div>
        </div>
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Rejetés
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-stamp-red">
            {Object.values(statuses).filter((s) => s === "rejected").length}
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(
          [
            { key: "tous", label: "Tous" },
            { key: "pending", label: "En attente" },
            { key: "accepted", label: "Acceptés" },
            { key: "rejected", label: "Rejetés" },
          ] as { key: typeof filterStatus; label: string }[]
        ).map((opt) => (
          <Chip
            key={opt.key}
            color="ink"
            variant={filterStatus === opt.key ? "filled" : "outline"}
            size="sm"
            onClick={() => setFilterStatus(opt.key)}
          >
            {opt.label}
          </Chip>
        ))}
      </div>

      {/* Appeal cards */}
      <div className="space-y-5">
        {filteredAppeals.length === 0 && (
          <div className="text-center py-12 font-[family-name:var(--font-hand)] text-xl text-ink-faded">
            Aucun appel dans cette catégorie.
          </div>
        )}
        {filteredAppeals.map((appeal) => {
          const currentStatus = statuses[appeal.id];
          return (
            <PaperCard
              key={appeal.id}
              shadow={
                currentStatus === "accepted"
                  ? "gold"
                  : currentStatus === "rejected"
                  ? "red"
                  : "ink"
              }
              className="p-5"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar src={appeal.user.avatar} size={48} ring />
                  {currentStatus === "pending" && (
                    <Stamp color="gold" size={32} fontSize={6} rotate={10} className="absolute -top-2 -right-3">
                      {`APPEL`}
                    </Stamp>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-[family-name:var(--font-serif)] font-bold text-base">
                      {appeal.user.firstName} {appeal.user.lastName}
                    </span>
                    <span className="font-[family-name:var(--font-hand)] text-base text-ink-faded">
                      {appeal.user.username}
                    </span>
                    <Badge
                      tone={
                        currentStatus === "pending"
                          ? "gold"
                          : currentStatus === "accepted"
                          ? "green"
                          : "red"
                      }
                      dot
                    >
                      {currentStatus === "pending"
                        ? "En attente"
                        : currentStatus === "accepted"
                        ? "Accepté"
                        : "Rejeté"}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-3 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded">
                    <span>Banni le {appeal.bannedAt}</span>
                    <span>Motif : {appeal.banReason}</span>
                    <span>{appeal.user.city}</span>
                  </div>

                  {/* Appeal message */}
                  <div className="bg-paper-warm border border-dashed border-[var(--ink-line)] rounded-[4px] p-3 mb-4">
                    <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-widest text-ink-faded mb-1.5">
                      Message de l'utilisateur
                    </div>
                    <p className="font-[family-name:var(--font-serif)] text-[13px] leading-relaxed italic text-ink">
                      &ldquo;{appeal.message}&rdquo;
                    </p>
                  </div>

                  {currentStatus === "pending" && (
                    <div className="flex gap-2.5">
                      <Button
                        variant="gold"
                        size="sm"
                        icon={<CheckCircle size={14} />}
                        onClick={() =>
                          setConfirmAppeal({ appeal, action: "accepted" })
                        }
                      >
                        Accepter l'appel
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<XCircle size={14} />}
                        onClick={() =>
                          setConfirmAppeal({ appeal, action: "rejected" })
                        }
                      >
                        Rejeter
                      </Button>
                    </div>
                  )}

                  {currentStatus !== "pending" && (
                    <div className="flex items-center gap-2 text-[13px] font-[family-name:var(--font-serif)] text-ink-faded">
                      <Gavel size={14} />
                      Décision prise —{" "}
                      <strong>
                        {currentStatus === "accepted" ? "Compte rétabli" : "Appel rejeté"}
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            </PaperCard>
          );
        })}
      </div>

      {/* Confirm Modal */}
      <Modal
        open={!!confirmAppeal}
        onClose={() => setConfirmAppeal(null)}
        title={
          confirmAppeal?.action === "accepted"
            ? "Accepter l'appel"
            : "Rejeter l'appel"
        }
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setConfirmAppeal(null)}>
              Annuler
            </Button>
            <Button
              variant={confirmAppeal?.action === "accepted" ? "gold" : "danger"}
              size="sm"
              onClick={handleConfirm}
            >
              Confirmer
            </Button>
          </>
        }
      >
        {confirmAppeal && (
          <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink leading-relaxed">
            {confirmAppeal.action === "accepted"
              ? `En acceptant cet appel, le compte de ${confirmAppeal.appeal.user.username} sera rétabli immédiatement. L'utilisateur recevra une notification.`
              : `En rejetant cet appel, la sanction de ${confirmAppeal.appeal.user.username} est maintenue. L'utilisateur sera informé de la décision définitive.`}
          </p>
        )}
      </Modal>
    </AdminPage>
  );
}
