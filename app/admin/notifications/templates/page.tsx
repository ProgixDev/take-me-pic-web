"use client";

import { useState } from "react";
import { Plus, Edit2, Copy, Bell, Mail, Smartphone, Star, MapPin, Shield, CreditCard } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  PaperCard,
  Badge,
  Button,
  Modal,
  Input,
  Textarea,
  Select,
  useToast,
} from "@/components/ui";

interface NotifTemplate {
  id: string;
  name: string;
  kind: "bienvenue" | "demande" | "karma" | "spot" | "abonnement" | "sécurité";
  canal: "push" | "email" | "in-app";
  title: string;
  body: string;
  lastUsed: string;
  sentCount: number;
}

const TEMPLATES: NotifTemplate[] = [
  {
    id: "t1",
    name: "Bienvenue dans la communauté",
    kind: "bienvenue",
    canal: "email",
    title: "Bienvenue dans la communauté Take Me Pic ! 📸",
    body: "Bonjour {{prénom}} ! Ton profil est créé. Explore la carte de ton quartier et fais ta première belle photo de voyage. La communauté t'attend !",
    lastUsed: "28 mai 2026",
    sentCount: 48230,
  },
  {
    id: "t2",
    name: "Demande de photo reçue",
    kind: "demande",
    canal: "push",
    title: "{{prénom}} a besoin de toi ! 🤝",
    body: "Il·elle est à {{distance}} de toi sur la carte. Tu as 5 minutes pour accepter. Chaque photo compte !",
    lastUsed: "30 mai 2026",
    sentCount: 18420,
  },
  {
    id: "t3",
    name: "Karma gagné",
    kind: "karma",
    canal: "in-app",
    title: "Tu viens de gagner {{points}} points de karma ✨",
    body: "Merci d'avoir aidé {{prénom}} aujourd'hui. Ton karma total est maintenant de {{total}} points. Continue — ça se voit dans le classement !",
    lastUsed: "30 mai 2026",
    sentCount: 142300,
  },
  {
    id: "t4",
    name: "Spot validé par la communauté",
    kind: "spot",
    canal: "in-app",
    title: "Ton spot « {{nom_spot}} » est approuvé 📍",
    body: "La communauté a validé ta suggestion. Il est maintenant visible sur la carte pour tous les voyageurs à {{ville}}. Belle contribution !",
    lastUsed: "25 mai 2026",
    sentCount: 3200,
  },
  {
    id: "t5",
    name: "Renouvellement d'abonnement",
    kind: "abonnement",
    canal: "email",
    title: "Ton abonnement Première classe se renouvelle dans 3 jours",
    body: "Bonjour {{prénom}}, ton abonnement Première classe sera automatiquement renouvelé le {{date}} pour {{montant}}. Gérer mon abonnement →",
    lastUsed: "29 mai 2026",
    sentCount: 4120,
  },
  {
    id: "t6",
    name: "Alerte de sécurité",
    kind: "sécurité",
    canal: "email",
    title: "Nouvelle connexion détectée sur ton compte",
    body: "Nous avons détecté une connexion depuis {{ville}}, {{pays}} le {{date}}. Si ce n'est pas toi, sécurise ton compte immédiatement. Changer mon mot de passe →",
    lastUsed: "27 mai 2026",
    sentCount: 890,
  },
];

const KIND_META: Record<NotifTemplate["kind"], { icon: React.ReactNode; color: "green" | "blue" | "gold" | "neutral" | "red" }> = {
  bienvenue: { icon: <Bell size={15} />, color: "green" },
  demande: { icon: <Star size={15} />, color: "blue" },
  karma: { icon: <Star size={15} />, color: "gold" },
  spot: { icon: <MapPin size={15} />, color: "blue" },
  abonnement: { icon: <CreditCard size={15} />, color: "gold" },
  sécurité: { icon: <Shield size={15} />, color: "red" },
};

const CANAL_ICON: Record<NotifTemplate["canal"], React.ReactNode> = {
  push: <Smartphone size={13} />,
  email: <Mail size={13} />,
  "in-app": <Bell size={13} />,
};

export default function NotificationTemplatesPage() {
  const toast = useToast();
  const [templates, setTemplates] = useState<NotifTemplate[]>(TEMPLATES);
  const [editTarget, setEditTarget] = useState<NotifTemplate | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editCanal, setEditCanal] = useState<NotifTemplate["canal"]>("push");

  const openEdit = (t: NotifTemplate) => {
    setEditTarget(t);
    setEditTitle(t.title);
    setEditBody(t.body);
    setEditCanal(t.canal);
  };

  const saveEdit = () => {
    if (!editTarget) return;
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === editTarget.id ? { ...t, title: editTitle, body: editBody, canal: editCanal } : t
      )
    );
    setEditTarget(null);
    toast.push(`Modèle « ${editTarget.name} » enregistré.`, "ok");
  };

  const duplicate = (t: NotifTemplate) => {
    const newT: NotifTemplate = {
      ...t,
      id: `t${Date.now()}`,
      name: `${t.name} (copie)`,
      sentCount: 0,
      lastUsed: "—",
    };
    setTemplates((prev) => [...prev, newT]);
    toast.push(`Modèle « ${t.name} » dupliqué.`, "ok");
  };

  return (
    <AdminPage
      title="Modèles de notifications"
      eyebrow="templates"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/notifications", label: "Notifications" },
        { label: "Modèles" },
      ]}
      actions={
        <Button
          variant="gold"
          size="sm"
          icon={<Plus size={14} />}
          onClick={() => toast.push("Création d'un nouveau modèle.", "info")}
        >
          Nouveau modèle
        </Button>
      }
    >
      {/* Documented backend boundary (TASK-008): no templates table exists yet. */}
      <div className="mb-4 p-3 bg-gold-light/15 border-[1.5px] border-dashed border-gold-deep/40 rounded-[4px]">
        <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink">
          <strong>Aperçu local</strong> — ces modèles ne sont pas encore stockés côté backend
          (aucune table dédiée). L'envoi réel passe par la frontière auditée
          «&nbsp;Nouvelle notification&nbsp;» (envoi individuel, ADR-0007) ; les modifications
          faites ici ne sont pas persistées.
        </p>
      </div>

      <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[14px] mb-6 max-w-2xl">
        Ces modèles pré-remplis accélèrent la création de notifications. Les variables entre{" "}
        <code className="font-[family-name:var(--font-mono)] text-[12px] bg-paper-warm/80 px-1 py-0.5 rounded">
          {"{{accolades}}"}
        </code>{" "}
        sont remplacées dynamiquement lors de l'envoi.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {templates.map((t) => {
          const meta = KIND_META[t.kind];
          return (
            <PaperCard key={t.id} shadow="ink" className="p-5 flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-[1.5px] shrink-0 ${
                      meta.color === "green"
                        ? "bg-stamp-green/10 border-stamp-green/30 text-stamp-green"
                        : meta.color === "gold"
                        ? "bg-gold-light/20 border-gold-deep/30 text-gold-deep"
                        : meta.color === "red"
                        ? "bg-stamp-red/10 border-stamp-red/30 text-stamp-red"
                        : "bg-stamp-blue/10 border-stamp-blue/30 text-stamp-blue"
                    }`}
                  >
                    {meta.icon}
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-serif)] font-bold text-[14px] leading-tight">
                      {t.name}
                    </h3>
                    <Badge tone={meta.color === "neutral" ? "neutral" : meta.color} className="mt-0.5">
                      {t.kind}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Canal + stats */}
              <div className="flex items-center gap-3 mb-3">
                <span className="flex items-center gap-1 font-[family-name:var(--font-type)] text-[11px] text-ink-faded capitalize">
                  {CANAL_ICON[t.canal]}
                  {t.canal}
                </span>
                <span className="text-ink-faded">·</span>
                <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">
                  {t.sentCount.toLocaleString("fr-FR")} envois
                </span>
              </div>

              {/* Preview */}
              <div className="flex-1 bg-paper-warm/60 rounded-[4px] border-[1.5px] border-dashed border-[var(--ink-line)] p-3 mb-4">
                <p className="font-[family-name:var(--font-serif)] font-semibold text-[13px] mb-1">
                  {t.title}
                </p>
                <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded leading-snug line-clamp-3">
                  {t.body}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-dashed border-[var(--ink-line)]">
                <span className="font-[family-name:var(--font-type)] text-[10px] text-ink-faded">
                  Dernier envoi : {t.lastUsed}
                </span>
                <div className="flex gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Copy size={12} />}
                    onClick={() => duplicate(t)}
                  >
                    dupliquer
                  </Button>
                  <Button
                    variant="paper"
                    size="sm"
                    icon={<Edit2 size={12} />}
                    onClick={() => openEdit(t)}
                  >
                    modifier
                  </Button>
                </div>
              </div>
            </PaperCard>
          );
        })}
      </div>

      {/* Edit Modal */}
      <Modal
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        title={`Modifier : ${editTarget?.name ?? ""}`}
        size="lg"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setEditTarget(null)}>
              Annuler
            </Button>
            <Button variant="gold" size="sm" onClick={saveEdit}>
              Enregistrer
            </Button>
          </>
        }
      >
        <div className="space-y-1">
          <Select
            label="Canal"
            value={editCanal}
            onChange={(e) => setEditCanal(e.target.value as NotifTemplate["canal"])}
          >
            <option value="push">Notification push (mobile)</option>
            <option value="email">E-mail</option>
            <option value="in-app">Bannière in-app</option>
          </Select>
          <Input
            label="Titre"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Titre de la notification…"
          />
          <Textarea
            label="Corps du message"
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            placeholder="Corps du message…"
            className="min-h-32"
          />
          <div className="p-3 bg-paper-warm/60 rounded-[4px] border border-dashed border-[var(--ink-line)]">
            <p className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mb-1">
              Variables disponibles
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["{{prénom}}", "{{ville}}", "{{points}}", "{{total}}", "{{date}}", "{{montant}}", "{{nom_spot}}", "{{distance}}"].map((v) => (
                <code key={v} className="font-[family-name:var(--font-mono)] text-[11px] bg-paper rounded border border-[var(--ink-line)] px-1.5 py-0.5 text-ink-faded">
                  {v}
                </code>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </AdminPage>
  );
}
