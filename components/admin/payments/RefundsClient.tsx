"use client";

import { RotateCcw, Clock, XCircle } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTable, type Column, Badge, StatCard } from "@/components/ui";
import type { AdminRefund } from "@/lib/admin/payments";

function money(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

const STATUS_TONE: Record<string, "green" | "gold" | "red" | "neutral"> = {
  succeeded: "green",
  pending: "gold",
  failed: "red",
  canceled: "neutral",
};

export function RefundsClient({ refunds }: { refunds: AdminRefund[] }) {
  const total = refunds.reduce((s, r) => s + r.amount, 0);
  const enAttente = refunds.filter((r) => r.status === "pending").length;
  const echoues = refunds.filter((r) => r.status === "failed").length;

  const columns: Column<AdminRefund>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">{r.id}</span>, sortValue: (r) => r.id },
    { key: "chargeId", header: "Paiement", cell: (r) => <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">{r.chargeId ?? "—"}</span>, sortValue: (r) => r.chargeId ?? "" },
    { key: "reason", header: "Motif", cell: (r) => <span className="font-[family-name:var(--font-serif)] text-[13px]">{r.reason ?? "—"}</span>, sortValue: (r) => r.reason ?? "" },
    { key: "amount", header: "Montant", align: "right", cell: (r) => <span className="font-[family-name:var(--font-serif)] font-bold text-stamp-red">{money(r.amount, r.currency)}</span>, sortValue: (r) => r.amount },
    { key: "status", header: "Statut", cell: (r) => <Badge tone={STATUS_TONE[r.status ?? ""] ?? "neutral"} dot>{r.status ?? "—"}</Badge>, sortValue: (r) => r.status ?? "" },
    { key: "createdAt", header: "Date", cell: (r) => <span className="text-[11px] text-ink-faded">{r.createdAt ? new Date(r.createdAt).toLocaleDateString("fr-FR") : "—"}</span>, sortValue: (r) => r.createdAt },
  ];

  return (
    <AdminPage title="Remboursements" eyebrow="remboursements Stripe" breadcrumb={[{ href: "/admin", label: "Admin" }, { href: "/admin/payments", label: "Paiements" }, { label: "Remboursements" }]}>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Total remboursé" value={money(total, refunds[0]?.currency ?? "EUR")} icon={<RotateCcw size={16} />} />
        <StatCard label="En attente" value={enAttente} tone="gold" icon={<Clock size={16} />} />
        <StatCard label="Échoués" value={echoues} tone="red" icon={<XCircle size={16} />} />
      </div>
      <DataTable columns={columns} rows={refunds} searchPlaceholder="rechercher un remboursement…" empty="Aucun remboursement Stripe." />
    </AdminPage>
  );
}
