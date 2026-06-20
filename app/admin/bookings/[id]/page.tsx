import { AdminPage } from "@/components/admin/AdminPage";
import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { Avatar, Badge, PaperCard } from "@/components/ui";
import { getBookingDetail, type AdminBookingStatus } from "@/lib/admin/bookings";

export const dynamic = "force-dynamic";

function euros(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

const STATUS_TONE: Record<AdminBookingStatus, "green" | "gold" | "red" | "neutral"> = {
  "confirmée": "green",
  "en attente": "gold",
  "annulée": "red",
  "remboursée": "neutral",
};

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getBookingDetail(id);

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Réservation"
        eyebrow="détail de la réservation"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/bookings", label: "Réservations" },
          { label: "Détail" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  const b = result.data;
  const net = b.amount - b.commission;

  return (
    <AdminPage
      title={`Réservation ${b.id}`}
      eyebrow="détail de la réservation"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/bookings", label: "Réservations" },
        { label: b.id },
      ]}
      actions={<Badge tone={STATUS_TONE[b.status]} dot>{b.status}</Badge>}
    >
      <div className="max-w-2xl mx-auto space-y-5">
        <PaperCard shadow="gold" className="p-6">
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-3">{b.experience}</h2>
          <dl className="space-y-2.5 text-[14px] font-[family-name:var(--font-serif)]">
            <div className="flex justify-between"><dt className="text-ink-faded">Montant</dt><dd className="font-bold">{euros(b.amount)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-faded">Commission</dt><dd>{euros(b.commission)}</dd></div>
            <div className="flex justify-between border-t border-dashed border-[var(--ink-line)] pt-2"><dt className="text-ink-faded">Net photographe</dt><dd className="font-bold text-gold-deep">{euros(net)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-faded">Date</dt><dd>{b.date}</dd></div>
          </dl>
        </PaperCard>

        <PaperCard shadow="ink" className="p-5">
          <h3 className="font-[family-name:var(--font-serif)] font-bold text-sm mb-3">Client</h3>
          <div className="flex items-center gap-3">
            <Avatar src={b.user.avatar ?? undefined} size={44} ring={b.user.premium} />
            <div>
              <div className="font-[family-name:var(--font-serif)] font-semibold">{b.user.firstName} {b.user.lastName}</div>
              <div className="font-[family-name:var(--font-hand)] text-base text-ink-faded">{b.user.email}</div>
            </div>
          </div>
        </PaperCard>

        <p className="text-center font-[family-name:var(--font-serif)] italic text-[12px] text-ink-faded">
          Le statut des réservations est géré automatiquement par les webhooks Stripe.
        </p>
      </div>
    </AdminPage>
  );
}
