"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  User as UserIcon,
  FileText,
  MessageSquare,
  MapPin,
  CheckCircle,
  Ban,
  EyeOff,
  X,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { PaperCard, Badge, Avatar, Button, Chip, useToast } from "@/components/ui";
import { setCommentVisibility, setPostVisibility } from "@/lib/admin/community-actions";
import { banUser, updateReportStatus } from "@/lib/admin/moderation-actions";
import type { ModerationActionResult } from "@/lib/admin/moderation-actions";
import type { ReportDetailModel, ReportStatus } from "@/lib/admin/moderation";
import type { UserDetailModel } from "@/lib/admin/users";

function statusTone(s: ReportStatus): "red" | "blue" | "green" | "neutral" {
  if (s === "open") return "red";
  if (s === "reviewing") return "blue";
  if (s === "resolved") return "green";
  return "neutral";
}

const STATUS_LABEL: Record<ReportStatus, string> = {
  open: "Ouvert",
  reviewing: "En cours",
  resolved: "Résolu",
  dismissed: "Ignoré",
};

function typeIcon(t: ReportDetailModel["targetType"]) {
  if (t === "user") return <UserIcon size={14} />;
  if (t === "post") return <FileText size={14} />;
  if (t === "comment") return <MessageSquare size={14} />;
  return <MapPin size={14} />;
}

function failureMessage(result: Exclude<ModerationActionResult, { kind: "ok" }>): string {
  if (result.kind === "unauthenticated") return "Session expirée — reconnecte-toi.";
  if (result.kind === "unauthorized") return "Action réservée au staff.";
  return result.message;
}

export function ReportDetailClient({
  report,
  target,
}: {
  report: ReportDetailModel;
  target: UserDetailModel | null;
}) {
  const { push } = useToast();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<ReportStatus>(report.status);

  const done = status === "resolved" || status === "dismissed";
  const hasContent = report.postId !== null || report.commentId !== null;

  function run(label: string, fn: () => Promise<ModerationActionResult>, next: ReportStatus) {
    startTransition(async () => {
      const result = await fn();
      if (result.kind === "ok") {
        setStatus(next);
        push(label, "ok");
      } else {
        push(failureMessage(result), "err");
      }
    });
  }

  function handleResolve() {
    run("Signalement marqué comme résolu.", () => updateReportStatus(report.id, "resolved"), "resolved");
  }

  function handleDismiss() {
    run("Signalement ignoré et archivé.", () => updateReportStatus(report.id, "dismissed"), "dismissed");
  }

  function handleBan() {
    if (!report.reportedUserId) {
      push("Ce signalement ne cible pas d'utilisateur.", "err");
      return;
    }
    const userId = report.reportedUserId;
    run(
      "Utilisateur banni et signalement résolu.",
      async () => {
        const ban = await banUser(userId, report.reason, { sourceReportId: report.id });
        if (ban.kind !== "ok") return ban;
        return updateReportStatus(report.id, "resolved");
      },
      "resolved",
    );
  }

  function handleHideContent() {
    run(
      "Contenu masqué et signalement résolu.",
      async () => {
        const hidden =
          report.postId !== null
            ? await setPostVisibility(report.postId, true, report.reason)
            : report.commentId !== null
              ? await setCommentVisibility(report.commentId, true, report.reason)
              : ({ kind: "error", message: "Aucun contenu à masquer." } as ModerationActionResult);
        if (hidden.kind !== "ok") return hidden;
        return updateReportStatus(report.id, "resolved");
      },
      "resolved",
    );
  }

  const targetName = target
    ? [target.firstName, target.lastName].filter(Boolean).join(" ").trim() || target.username
    : report.targetLabel;

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
          {STATUS_LABEL[status]}
        </Badge>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Report + Content */}
        <div className="lg:col-span-2 space-y-5">
          <PaperCard shadow="ink" className="p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-1">
                  Résumé du signalement
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge tone="neutral">
                    {typeIcon(report.targetType)} {report.targetType}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
                  Raison
                </div>
                <div className="font-[family-name:var(--font-serif)] font-semibold">{report.reason}</div>
              </div>
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
                  Date
                </div>
                <div className="font-[family-name:var(--font-serif)]">
                  {new Date(report.createdAt).toLocaleString("fr-FR")}
                </div>
              </div>
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
                  Cible
                </div>
                <div className="font-[family-name:var(--font-hand)] text-lg">{report.targetLabel}</div>
              </div>
              <div>
                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
                  Type de contenu
                </div>
                <Chip color="ink" variant="outline" size="sm">
                  {report.targetType}
                </Chip>
              </div>
            </div>
          </PaperCard>

          {/* Reported user preview */}
          {target && (
            <PaperCard shadow="ink" className="p-5">
              <h2 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-4">
                Utilisateur signalé
              </h2>
              <div className="flex items-start gap-4">
                <Avatar src={target.avatarUrl ?? undefined} size={48} ring />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-[family-name:var(--font-serif)] font-bold text-base">{targetName}</span>
                    <span className="font-[family-name:var(--font-hand)] text-base text-ink-faded">
                      {target.username}
                    </span>
                    <Badge tone={target.status === "banned" ? "red" : target.status === "suspended" ? "gold" : "green"}>
                      {target.status}
                    </Badge>
                  </div>
                  {target.bio && (
                    <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded mb-2">{target.bio}</p>
                  )}
                  <div className="flex flex-wrap gap-3 text-[12px] font-[family-name:var(--font-type)] uppercase tracking-widest text-ink-faded">
                    <span>{target.photosCount} photos</span>
                    <span>{target.rating.toFixed(1)} note</span>
                    <span>{target.city ?? "—"}</span>
                    <span>{target.karma} karma</span>
                    {target.reports.length > 0 && (
                      <span className="text-stamp-red">
                        {target.reports.length} signalement{target.reports.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <Link href={`/admin/users/${target.id}`}>
                      <Button variant="paper" size="sm">
                        Voir le profil complet →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </PaperCard>
          )}

          {/* Reporter */}
          {report.reporter && (
            <PaperCard shadow="soft" className="p-5">
              <h2 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-4">
                Déclarant
              </h2>
              <div className="flex items-center gap-3">
                <Avatar src={report.reporter.avatarUrl ?? undefined} size={40} />
                <div>
                  <div className="font-[family-name:var(--font-serif)] font-semibold">
                    {[report.reporter.firstName, report.reporter.lastName].filter(Boolean).join(" ")}
                  </div>
                  <div className="font-[family-name:var(--font-hand)] text-base text-ink-faded">
                    {report.reporter.username}
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
          )}
        </div>

        {/* Right: Decision panel */}
        <div className="space-y-4">
          <PaperCard shadow="ink" className="p-5">
            <h2 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-1">Panneau de décision</h2>
            <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded mb-5">
              Applique une action à ce signalement.
            </p>

            <div className="space-y-2.5">
              <Button variant="gold" size="md" full icon={<CheckCircle size={15} />} onClick={handleResolve} disabled={done || isPending}>
                Marquer comme résolu
              </Button>
              {report.reportedUserId && (
                <Button variant="danger" size="md" full icon={<Ban size={15} />} onClick={handleBan} disabled={done || isPending}>
                  Bannir l&apos;utilisateur
                </Button>
              )}
              {hasContent && (
                <Button variant="danger" size="md" full icon={<EyeOff size={15} />} onClick={handleHideContent} disabled={done || isPending}>
                  Masquer le contenu
                </Button>
              )}
              <Button variant="ghost" size="md" full icon={<X size={15} />} onClick={handleDismiss} disabled={done || isPending}>
                Ignorer le signalement
              </Button>
            </div>

            {done && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-stamp-green/10 rounded-[4px] border border-stamp-green/30">
                <CheckCircle size={15} className="text-stamp-green flex-shrink-0" />
                <span className="font-[family-name:var(--font-serif)] text-[13px] text-stamp-green font-semibold">
                  Signalement traité
                </span>
              </div>
            )}
          </PaperCard>

          <PaperCard shadow="soft" className="p-5">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-sm mb-2 flex items-center gap-2">
              <AlertTriangle size={14} /> Rappel
            </h3>
            <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded leading-relaxed">
              Bannir applique une sanction immédiate (RPC <code>admin_ban_user</code>) et résout le signalement.
              Masquer le contenu retire la publication ou le commentaire de la communauté.
            </p>
          </PaperCard>
        </div>
      </div>
    </AdminPage>
  );
}
