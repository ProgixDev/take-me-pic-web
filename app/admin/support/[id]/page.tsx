"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Send, CheckCircle, ArrowUpCircle, ArrowLeft } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Button,
  PaperCard,
  Badge,
  Avatar,
  Modal,
  Textarea,
  useToast,
} from "@/components/ui";
import { getTicket } from "@/lib/data";

type MsgSender = "user" | "support";

interface ChatMsg {
  id: string;
  sender: MsgSender;
  text: string;
  time: string;
}

const STATUS_TONE: Record<string, "red" | "gold" | "green"> = {
  ouvert: "red",
  "en cours": "gold",
  résolu: "green",
};

const PRIORITY_TONE: Record<string, "red" | "gold" | "neutral"> = {
  haute: "red",
  normale: "gold",
  basse: "neutral",
};

const CATEGORY_TONE: Record<string, "blue" | "gold" | "red" | "neutral"> = {
  compte: "blue",
  paiement: "gold",
  sécurité: "red",
  technique: "neutral",
  autre: "neutral",
};

const SUPPORT_AGENTS = ["Claire Bernard", "Marc Olivier", "Yasmine Karam"];

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const ticket = getTicket(id);

  // Synthesize a realistic back-and-forth thread
  const [thread, setThread] = useState<ChatMsg[]>([
    {
      id: "m1",
      sender: "user",
      text: `Bonjour, j'ai un problème avec : « ${ticket.subject} ». Cela dure depuis hier et je n'arrive pas à le résoudre seul. Pourriez-vous m'aider ?`,
      time: "hier, 14:32",
    },
    {
      id: "m2",
      sender: "support",
      text: `Bonjour ${ticket.user.firstName} ! Merci pour votre message. Nous avons bien reçu votre demande concernant « ${ticket.subject} ». Pouvez-vous nous donner plus de détails sur ce que vous observez ? Un message d'erreur, ou une étape précise qui bloque ?`,
      time: "hier, 14:58",
    },
    {
      id: "m3",
      sender: "user",
      text: "Oui, voici ce qui se passe : quand j'essaie d'effectuer l'action, l'application affiche un écran blanc puis revient à l'accueil sans message. J'ai essayé de redémarrer l'app et de vider le cache, sans succès.",
      time: "hier, 15:12",
    },
    {
      id: "m4",
      sender: "support",
      text: "Merci pour ces précisions. Notre équipe technique est informée. En attendant, pourriez-vous essayer de déconnecter puis reconnecter votre compte ? Si le problème persiste, nous vous proposons un appel de diagnostic de 10 minutes.",
      time: "hier, 16:30",
    },
    {
      id: "m5",
      sender: "user",
      text: "J'ai essayé la déconnexion/reconnexion mais le problème est toujours là. Je suis disponible pour un appel si nécessaire.",
      time: "aujourd'hui, 09:05",
    },
  ]);

  const [reply, setReply] = useState("");
  const [status, setStatus] = useState(ticket.status);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [assignee, setAssignee] = useState(SUPPORT_AGENTS[0]);

  const sendReply = () => {
    if (!reply.trim()) return;
    const newMsg: ChatMsg = {
      id: `m${Date.now()}`,
      sender: "support",
      text: reply.trim(),
      time: "à l'instant",
    };
    setThread((prev) => [...prev, newMsg]);
    setReply("");
    toast.push("Réponse envoyée à l'utilisateur.", "ok");
  };

  const resolve = () => {
    setResolveOpen(false);
    setStatus("résolu");
    toast.push(`Ticket ${ticket.id} marqué comme résolu.`, "ok");
  };

  const escalate = () => {
    setEscalateOpen(false);
    toast.push(`Ticket ${ticket.id} escaladé à l'équipe technique.`, "info");
  };

  return (
    <AdminPage
      title={ticket.subject}
      eyebrow={`ticket #${ticket.id}`}
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/support", label: "Support" },
        { label: ticket.id },
      ]}
      actions={
        <>
          <Button
            variant="paper"
            size="sm"
            icon={<ArrowLeft size={14} />}
            onClick={() => router.push("/admin/support")}
          >
            Retour
          </Button>
          {status !== "résolu" && (
            <>
              <Button
                variant="paper"
                size="sm"
                icon={<ArrowUpCircle size={14} />}
                onClick={() => setEscalateOpen(true)}
              >
                Escalader
              </Button>
              <Button
                variant="gold"
                size="sm"
                icon={<CheckCircle size={14} />}
                onClick={() => setResolveOpen(true)}
              >
                Résoudre
              </Button>
            </>
          )}
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Thread */}
        <div className="space-y-4">
          <PaperCard shadow="ink" className="overflow-hidden">
            {/* Thread header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-dashed border-[var(--ink-line)] bg-paper-warm/40">
              <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
                Conversation — {thread.length} message{thread.length > 1 ? "s" : ""}
              </span>
              <Badge tone={STATUS_TONE[status]} dot>
                {status}
              </Badge>
            </div>

            {/* Messages */}
            <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
              {thread.map((msg) => {
                const isSupport = msg.sender === "support";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isSupport ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div className="shrink-0">
                      {isSupport ? (
                        <div className="w-8 h-8 rounded-full bg-gold-light/30 border border-gold-deep/30 flex items-center justify-center text-[13px]">
                          🛎
                        </div>
                      ) : (
                        <Avatar src={ticket.user.avatar} size={32} />
                      )}
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[75%] ${isSupport ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      <span className={`font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded ${isSupport ? "text-right" : ""}`}>
                        {isSupport ? assignee : `${ticket.user.firstName} ${ticket.user.lastName}`}
                      </span>
                      <div
                        className={`rounded-[6px] px-4 py-3 border-[1.5px] text-[14px] font-[family-name:var(--font-serif)] leading-relaxed ${
                          isSupport
                            ? "bg-ink text-paper-warm border-ink"
                            : "bg-paper-warm/60 text-ink border-[var(--ink-line)]"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="font-[family-name:var(--font-type)] text-[10px] text-ink-faded">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply box */}
            {status !== "résolu" && (
              <div className="px-5 pb-5 pt-3 border-t border-dashed border-[var(--ink-line)]">
                <Textarea
                  label="Répondre"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Rédigez votre réponse au voyageur…"
                  className="min-h-24"
                />
                <div className="flex justify-end mt-1">
                  <Button
                    variant="gold"
                    size="sm"
                    icon={<Send size={14} />}
                    onClick={sendReply}
                  >
                    Répondre
                  </Button>
                </div>
              </div>
            )}

            {status === "résolu" && (
              <div className="px-5 py-4 border-t border-dashed border-[var(--ink-line)] bg-stamp-green/5 text-center">
                <p className="font-[family-name:var(--font-hand)] text-xl text-stamp-green">
                  ✓ Ce ticket est résolu — merci pour l'aide !
                </p>
              </div>
            )}
          </PaperCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Ticket meta */}
          <PaperCard shadow="soft" className="p-4">
            <h3 className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">
              Détails du ticket
            </h3>
            <div className="space-y-2.5">
              <div>
                <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded block mb-0.5">
                  Statut
                </span>
                <Badge tone={STATUS_TONE[status]} dot>
                  {status}
                </Badge>
              </div>
              <div>
                <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded block mb-0.5">
                  Priorité
                </span>
                <Badge tone={PRIORITY_TONE[ticket.priority]} dot>
                  {ticket.priority}
                </Badge>
              </div>
              <div>
                <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded block mb-0.5">
                  Catégorie
                </span>
                <Badge tone={CATEGORY_TONE[ticket.category]}>
                  {ticket.category}
                </Badge>
              </div>
              <div>
                <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded block mb-0.5">
                  Dernière activité
                </span>
                <span className="font-[family-name:var(--font-serif)] text-[13px]">
                  {ticket.updated}
                </span>
              </div>
            </div>
          </PaperCard>

          {/* User info */}
          <PaperCard shadow="soft" className="p-4">
            <h3 className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">
              Utilisateur
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <Avatar src={ticket.user.avatar} size={40} ring={ticket.user.premium} />
              <div>
                <p className="font-[family-name:var(--font-serif)] font-semibold text-[14px] leading-tight">
                  {ticket.user.firstName} {ticket.user.lastName}
                </p>
                <p className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
                  {ticket.user.username}
                </p>
              </div>
            </div>
            <div className="space-y-1.5 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-ink-faded font-[family-name:var(--font-serif)]">Ville</span>
                <span className="font-[family-name:var(--font-serif)]">{ticket.user.country} {ticket.user.city}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-faded font-[family-name:var(--font-serif)]">Karma</span>
                <span className="font-[family-name:var(--font-serif)] font-bold text-gold-deep">{ticket.user.karma.toLocaleString("fr-FR")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-faded font-[family-name:var(--font-serif)]">Premium</span>
                <Badge tone={ticket.user.premium ? "gold" : "neutral"}>
                  {ticket.user.premium ? "Oui" : "Non"}
                </Badge>
              </div>
            </div>
          </PaperCard>

          {/* Assignee */}
          <PaperCard shadow="soft" className="p-4">
            <h3 className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">
              Assigné à
            </h3>
            <div className="space-y-2">
              {SUPPORT_AGENTS.map((agent) => (
                <button
                  key={agent}
                  onClick={() => {
                    setAssignee(agent);
                    toast.push(`Ticket réassigné à ${agent}.`, "ok");
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-[4px] border-[1.5px] transition cursor-pointer text-left ${
                    assignee === agent
                      ? "border-ink bg-ink text-paper-warm"
                      : "border-[var(--ink-line)] bg-paper-warm/40 text-ink hover:bg-paper-warm"
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gold-light/30 border border-gold-deep/30 flex items-center justify-center text-[10px] shrink-0">
                    {agent[0]}
                  </div>
                  <span className="font-[family-name:var(--font-serif)] text-[13px]">
                    {agent}
                  </span>
                  {assignee === agent && (
                    <span className="ml-auto text-[10px] font-[family-name:var(--font-type)] uppercase tracking-[0.08em] opacity-70">
                      actif
                    </span>
                  )}
                </button>
              ))}
            </div>
          </PaperCard>
        </div>
      </div>

      {/* Resolve Modal */}
      <Modal
        open={resolveOpen}
        onClose={() => setResolveOpen(false)}
        title="Marquer comme résolu ?"
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setResolveOpen(false)}>
              Annuler
            </Button>
            <Button variant="gold" size="sm" icon={<CheckCircle size={14} />} onClick={resolve}>
              Confirmer
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded leading-relaxed">
          Le ticket <strong>#{ticket.id}</strong> sera fermé et l'utilisateur recevra une notification de résolution. Tu pourras le réouvrir si nécessaire.
        </p>
      </Modal>

      {/* Escalate Modal */}
      <Modal
        open={escalateOpen}
        onClose={() => setEscalateOpen(false)}
        title="Escalader ce ticket ?"
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setEscalateOpen(false)}>
              Annuler
            </Button>
            <Button variant="paper" size="sm" icon={<ArrowUpCircle size={14} />} onClick={escalate}>
              Escalader
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded leading-relaxed">
          Le ticket sera transmis à l'équipe technique avec une priorité haute. L'utilisateur sera notifié que son dossier est pris en charge au niveau 2.
        </p>
      </Modal>
    </AdminPage>
  );
}
