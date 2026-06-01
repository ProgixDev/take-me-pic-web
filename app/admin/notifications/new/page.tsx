"use client";

import { useState } from "react";
import { Send, Smartphone, Mail, Bell, Users, ChevronRight } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Button,
  PaperCard,
  Stamp,
  Modal,
  Input,
  Textarea,
  Select,
  useToast,
} from "@/components/ui";
import { fmtNum } from "@/lib/data";

type Audience = "tous" | "premium" | "ville" | "inactifs";
type Canal = "push" | "email" | "in-app";

const AUDIENCE_META: Record<Audience, { label: string; reach: number; description: string }> = {
  tous: { label: "Tous les utilisateurs", reach: 48230, description: "Ensemble de la communauté active" },
  premium: { label: "Abonnés Première classe", reach: 4120, description: "Utilisateurs avec un abonnement actif" },
  ville: { label: "Paris (exemple)", reach: 14200, description: "Utilisateurs localisés dans une ville" },
  inactifs: { label: "Utilisateurs inactifs", reach: 8900, description: "Pas de connexion depuis +7 jours" },
};

const CANAL_META: Record<Canal, { label: string; icon: React.ReactNode; description: string }> = {
  push: { label: "Notification push", icon: <Smartphone size={16} />, description: "Envoyée sur l'app mobile" },
  email: { label: "E-mail", icon: <Mail size={16} />, description: "Campagne e-mail directe" },
  "in-app": { label: "In-app", icon: <Bell size={16} />, description: "Bannière dans l'application" },
};

export default function NewNotificationPage() {
  const toast = useToast();
  const [audience, setAudience] = useState<Audience>("tous");
  const [canal, setCanal] = useState<Canal>("push");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const reach = AUDIENCE_META[audience].reach;
  const canSend = title.trim().length > 0 && message.trim().length > 0;

  const handleSend = () => {
    setConfirmOpen(false);
    toast.push(
      `Notification envoyée à ${fmtNum(reach)} utilisateur${reach > 1 ? "s" : ""} via ${CANAL_META[canal].label}.`,
      "ok"
    );
    setTitle("");
    setMessage("");
  };

  return (
    <AdminPage
      title="Composer une notification"
      eyebrow="broadcast"
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

          {/* Audience */}
          <Select
            label="Audience cible"
            value={audience}
            onChange={(e) => setAudience(e.target.value as Audience)}
          >
            <option value="tous">Tous les utilisateurs</option>
            <option value="premium">Abonnés Première classe</option>
            <option value="ville">Par ville</option>
            <option value="inactifs">Utilisateurs inactifs (+7 j.)</option>
          </Select>

          {/* Audience info */}
          <div className="flex items-center gap-2 mb-4 p-3 bg-paper-warm/60 rounded-[4px] border-[1.5px] border-dashed border-[var(--ink-line)]">
            <Users size={15} className="text-ink-faded shrink-0" />
            <div>
              <p className="font-[family-name:var(--font-serif)] text-[14px]">
                <strong className="text-gold-deep">{fmtNum(reach)}</strong> destinataires estimés
              </p>
              <p className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
                {AUDIENCE_META[audience].description}
              </p>
            </div>
          </div>

          {/* Canal */}
          <Select
            label="Canal d'envoi"
            value={canal}
            onChange={(e) => setCanal(e.target.value as Canal)}
          >
            <option value="push">Notification push (mobile)</option>
            <option value="email">E-mail</option>
            <option value="in-app">Bannière in-app</option>
          </Select>

          {/* Title */}
          <Input
            label="Titre de la notification"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : Nouveau spot près de chez toi !"
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
              Remplis le titre et le message pour pouvoir envoyer.
            </p>
          )}
        </PaperCard>

        {/* Live preview */}
        <div className="space-y-4">
          <h2 className="font-[family-name:var(--font-hand)] text-2xl text-gold-deep -rotate-1">
            aperçu en direct
          </h2>

          {/* Phone-ish push preview */}
          {(canal === "push" || canal === "in-app") && (
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
                    {/* Blurred app content placeholder */}
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
                              {title || "Titre de la notification…"}
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
          )}

          {/* Email preview */}
          {canal === "email" && (
            <PaperCard shadow="gold" className="p-6 max-w-[480px] mx-auto">
              {/* Email header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-dashed border-[var(--ink-line)]">
                <div className="w-10 h-10 rounded-full bg-gold-light/30 border border-gold-deep/30 flex items-center justify-center">
                  <span className="text-lg">📸</span>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-serif)] font-bold text-[14px]">
                    Take Me Pic
                  </p>
                  <p className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
                    bonjour@takemepic.com
                  </p>
                </div>
              </div>

              <h3 className="font-[family-name:var(--font-serif)] font-bold text-[18px] mb-3 leading-snug">
                {title || "Titre de l'e-mail…"}
              </h3>

              <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded leading-relaxed mb-4">
                {message || "Le corps de ton message apparaîtra ici."}
              </p>

              <div className="bg-ink text-paper-warm text-center py-2.5 px-4 rounded-[4px] font-[family-name:var(--font-serif)] font-semibold text-[14px]">
                Ouvrir l'application →
              </div>

              <p className="font-[family-name:var(--font-type)] text-[10px] text-ink-faded text-center mt-4 leading-relaxed">
                Tu reçois cet e-mail car tu es membre de Take Me Pic.
                <br />Se désabonner · Préférences de notification
              </p>
            </PaperCard>
          )}

          {/* Reach summary */}
          <PaperCard shadow="soft" className="p-4 max-w-[480px] mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-paper-warm border border-dashed border-[var(--ink-line)] flex items-center justify-center">
                {CANAL_META[canal].icon}
              </div>
              <div>
                <p className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">
                  {CANAL_META[canal].label} · {AUDIENCE_META[audience].label}
                </p>
                <p className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
                  {fmtNum(reach)} destinataires estimés
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
            <Button variant="gold" size="sm" icon={<Send size={14} />} onClick={handleSend}>
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
                <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">Audience</span>
                <span className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">{AUDIENCE_META[audience].label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">Canal</span>
                <span className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">{CANAL_META[canal].label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">Portée estimée</span>
                <span className="font-[family-name:var(--font-serif)] font-bold text-[14px] text-gold-deep">
                  {fmtNum(reach)} utilisateurs
                </span>
              </div>
            </div>
          </div>
          <div className="border border-dashed border-[var(--ink-line)] rounded-[4px] p-3">
            <p className="font-[family-name:var(--font-serif)] font-bold text-[14px] mb-1">{title}</p>
            <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded leading-snug">
              {message}
            </p>
          </div>
          <p className="font-[family-name:var(--font-serif)] italic text-[12px] text-ink-faded">
            Cette action est irréversible. Le message sera envoyé immédiatement.
          </p>
        </div>
      </Modal>
    </AdminPage>
  );
}
