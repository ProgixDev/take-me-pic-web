"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  User,
  FileText,
  MessageSquare,
  MapPin,
  CheckCircle,
  Ban,
  Trash2,
  X,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  PaperCard,
  Badge,
  Avatar,
  Button,
  Modal,
  Textarea,
  Stamp,
  Chip,
  useToast,
} from "@/components/ui";
import { getReport, getUser, users } from "@/lib/data";

type Decision = "avertir" | "suspendre" | "supprimer" | "ignorer" | null;

function severityTone(s: string): "red" | "gold" | "neutral" {
  if (s === "high") return "red";
  if (s === "medium") return "gold";
  return "neutral";
}

function statusTone(s: string): "red" | "blue" | "green" | "neutral" {
  if (s === "open") return "red";
  if (s === "reviewing") return "blue";
  if (s === "resolved") return "green";
  return "neutral";
}

function typeIcon(t: string) {
  if (t === "user") return <User size={14} />;
  if (t === "post") return <FileText size={14} />;
  if (t === "comment") return <MessageSquare size={14} />;
  return <MapPin size={14} />;
}

const DECISION_META: Record<
  NonNullable<Decision>,
  { label: string; color: "danger" | "ink" | "gold" | "ghost"; description: string }
> = {
  avertir: {
    label: "Envoyer un avertissement",
    color: "gold",
    description:
      "Un message officiel sera envoyé à l'utilisateur concerné lui signalant une violation des règles de la communauté.",
  },
  suspendre: {
    label: "Suspendre le compte",
    color: "danger",
    description:
      "Le compte sera suspendu temporairement (7 jours). L'utilisateur ne pourra plus accéder à l'application.",
  },
  supprimer: {
    label: "Supprimer le contenu",
    color: "danger",
    description:
      "Le contenu signalé sera supprimé définitivement et l'utilisateur en sera informé.",
  },
  ignorer: {
    label: "Ignorer le signalement",
    color: "ghost",
    description:
      "Ce signalement sera marqué comme non pertinent et archivé. Aucune action ne sera prise.",
  },
};

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const report = getReport(id);
  const { push } = useToast();

  const [decision, setDecision] = useState<Decision>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [status, setStatus] = useState(report.status);
  const [note, setNote] = useState("");

  // Find the target user from reports
  const targetUser = users.find((u) => u.username === report.target) ?? users[3];

  function handleDecision(d: NonNullable<Decision>) {
    setDecision(d);
    setConfirmOpen(true);
  }

  function handleConfirm() {
    setConfirmOpen(false);
    if (decision === "ignorer") {
      setStatus("dismissed");
      push("Signalement ignoré et archivé.", "info");
    } else if (decision === "avertir") {
      setStatus("resolved");
      push(`Avertissement envoyé à ${targetUser.username}.`, "ok");
    } else if (decision === "suspendre") {
      setStatus("resolved");
      push(`Compte ${targetUser.username} suspendu pour 7 jours.`, "ok");
    } else if (decision === "supprimer") {
      setStatus("resolved");
      push("Contenu supprimé définitivement.", "ok");
    }
    setDecision(null);
  }

  return (
    <AdminPage
      title={`Signalement #${report.id}`}
      eyebrow="examen du signalement ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/moderation", label: "Modération" },
        { href: "/admin/moderation/reports", label: "Signalements" },
        { label: `#${report.id}` },
      ]}
      actions={
        <Badge tone={statusTone(status)} dot>
          {status === "open"
            ? "Ouvert"
            : status === "reviewing"
            ? "En cours"
            : status === "resolved"
            ? "Résolu"
            : "Ignoré"}
        </Badge>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Report + Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Report Summary */}
          <PaperCard shadow={report.severity === "high" ? "red" : report.severity === "medium" ? "gold" : "soft"} className="p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-1">
                  Résumé du signalement
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge tone="neutral">{typeIcon(report.type)} {report.type}</Badge>
                  <Badge tone={severityTone(report.severity)}>
                    sévérité :{" "}
                    {report.severity === "high"
                      ? "haute"
                      : report.severity === "medium"
                      ? "moyenne"
                      : "basse"}
                  </Badge>
                </div>
              </div>
              {report.severity === "high" && (
                <Stamp color="red" size={64} fontSize={7} rotate={10}>
                  {`URGENT\n!`}
                </Stamp>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
                  Raison
                </div>
                <div className="font-[family-name:var(--font-serif)] font-semibold">
                  {report.reason}
                </div>
              </div>
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
                  Date
                </div>
                <div className="font-[family-name:var(--font-serif)]">{report.date}</div>
              </div>
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
                  Cible
                </div>
                <div className="font-[family-name:var(--font-hand)] text-lg">
                  {report.target}
                </div>
              </div>
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
                  Type de contenu
                </div>
                <Chip color="ink" variant="outline" size="sm">
                  {report.type}
                </Chip>
              </div>
            </div>
          </PaperCard>

          {/* Reported Content / User Preview */}
          <PaperCard shadow="ink" className="p-5">
            <h2 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-4">
              Contenu / utilisateur signalé
            </h2>
            <div className="flex items-start gap-4">
              <Avatar src={targetUser.avatar} size={48} ring />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-[family-name:var(--font-serif)] font-bold text-base">
                    {targetUser.firstName} {targetUser.lastName}
                  </span>
                  <span className="font-[family-name:var(--font-hand)] text-base text-ink-faded">
                    {targetUser.username}
                  </span>
                  <Badge
                    tone={
                      targetUser.status === "banned"
                        ? "red"
                        : targetUser.status === "suspended"
                        ? "sunset"
                        : "green"
                    }
                  >
                    {targetUser.status}
                  </Badge>
                </div>
                <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded mb-2">
                  {targetUser.bio}
                </p>
                <div className="flex flex-wrap gap-3 text-[12px] font-[family-name:var(--font-type)] uppercase tracking-widest text-ink-faded">
                  <span>📸 {targetUser.photosGiven} photos</span>
                  <span>⭐ {targetUser.rating.toFixed(1)} note</span>
                  <span>🌍 {targetUser.city}</span>
                  <span>⚡ {targetUser.karma} karma</span>
                  <span className="text-stamp-red">
                    🚩 {targetUser.reports} signalement{targetUser.reports !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="mt-3">
                  <Link href={`/admin/users/${targetUser.id}`}>
                    <Button variant="paper" size="sm">
                      Voir le profil complet →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </PaperCard>

          {/* Reporter Info */}
          <PaperCard shadow="soft" className="p-5">
            <h2 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-4">
              Informations sur le déclarant
            </h2>
            <div className="flex items-center gap-3">
              <Avatar src={report.reporter.avatar} size={40} />
              <div>
                <div className="font-[family-name:var(--font-serif)] font-semibold">
                  {report.reporter.firstName} {report.reporter.lastName}
                </div>
                <div className="font-[family-name:var(--font-hand)] text-base text-ink-faded">
                  {report.reporter.username}
                </div>
                <div className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-widest text-ink-faded mt-0.5">
                  Membre depuis {report.reporter.joined} · {report.reporter.city}
                </div>
              </div>
              <div className="ml-auto">
                <Link href={`/admin/users/${report.reporter.id}`}>
                  <Button variant="ghost" size="sm">
                    Voir →
                  </Button>
                </Link>
              </div>
            </div>
          </PaperCard>

          {/* Internal Note */}
          <PaperCard shadow="soft" className="p-5">
            <h2 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-3">
              Note interne
            </h2>
            <Textarea
              label="Note de modération (non visible par les utilisateurs)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="Ajoutez vos observations, contexte supplémentaire…"
            />
            <div className="mt-3 flex justify-end">
              <Button
                variant="paper"
                size="sm"
                onClick={() => push("Note interne sauvegardée.", "ok")}
              >
                Sauvegarder la note
              </Button>
            </div>
          </PaperCard>
        </div>

        {/* Right: Decision Panel */}
        <div className="space-y-4">
          <PaperCard shadow="ink" className="p-5">
            <h2 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-1">
              Panneau de décision
            </h2>
            <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded mb-5">
              Choisissez une action à appliquer à ce signalement.
            </p>

            <div className="space-y-2.5">
              <Button
                variant="gold"
                size="md"
                full
                icon={<AlertTriangle size={15} />}
                onClick={() => handleDecision("avertir")}
                disabled={status === "resolved" || status === "dismissed"}
              >
                Avertir l'utilisateur
              </Button>
              <Button
                variant="danger"
                size="md"
                full
                icon={<Ban size={15} />}
                onClick={() => handleDecision("suspendre")}
                disabled={status === "resolved" || status === "dismissed"}
              >
                Suspendre le compte
              </Button>
              <Button
                variant="danger"
                size="md"
                full
                icon={<Trash2 size={15} />}
                onClick={() => handleDecision("supprimer")}
                disabled={status === "resolved" || status === "dismissed"}
              >
                Supprimer le contenu
              </Button>
              <Button
                variant="ghost"
                size="md"
                full
                icon={<X size={15} />}
                onClick={() => handleDecision("ignorer")}
                disabled={status === "resolved" || status === "dismissed"}
              >
                Ignorer le signalement
              </Button>
            </div>

            {(status === "resolved" || status === "dismissed") && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-stamp-green/10 rounded-[4px] border border-stamp-green/30">
                <CheckCircle size={15} className="text-stamp-green flex-shrink-0" />
                <span className="font-[family-name:var(--font-serif)] text-[13px] text-stamp-green font-semibold">
                  Signalement traité
                </span>
              </div>
            )}
          </PaperCard>

          {/* Severity guide */}
          <PaperCard shadow="soft" className="p-5">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-sm mb-3">
              Guide de sévérité
            </h3>
            <div className="space-y-2 font-[family-name:var(--font-serif)] text-[12px]">
              <div className="flex gap-2">
                <Badge tone="red">Haute</Badge>
                <span className="text-ink-faded">Harcèlement, faux profil, contenu illicite</span>
              </div>
              <div className="flex gap-2">
                <Badge tone="gold">Moyenne</Badge>
                <span className="text-ink-faded">Comportement déplacé, photo volée</span>
              </div>
              <div className="flex gap-2">
                <Badge tone="neutral">Basse</Badge>
                <span className="text-ink-faded">Spam, contenu inapproprié mineur</span>
              </div>
            </div>
          </PaperCard>
        </div>
      </div>

      {/* Confirmation Modal */}
      {decision && (
        <Modal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title={`Confirmer : ${DECISION_META[decision].label}`}
          size="sm"
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(false)}>
                Annuler
              </Button>
              <Button variant={DECISION_META[decision].color} size="sm" onClick={handleConfirm}>
                Confirmer
              </Button>
            </>
          }
        >
          <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink leading-relaxed">
            {DECISION_META[decision].description}
          </p>
          <div className="mt-3 p-3 bg-paper-warm rounded-[4px] border border-dashed border-[var(--ink-line)]">
            <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded">
              Cible de l'action
            </span>
            <div className="font-[family-name:var(--font-hand)] text-lg mt-0.5">
              {targetUser.username}
            </div>
          </div>
        </Modal>
      )}
    </AdminPage>
  );
}
