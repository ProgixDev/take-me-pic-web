import { expect, test } from "@playwright/test";

// Each test is pinned to one Playwright project: the anonymous project has no
// storage state, while staff/nonstaff reuse the session saved by auth.setup.ts.

test.describe("admin auth gate", () => {
  test("anonymous users are redirected to login", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "anonymous", "Anonymous-project test.");

    await page.goto("/admin/moderation/reports");
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: /Espace administrateur|Connexion/i })).toBeVisible({
      timeout: 15000,
    });
  });

  test("audit log is protected the same way", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "anonymous", "Anonymous-project test.");

    await page.goto("/admin/audit-log");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("staff users can open moderation routes", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "staff", "Staff-project test.");

    await page.goto("/admin/moderation/reports");
    await expect(page).toHaveURL(/\/admin\/moderation\/reports$/);
    await expect(page.getByRole("heading", { name: "Signalements" })).toBeVisible({ timeout: 15000 });
  });

  test("staff users can open the audit log", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "staff", "Staff-project test.");

    await page.goto("/admin/audit-log");
    await expect(page).toHaveURL(/\/admin\/audit-log$/);
    await expect(page.getByRole("heading", { name: "Journal d'audit" })).toBeVisible({ timeout: 15000 });
  });

  test("non-staff users are denied access to moderation routes", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "nonstaff", "Non-staff-project test.");

    await page.goto("/admin/moderation/reports");
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: /Espace administrateur|Connexion/i })).toBeVisible({
      timeout: 15000,
    });
  });
});
