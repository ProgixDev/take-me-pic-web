import { expect, test } from "@playwright/test";

// TASK-009 admin analytics: anonymous fail-closed + staff access. The five
// wired pages assert live-shell markers (headings + stat labels, all
// data-independent — they render with zero rows too); retention asserts its
// documented-gap banner.

const ROUTES = [
  { path: "/admin/analytics", heading: "Analytics", marker: "Utilisateurs" },
  { path: "/admin/analytics/users", heading: "Analytiques utilisateurs", marker: "Total utilisateurs" },
  { path: "/admin/analytics/engagement", heading: "Engagement", marker: "Demandes (30 j)" },
  { path: "/admin/analytics/geography", heading: "Géographie", marker: "Profils localisés" },
  { path: "/admin/analytics/revenue", heading: "Revenus", marker: "Revenu réservations" },
  { path: "/admin/analytics/retention", heading: "Rétention", marker: "Aperçu local" },
];

test.describe("admin analytics", () => {
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
      // exact: the page h1 ("Rétention") is a prefix of section headings
      // ("Rétention par cohorte mensuelle"), which trips strict mode.
      await expect(page.getByRole("heading", { name: route.heading, exact: true }).first()).toBeVisible({
        timeout: 15000,
      });
      await expect(page.getByText(route.marker).first()).toBeVisible({ timeout: 15000 });
    });

    test(`non-staff users are denied on ${route.path}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "nonstaff", "Non-staff-project test.");

      await page.goto(route.path);
      await expect(page).toHaveURL(/\/login$/);
    });
  }
});
