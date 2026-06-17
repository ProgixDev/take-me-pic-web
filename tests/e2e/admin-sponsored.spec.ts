import { expect, test } from "@playwright/test";

// Validates the sponsored-campaign loop that drives the mobile photo-spots
// sponsored badge (mobile TASK-020): a staff member creates a campaign in the
// admin console (direct staff write to sponsored_campaigns) targeting a spot, and
// it appears in the live list marked online. Staff-only; unique partner per run.
test.describe("admin sponsored campaigns (drives mobile sponsored spots)", () => {
  test("staff creates an active campaign and sees it listed", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "staff", "Staff-project test.");

    const partner = `[E2E] Partenaire ${Date.now()}`;

    await page.goto("/admin/sponsored");

    // Controlled inputs — type real keystrokes (fill leaves React state empty).
    const partnerField = page.getByPlaceholder(/Office de tourisme/);
    await partnerField.click();
    await partnerField.pressSequentially(partner);
    const spotField = page.getByPlaceholder(/Ex\. 2/);
    await spotField.click();
    await spotField.pressSequentially("2");

    await page.getByRole("button", { name: "Créer la campagne" }).click();

    // After creation the list refreshes and shows the new campaign (partner name).
    await expect(page.getByText(partner)).toBeVisible({ timeout: 15000 });
  });
});
