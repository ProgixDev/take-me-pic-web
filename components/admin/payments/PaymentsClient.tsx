"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTable, type Column, Badge, StatCard } from "@/components/ui";
import type { AdminCharge } from "@/lib/admin/payments";

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
};

const STATUS_LABEL: Record<string, string> = {
  succeeded: "réussi",
  pending: "en attente",
  failed: "échoué",
};

type StatusFilter = "tous" | "succeeded" | "pending" | "failed";

export function PaymentsClient({ charges }: { charges: AdminCharge[] }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");

  const filtered = useMemo(
    () => charges.filter((c) => statusFilter === "tous" || c.status === statusFilter),
    [charges, statusFilter],
  );

  const totalNet = charges.filter((c) => c.status === "succeeded").reduce((s, c) => s + (c.amount - c.amountRefunded), 0);
  const reussis = charges.filter((c) => c.status === "succeeded").length;
  const echoues = charges.filter((c) => c.status === "failed").length;
  const rembourses = charges.filter((c) => c.refunded).length;

  const columns: Column<AdminCharge>[] = [
    { key: "id", header: "ID", cell: (r) => <span className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded">{r.id}</span>, sortValue: (r) => r.id },
    {
      key: "customer",
      header: "Client",
      cell: (r) => (
        <div className="min-w-0">
          <div className="font-[family-name:var(--font-serif)]">{r.customerName ?? "—"}</div>
          {r.customerEmail && <div className="font-[family-name:var(--font-type)] text-[11px] text-ink-faded truncate">{r.customerEmail}</div>}
        </div>
      ),
      sortValue: (r) => r.customerName ?? "",
    },
    { key: "description", header: "Description", cell: (r) => <span className="font-[family-name:var(--font-serif)] text-[13px]">{r.description ?? "—"}</span>, sortValue: (r) => r.description ?? "" },
    {
      key: "method",
      header: "Moyen",
      cell: (r) => (r.cardBrand ? <span className="capitalize">{r.cardBrand} ·{r.cardLast4}</span> : "—"),
    },
    { key: "amount", header: "Montant", align: "right", cell: (r) => <span className="font-[family-name:var(--font-serif)] font-bold">{money(r.amount, r.currency)}</span>, sortValue: (r) => r.amount },
    {
      key: "status",
      header: "Statut",
      cell: (r) => (
        <Badge tone={r.refunded ? "neutral" : STATUS_TONE[r.status] ?? "neutral"} dot>
          {r.refunded ? "remboursé" : STATUS_LABEL[r.status] ?? r.status}
        </Badge>
      ),
      sortValue: (r) => r.status,
    },
    { key: "createdAt", header: "Date", cell: (r) => <span className="text-[11px] text-ink-faded">{r.createdAt ? new Date(r.createdAt).toLocaleDateString("fr-FR") : "—"}</span>, sortValue: (r) => r.createdAt },
  ];

  return (
    <AdminPage title="Paiements" eyebrow="transactions Stripe" breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Paiements" }]}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Net encaissé" value={money(totalNet, charges[0]?.currency ?? "EUR")} icon={<CreditCard size={16} />} />
        <StatCard label="Réussis" value={reussis} tone="green" icon={<CheckCircle size={16} />} />
        <StatCard label="Échoués" value={echoues} tone="red" icon={<XCircle size={16} />} />
        <StatCard label="Remboursés" value={rembourses} tone="gold" icon={<RotateCcw size={16} />} />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(["tous", "succeeded", "pending", "failed"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-[4px] border-[1.5px] text-[12px] font-[family-name:var(--font-type)] uppercase tracking-widest ${
              statusFilter === s ? "border-ink bg-ink text-paper" : "border-[var(--ink-line)] text-ink-faded"
            }`}
          >
            {s === "tous" ? "Tous" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        onRowClick={(row) => router.push(`/admin/payments/${row.id}`)}
        searchPlaceholder="rechercher un paiement…"
        empty="Aucun paiement Stripe."
      />
    </AdminPage>
  );
}
