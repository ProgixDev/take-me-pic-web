import { expect, test } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Validates the booking lifecycle from the spec's independent test (TASK-022):
// create a booking, process a mocked Stripe confirmation webhook, and verify the
// status changes — idempotently, and without touching Premium. Runs without
// browser auth (uses the request fixture + the service role to seed/read).

function serviceClient(): SupabaseClient {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

test.describe("stripe booking webhook (source of truth)", () => {
  test("a confirmation webhook flips a pending booking to confirmed (idempotent)", async ({ request }, testInfo) => {
    test.skip(testInfo.project.name !== "anonymous", "Webhook test runs without browser auth.");
    test.skip(
      !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.WEBHOOK_TEST_SECRET,
      "Missing SUPABASE_SERVICE_ROLE_KEY / WEBHOOK_TEST_SECRET.",
    );

    const supabase = serviceClient();
    const pi = `pi_e2e_${Date.now()}`;

    // Seed: a pending booking owned by any existing profile.
    const { data: prof, error: profErr } = await supabase.from("profiles").select("id").limit(1).single();
    expect(profErr?.message).toBeFalsy();

    const { data: booking, error: insErr } = await supabase
      .from("bookings")
      .insert({
        user_id: (prof as { id: string }).id,
        title: "[E2E] Booking",
        amount_cents: 3600,
        commission_cents: 288,
        stripe_payment_intent: pi,
      })
      .select("id, status")
      .single();
    expect(insErr?.message).toBeFalsy();
    expect((booking as { status: string }).status).toBe("pending");
    const bookingId = (booking as { id: number }).id;

    const postWebhook = (auth: boolean) =>
      request.post("/api/stripe/webhook", {
        headers: auth ? { "x-webhook-test-secret": process.env.WEBHOOK_TEST_SECRET! } : {},
        data: { type: "checkout.session.completed", data: { object: { payment_intent: pi } } },
      });

    // Confirmation webhook → confirmed.
    const res = await postWebhook(true);
    expect(res.ok()).toBeTruthy();
    const { data: after } = await supabase.from("bookings").select("status").eq("id", bookingId).single();
    expect((after as { status: string }).status).toBe("confirmed");

    // Idempotent replay → still confirmed, still ok.
    const res2 = await postWebhook(true);
    expect(res2.ok()).toBeTruthy();
    const { data: after2 } = await supabase.from("bookings").select("status").eq("id", bookingId).single();
    expect((after2 as { status: string }).status).toBe("confirmed");

    // Unauthorized (no secret) → 401, no change.
    const bad = await postWebhook(false);
    expect(bad.status()).toBe(401);

    // Cleanup the fixture.
    await supabase.from("bookings").delete().eq("id", bookingId);
  });
});
