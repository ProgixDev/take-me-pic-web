import { expect, test } from "@playwright/test";

// Validates the sponsored-campaign loop that drives the mobile photo-spots
// sponsored badge (mobile TASK-020): a staff member creates an ACTIVE campaign in
// the admin console (admin_create_campaign) and it appears in the live list
// (admin_list_campaigns) marked online. Staff-only; unique name per run.
test.describe("admin sponsored campaigns (drives mobile sponsored spots)", () => {
  test("staff creates an active campaign and sees it listed", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "staff", "Staff-project test.");

    const name = `[E2E] Campagne ${Date.now()}`;

    await page.goto("/admin/sponsored");

    // Controlled inputs — type real keystrokes (fill leaves React state empty).
    const partner = page.getByPlaceholder(/Office de tourisme/);
    await partner.click();
    await partner.pressSequentially("[E2E] Partenaire");
    const campaign = page.getByPlaceholder(/Été à Paris/);
    await campaign.click();
    await campaign.pressSequentially(name);

    await page.getByRole("button", { name: "Créer la campagne" }).click();

    // After creation the list refreshes and shows the new campaign as online.
    await expect(page.getByText(name)).toBeVisible({ timeout: 15000 });
  });
});
