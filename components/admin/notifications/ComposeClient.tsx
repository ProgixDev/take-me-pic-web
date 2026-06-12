"use client";

import { useState, useTransition } from "react";
import { Send, Smartphone, User } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Button, PaperCard, Stamp, Modal, Input, Textarea, useToast } from "@/components/ui";
import { sendUserNotification } from "@/lib/admin/notifications-actions";

function actionErrorMessage(result: { kind: string; message?: string }) {
  if (result.kind === "unauthenticated") return "Session Supabase manquante. Reconnecte-toi.";
  if (result.kind === "unauthorized") return "Ce compte n'a pas les droits staff pour cette action.";
  return result.message ?? "L'envoi a échoué.";
}

export function ComposeClient() {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [target, setTarget] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const canSend = target.trim().length > 0 && message.trim().length > 0;

  const handleSend = () => {
    setConfirmOpen(false);
    startTransition(async () => {
      const result = await sendUserNotification(target, message, title || undefined);
      if (result.kind === "ok") {
        toast.push(`Notification envoyée à ${target.trim()} (in-app + push).`, "ok");
        setTarget("");
        setTitle("");
        setMessage("");
      } else {
        toast.push(actionErrorMessage(result), "err");
      }
    });
  };

  return (
    <AdminPage
      title="Composer une notification"
      eyebrow="envoi individuel"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/notifications", label: "Notifications" },
        { label: "Nouvelle" },
      ]}
      actions={
        <Button
          variant="gold"
          size="sm"
          icon={<Send size={14} />}
          disabled={pending}
          onClick={() => canSend && setConfirmOpen(true)}
        >
          Envoyer
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <PaperCard shadow="ink" className="p-6">
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-5">
            Paramètres du message
          </h2>

          {/* Target user */}
          <Input
            label="Destinataire (username ou ID profil)"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Ex : claire.bernard"
          />

          <div className="flex items-center gap-2 mb-4 p-3 bg-paper-warm/60 rounded-[4px] border-[1.5px] border-dashed border-[var(--ink-line)]">
            <User size={15} className="text-ink-faded shrink-0" />
            <div>
              <p className="font-[family-name:var(--font-serif)] text-[14px]">
                Envoi <strong className="text-gold-deep">individuel</strong> — notification in-app +
                push sur les appareils enregistrés du destinataire.
              </p>
              <p className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
                Les envois par segment (tous, premium, ville, inactifs) et le canal e-mail n'ont pas
                encore de backend (ADR-0007). Chaque envoi est journalisé.
              </p>
            </div>
          </div>

          {/* Title */}
          <Input
            label="Titre du push (optionnel)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Message de l'équipe"
            maxLength={80}
          />
          {title && (
            <p className="text-[11px] font-[family-name:var(--font-type)] text-ink-faded -mt-2 mb-3.5 pl-1">
              {title.length}/80 caractères
            </p>
          )}

          {/* Message */}
          <Textarea
            label="Corps du message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Rédige ton message ici — chaleureux, court, actionnable."
            className="min-h-36"
            maxLength={320}
          />
          {message && (
            <p className="text-[11px] font-[family-name:var(--font-type)] text-ink-faded -mt-2 mb-3.5 pl-1">
              {message.length}/320 caractères
            </p>
          )}

          {!canSend && (
            <p className="font-[family-name:var(--font-serif)] italic text-[13px] text-ink-faded mt-1">
              Renseigne le destinataire et le message pour pouvoir envoyer.
            </p>
          )}
        </PaperCard>

        {/* Live preview */}
        <div className="space-y-4">
          <h2 className="font-[family-name:var(--font-hand)] text-2xl text-gold-deep -rotate-1">
            aperçu en direct
          </h2>

          <div className="relative mx-auto max-w-[320px]">
            {/* Phone mockup */}
            <div className="bg-ink rounded-[24px] p-3 shadow-ink">
              <div className="bg-paper-warm rounded-[16px] overflow-hidden min-h-[520px] p-0">
                {/* Status bar */}
                <div className="bg-ink/10 px-4 py-2 flex items-center justify-between">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] text-ink-faded">9:41</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-1.5 rounded bg-ink/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-ink/40" />
                  </div>
                </div>

                {/* App screen mockup */}
                <div className="p-3 pt-4 space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-paper/60 rounded-lg border border-dashed border-[var(--ink-line)] flex items-center justify-center opacity-40">
                      <span className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.1em] text-ink-faded">contenu app</span>
                    </div>
                  ))}

                  {/* Notification overlay */}
                  {(title || message) && (
                    <PaperCard shadow="ink" className="p-3 mt-2 animate-fade-up">
                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gold-light/40 border border-gold-deep/30 flex items-center justify-center shrink-0">
                          <span className="text-[11px]">📸</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.1em] text-ink-faded">
                              Take Me Pic
                            </span>
                            <span className="font-[family-name:var(--font-type)] text-[9px] text-ink-faded">
                              maintenant
                            </span>
                          </div>
                          <p className="font-[family-name:var(--font-serif)] font-bold text-[12px] leading-tight">
                            {title || "Take Me Pic"}
                          </p>
                          <p className="font-[family-name:var(--font-serif)] text-[11px] text-ink-faded leading-snug mt-0.5 line-clamp-2">
                            {message || "Corps du message…"}
                          </p>
                        </div>
                      </div>
                    </PaperCard>
                  )}
                </div>
              </div>
            </div>

            <div className="absolute -top-2 -right-2">
              <Stamp color="blue" size={56} fontSize={8} rotate={12}>
                {`PUSH\n★\nMOBILE`}
              </Stamp>
            </div>
          </div>

          {/* Channel summary */}
          <PaperCard shadow="soft" className="p-4 max-w-[480px] mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-paper-warm border border-dashed border-[var(--ink-line)] flex items-center justify-center">
                <Smartphone size={16} />
              </div>
              <div>
                <p className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">
                  In-app + push · 1 destinataire
                </p>
                <p className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
                  Envoyé via la frontière auditée admin_send_notification
                </p>
              </div>
            </div>
          </PaperCard>
        </div>
      </div>

      {/* Confirm modal */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirmer l'envoi"
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setConfirmOpen(false)}>
              Annuler
            </Button>
            <Button variant="gold" size="sm" icon={<Send size={14} />} disabled={pending} onClick={handleSend}>
              Envoyer maintenant
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="p-4 bg-paper-warm/60 rounded-[4px] border-[1.5px] border-dashed border-[var(--ink-line)]">
            <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mb-1">
              Résumé de l'envoi
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">Destinataire</span>
                <span className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">{target.trim()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">Canal</span>
                <span className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">In-app + push</span>
              </div>
            </div>
          </div>
          <div className="border border-dashed border-[var(--ink-line)] rounded-[4px] p-3">
            {title && <p className="font-[family-name:var(--font-serif)] font-bold text-[14px] mb-1">{title}</p>}
            <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded leading-snug">
              {message}
            </p>
          </div>
          <p className="font-[family-name:var(--font-serif)] italic text-[12px] text-ink-faded">
            Cette action est irréversible, envoyée immédiatement et journalisée.
          </p>
        </div>
      </Modal>
    </AdminPage>
  );
}
