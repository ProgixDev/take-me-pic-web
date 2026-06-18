import { AdminQueryState, queryStateMessage } from "@/components/admin/QueryState";
import { BookingsClient } from "@/components/admin/bookings/BookingsClient";
import { getBookings } from "@/lib/admin/bookings";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const result = await getBookings();

  if (result.kind !== "ok") {
    return (
      <AdminQueryState
        title="Réservations"
        eyebrow="les billets vendus"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { label: "Réservations" },
        ]}
        message={queryStateMessage(result.kind, result.kind === "error" ? result.message : undefined)}
      />
    );
  }

  return <BookingsClient bookings={result.data} />;
}
