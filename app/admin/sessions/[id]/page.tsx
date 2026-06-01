"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Camera,
  MessageCircle,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Mail,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Badge,
  Button,
  Modal,
  PaperCard,
  Polaroid,
  Stamp,
  Avatar,
  useToast,
} from "@/components/ui";
import { getSession } from "@/lib/data";

const STATUS_TONE: Record<string, "green" | "blue" | "red" | "gold" | "neutral"> = {
  completed: "green",
  active: "blue",
  cancelled: "red",
  pending: "gold",
};

const STATUS_LABEL: Record<string, string> = {
  completed: "Terminée",
  active: "En cours",
  cancelled: "Annulée",
  pending: "En attente",
};

type TimelineStep = {
  key: string;
  label: string;
  icon: React.ReactNode;
  done: boolean;
  active?: boolean;
};

const POLAROID_SEEDS = ["session1", "session2", "session3", "session4", "session5", "session6"];

export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const session = getSession(id);

  const [cancelModal, setCancelModal] = useState(false);
  const [contactModal, setContactModal] = useState(false);
  const [contactMsg, setContactMsg] = useState("");

  const isCompleted = session.status === "completed";
  const isActive = session.status === "active";

  const timelineSteps: TimelineStep[] = [
    {
      key: "request",
      label: "Demande envoyée",
      icon: <Mail size={14} />,
      done: true,
    },
    {
      key: "match",
      label: "Match confirmé",
      icon: <CheckCircle2 size={14} />,
      done: session.status !== "pending",
    },
    {
      key: "chat",
      label: "Chat ouvert",
      icon: <MessageCircle size={14} />,
      done: session.status !== "pending",
    },
    {
      key: "session",
      label: "Session en cours",
      icon: <Camera size={14} />,
      done: isCompleted || isActive,
      active: isActive,
    },
    {
      key: "gallery",
      label: "Galerie partagée",
      icon: <Camera size={14} />,
      done: isCompleted,
    },
    {
      key: "note",
      label: "Note déposée",
      icon: <Star size={14} />,
      done: isCompleted && session.rating != null,
    },
  ];

  function handleCancel() {
    setCancelModal(false);
    toast.push(`Session ${session.id} annulée avec succès.`, "ok");
  }

  function handleContact() {
    if (!contactMsg.trim()) return;
    setContactModal(false);
    setContactMsg("");
    toast.push("Message envoyé aux deux participants.", "ok");
  }

  const galleryCount = Math.min(session.photos, POLAROID_SEEDS.length);

  return (
    <AdminPage
      title={`Session ${session.id}`}
      eyebrow="détail de session"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/sessions", label: "Sessions" },
        { label: session.id },
      ]}
      actions={
        <>
          <Button
            variant="paper"
            size="sm"
            icon={<MessageCircle size={14} />}
            onClick={() => setContactModal(true)}
          >
            Contacter
          </Button>
          {session.status !== "cancelled" && session.status !== "completed" && (
            <Button
              variant="danger"
              size="sm"
              icon={<XCircle size={14} />}
              onClick={() => setCancelModal(true)}
            >
              Annuler la session
            </Button>
          )}
        </>
      }
    >
      <div className="grid gap-6">
        {/* Status banner */}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge tone={STATUS_TONE[session.status] ?? "neutral"} dot>
            {STATUS_LABEL[session.status]}
          </Badge>
          <span className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.1em] text-ink-faded flex items-center gap-1.5">
            <MapPin size={12} />
            {session.spot} · {session.city}
          </span>
          <span className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.1em] text-ink-faded flex items-center gap-1.5">
            <Clock size={12} />
            {session.date} · {session.durationMin} min
          </span>
          {session.rating != null && (
            <span className="flex items-center gap-1 text-gold-deep font-[family-name:var(--font-serif)] font-bold text-[14px]">
              <Star size={14} fill="currentColor" />
              {session.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Timeline */}
        <PaperCard shadow="soft" className="p-5">
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-[16px] mb-5 flex items-center gap-2">
            <ChevronRight size={16} className="text-gold-deep" />
            Chronologie
          </h2>
          <div className="flex items-start gap-0 overflow-x-auto pb-2">
            {timelineSteps.map((step, i) => (
              <div key={step.key} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5 min-w-[90px]">
                  <div
                    className={`w-8 h-8 rounded-full border-[1.5px] flex items-center justify-center transition-all ${
                      step.active
                        ? "bg-stamp-blue border-stamp-blue text-paper-warm animate-pulse"
                        : step.done
                        ? "bg-stamp-green border-stamp-green text-paper-warm"
                        : "bg-card border-ink-faded text-ink-faded"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.08em] text-center ${
                      step.done ? "text-ink" : "text-ink-faded"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < timelineSteps.length - 1 && (
                  <div
                    className={`h-[1.5px] w-8 mt-[-16px] transition-all ${
                      step.done ? "bg-stamp-green" : "bg-ink-faded/40"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </PaperCard>

        {/* Participants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Requester */}
          <PaperCard shadow="ink" className="p-5 relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <Stamp color="blue" size={52} rotate={-8} fontSize={9}>
                DEMANDEUR
              </Stamp>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Avatar src={session.requester.avatar} size={52} ring={session.requester.premium} />
              <div>
                <div className="font-[family-name:var(--font-serif)] font-bold text-[16px]">
                  {session.requester.firstName} {session.requester.lastName}
                </div>
                <div className="text-ink-faded text-[12px] font-[family-name:var(--font-type)]">
                  {session.requester.username}
                </div>
                <div className="text-ink-faded text-[12px] mt-0.5">{session.requester.email}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-paper-warm rounded-[4px] p-2">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[18px] text-gold-deep">
                  {session.requester.karma.toLocaleString("fr-FR")}
                </div>
                <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.08em] text-ink-faded mt-0.5">
                  Karma
                </div>
              </div>
              <div className="bg-paper-warm rounded-[4px] p-2">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[18px]">
                  {session.requester.rating.toFixed(1)}
                </div>
                <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.08em] text-ink-faded mt-0.5">
                  Note
                </div>
              </div>
              <div className="bg-paper-warm rounded-[4px] p-2">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[18px]">
                  {session.requester.city}
                </div>
                <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.08em] text-ink-faded mt-0.5">
                  Ville
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/admin/users/${session.requester.id}`)}
              >
                Voir le profil
              </Button>
            </div>
          </PaperCard>

          {/* Photographer */}
          <PaperCard shadow="gold" className="p-5 relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <Stamp color="gold" size={52} rotate={6} fontSize={9}>
                PHOTO-{"\n"}GRAPHE
              </Stamp>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Avatar src={session.photographer.avatar} size={52} ring={session.photographer.premium} />
              <div>
                <div className="font-[family-name:var(--font-serif)] font-bold text-[16px]">
                  {session.photographer.firstName} {session.photographer.lastName}
                </div>
                <div className="text-ink-faded text-[12px] font-[family-name:var(--font-type)]">
                  {session.photographer.username}
                </div>
                <div className="text-ink-faded text-[12px] mt-0.5">{session.photographer.email}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-paper-warm rounded-[4px] p-2">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[18px] text-gold-deep">
                  {session.photographer.karma.toLocaleString("fr-FR")}
                </div>
                <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.08em] text-ink-faded mt-0.5">
                  Karma
                </div>
              </div>
              <div className="bg-paper-warm rounded-[4px] p-2">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[18px]">
                  {session.photographer.rating.toFixed(1)}
                </div>
                <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.08em] text-ink-faded mt-0.5">
                  Note
                </div>
              </div>
              <div className="bg-paper-warm rounded-[4px] p-2">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[18px]">
                  {session.photographer.photosGiven}
                </div>
                <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.08em] text-ink-faded mt-0.5">
                  Photos
                </div>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/admin/users/${session.photographer.id}`)}
              >
                Voir le profil
              </Button>
            </div>
          </PaperCard>
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <PaperCard shadow="soft" className="p-4 text-center">
            <div className="font-[family-name:var(--font-serif)] font-extrabold text-[32px] text-stamp-blue">
              {session.photos}
            </div>
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mt-1">
              Photos prises
            </div>
          </PaperCard>
          <PaperCard shadow="soft" className="p-4 text-center">
            <div className="font-[family-name:var(--font-serif)] font-extrabold text-[32px] text-gold-deep">
              +{session.karmaAwarded}
            </div>
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mt-1">
              Karma attribué
            </div>
          </PaperCard>
          <PaperCard shadow="soft" className="p-4 text-center">
            <div className="font-[family-name:var(--font-serif)] font-extrabold text-[32px]">
              {session.durationMin}
            </div>
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mt-1">
              Minutes
            </div>
          </PaperCard>
          <PaperCard shadow="soft" className="p-4 text-center">
            <div className="font-[family-name:var(--font-serif)] font-extrabold text-[32px] text-gold-deep">
              {session.rating != null ? session.rating.toFixed(1) : "—"}
            </div>
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mt-1">
              Note reçue
            </div>
          </PaperCard>
        </div>

        {/* Gallery Strip */}
        {isCompleted && galleryCount > 0 && (
          <PaperCard shadow="soft" className="p-5">
            <h2 className="font-[family-name:var(--font-serif)] font-bold text-[16px] mb-4 flex items-center gap-2">
              <Camera size={16} className="text-gold-deep" />
              Galerie de la session
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 flex-wrap">
              {POLAROID_SEEDS.slice(0, galleryCount).map((seed, i) => (
                <Polaroid
                  key={seed}
                  src={`https://picsum.photos/seed/${seed}${session.id}/400/400`}
                  caption={`Photo ${i + 1}`}
                  width={130}
                  height={130}
                  tilt={i % 2 === 0 ? 1.5 : -1.5}
                  captionSize={11}
                />
              ))}
            </div>
          </PaperCard>
        )}
      </div>

      {/* Cancel Modal */}
      <Modal
        open={cancelModal}
        onClose={() => setCancelModal(false)}
        title="Annuler la session ?"
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setCancelModal(false)}>
              Non, garder
            </Button>
            <Button variant="danger" size="sm" icon={<XCircle size={14} />} onClick={handleCancel}>
              Oui, annuler
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-2 p-3 bg-stamp-red/8 border border-stamp-red/30 rounded-[4px]">
            <AlertTriangle size={16} className="text-stamp-red mt-0.5 shrink-0" />
            <p className="font-[family-name:var(--font-serif)] text-[14px]">
              Cette action annulera définitivement la session <strong>{session.id}</strong> entre{" "}
              <strong>{session.requester.firstName}</strong> et{" "}
              <strong>{session.photographer.firstName}</strong>. Les deux participants seront notifiés.
            </p>
          </div>
        </div>
      </Modal>

      {/* Contact Modal */}
      <Modal
        open={contactModal}
        onClose={() => setContactModal(false)}
        title="Contacter les participants"
        size="md"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setContactModal(false)}>
              Annuler
            </Button>
            <Button
              variant="ink"
              size="sm"
              icon={<Mail size={14} />}
              onClick={handleContact}
            >
              Envoyer
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">
            Ce message sera envoyé à <strong>{session.requester.firstName}</strong> et{" "}
            <strong>{session.photographer.firstName}</strong>.
          </p>
          <textarea
            rows={5}
            value={contactMsg}
            onChange={(e) => setContactMsg(e.target.value)}
            placeholder="Rédigez votre message ici…"
            className="w-full bg-paper-warm border-[1.5px] border-ink rounded-[4px] px-3 py-2 font-[family-name:var(--font-hand)] text-[16px] text-ink placeholder:text-ink-faded outline-none resize-none focus:border-gold-deep transition"
          />
        </div>
      </Modal>
    </AdminPage>
  );
}
