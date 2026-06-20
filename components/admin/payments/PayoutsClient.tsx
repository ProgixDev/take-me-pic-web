"use client";

import { Banknote, Clock, XCircle } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTable, type Column, Badge, StatCard } from "@/components/ui";
import type { AdminPayout } from "@/lib/admin/payments";

function money(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

const STATUS_TONE: Record<string, "green" | "gold" | "red" | "neutral"> = {
  paid: "green",
  pending: "gold",
  in_transit: "gold",
  failed: "red",
  canceled: "neutral",
};

export function PayoutsClient({ payouts }: { payouts: AdminPayout[] }) {
  const verse = payouts.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const enAttente = payouts.filter((p) => p.status === "pending" || p.status === "in_transit");
  const totalEnAttente = enAttente.reduce((s, p) => s + p.amount, 0);
  const nbEchoue = payouts.filter((p) => p.status === "failed").length;

  const columns: Column<AdminPayout>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">{r.id}</span>, sortValue: (r) => r.id },
    { key: "method", header: "Méthode", cell: (r) => <span className="capitalize">{r.method}</span>, sortValue: (r) => r.method },
    { key: "amount", header: "Montant", align: "right", cell: (r) => <span className="font-[family-name:var(--font-serif)] font-bold">{money(r.amount, r.currency)}</span>, sortValue: (r) => r.amount },
    { key: "status", header: "Statut", cell: (r) => <Badge tone={STATUS_TONE[r.status] ?? "neutral"} dot>{r.status}</Badge>, sortValue: (r) => r.status },
    { key: "arrivalDate", header: "Arrivée", cell: (r) => <span className="text-[11px] text-ink-faded">{r.arrivalDate ? new Date(r.arrivalDate).toLocaleDateString("fr-FR") : "—"}</span>, sortValue: (r) => r.arrivalDate },
  ];

  return (
    <AdminPage title="Versements" eyebrow="payouts Stripe" breadcrumb={[{ href: "/admin", label: "Admin" }, { href: "/admin/payments", label: "Paiements" }, { label: "Versements" }]}>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Versé" value={money(verse, payouts[0]?.currency ?? "EUR")} tone="green" icon={<Banknote size={16} />} />
        <StatCard label="En attente" value={money(totalEnAttente, payouts[0]?.currency ?? "EUR")} tone="gold" icon={<Clock size={16} />} />
        <StatCard label="Échoués" value={nbEchoue} tone="red" icon={<XCircle size={16} />} />
      </div>
      <DataTable columns={columns} rows={payouts} searchPlaceholder="rechercher un versement…" empty="Aucun versement Stripe (Connect requis)." />
    </AdminPage>
  );
}
