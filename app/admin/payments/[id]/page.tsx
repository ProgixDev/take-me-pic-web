import Link from "next/link";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { Badge, Button, PaperCard } from "@/components/ui";
import { getPaymentDetail } from "@/lib/admin/payments";

export const dynamic = "force-dynamic";

const NOT_CONFIGURED = "Stripe n'est pas configuré (STRIPE_SECRET_KEY absent).";

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

export default async function PaymentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getPaymentDetail(id);

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Paiement"
        eyebrow="détail de la transaction"
        breadcrumb={[{ href: "/admin", label: "Admin" }, { href: "/admin/payments", label: "Paiements" }, { label: "Détail" }]}
        message={result.kind === "not_configured" ? NOT_CONFIGURED : queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  const c = result.data;

  return (
    <AdminPage
      title={`Paiement ${c.id}`}
      eyebrow="détail de la transaction"
      breadcrumb={[{ href: "/admin", label: "Admin" }, { href: "/admin/payments", label: "Paiements" }, { label: c.id }]}
      actions={
        c.receiptUrl ? (
          <Link href={c.receiptUrl} target="_blank">
            <Button variant="paper" size="sm">Reçu Stripe →</Button>
          </Link>
        ) : null
      }
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <PaperCard shadow="gold" className="p-6 text-center">
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-4xl text-gold-deep mb-2">
            {money(c.amount, c.currency)}
          </div>
          <Badge tone={c.refunded ? "neutral" : STATUS_TONE[c.status] ?? "neutral"} dot>
            {c.refunded ? "remboursé" : c.status}
          </Badge>
          {c.amountRefunded > 0 && (
            <p className="mt-2 font-[family-name:var(--font-serif)] text-[13px] text-stamp-red">
              {money(c.amountRefunded, c.currency)} remboursé
            </p>
          )}
        </PaperCard>

        <PaperCard shadow="ink" className="p-5">
          <dl className="space-y-3 text-[14px] font-[family-name:var(--font-serif)]">
            <div className="flex justify-between"><dt className="text-ink-faded">Client</dt><dd>{c.customerName ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-faded">E-mail</dt><dd>{c.customerEmail ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-faded">Description</dt><dd>{c.description ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-faded">Carte</dt><dd>{c.cardBrand ? `${c.cardBrand} ·${c.cardLast4}` : "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-faded">Date</dt><dd>{c.createdAt ? new Date(c.createdAt).toLocaleString("fr-FR") : "—"}</dd></div>
          </dl>
        </PaperCard>
      </div>
    </AdminPage>
  );
}
