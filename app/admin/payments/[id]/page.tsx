"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw, Mail, Receipt } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Avatar,
  Badge,
  Button,
  Modal,
  PaperCard,
  Ticket,
  Stamp,
  useToast,
} from "@/components/ui";
import { getPayment, fmtEur } from "@/lib/data";

const STATUS_TONE: Record<string, "green" | "gold" | "red" | "neutral"> = {
  réussi: "green",
  "en attente": "gold",
  échoué: "red",
  remboursé: "neutral",
};

const TYPE_TONE: Record<string, "blue" | "gold" | "red" | "neutral"> = {
  abonnement: "gold",
  réservation: "blue",
  remboursement: "red",
};

type ModalKind = "rembourser" | "recu" | null;

export default function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [modal, setModal] = useState<ModalKind>(null);

  const payment = getPayment(id);

  const serviceFee = Math.abs(payment.amount) * 0.05;
  const sousTotal = Math.abs(payment.amount) - serviceFee;
  const total = Math.abs(payment.amount);

  return (
    <AdminPage
      title={`Paiement ${payment.id}`}
      eyebrow="détail transaction"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/payments", label: "Paiements" },
        { label: payment.id },
      ]}
      actions={
        <Button
          variant="paper"
          size="sm"
          icon={<ArrowLeft size={15} />}
          onClick={() => router.push("/admin/payments")}
        >
          Retour
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: amount hero + actions */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Amount hero card */}
          <PaperCard
            shadow={payment.amount < 0 ? "red" : "gold"}
            className="p-6 text-center relative overflow-hidden"
          >
            <Stamp
              color={payment.amount < 0 ? "red" : "gold"}
              shape="octagon"
              size={52}
              rotate={10}
              fontSize={8}
              className="absolute -top-2 -right-2 opacity-60"
            >
              {payment.status === "réussi" ? "VALIDÉ\n✓" : payment.status === "remboursé" ? "REMB.\n↩" : payment.status === "échoué" ? "ÉCHEC\n✗" : "ATTENTE\n…"}
            </Stamp>
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.15em] text-ink-faded mb-2">
              Montant
            </div>
            <div
              className={`font-[family-name:var(--font-serif)] font-extrabold text-[42px] leading-none ${
                payment.amount < 0 ? "text-stamp-red" : "text-gold-deep"
              }`}
            >
              {fmtEur(payment.amount)}
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Badge tone={STATUS_TONE[payment.status] ?? "neutral"} dot>
                {payment.status}
              </Badge>
              <Badge tone={TYPE_TONE[payment.type] ?? "neutral"}>
                {payment.type}
              </Badge>
            </div>
          </PaperCard>

          {/* Customer card */}
          <PaperCard shadow="soft" className="p-5">
            <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.12em] text-ink-faded mb-3">
              Client
            </div>
            <div className="flex items-center gap-3">
              <Avatar src={payment.user.avatar} size={44} ring={payment.user.premium} />
              <div className="flex-1 min-w-0">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[16px] leading-tight">
                  {payment.user.firstName} {payment.user.lastName}
                </div>
                <div className="font-[family-name:var(--font-mono)] text-[11px] text-ink-faded truncate">
                  {payment.user.email}
                </div>
                <div className="font-[family-name:var(--font-mono)] text-[11px] text-ink-faded">
                  {payment.user.username}
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-dashed border-[var(--ink-line)] grid grid-cols-2 gap-2 text-[12px]">
              <div>
                <span className="text-ink-faded">Ville : </span>
                <span>{payment.user.city}</span>
              </div>
              <div>
                <span className="text-ink-faded">Premium : </span>
                <span className={payment.user.premium ? "text-gold-deep font-semibold" : ""}>
                  {payment.user.premium ? "Oui ✦" : "Non"}
                </span>
              </div>
            </div>
          </PaperCard>

          {/* Actions */}
          <PaperCard shadow="soft" className="p-5">
            <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.12em] text-ink-faded mb-3">
              Actions
            </div>
            <div className="flex flex-col gap-2.5">
              <Button
                variant="gold"
                size="sm"
                full
                icon={<RotateCcw size={15} />}
                onClick={() => setModal("rembourser")}
                disabled={payment.status === "remboursé" || payment.status === "échoué"}
              >
                Rembourser
              </Button>
              <Button
                variant="paper"
                size="sm"
                full
                icon={<Mail size={15} />}
                onClick={() => setModal("recu")}
              >
                Renvoyer le reçu
              </Button>
            </div>
          </PaperCard>
        </div>

        {/* Right column: ticket receipt */}
        <div className="lg:col-span-2">
          <PaperCard shadow="soft" className="p-5">
            <div className="flex items-center gap-2 mb-5">
              <Receipt size={18} className="text-gold-deep" />
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-[18px]">
                Reçu de transaction
              </h3>
            </div>

            {/* Ticket component */}
            <div className="my-4 mx-4">
              <Ticket className="border-[1.5px] border-ink">
                <div className="px-8 py-5">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5 pb-4 border-b border-dashed border-[var(--ink-line)]">
                    <div>
                      <div className="font-[family-name:var(--font-hand)] text-2xl text-gold-deep -rotate-1">
                        Take Me Pic
                      </div>
                      <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.12em] text-ink-faded">
                        Reçu de paiement
                      </div>
                    </div>
                    <Stamp color="gold" shape="circle" size={52} rotate={8} fontSize={8}>
                      {"TAKE\nME PIC"}
                    </Stamp>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.1em] text-ink-faded mb-1">
                        Référence
                      </div>
                      <div className="font-[family-name:var(--font-mono)] text-[12px]">
                        {payment.id}
                      </div>
                    </div>
                    <div>
                      <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.1em] text-ink-faded mb-1">
                        Date
                      </div>
                      <div className="font-[family-name:var(--font-mono)] text-[12px]">
                        {payment.date}
                      </div>
                    </div>
                    <div>
                      <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.1em] text-ink-faded mb-1">
                        Client
                      </div>
                      <div className="font-[family-name:var(--font-serif)] text-[13px] font-semibold">
                        {payment.user.firstName} {payment.user.lastName}
                      </div>
                      <div className="font-[family-name:var(--font-mono)] text-[11px] text-ink-faded">
                        {payment.user.email}
                      </div>
                    </div>
                    <div>
                      <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.1em] text-ink-faded mb-1">
                        Méthode
                      </div>
                      <div className="font-[family-name:var(--font-serif)] text-[13px]">
                        {payment.method}
                      </div>
                    </div>
                    <div>
                      <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.1em] text-ink-faded mb-1">
                        Type
                      </div>
                      <div>
                        <Badge tone={TYPE_TONE[payment.type] ?? "neutral"}>
                          {payment.type}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.1em] text-ink-faded mb-1">
                        Statut
                      </div>
                      <div>
                        <Badge tone={STATUS_TONE[payment.status] ?? "neutral"} dot>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="border-t border-dashed border-[var(--ink-line)] pt-4 space-y-2">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-ink-faded font-[family-name:var(--font-serif)]">
                        Sous-total
                      </span>
                      <span className="font-[family-name:var(--font-mono)]">
                        {fmtEur(sousTotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-ink-faded font-[family-name:var(--font-serif)]">
                        Frais de service (5 %)
                      </span>
                      <span className="font-[family-name:var(--font-mono)]">
                        {fmtEur(serviceFee)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[15px] font-bold pt-2 border-t border-[var(--ink-line)] mt-2">
                      <span className="font-[family-name:var(--font-serif)]">Total</span>
                      <span
                        className={`font-[family-name:var(--font-mono)] ${
                          payment.amount < 0 ? "text-stamp-red" : "text-gold-deep"
                        }`}
                      >
                        {fmtEur(total)}
                      </span>
                    </div>
                  </div>

                  {/* Footer note */}
                  <div className="mt-5 pt-4 border-t border-dashed border-[var(--ink-line)] text-center">
                    <div className="font-[family-name:var(--font-hand)] text-[15px] text-ink-faded italic">
                      Merci de voyager avec Take Me Pic ✦
                    </div>
                    <div className="font-[family-name:var(--font-mono)] text-[10px] text-ink-faded mt-1">
                      Pour toute question : support@takemepic.app
                    </div>
                  </div>
                </div>
              </Ticket>
            </div>
          </PaperCard>
        </div>
      </div>

      {/* Modal: Rembourser */}
      <Modal
        open={modal === "rembourser"}
        onClose={() => setModal(null)}
        title="Confirmer le remboursement"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setModal(null)}>
              Annuler
            </Button>
            <Button
              variant="gold"
              size="sm"
              icon={<RotateCcw size={15} />}
              onClick={() => {
                setModal(null);
                toast.push(
                  `Remboursement de ${fmtEur(Math.abs(payment.amount))} initié pour ${payment.user.firstName} ${payment.user.lastName} !`,
                  "ok"
                );
              }}
            >
              Confirmer le remboursement
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[15px] mb-3">
          Vous êtes sur le point de rembourser{" "}
          <strong className="text-gold-deep">{fmtEur(Math.abs(payment.amount))}</strong>{" "}
          à{" "}
          <strong>
            {payment.user.firstName} {payment.user.lastName}
          </strong>
          .
        </p>
        <div className="bg-paper-warm border border-dashed border-[var(--ink-line)] rounded p-3 text-[13px] text-ink-faded font-[family-name:var(--font-serif)]">
          Le remboursement apparaîtra sur le relevé bancaire sous 3–5 jours
          ouvrés. Cette action est irréversible.
        </div>
      </Modal>

      {/* Modal: Renvoyer reçu */}
      <Modal
        open={modal === "recu"}
        onClose={() => setModal(null)}
        title="Renvoyer le reçu"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setModal(null)}>
              Annuler
            </Button>
            <Button
              variant="ink"
              size="sm"
              icon={<Mail size={15} />}
              onClick={() => {
                setModal(null);
                toast.push(
                  `Reçu renvoyé à ${payment.user.email} !`,
                  "ok"
                );
              }}
            >
              Envoyer
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[15px]">
          Le reçu de la transaction{" "}
          <span className="font-[family-name:var(--font-mono)] text-[13px] bg-paper-2 px-1.5 py-0.5 rounded">
            {payment.id}
          </span>{" "}
          sera envoyé à{" "}
          <strong>{payment.user.email}</strong>.
        </p>
      </Modal>
    </AdminPage>
  );
}
