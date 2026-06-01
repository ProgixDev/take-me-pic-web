"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Clock, Banknote, CheckCircle2, AlertCircle, Plus } from "lucide-react";
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
  Select,
  useToast,
} from "@/components/ui";
import { users, fmtEur, fmtNum } from "@/lib/data";

interface PayoutRow {
  id: string;
  beneficiary: {
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    city: string;
  };
  role: string;
  amount: number;
  status: "en attente" | "versé" | "échoué";
  date: string;
  method: string;
}

const STATUS_TONE: Record<string, "green" | "gold" | "red"> = {
  versé: "green",
  "en attente": "gold",
  échoué: "red",
};

const ROLES = ["Photographe", "Photographe", "Partenaire", "Photographe", "Ambassadeur", "Partenaire"];
const METHODS = ["Virement SEPA", "Stripe Connect", "Virement SEPA", "PayPal"];

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

const PAYOUT_ROWS: PayoutRow[] = Array.from({ length: 12 }, (_, i) => {
  const u = users[(i * 4 + 1) % users.length];
  const statuses: PayoutRow["status"][] = ["en attente", "versé", "versé", "en attente", "versé", "échoué"];
  return {
    id: `pyo_${800 + i}`,
    beneficiary: {
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      avatar: u.avatar,
      city: u.city,
    },
    role: ROLES[i % ROLES.length],
    amount: 45 + (i * 37) % 380,
    status: statuses[i % statuses.length],
    date: `2026-05-${pad2((i % 27) + 1)}`,
    method: METHODS[i % METHODS.length],
  };
});

export default function PayoutsPage() {
  const router = useRouter();
  const toast = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  // Form state for new payout
  const [selectedUserId, setSelectedUserId] = useState(users[0].id);
  const [payoutAmount, setPayoutAmount] = useState("");

  const [payouts, setPayouts] = useState<PayoutRow[]>(PAYOUT_ROWS);

  const totalVerse = payouts
    .filter((p) => p.status === "versé")
    .reduce((s, p) => s + p.amount, 0);
  const enAttente = payouts.filter((p) => p.status === "en attente");
  const totalEnAttente = enAttente.reduce((s, p) => s + p.amount, 0);
  const nbVerse = payouts.filter((p) => p.status === "versé").length;
  const nbEchoue = payouts.filter((p) => p.status === "échoué").length;

  const columns: Column<PayoutRow>[] = [
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
      key: "beneficiary",
      header: "Bénéficiaire",
      cell: (row) => (
        <span className="flex items-center gap-2.5">
          <Avatar src={row.beneficiary.avatar} size={32} />
          <span className="flex flex-col min-w-0">
            <span className="font-[family-name:var(--font-serif)] text-[13px] font-semibold truncate">
              {row.beneficiary.firstName} {row.beneficiary.lastName}
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[10px] text-ink-faded truncate">
              {row.beneficiary.email}
            </span>
          </span>
        </span>
      ),
      sortValue: (row) => `${row.beneficiary.firstName} ${row.beneficiary.lastName}`,
    },
    {
      key: "role",
      header: "Rôle",
      cell: (row) => (
        <Badge
          tone={
            row.role === "Ambassadeur"
              ? "gold"
              : row.role === "Partenaire"
              ? "blue"
              : "neutral"
          }
        >
          {row.role}
        </Badge>
      ),
      sortValue: (row) => row.role,
    },
    {
      key: "amount",
      header: "Montant",
      align: "right",
      cell: (row) => (
        <span className="font-[family-name:var(--font-mono)] font-bold text-[14px] text-gold-deep">
          {fmtEur(row.amount)}
        </span>
      ),
      sortValue: (row) => row.amount,
    },
    {
      key: "method",
      header: "Méthode",
      cell: (row) => (
        <span className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded">
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
    {
      key: "actions",
      header: "",
      align: "center",
      cell: (row) =>
        row.status === "en attente" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPayouts((prev) =>
                prev.map((p) =>
                  p.id === row.id ? { ...p, status: "versé" } : p
                )
              );
              toast.push(
                `Virement de ${fmtEur(row.amount)} lancé pour ${row.beneficiary.firstName} ${row.beneficiary.lastName} !`,
                "ok"
              );
            }}
            className="text-[12px] font-[family-name:var(--font-serif)] font-semibold text-stamp-blue border border-stamp-blue/40 rounded px-2.5 py-1 hover:bg-stamp-blue/10 transition cursor-pointer"
          >
            Virer
          </button>
        ) : null,
    },
  ];

  const selectedUser = users.find((u) => u.id === selectedUserId) ?? users[0];

  return (
    <AdminPage
      title="Virements photographes"
      eyebrow="paiements partenaires ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/payments", label: "Paiements" },
        { label: "Virements" },
      ]}
      actions={
        <>
          <Button
            variant="ink"
            size="sm"
            icon={<Send size={15} />}
            onClick={() => {
              const pending = payouts.filter((p) => p.status === "en attente");
              setPayouts((prev) =>
                prev.map((p) =>
                  p.status === "en attente" ? { ...p, status: "versé" } : p
                )
              );
              toast.push(
                `${pending.length} virement(s) pour ${fmtEur(totalEnAttente)} lancés !`,
                "ok"
              );
            }}
            disabled={enAttente.length === 0}
          >
            Tout virer ({enAttente.length})
          </Button>
          <Button
            variant="gold"
            size="sm"
            icon={<Plus size={15} />}
            onClick={() => setModalOpen(true)}
          >
            Lancer un virement
          </Button>
        </>
      }
    >
      {/* KPI StatCards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="En attente"
          value={fmtEur(totalEnAttente)}
          delta={`${enAttente.length} virement(s)`}
          icon={<Clock size={18} />}
          tone="gold"
        />
        <StatCard
          label="Versé ce mois"
          value={fmtEur(totalVerse)}
          delta={`${nbVerse} virement(s)`}
          icon={<CheckCircle2 size={18} />}
          tone="green"
        />
        <StatCard
          label="Total virements"
          value={fmtNum(payouts.length)}
          icon={<Banknote size={18} />}
          tone="ink"
        />
        <StatCard
          label="Échoués"
          value={fmtNum(nbEchoue)}
          icon={<AlertCircle size={18} />}
          tone="red"
        />
      </div>

      {/* DataTable */}
      <DataTable<PayoutRow>
        columns={columns}
        rows={payouts as unknown as PayoutRow[]}
        searchable
        searchPlaceholder="rechercher un bénéficiaire…"
        pageSize={12}
        empty="Aucun virement trouvé."
      />

      {/* Modal: Lancer un virement */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Lancer un virement"
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
              variant="gold"
              size="sm"
              icon={<Send size={15} />}
              onClick={() => {
                if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
                  toast.push("Veuillez saisir un montant valide.", "err");
                  return;
                }
                const newPayout: PayoutRow = {
                  id: `pyo_manual_${Date.now()}`,
                  beneficiary: {
                    firstName: selectedUser.firstName,
                    lastName: selectedUser.lastName,
                    email: selectedUser.email,
                    avatar: selectedUser.avatar,
                    city: selectedUser.city,
                  },
                  role: "Photographe",
                  amount: parseFloat(payoutAmount),
                  status: "en attente",
                  date: "2026-05-30",
                  method: "Virement SEPA",
                };
                setPayouts((prev) => [newPayout, ...prev]);
                setModalOpen(false);
                setPayoutAmount("");
                toast.push(
                  `Virement de ${fmtEur(parseFloat(payoutAmount))} créé pour ${selectedUser.firstName} ${selectedUser.lastName} !`,
                  "ok"
                );
              }}
            >
              Confirmer le virement
            </Button>
          </>
        }
      >
        <div className="space-y-1">
          <Select
            label="Bénéficiaire"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            {users.slice(0, 24).map((u) => (
              <option key={u.id} value={u.id}>
                {u.firstName} {u.lastName} — {u.city}
              </option>
            ))}
          </Select>

          <Input
            label="Montant (€)"
            type="number"
            min={1}
            step={0.01}
            placeholder="ex: 120.00"
            value={payoutAmount}
            onChange={(e) => setPayoutAmount(e.target.value)}
          />

          <Select label="Méthode de virement">
            <option value="sepa">Virement SEPA</option>
            <option value="stripe">Stripe Connect</option>
            <option value="paypal">PayPal</option>
          </Select>

          {selectedUser && (
            <div className="flex items-center gap-3 bg-paper-warm border border-dashed border-[var(--ink-line)] rounded-[4px] p-3">
              <Avatar src={selectedUser.avatar} size={36} />
              <div>
                <div className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">
                  {selectedUser.firstName} {selectedUser.lastName}
                </div>
                <div className="font-[family-name:var(--font-mono)] text-[11px] text-ink-faded">
                  {selectedUser.email}
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </AdminPage>
  );
}
