"use client";

import { FileText, ExternalLink } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTable, type Column, Badge, StatCard } from "@/components/ui";
import type { AdminInvoice } from "@/lib/admin/payments";

function money(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

const STATUS_TONE: Record<string, "green" | "gold" | "red" | "neutral"> = {
  paid: "green",
  open: "gold",
  draft: "neutral",
  uncollectible: "red",
  void: "neutral",
};

export function InvoicesClient({ invoices }: { invoices: AdminInvoice[] }) {
  const totalPaid = invoices.reduce((s, i) => s + i.amountPaid, 0);
  const open = invoices.filter((i) => i.status === "open").length;

  const columns: Column<AdminInvoice>[] = [
    { key: "number", header: "N°", cell: (r) => <span className="font-[family-name:var(--font-type)] text-[12px]">{r.number ?? r.id}</span>, sortValue: (r) => r.number ?? r.id },
    { key: "customerEmail", header: "Client", cell: (r) => <span className="font-[family-name:var(--font-serif)] text-[13px]">{r.customerEmail ?? "—"}</span>, sortValue: (r) => r.customerEmail ?? "" },
    { key: "amountDue", header: "Montant", align: "right", cell: (r) => <span className="font-[family-name:var(--font-serif)] font-bold">{money(r.amountDue, r.currency)}</span>, sortValue: (r) => r.amountDue },
    { key: "status", header: "Statut", cell: (r) => <Badge tone={STATUS_TONE[r.status ?? ""] ?? "neutral"} dot>{r.status ?? "—"}</Badge>, sortValue: (r) => r.status ?? "" },
    { key: "createdAt", header: "Date", cell: (r) => <span className="text-[11px] text-ink-faded">{r.createdAt ? new Date(r.createdAt).toLocaleDateString("fr-FR") : "—"}</span>, sortValue: (r) => r.createdAt },
    {
      key: "link",
      header: "",
      cell: (r) =>
        r.hostedInvoiceUrl ? (
          <a href={r.hostedInvoiceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[12px] text-gold-deep">
            <ExternalLink size={12} /> voir
          </a>
        ) : null,
    },
  ];

  return (
    <AdminPage title="Facturation" eyebrow="factures Stripe" breadcrumb={[{ href: "/admin", label: "Admin" }, { href: "/admin/settings", label: "Réglages" }, { label: "Facturation" }]}>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Factures" value={invoices.length} icon={<FileText size={16} />} />
        <StatCard label="Payé" value={money(totalPaid, invoices[0]?.currency ?? "EUR")} tone="green" />
        <StatCard label="Ouvertes" value={open} tone="gold" />
      </div>
      <DataTable columns={columns} rows={invoices} searchPlaceholder="rechercher une facture…" empty="Aucune facture Stripe." />
    </AdminPage>
  );
}
