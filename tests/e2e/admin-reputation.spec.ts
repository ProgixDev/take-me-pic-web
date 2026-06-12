import { expect, test } from "@playwright/test";

// TASK-007-2 read-only karma ledger and ratings inspection.
// Sections render for any user/session (empty states included), so the
// assertions stay data-independent beyond "at least one row exists", the
// same assumption the existing user-detail test makes.

test.describe("admin reputation inspection", () => {
  test("staff user detail shows the reputation tab with ledger and ratings", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "staff", "Staff-project test.");

    await page.goto("/admin/users");
    await expect(page.getByRole("heading", { name: "Utilisateurs" })).toBeVisible({ timeout: 15000 });

    const firstRow = page.locator("tbody tr").first();
    await expect(firstRow).toBeVisible({ timeout: 15000 });
    await firstRow.click();
    await expect(page).toHaveURL(/\/admin\/users\/[0-9a-f-]+$/);

    await page.getByRole("button", { name: "Réputation" }).click();
    await expect(page.getByRole("heading", { name: "Journal de karma" })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("heading", { name: /Notes reçues/ })).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("heading", { name: /Notes données/ })).toBeVisible({ timeout: 15000 });
  });

  test("staff session review shows the exchanged-ratings card", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "staff", "Staff-project test.");

    await page.goto("/admin/sessions");
    await expect(page.getByRole("heading", { name: "Sessions photo" })).toBeVisible({ timeout: 15000 });

    const firstRow = page.locator("tbody tr").first();
    await expect(firstRow).toBeVisible({ timeout: 15000 });
    await firstRow.click();
    await expect(page).toHaveURL(/\/admin\/sessions\/\d+$/);
    await expect(page.getByRole("heading", { name: "Notes échangées" })).toBeVisible({ timeout: 15000 });
  });
});
