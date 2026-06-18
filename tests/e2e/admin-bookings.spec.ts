import { expect, test } from "@playwright/test";

// The admin bookings page now reads REAL bookings (service-role read, gated by the
// staff session) instead of mock data. Asserts the shell loads for staff and that
// a seeded real booking surfaces; anonymous is redirected to login.
test.describe("admin bookings (real data)", () => {
  test("anonymous users cannot open /admin/bookings", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "anonymous", "Anonymous-project test.");
    await page.goto("/admin/bookings");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("staff sees real bookings", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "staff", "Staff-project test.");
    await page.goto("/admin/bookings");
    await expect(page.getByRole("heading", { name: "Réservations" })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Réservations totales")).toBeVisible({ timeout: 15000 });
    // A seeded real booking surfaces (proves it's not the old mock data).
    await expect(page.getByText(/Tram 28/).first()).toBeVisible({ timeout: 15000 });
  });
});
