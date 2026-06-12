import { expect, test } from "@playwright/test";

// TASK-008 notifications and content operations: anonymous fail-closed +
// staff access. The live screens assert data-independent shell markers
// (headings + stat labels); the documented-boundary screens assert their
// "Aperçu local" banner so the gap stays visible.

const ROUTES = [
  { path: "/admin/notifications", heading: "Centre de notifications", marker: "Non lues" },
  { path: "/admin/notifications/new", heading: "Composer une notification", marker: "Paramètres du message" },
  { path: "/admin/notifications/templates", heading: "Modèles de notifications", marker: "Aperçu local" },
  { path: "/admin/content/manual", heading: "Manuel du voyageur", marker: "Secrets total" },
  { path: "/admin/content/guides", heading: "Bibliothèque de contenu", marker: "Aperçu local" },
  { path: "/admin/content/pages", heading: "Pages statiques", marker: "Aperçu local" },
];

test.describe("admin notifications and content", () => {
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
      await expect(page.getByText(route.marker).first()).toBeVisible({ timeout: 15000 });
    });

    test(`non-staff users are denied on ${route.path}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "nonstaff", "Non-staff-project test.");

      await page.goto(route.path);
      await expect(page).toHaveURL(/\/login$/);
    });
  }
});
