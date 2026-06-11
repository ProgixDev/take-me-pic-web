"use client";

import Link from "next/link";
import { MessageSquare, Flag, Users as UsersIcon, Clock } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Avatar, Badge, PaperCard, Stamp } from "@/components/ui";
import type { HelpRequestDetail } from "@/lib/admin/support";
import { STATUS_LABEL, STATUS_TONE, formatDateTime } from "@/components/admin/support/status";

function ParticipantCard({
  title,
  profile,
}: {
  title: string;
  profile: HelpRequestDetail["requester"];
}) {
  return (
    <PaperCard shadow="soft" className="p-4 flex items-center gap-3">
      <Avatar src={profile?.avatarUrl ?? undefined} size={44} />
      <div className="min-w-0">
        <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded">
          {title}
        </div>
        {profile ? (
          <Link
            href={`/admin/users/${profile.id}`}
            className="font-[family-name:var(--font-serif)] font-bold text-[15px] hover:underline"
          >
            {[profile.firstName, profile.lastName].filter(Boolean).join(" ")}
          </Link>
        ) : (
          <span className="font-[family-name:var(--font-serif)] text-[15px] text-ink-faded">Non assigné</span>
        )}
        <div className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
          {profile?.username ?? "—"}
        </div>
      </div>
    </PaperCard>
  );
}

export function HelpRequestDetailClient({
  detail,
  variant,
}: {
  detail: HelpRequestDetail;
  variant: "request" | "session";
}) {
  const isSession = variant === "session";
  const title = isSession ? `Session #${detail.id}` : `Demande #${detail.id}`;
  const summary = detail.conversationSummary;

  const timeline = [
    { label: "Créée", value: detail.createdAt },
    { label: "Acceptée", value: detail.acceptedAt },
    { label: "Session", value: detail.sessionAt },
    { label: "Terminée", value: detail.completedAt },
    { label: "Expire", value: detail.expiresAt },
  ];

  return (
    <AdminPage
      title={title}
      eyebrow={isSession ? "revue de session" : "revue de demande"}
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        isSession
          ? { href: "/admin/sessions", label: "Sessions" }
          : { href: "/admin/requests", label: "Demandes" },
        { label: `#${detail.id}` },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Badge tone={STATUS_TONE[detail.status]} dot>
            {STATUS_LABEL[detail.status]}
          </Badge>
          {detail.reportCount > 0 && (
            <Badge tone="red" dot>
              {detail.reportCount} signalement{detail.reportCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <ParticipantCard title="Demandeur" profile={detail.requester} />
        <ParticipantCard title="Photographe" profile={detail.helper} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PaperCard shadow="ink" className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-ink-faded" />
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg">Cycle de vie</h3>
          </div>
          <div className="space-y-2">
            {timeline.map((step) => (
              <div
                key={step.label}
                className="flex items-center justify-between p-2.5 bg-paper-warm/40 rounded-[4px]"
              >
                <span className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.08em] text-ink-faded">
                  {step.label}
                </span>
                <span className="font-[family-name:var(--font-serif)] text-[13px] font-semibold">
                  {formatDateTime(step.value)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between p-2.5 bg-paper-warm/40 rounded-[4px]">
              <span className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.08em] text-ink-faded">
                Personnes
              </span>
              <span className="font-[family-name:var(--font-serif)] text-[13px] font-semibold">
                {detail.peopleCount}
              </span>
            </div>
          </div>
          {detail.note && (
            <div className="mt-4 p-3 bg-paper-warm/60 rounded-[4px] border border-dashed border-[var(--ink-line)]">
              <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mb-1">
                Note du demandeur
              </div>
              <p className="font-[family-name:var(--font-serif)] italic text-[13px]">{detail.note}</p>
            </div>
          )}
        </PaperCard>

        <PaperCard shadow="soft" className="p-5 relative">
          <div className="absolute top-3 right-3">
            <Stamp color="blue" shape="rect" size={48} rotate={4} fontSize={8}>
              {"méta\nuniquement"}
            </Stamp>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={16} className="text-ink-faded" />
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-lg">Résumé de conversation</h3>
          </div>

          {summary.kind === "ok" ? (
            summary.summary.status === "not_started" ? (
              <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[14px]">
                Aucune conversation ouverte pour cette session — c&apos;est un état normal.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <MessageSquare size={14} />, label: "Messages", value: String(summary.summary.messageCount) },
                  { icon: <UsersIcon size={14} />, label: "Participants", value: String(summary.summary.participantCount) },
                  { icon: <Flag size={14} />, label: "Signalements liés", value: String(summary.summary.reportCount) },
                  { icon: <Clock size={14} />, label: "Premier message", value: formatDateTime(summary.summary.firstMessageAt) },
                  { icon: <Clock size={14} />, label: "Dernier message", value: formatDateTime(summary.summary.lastMessageAt) },
                  {
                    icon: <UsersIcon size={14} />,
                    label: "Rôles",
                    value: summary.summary.participantRoles.length
                      ? summary.summary.participantRoles.join(", ")
                      : "—",
                  },
                ].map((item) => (
                  <div key={item.label} className="p-3 bg-paper-warm/40 rounded-[4px]">
                    <div className="flex items-center gap-1.5 text-ink-faded mb-1">
                      {item.icon}
                      <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.08em]">
                        {item.label}
                      </span>
                    </div>
                    <div className="font-[family-name:var(--font-serif)] font-bold text-[15px]">{item.value}</div>
                  </div>
                ))}
              </div>
            )
          ) : summary.kind === "not_found" ? (
            <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[14px]">
              Aucune conversation ouverte pour cette session — c&apos;est un état normal.
            </p>
          ) : summary.kind === "unauthorized" ? (
            <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">
              Ce compte n&apos;a pas la capacité de consulter les résumés de conversation.
            </p>
          ) : summary.kind === "unauthenticated" ? (
            <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">
              Session Supabase manquante. Reconnecte-toi.
            </p>
          ) : (
            <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">
              Le résumé de conversation n&apos;a pas pu être chargé.
            </p>
          )}

          <p className="font-[family-name:var(--font-type)] text-[10px] text-ink-faded mt-4">
            Métadonnées uniquement — le contenu des messages et les photos de session ne sont pas exposés.
          </p>
        </PaperCard>
      </div>
    </AdminPage>
  );
}
