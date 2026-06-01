"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Calendar, RefreshCw, XCircle, Layers } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Avatar,
  Badge,
  Button,
  Modal,
  PaperCard,
  Stamp,
  Chip,
  useToast,
} from "@/components/ui";
import { subscriptions, payments, fmtEur } from "@/lib/data";

const STATUS_TONE: Record<string, "green" | "gold" | "red" | "neutral"> = {
  actif: "green",
  "en essai": "gold",
  annulé: "red",
  expiré: "neutral",
};

const PLAN_TONE: Record<string, "blue" | "gold"> = {
  Mensuel: "blue",
  Annuel: "gold",
};

type ModalKind = "changer" | "annuler" | "rembourser" | null;

export default function PremiumDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [modal, setModal] = useState<ModalKind>(null);
  const [newPlan, setNewPlan] = useState<"Mensuel" | "Annuel">("Annuel");

  const sub = subscriptions.find((s) => s.id === id) ?? subscriptions[0];

  // Synthetic billing history from payments filtered/synthesized for this user
  const billingHistory = payments
    .filter((p) => p.user.id === sub.user.id && p.type === "abonnement")
    .slice(0, 6);

  // Fallback synthetic rows if none match
  const historyRows =
    billingHistory.length > 0
      ? billingHistory
      : Array.from({ length: 4 }, (_, i) => ({
          id: `synth_${i}`,
          date: `2026-0${5 - i}-01`,
          amount: sub.plan === "Annuel" ? 39.99 : 4.99,
          status: i === 2 ? "remboursé" : "réussi",
          method: "Visa",
        }));

  const HIST_STATUS_TONE: Record<string, "green" | "red" | "gold" | "neutral"> = {
    réussi: "green",
    remboursé: "gold",
    échoué: "red",
    "en attente": "neutral",
  };

  return (
    <AdminPage
      title={`${sub.user.firstName} ${sub.user.lastName}`}
      eyebrow="détail abonnement"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/premium", label: "Premium" },
        { label: `${sub.user.firstName} ${sub.user.lastName}` },
      ]}
      actions={
        <Button
          variant="paper"
          size="sm"
          icon={<ArrowLeft size={15} />}
          onClick={() => router.push("/admin/premium")}
        >
          Retour
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: subscriber + plan info */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          {/* Subscriber card */}
          <PaperCard shadow="gold" className="p-5 relative overflow-hidden">
            <Stamp
              color="gold"
              shape="circle"
              size={64}
              rotate={15}
              fontSize={9}
              className="absolute -top-3 -right-3 opacity-70"
            >
              {"PREMIUM\n✦"}
            </Stamp>
            <div className="flex items-start gap-4">
              <Avatar src={sub.user.avatar} size={52} ring />
              <div className="flex-1 min-w-0">
                <div className="font-[family-name:var(--font-serif)] font-bold text-[18px] leading-tight">
                  {sub.user.firstName} {sub.user.lastName}
                </div>
                <div className="font-[family-name:var(--font-mono)] text-[12px] text-ink-faded truncate mt-0.5">
                  {sub.user.email}
                </div>
                <div className="font-[family-name:var(--font-mono)] text-[12px] text-ink-faded">
                  {sub.user.username}
                </div>
                <div className="mt-2">
                  <Badge tone={STATUS_TONE[sub.status] ?? "neutral"} dot>
                    {sub.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-dashed border-[var(--ink-line)] grid grid-cols-2 gap-3">
              <div>
                <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.1em] text-ink-faded mb-1">
                  Ville
                </div>
                <div className="font-[family-name:var(--font-serif)] text-[14px]">
                  {sub.user.country} {sub.user.city}
                </div>
              </div>
              <div>
                <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.1em] text-ink-faded mb-1">
                  Membre depuis
                </div>
                <div className="font-[family-name:var(--font-mono)] text-[13px]">
                  {sub.user.joined}
                </div>
              </div>
              <div>
                <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.1em] text-ink-faded mb-1">
                  Karma
                </div>
                <div className="font-[family-name:var(--font-serif)] font-bold text-gold-deep text-[16px]">
                  {sub.user.karma.toLocaleString("fr-FR")}
                </div>
              </div>
              <div>
                <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.1em] text-ink-faded mb-1">
                  Dernière visite
                </div>
                <div className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
                  {sub.user.lastSeen}
                </div>
              </div>
            </div>
          </PaperCard>

          {/* Plan info card */}
          <PaperCard shadow="ink" className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-[16px]">
                Formule actuelle
              </h3>
              <Badge tone={PLAN_TONE[sub.plan] ?? "neutral"}>{sub.plan}</Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded">
                  Prix
                </span>
                <span className="font-[family-name:var(--font-mono)] font-bold text-[18px] text-gold-deep">
                  {fmtEur(sub.price)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded">
                  Début
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[13px]">
                  {sub.started}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded">
                  Renouvellement
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[13px]">
                  {sub.renews}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded">
                  ID abonnement
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[11px] text-ink-faded">
                  {sub.id}
                </span>
              </div>
            </div>
          </PaperCard>

          {/* Actions */}
          <PaperCard shadow="soft" className="p-5">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-[16px] mb-4">
              Actions
            </h3>
            <div className="flex flex-col gap-2.5">
              <Button
                variant="paper"
                size="sm"
                full
                icon={<Layers size={15} />}
                onClick={() => setModal("changer")}
              >
                Changer de formule
              </Button>
              <Button
                variant="gold"
                size="sm"
                full
                icon={<RefreshCw size={15} />}
                onClick={() => setModal("rembourser")}
              >
                Rembourser
              </Button>
              <Button
                variant="danger"
                size="sm"
                full
                icon={<XCircle size={15} />}
                onClick={() => setModal("annuler")}
              >
                Annuler l'abonnement
              </Button>
            </div>
          </PaperCard>
        </div>

        {/* Right column: billing history */}
        <div className="lg:col-span-2">
          <PaperCard shadow="soft" className="p-5">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard size={18} className="text-gold-deep" />
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-[18px]">
                Historique de facturation
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-[1.5px] border-dashed border-[var(--ink-line)]">
                    {["ID", "Date", "Montant", "Méthode", "Statut"].map((h) => (
                      <th
                        key={h}
                        className="pb-2 px-3 font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.12em] text-ink-faded"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {historyRows.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-[var(--ink-line)] last:border-0 hover:bg-paper-warm/50 transition"
                    >
                      <td className="py-3 px-3 font-[family-name:var(--font-mono)] text-[11px] text-ink-faded">
                        {"id" in row ? row.id : "—"}
                      </td>
                      <td className="py-3 px-3 font-[family-name:var(--font-mono)] text-[13px]">
                        {"date" in row ? String(row.date) : "—"}
                      </td>
                      <td className="py-3 px-3 font-[family-name:var(--font-serif)] font-semibold text-[14px]">
                        {fmtEur("amount" in row ? Number(row.amount) : sub.price)}
                      </td>
                      <td className="py-3 px-3 font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
                        {"method" in row ? String(row.method) : "Visa"}
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          tone={
                            HIST_STATUS_TONE[
                              ("status" in row ? String(row.status) : "réussi") as string
                            ] ?? "neutral"
                          }
                          dot
                        >
                          {"status" in row ? String(row.status) : "réussi"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Stats summary */}
            <div className="mt-6 pt-5 border-t border-dashed border-[var(--ink-line)] grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.1em] text-ink-faded">
                  Total facturé
                </div>
                <div className="font-[family-name:var(--font-serif)] font-bold text-[22px] text-gold-deep mt-1">
                  {fmtEur(
                    historyRows.reduce(
                      (s, r) =>
                        s +
                        ("amount" in r ? Math.abs(Number(r.amount)) : sub.price),
                      0
                    )
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.1em] text-ink-faded">
                  Paiements réussis
                </div>
                <div className="font-[family-name:var(--font-serif)] font-bold text-[22px] text-stamp-green mt-1">
                  {
                    historyRows.filter(
                      (r) =>
                        ("status" in r ? r.status : "réussi") === "réussi"
                    ).length
                  }
                </div>
              </div>
              <div className="text-center">
                <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.1em] text-ink-faded">
                  Jours actifs
                </div>
                <div className="font-[family-name:var(--font-serif)] font-bold text-[22px] mt-1">
                  {sub.status === "actif" ? "∞" : "—"}
                </div>
              </div>
            </div>
          </PaperCard>
        </div>
      </div>

      {/* Modal: Changer de formule */}
      <Modal
        open={modal === "changer"}
        onClose={() => setModal(null)}
        title="Changer de formule"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setModal(null)}>
              Annuler
            </Button>
            <Button
              variant="gold"
              size="sm"
              icon={<Layers size={15} />}
              onClick={() => {
                setModal(null);
                toast.push(
                  `Formule changée vers ${newPlan} avec succès !`,
                  "ok"
                );
              }}
            >
              Confirmer
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[15px] text-ink-faded mb-4">
          Sélectionnez la nouvelle formule pour{" "}
          <strong>
            {sub.user.firstName} {sub.user.lastName}
          </strong>
          .
        </p>
        <div className="flex gap-3">
          {(["Mensuel", "Annuel"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setNewPlan(p)}
              className={`flex-1 p-4 rounded-[4px] border-[1.5px] text-left transition cursor-pointer ${
                newPlan === p
                  ? "border-ink bg-ink text-paper-warm"
                  : "border-ink bg-card hover:bg-paper-warm"
              }`}
            >
              <div className="font-[family-name:var(--font-serif)] font-bold text-[16px]">
                {p}
              </div>
              <div className="font-[family-name:var(--font-mono)] text-[14px] mt-1 opacity-80">
                {p === "Annuel" ? "39,99 € / an" : "4,99 € / mois"}
              </div>
            </button>
          ))}
        </div>
      </Modal>

      {/* Modal: Annuler */}
      <Modal
        open={modal === "annuler"}
        onClose={() => setModal(null)}
        title="Annuler l'abonnement"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setModal(null)}>
              Non, garder
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<XCircle size={15} />}
              onClick={() => {
                setModal(null);
                toast.push("Abonnement annulé.", "info");
              }}
            >
              Oui, annuler
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[15px]">
          Êtes-vous sûr de vouloir annuler l'abonnement de{" "}
          <strong>
            {sub.user.firstName} {sub.user.lastName}
          </strong>
          ? L'accès Premium sera révoqué à la fin de la période en cours (
          {sub.renews}).
        </p>
      </Modal>

      {/* Modal: Rembourser */}
      <Modal
        open={modal === "rembourser"}
        onClose={() => setModal(null)}
        title="Rembourser l'abonnement"
        footer={
          <>
            <Button variant="paper" size="sm" onClick={() => setModal(null)}>
              Annuler
            </Button>
            <Button
              variant="gold"
              size="sm"
              icon={<RefreshCw size={15} />}
              onClick={() => {
                setModal(null);
                toast.push(
                  `Remboursement de ${fmtEur(sub.price)} initié !`,
                  "ok"
                );
              }}
            >
              Confirmer le remboursement
            </Button>
          </>
        }
      >
        <p className="font-[family-name:var(--font-serif)] text-[15px] text-ink-faded mb-4">
          Un remboursement de{" "}
          <strong className="text-ink">{fmtEur(sub.price)}</strong> sera émis
          vers le moyen de paiement d'origine de{" "}
          <strong>
            {sub.user.firstName} {sub.user.lastName}
          </strong>
          .
        </p>
        <div className="bg-paper-warm border border-dashed border-[var(--ink-line)] rounded-[4px] p-3 text-[13px] font-[family-name:var(--font-serif)] text-ink-faded">
          Le remboursement peut prendre 3 à 5 jours ouvrés selon la banque.
        </div>
      </Modal>
    </AdminPage>
  );
}
