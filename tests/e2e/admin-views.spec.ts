import { expect, test } from "@playwright/test";

// TASK-005/006 live admin views: anonymous fail-closed + staff access.
// Heading names match the French UI (locale pinned in playwright.config.ts).

const ROUTES = [
  { path: "/admin/users", heading: "Utilisateurs" },
  { path: "/admin/users/verification", heading: "File de vérification" },
  { path: "/admin/settings/roles", heading: "Rôles & permissions" },
  { path: "/admin/settings/team", heading: "Équipe admin" },
  { path: "/admin/requests", heading: "Demandes photo" },
  { path: "/admin/sessions", heading: "Sessions photo" },
];

test.describe("admin live views", () => {
  for (const route of ROUTES) {
    test(`anonymous users cannot open ${route.path}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "anonymous", "Anonymous-project test.");

      await page.goto(route.path);
      await expect(page).toHaveURL(/\/login$/);
    });

    test(`staff users can open ${route.path}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "staff", "Staff-project test.");

      await page.goto(route.path);
      await expect(page).toHaveURL(new RegExp(`${route.path.replaceAll("/", "\\/")}$`));
      await expect(page.getByRole("heading", { name: route.heading })).toBeVisible({ timeout: 15000 });
    });

    test(`non-staff users are denied on ${route.path}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "nonstaff", "Non-staff-project test.");

      await page.goto(route.path);
      await expect(page).toHaveURL(/\/login$/);
    });
  }

  test("staff user detail shows a live profile", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "staff", "Staff-project test.");

    await page.goto("/admin/users");
    await expect(page.getByRole("heading", { name: "Utilisateurs" })).toBeVisible({ timeout: 15000 });

    // The users table is populated from live profiles; open the first row.
    const firstRow = page.locator("tbody tr").first();
    await expect(firstRow).toBeVisible({ timeout: 15000 });
    await firstRow.click();
    await expect(page).toHaveURL(/\/admin\/users\/[0-9a-f-]+$/);
    await expect(page.getByRole("heading", { name: "Informations du compte" })).toBeVisible({
      timeout: 15000,
    });
  });
});
