import { expect, test } from "@playwright/test";

// Validates the full spot-publishing loop that feeds the mobile photo-spots slice
// (mobile TASK-013): a staff member CREATES a spot in the admin console (it lands
// in the moderation queue as `pending`) and then APPROVES it from the queue
// (admin_review_spot → `approved`), after which the community + mobile app can see
// it. Staff-only; runs against the live shared backend, so it uses a unique name
// per run and asserts on the action outcome, not on global counts.
test.describe("admin spot create + approve (mobile spots backend)", () => {
  test("staff creates a spot and approves it through the queue", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "staff", "Staff-project test.");

    const name = `[E2E] Spot ${Date.now()}`;

    // ── create → moderation queue ────────────────────────────────────────────
    await page.goto("/admin/spots/new");
    await page.getByPlaceholder(/Pont des Arts/).fill(name);
    await page.getByPlaceholder(/Ex\. 19H/).fill("🌇 19H");
    await page.getByRole("button", { name: "Créer le spot" }).first().click();
    await expect(page.getByText(`Spot « ${name} » créé !`)).toBeVisible({ timeout: 15000 });

    // ── approve from the pending queue ───────────────────────────────────────
    await page.goto("/admin/spots/pending");
    const nameLink = page.getByRole("link", { name });
    await expect(nameLink).toBeVisible({ timeout: 15000 });
    // Click the "Approuver" button inside the card that holds this spot's name.
    await nameLink
      .locator(
        'xpath=ancestor::*[.//button[normalize-space()="Approuver"]][1]//button[normalize-space()="Approuver"]',
      )
      .click();

    // The card stamps APPROUVÉ + a success toast fires.
    await expect(page.getByText(/approuvé/i).first()).toBeVisible({ timeout: 15000 });
  });
});
