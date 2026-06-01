"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Plus, TrendingDown, AlertCircle } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  DataTable,
  Column,
  Avatar,
  Badge,
  Button,
  Modal,
  StatCard,
  Input,
  Textarea,
  Select,
  useToast,
} from "@/components/ui";
import { payments, Payment, fmtEur, fmtNum } from "@/lib/data";

const refundRows = payments.filter(
  (p) => p.type === "remboursement" || p.status === "remboursé"
);

const STATUS_TONE: Record<string, "green" | "gold" | "red" | "neutral"> = {
  réussi: "green",
  "en attente": "gold",
  échoué: "red",
  remboursé: "neutral",
};

export default function RefundsPage() {
  const router = useRouter();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [selectedPaymentId, setSelectedPaymentId] = useState(
    payments[0]?.id ?? ""
  );
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");

  const totalRemb = refundRows.reduce(
    (s, p) => s + Math.abs(p.amount),
    0
  );
  const nbRemb = refundRows.length;
  const nbEnAttente = refundRows.filter((p) => p.status === "en attente").length;
  const nbEchoues = refundRows.filter((p) => p.status === "échoué").length;

  const columns: Column<Payment>[] = [
    {
      key: "id",
      header: "ID",
      cell: (row) => (
        <span className="font-[family-name:var(--font-mono)] text-[11px] text-ink-faded">
          {row.id}
        </span>
      ),
      sortValue: (row) => row.id,
    },
    {
      key: "user",
      header: "Client",
      cell: (row) => (
        <span className="flex items-center gap-2.5">
          <Avatar src={row.user.avatar} size={30} />
          <span className="flex flex-col min-w-0">
            <span className="font-[family-name:var(--font-serif)] text-[13px] font-semibold truncate">
              {row.user.firstName} {row.user.lastName}
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-ink-faded truncate">
              {row.user.email}
            </span>
          </span>
        </span>
      ),
      sortValue: (row) => `${row.user.firstName} ${row.user.lastName}`,
    },
    {
      key: "type",
      header: "Type",
      cell: (row) => (
        <Badge tone={row.type === "remboursement" ? "red" : "neutral"}>
          {row.type}
        </Badge>
      ),
      sortValue: (row) => row.type,
    },
    {
      key: "amount",
      header: "Montant",
      align: "right",
      cell: (row) => (
        <span className="font-[family-name:var(--font-mono)] font-bold text-[14px] text-stamp-red">
          {fmtEur(Math.abs(row.amount))}
        </span>
      ),
      sortValue: (row) => Math.abs(row.amount),
    },
    {
      key: "method",
      header: "Méthode",
      cell: (row) => (
        <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded">
          {row.method}
        </span>
      ),
      sortValue: (row) => row.method,
    },
    {
      key: "status",
      header: "Statut",
      cell: (row) => (
        <Badge tone={STATUS_TONE[row.status] ?? "neutral"} dot>
          {row.status}
        </Badge>
      ),
      sortValue: (row) => row.status,
    },
    {
      key: "date",
      header: "Date",
      cell: (row) => (
        <span className="font-[family-name:var(--font-mono)] text-[12px] text-ink-faded">
          {row.date}
        </span>
      ),
      sortValue: (row) => row.date,
    },
  ];

  return (
    <AdminPage
      title="Remboursements"
      eyebrow="gestion des remboursements"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/payments", label: "Paiements" },
        { label: "Remboursements" },
      ]}
      actions={
        <Button
          variant="danger"
          size="sm"
          icon={<Plus size={15} />}
          onClick={() => setModalOpen(true)}
        >
          Nouveau remboursement
        </Button>
      }
    >
      {/* KPI StatCards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total remboursé"
          value={fmtEur(totalRemb)}
          icon={<TrendingDown size={18} />}
          tone="red"
        />
        <StatCard
          label="Nb remboursements"
          value={fmtNum(nbRemb)}
          icon={<RotateCcw size={18} />}
          tone="ink"
        />
        <StatCard
          label="En attente"
          value={fmtNum(nbEnAttente)}
          icon={<AlertCircle size={18} />}
          tone="gold"
        />
        <StatCard
          label="Échoués"
          value={fmtNum(nbEchoues)}
          icon={<AlertCircle size={18} />}
          tone="red"
        />
      </div>

      {/* DataTable */}
      <DataTable<Payment>
        columns={columns}
        rows={refundRows as unknown as Payment[]}
        onRowClick={(row) => router.push(`/admin/payments/${row.id}`)}
        searchable
        searchPlaceholder="rechercher un remboursement…"
        pageSize={12}
        empty="Aucun remboursement trouvé."
      />

      {/* Modal: Nouveau remboursement */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nouveau remboursement"
        size="md"
        footer={
          <>
            <Button
              variant="paper"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<RotateCcw size={15} />}
              onClick={() => {
                if (!refundAmount || !refundReason) {
                  toast.push("Veuillez remplir tous les champs.", "err");
                  return;
                }
                setModalOpen(false);
                setRefundAmount("");
                setRefundReason("");
                toast.push(
                  `Remboursement de ${refundAmount} € initié avec succès !`,
                  "ok"
                );
              }}
            >
              Confirmer le remboursement
            </Button>
          </>
        }
      >
        <div className="space-y-1">
          <Select
            label="Paiement concerné"
            value={selectedPaymentId}
            onChange={(e) => setSelectedPaymentId(e.target.value)}
          >
            {payments
              .filter((p) => p.status === "réussi" && p.amount > 0)
              .slice(0, 20)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} — {p.user.firstName} {p.user.lastName} —{" "}
                  {fmtEur(p.amount)}
                </option>
              ))}
          </Select>

          <Input
            label="Montant à rembourser (€)"
            type="number"
            min={0}
            step={0.01}
            placeholder="ex: 4.99"
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
          />

          <Textarea
            label="Motif du remboursement"
            placeholder="Expliquez la raison du remboursement…"
            rows={3}
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
          />

          <div className="bg-stamp-red/8 border border-stamp-red/30 rounded-[4px] p-3 text-[13px] text-stamp-red font-[family-name:var(--font-serif)]">
            Les remboursements sont traités dans un délai de 3 à 5 jours
            ouvrés. Cette action est irréversible.
          </div>
        </div>
      </Modal>
    </AdminPage>
  );
}
