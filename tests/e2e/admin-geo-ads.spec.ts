import { expect, test } from "@playwright/test";

// Validates the geo-ad campaign creation that drives the mobile ad slot
// (mobile TASK-021): a staff member creates a geo-targeted campaign (partner +
// lat/lng + radius → sponsored_campaigns.target_area/target_radius_m) and it
// appears in the list as a géo campaign. Staff-only; unique partner per run.
test.describe("admin geo-ad campaigns (drives mobile geo ads)", () => {
  test("staff creates a geo-targeted campaign and sees it listed", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "staff", "Staff-project test.");

    const partner = `[E2E] Geo ${Date.now()}`;

    await page.goto("/admin/sponsored");

    const type = async (placeholder: RegExp | string, value: string) => {
      const f = page.getByPlaceholder(placeholder);
      await f.click();
      await f.pressSequentially(value);
    };
    await type(/Office de tourisme/, partner);
    await type(/48\.8578/, "48.8578"); // latitude
    await type(/2\.3622/, "2.3622"); // longitude
    await type("2000", "2000"); // radius (m)

    await page.getByRole("button", { name: "Créer la campagne" }).click();

    // Listed by partner name + shown as a géo campaign with its radius.
    await expect(page.getByText(partner)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/géo · 2000 m/).first()).toBeVisible({ timeout: 15000 });
  });
});
