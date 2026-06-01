"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Clock,
  AlertTriangle,
  ExternalLink,
  Navigation,
  MessageSquare,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Badge,
  Button,
  Modal,
  PaperCard,
  Stamp,
  Avatar,
  Tape,
  useToast,
} from "@/components/ui";
import { sessions, getSession } from "@/lib/data";

type RequestStatus = "en attente" | "en cours" | "expiré" | "refusé";

interface PhotoRequest {
  id: string;
  requester: ReturnType<typeof getSession>["requester"];
  photographer: ReturnType<typeof getSession>["photographer"];
  spot: string;
  city: string;
  distance: string;
  status: RequestStatus;
  expires: string;
  sessionId: string;
  message: string;
  sentAt: string;
}

function buildRequestById(rawId: string): PhotoRequest {
  // Extract numeric index from "req_N"
  const idx = parseInt(rawId.replace("req_", ""), 10) - 1;
  const all = sessions.filter((s) => s.status === "pending" || s.status === "active");
  const extra = sessions
    .filter((s) => s.status === "completed" || s.status === "cancelled")
    .slice(0, 6);
  const allSessions = [...all, ...extra];
  const safeIdx = Math.abs(idx) % allSessions.length;
  const s = allSessions[safeIdx] ?? allSessions[0];

  const statusMap: Record<string, RequestStatus> = {
    pending: "en attente",
    active: "en cours",
    completed: "expiré",
    cancelled: "refusé",
  };

  const DISTANCES = ["0,3 km", "1,1 km", "0,7 km", "2,4 km", "0,5 km", "1,8 km", "3,2 km"];
  const EXPIRES = [
    "dans 45 min",
    "dans 2 h",
    "dans 12 min",
    "expiré il y a 3 h",
    "dans 1 h 20",
    "expiré il y a 10 h",
    "dans 8 h",
  ];
  const MESSAGES = [
    "Bonjour ! Je suis à la Place des Vosges et je cherche quelqu'un pour quelques photos. Je peux rester 30 min max. Merci d'avance !",
    "Salut, je suis de passage à Lisbonne pour deux jours et j'aimerais de belles photos devant les tuiles azulejos. Pas besoin d'être pro, juste sympa ✿",
    "Je serai au Pont des Arts demain matin à 7h pour l'heure dorée. Si tu veux bien m'aider, je t'offre un café ! ☼",
    "Je fais le tour de Barcelone en solo. Un coup de main pour quelques souvenirs serait vraiment super. Merci !",
    "En vacances à Paris avec ma famille, on cherche quelqu'un pour nous immortaliser devant la Tour Eiffel. Promis, on est rapides !",
  ];
  const SENT = [
    "2026-05-30 08:42",
    "2026-05-29 16:18",
    "2026-05-30 11:05",
    "2026-05-28 09:33",
    "2026-05-30 14:50",
  ];

  return {
    id: rawId,
    requester: s.requester,
    photographer: s.photographer,
    spot: s.spot,
    city: s.city,
    distance: DISTANCES[safeIdx % DISTANCES.length],
    status: statusMap[s.status],
    expires: EXPIRES[safeIdx % EXPIRES.length],
    sessionId: s.id,
    message: MESSAGES[safeIdx % MESSAGES.length],
    sentAt: SENT[safeIdx % SENT.length],
  };
}

const STATUS_TONE: Record<RequestStatus, "gold" | "blue" | "neutral" | "red"> = {
  "en attente": "gold",
  "en cours": "blue",
  "expiré": "neutral",
  "refusé": "red",
};

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();

  const req = buildRequestById(id);

  const [expireModal, setExpireModal] = useState(false);

  function handleExpire() {
    setExpireModal(false);
    toast.push(`Demande ${req.id} expirée de force.`, "ok");
  }

  const isExpired = req.status === "expiré" || req.status === "refusé";

  return (
    <AdminPage
      title={`Demande ${req.id}`}
      eyebrow="le pli reçu"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/requests", label: "Demandes" },
        { label: req.id },
      ]}
      actions={
        <>
          <Button
            variant="paper"
            size="sm"
            icon={<ExternalLink size={14} />}
            onClick={() => router.push(`/admin/sessions/${req.sessionId}`)}
          >
            Voir la session
          </Button>
          {!isExpired && (
            <Button
              variant="danger"
              size="sm"
              icon={<AlertTriangle size={14} />}
              onClick={() => setExpireModal(true)}
            >
              Forcer l&apos;expiration
            </Button>
          )}
        </>
      }
    >
      <div className="grid gap-6">
        {/* Status row */}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge tone={STATUS_TONE[req.status]} dot>
            {req.status}
          </Badge>
          <span className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.1em] text-ink-faded flex items-center gap-1.5">
            <MapPin size={12} />
            {req.spot} · {req.city}
          </span>
          <span className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.1em] text-ink-faded flex items-center gap-1.5">
            <Navigation size={12} />
            {req.distance}
          </span>
          <span
            className={`font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.1em] flex items-center gap-1.5 ${
              req.expires.startsWith("expiré") ? "text-stamp-red" : "text-ink-faded"
            }`}
          >
            <Clock size={12} />
            {req.expires}
          </span>
        </div>

        {/* Postcard / pli */}
        <div className="relative">
          <Tape color="cream" rotate={-1} className="absolute -top-2 left-10 z-10" />
          <Tape color="red" rotate={2} className="absolute -top-2 right-16 z-10" />
          <PaperCard shadow="ink" tilt={-0.5} className="p-6 paper relative overflow-hidden">
            {/* Stamp decoration */}
            <div className="absolute top-4 right-4">
              <Stamp color="red" shape="circle" size={56} rotate={14} fontSize={8}>
                {req.city.toUpperCase()}
              </Stamp>
            </div>
            <div className="absolute bottom-4 right-20 opacity-40">
              <Stamp color="blue" shape="rect" size={42} rotate={-6} fontSize={7}>
                TMP POST
              </Stamp>
            </div>

            {/* Header */}
            <div className="flex items-start gap-3 mb-5 pr-16">
              <Avatar src={req.requester.avatar} size={44} />
              <div>
                <div className="font-[family-name:var(--font-hand)] text-[20px] leading-tight">
                  {req.requester.firstName} {req.requester.lastName}
                </div>
                <div className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.1em] text-ink-faded mt-0.5">
                  {req.requester.username} · envoyé le {req.sentAt}
                </div>
              </div>
            </div>

            {/* Divider rule */}
            <div className="squiggle mb-4 w-40" />

            {/* Message body */}
            <div className="relative bg-paper-warm/60 rounded-[4px] border border-dashed border-[var(--ink-line)] p-4 mb-4">
              <MessageSquare
                size={14}
                className="absolute top-3 left-3 text-gold-deep opacity-60"
              />
              <p className="font-[family-name:var(--font-hand)] text-[18px] leading-relaxed text-ink pl-4">
                {req.message}
              </p>
            </div>

            {/* Footer meta */}
            <div className="flex items-center gap-4 font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.08em] text-ink-faded">
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                {req.spot}
              </span>
              <span className="flex items-center gap-1">
                <Navigation size={11} />
                {req.distance} du photographe
              </span>
            </div>
          </PaperCard>
        </div>

        {/* Participants */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Requester */}
          <PaperCard shadow="soft" className="p-5">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mb-3">
              Demandeur
            </div>
            <div className="flex items-center gap-3">
              <Avatar src={req.requester.avatar} size={44} ring={req.requester.premium} />
              <div className="flex-1 min-w-0">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[15px] truncate">
                  {req.requester.firstName} {req.requester.lastName}
                </div>
                <div className="text-ink-faded text-[12px] font-[family-name:var(--font-type)] truncate">
                  {req.requester.email}
                </div>
                <div className="text-ink-faded text-[12px] mt-0.5">
                  {req.requester.city} · Karma{" "}
                  <span className="text-gold-deep font-bold">
                    {req.requester.karma.toLocaleString("fr-FR")}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/admin/users/${req.requester.id}`)}
              >
                Voir le profil →
              </Button>
            </div>
          </PaperCard>

          {/* Photographer */}
          <PaperCard shadow="soft" className="p-5">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mb-3">
              Photographe ciblé
            </div>
            <div className="flex items-center gap-3">
              <Avatar src={req.photographer.avatar} size={44} ring={req.photographer.premium} />
              <div className="flex-1 min-w-0">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[15px] truncate">
                  {req.photographer.firstName} {req.photographer.lastName}
                </div>
                <div className="text-ink-faded text-[12px] font-[family-name:var(--font-type)] truncate">
                  {req.photographer.email}
                </div>
                <div className="text-ink-faded text-[12px] mt-0.5">
                  {req.photographer.city} · {req.photographer.photosGiven} photos prises
                </div>
              </div>
            </div>
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/admin/users/${req.photographer.id}`)}
              >
                Voir le profil →
              </Button>
            </div>
          </PaperCard>
        </div>

        {/* Location block */}
        <PaperCard shadow="soft" className="p-5 map-hand overflow-hidden relative">
          <div className="relative z-10">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mb-2">
              Localisation du spot
            </div>
            <div className="font-[family-name:var(--font-hand)] text-[22px] flex items-center gap-2">
              <MapPin size={18} className="text-stamp-red" />
              {req.spot}, {req.city}
            </div>
            <div className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded mt-1">
              Distance estimée entre les participants : <strong>{req.distance}</strong>
            </div>
          </div>
          <div className="absolute inset-0 opacity-[0.04] bg-[url('https://picsum.photos/seed/map42/800/200')] bg-cover bg-center" />
        </PaperCard>
      </div>

      {/* Force Expire Modal */}
      <Modal
        open={expireModal}
        onClose={() => setExpireModal(false)}
        title="Forcer l'expiration ?"
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setExpireModal(false)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<AlertTriangle size={14} />}
              onClick={handleExpire}
            >
              Forcer l&apos;expiration
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-2 p-3 bg-stamp-red/8 border border-stamp-red/30 rounded-[4px]">
          <AlertTriangle size={16} className="text-stamp-red mt-0.5 shrink-0" />
          <p className="font-[family-name:var(--font-serif)] text-[14px]">
            La demande <strong>{req.id}</strong> sera immédiatement marquée comme expirée.
            Le demandeur et le photographe seront notifiés.
          </p>
        </div>
      </Modal>
    </AdminPage>
  );
}
