// Stripe Checkout return page. success_url / cancel_url point here (https is
// required by Stripe). It shows the outcome and offers a deep link back into the
// app. The booking's real status is set by the webhook, not this page.
export const dynamic = "force-dynamic";

export default async function BookingReturn({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; booking?: string }>;
}) {
  const { status } = await searchParams;
  const ok = status === "success";
  const appLink = "tmp://booking";

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: 24,
        fontFamily: "ui-serif, Georgia, serif",
        background: "#f3e8ce",
        color: "#2a1f1a",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 56 }}>{ok ? "🎟️" : "↩️"}</div>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
        {ok ? "Paiement reçu" : "Paiement annulé"}
      </h1>
      <p style={{ maxWidth: 420, opacity: 0.75, lineHeight: 1.5, margin: 0 }}>
        {ok
          ? "Ta réservation est en cours de confirmation. Tu peux revenir dans l'app — le billet apparaîtra dès la confirmation."
          : "Aucun montant n'a été débité. Tu peux réessayer depuis l'app quand tu veux."}
      </p>
      <a
        href={appLink}
        style={{
          marginTop: 8,
          padding: "12px 22px",
          background: "#2a1f1a",
          color: "#f3e8ce",
          borderRadius: 6,
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Revenir dans Take Me Pic
      </a>
    </main>
  );
}
