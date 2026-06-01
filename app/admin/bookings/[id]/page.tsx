"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  CreditCard,
  AlertTriangle,
  RotateCcw,
  XCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Badge,
  Button,
  Modal,
  PaperCard,
  Stamp,
  Avatar,
  Ticket,
  Tape,
  useToast,
} from "@/components/ui";
import { getBooking, fmtEur } from "@/lib/data";

const STATUS_TONE: Record<string, "green" | "gold" | "red"> = {
  "confirmée": "green",
  "en attente": "gold",
  "annulée": "red",
};

const STATUS_LABEL_FULL: Record<string, string> = {
  "confirmée": "Réservation confirmée",
  "en attente": "En attente de confirmation",
  "annulée": "Réservation annulée",
};

const PAYMENT_STATUS: Record<string, { label: string; tone: "green" | "gold" | "red" | "neutral" }> = {
  "confirmée": { label: "Paiement reçu", tone: "green" },
  "en attente": { label: "Paiement en attente", tone: "gold" },
  "annulée": { label: "Paiement annulé", tone: "red" },
};

const PAYMENT_METHODS = ["Visa •••• 4242", "Mastercard •••• 1234", "Apple Pay", "Visa •••• 8765"];
const EXPERIENCE_DESCS: Record<string, string> = {
  "Tram 28, visite guidée":
    "Montez à bord du célèbre Tram 28 avec un guide local et découvrez les quartiers historiques de Lisbonne. Photos incluses à chaque arrêt.",
  "Atelier photo argentique":
    "Un après-midi en studio — apprenez à développer votre propre film argentique et repartez avec vos tirages.",
  "Balade Alfama au lever":
    "Lever à l'aube pour capturer la lumière dorée sur les ruelles d'Alfama, avec un photographe local.",
  "Tour des toits de Paris":
    "Accès privé à une terrasse parisienne avec vue panoramique — idéal pour portraits et coucher de soleil.",
  "Médina au coucher":
    "Parcourez les ruelles de la médina de Marrakech au coucher du soleil avec un guide expert.",
};

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();

  const booking = getBooking(id);

  const [refundModal, setRefundModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);

  const payInfo = PAYMENT_STATUS[booking.status] ?? { label: "—", tone: "neutral" as const };
  const payMethod = PAYMENT_METHODS[parseInt(booking.id.replace("bk_", ""), 10) % PAYMENT_METHODS.length];
  const expDesc =
    EXPERIENCE_DESCS[booking.experience] ??
    "Expérience immersive au cœur de la destination — guide local, accès privé, photos incluses.";

  function handleRefund() {
    setRefundModal(false);
    toast.push(`Réservation ${booking.id} remboursée avec succès.`, "ok");
  }

  function handleCancel() {
    setCancelModal(false);
    toast.push(`Réservation ${booking.id} annulée.`, "ok");
  }

  const isCancellable = booking.status !== "annulée";
  const isRefundable = booking.status === "confirmée";

  return (
    <AdminPage
      title={`Réservation ${booking.id}`}
      eyebrow="billet voyageur"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/bookings", label: "Réservations" },
        { label: booking.id },
      ]}
      actions={
        <>
          {isRefundable && (
            <Button
              variant="paper"
              size="sm"
              icon={<RotateCcw size={14} />}
              onClick={() => setRefundModal(true)}
            >
              Rembourser
            </Button>
          )}
          {isCancellable && (
            <Button
              variant="danger"
              size="sm"
              icon={<XCircle size={14} />}
              onClick={() => setCancelModal(true)}
            >
              Annuler
            </Button>
          )}
        </>
      }
    >
      <div className="grid gap-6">
        {/* Status badge */}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge tone={STATUS_TONE[booking.status] ?? "neutral"} dot>
            {booking.status}
          </Badge>
          <span className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.1em] text-ink-faded flex items-center gap-1.5">
            <MapPin size={12} />
            {booking.city}
          </span>
          <span className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.1em] text-ink-faded flex items-center gap-1.5">
            <Calendar size={12} />
            {booking.date}
          </span>
        </div>

        {/* Ticket Booking Pass */}
        <div className="relative max-w-2xl">
          <Tape color="cream" rotate={-1} className="absolute -top-2 left-12 z-10" />
          <Ticket className="border-[1.5px] border-ink relative">
            <div className="grid md:grid-cols-[1fr_auto] divide-y md:divide-y-0 md:divide-x divide-dashed divide-[var(--ink-line)]">
              {/* Main section */}
              <div className="p-6 relative overflow-hidden">
                {/* Stamp decoration */}
                <div className="absolute top-4 right-4">
                  <Stamp
                    color={
                      booking.status === "confirmée"
                        ? "green"
                        : booking.status === "annulée"
                        ? "red"
                        : "gold"
                    }
                    shape="circle"
                    size={68}
                    rotate={booking.status === "confirmée" ? 12 : -8}
                    fontSize={9}
                  >
                    {booking.status === "confirmée"
                      ? "CONFIRMÉ"
                      : booking.status === "annulée"
                      ? "ANNULÉ"
                      : "EN ATTENTE"}
                  </Stamp>
                </div>

                <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-1">
                  Expérience · Take Me Pic
                </div>
                <h2 className="font-[family-name:var(--font-serif)] font-bold text-[22px] tracking-[-0.02em] leading-snug mb-1 pr-20">
                  {booking.experience}
                </h2>
                <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded leading-relaxed max-w-xs mb-5">
                  {expDesc}
                </p>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.12em] text-ink-faded mb-0.5">
                      Ville
                    </div>
                    <div className="font-[family-name:var(--font-serif)] font-bold text-[15px]">
                      {booking.city}
                    </div>
                  </div>
                  <div>
                    <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.12em] text-ink-faded mb-0.5">
                      Date
                    </div>
                    <div className="font-[family-name:var(--font-serif)] font-bold text-[15px]">
                      {booking.date}
                    </div>
                  </div>
                  <div>
                    <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.12em] text-ink-faded mb-0.5">
                      Réf. billet
                    </div>
                    <div className="font-[family-name:var(--font-mono)] text-[13px] text-ink-faded">
                      {booking.id}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stub section */}
              <div className="p-5 flex flex-col justify-center items-center gap-2 min-w-[140px]">
                <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.12em] text-ink-faded">
                  Montant
                </div>
                <div className="font-[family-name:var(--font-serif)] font-extrabold text-[28px] text-gold-deep">
                  {fmtEur(booking.amount)}
                </div>
                <Badge tone={STATUS_TONE[booking.status] ?? "neutral"} dot>
                  {booking.status}
                </Badge>
              </div>
            </div>
          </Ticket>
        </div>

        {/* Customer & Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer */}
          <PaperCard shadow="soft" className="p-5">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mb-3">
              Client
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Avatar src={booking.user.avatar} size={48} ring={booking.user.premium} />
              <div className="flex-1 min-w-0">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[16px] truncate">
                  {booking.user.firstName} {booking.user.lastName}
                </div>
                <div className="text-ink-faded text-[12px] font-[family-name:var(--font-type)] truncate">
                  {booking.user.email}
                </div>
                <div className="text-ink-faded text-[12px] mt-0.5">
                  {booking.user.phone}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-paper-warm rounded-[4px] p-2.5 text-center">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[16px] text-gold-deep">
                  {booking.user.karma.toLocaleString("fr-FR")}
                </div>
                <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.08em] text-ink-faded mt-0.5">
                  Karma
                </div>
              </div>
              <div className="bg-paper-warm rounded-[4px] p-2.5 text-center">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[16px]">
                  {booking.user.city}
                </div>
                <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.08em] text-ink-faded mt-0.5">
                  Ville
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/admin/users/${booking.user.id}`)}
            >
              Voir le profil →
            </Button>
          </PaperCard>

          {/* Payment details */}
          <PaperCard shadow="soft" className="p-5">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mb-3">
              Paiement
            </div>
            <div className="flex flex-col gap-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-serif)] text-[14px]">
                  Statut du paiement
                </span>
                <Badge tone={payInfo.tone} dot>
                  {payInfo.label}
                </Badge>
              </div>

              {/* Amount */}
              <div className="flex items-center justify-between border-t border-dashed border-[var(--ink-line)] pt-3">
                <span className="font-[family-name:var(--font-serif)] text-[14px]">
                  Montant total
                </span>
                <span className="font-[family-name:var(--font-serif)] font-extrabold text-[20px] text-gold-deep">
                  {fmtEur(booking.amount)}
                </span>
              </div>

              {/* Method */}
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-serif)] text-[14px]">
                  Moyen de paiement
                </span>
                <span className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[13px] text-ink-faded">
                  <CreditCard size={14} />
                  {payMethod}
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between border-t border-dashed border-[var(--ink-line)] pt-3">
                <span className="font-[family-name:var(--font-serif)] text-[14px]">
                  Date de la réservation
                </span>
                <span className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded flex items-center gap-1">
                  <Calendar size={12} />
                  {booking.date}
                </span>
              </div>

              {/* Status icon */}
              <div className="flex items-center gap-2 mt-1">
                {booking.status === "confirmée" ? (
                  <CheckCircle size={16} className="text-stamp-green" />
                ) : booking.status === "en attente" ? (
                  <Clock size={16} className="text-gold-deep" />
                ) : (
                  <XCircle size={16} className="text-stamp-red" />
                )}
                <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
                  {STATUS_LABEL_FULL[booking.status]}
                </span>
              </div>
            </div>
          </PaperCard>
        </div>
      </div>

      {/* Refund Modal */}
      <Modal
        open={refundModal}
        onClose={() => setRefundModal(false)}
        title="Rembourser cette réservation ?"
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setRefundModal(false)}>
              Annuler
            </Button>
            <Button
              variant="gold"
              size="sm"
              icon={<RotateCcw size={14} />}
              onClick={handleRefund}
            >
              Confirmer le remboursement
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <p className="font-[family-name:var(--font-serif)] text-[14px]">
            Un remboursement de{" "}
            <strong className="text-gold-deep">{fmtEur(booking.amount)}</strong> sera effectué
            vers <strong>{payMethod}</strong> de{" "}
            <strong>
              {booking.user.firstName} {booking.user.lastName}
            </strong>.
          </p>
          <div className="flex items-start gap-2 p-3 bg-gold-light/20 border border-gold-deep/30 rounded-[4px]">
            <AlertTriangle size={15} className="text-gold-deep mt-0.5 shrink-0" />
            <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
              Le délai de remboursement est de 3 à 5 jours ouvrés selon la banque.
            </p>
          </div>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        open={cancelModal}
        onClose={() => setCancelModal(false)}
        title="Annuler la réservation ?"
        size="sm"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setCancelModal(false)}>
              Non, garder
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<XCircle size={14} />}
              onClick={handleCancel}
            >
              Oui, annuler
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-2 p-3 bg-stamp-red/8 border border-stamp-red/30 rounded-[4px]">
          <AlertTriangle size={16} className="text-stamp-red mt-0.5 shrink-0" />
          <p className="font-[family-name:var(--font-serif)] text-[14px]">
            La réservation <strong>{booking.id}</strong> pour{" "}
            <strong>
              {booking.user.firstName} {booking.user.lastName}
            </strong>{" "}
            sera définitivement annulée. Cette action est irréversible.
          </p>
        </div>
      </Modal>
    </AdminPage>
  );
}
