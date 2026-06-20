"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Send, CheckCircle, RotateCcw, UserPlus } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { PaperCard, Badge, Avatar, Button, Textarea, useToast } from "@/components/ui";
import {
  assignTicketToMe,
  replyToTicket,
  updateTicketStatus,
  type SupportActionResult,
} from "@/lib/admin/support-tickets-actions";
import type { SupportTicketDetail, TicketStatus } from "@/lib/admin/support-tickets";

const STATUS_LABEL: Record<TicketStatus, string> = { ouvert: "Ouvert", en_cours: "En cours", resolu: "Résolu" };
const STATUS_TONE: Record<TicketStatus, "red" | "gold" | "green"> = { ouvert: "red", en_cours: "gold", resolu: "green" };

function failureMessage(result: Exclude<SupportActionResult, { kind: "ok" }>): string {
  if (result.kind === "unauthenticated") return "Session expirée — reconnecte-toi.";
  if (result.kind === "unauthorized") return "Action réservée au staff.";
  return result.message;
}

function fullName(p: SupportTicketDetail["user"]): string {
  if (!p) return "Utilisateur inconnu";
  return [p.firstName, p.lastName].filter(Boolean).join(" ").trim() || p.username;
}

export function SupportTicketDetailClient({ ticket }: { ticket: SupportTicketDetail }) {
  const { push } = useToast();
  const [isPending, startTransition] = useTransition();
  const [reply, setReply] = useState("");

  function act(fn: () => Promise<SupportActionResult>, okMsg: string, onOk?: () => void) {
    startTransition(async () => {
      const result = await fn();
      if (result.kind === "ok") {
        push(okMsg, "ok");
        onOk?.();
      } else {
        push(failureMessage(result), "err");
      }
    });
  }

  const thread = [
    { id: 0, author: ticket.user, isStaff: false, body: ticket.body, createdAt: ticket.createdAt },
    ...ticket.replies,
  ];

  return (
    <AdminPage
      title={ticket.subject}
      eyebrow={`ticket #${ticket.id}`}
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/support", label: "Support" },
        { label: `#${ticket.id}` },
      ]}
      actions={
        <Badge tone={STATUS_TONE[ticket.status]} dot>
          {STATUS_LABEL[ticket.status]}
        </Badge>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation */}
        <div className="lg:col-span-2 space-y-5">
          <PaperCard shadow="ink" className="p-5 space-y-4">
            {thread.map((m) => (
              <div key={`${m.isStaff ? "s" : "u"}-${m.id}`} className={`flex gap-3 ${m.isStaff ? "flex-row-reverse" : ""}`}>
                <Avatar src={m.author?.avatarUrl ?? undefined} size={32} />
                <div className={`flex-1 ${m.isStaff ? "text-right" : ""}`}>
                  <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
                    {m.isStaff ? "Support" : fullName(m.author)} · {new Date(m.createdAt).toLocaleString("fr-FR")}
                  </div>
                  <div
                    className={`inline-block px-3 py-2 rounded-[6px] border-[1.5px] text-[13px] font-[family-name:var(--font-serif)] leading-relaxed ${
                      m.isStaff ? "bg-gold-deep/10 border-gold-deep/40" : "bg-paper-warm border-[var(--ink-line)]"
                    }`}
                  >
                    {m.body}
                  </div>
                </div>
              </div>
            ))}
          </PaperCard>

          {ticket.status !== "resolu" && (
            <PaperCard shadow="soft" className="p-5">
              <Textarea
                label="Répondre à l'utilisateur"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                placeholder="Votre réponse…"
              />
              <div className="mt-3 flex justify-end">
                <Button
                  variant="gold"
                  size="sm"
                  icon={<Send size={14} />}
                  disabled={isPending || !reply.trim()}
                  onClick={() =>
                    act(() => replyToTicket(ticket.id, reply), "Réponse envoyée.", () => setReply(""))
                  }
                >
                  Envoyer
                </Button>
              </div>
            </PaperCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <PaperCard shadow="ink" className="p-5">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-sm mb-3">Actions</h3>
            <div className="space-y-2.5">
              {ticket.status !== "resolu" ? (
                <Button variant="gold" size="md" full icon={<CheckCircle size={15} />} disabled={isPending} onClick={() => act(() => updateTicketStatus(ticket.id, "resolu"), "Ticket marqué comme résolu.")}>
                  Marquer comme résolu
                </Button>
              ) : (
                <Button variant="paper" size="md" full icon={<RotateCcw size={15} />} disabled={isPending} onClick={() => act(() => updateTicketStatus(ticket.id, "ouvert"), "Ticket rouvert.")}>
                  Rouvrir le ticket
                </Button>
              )}
              <Button variant="paper" size="md" full icon={<UserPlus size={15} />} disabled={isPending} onClick={() => act(() => assignTicketToMe(ticket.id), "Ticket assigné à toi.")}>
                M&apos;assigner ce ticket
              </Button>
            </div>
          </PaperCard>

          <PaperCard shadow="soft" className="p-5">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-sm mb-3">Détails</h3>
            <dl className="space-y-2 text-[13px] font-[family-name:var(--font-serif)]">
              <div className="flex justify-between"><dt className="text-ink-faded">Statut</dt><dd><Badge tone={STATUS_TONE[ticket.status]} dot>{STATUS_LABEL[ticket.status]}</Badge></dd></div>
              <div className="flex justify-between"><dt className="text-ink-faded">Priorité</dt><dd>{ticket.priority}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-faded">Catégorie</dt><dd>{ticket.category}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-faded">Assigné à</dt><dd>{ticket.assignedTo ? fullName(ticket.assignedTo) : "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-faded">Ouvert le</dt><dd>{new Date(ticket.createdAt).toLocaleDateString("fr-FR")}</dd></div>
            </dl>
          </PaperCard>

          {ticket.user && (
            <PaperCard shadow="soft" className="p-5">
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-sm mb-3">Demandeur</h3>
              <div className="flex items-center gap-3">
                <Avatar src={ticket.user.avatarUrl ?? undefined} size={40} ring />
                <div className="min-w-0">
                  <div className="font-[family-name:var(--font-serif)] font-semibold truncate">{fullName(ticket.user)}</div>
                  <div className="font-[family-name:var(--font-hand)] text-base text-ink-faded truncate">{ticket.user.username}</div>
                  {ticket.user.city && (
                    <div className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-widest text-ink-faded">{ticket.user.city}</div>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <Link href={`/admin/users/${ticket.user.id}`}>
                  <Button variant="paper" size="sm" full>
                    Voir le profil →
                  </Button>
                </Link>
              </div>
            </PaperCard>
          )}
        </div>
      </div>
    </AdminPage>
  );
}
