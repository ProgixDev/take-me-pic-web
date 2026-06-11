import { expect, test } from "@playwright/test";

// TASK-007 live community and spots moderation views: anonymous fail-closed +
// staff access. Heading names match the French UI (locale pinned in
// playwright.config.ts). Assertions stay data-independent: the shared backend
// may gain posts/comments/spots at any time, so we check the live shell
// (heading + stat labels), not row counts.

const ROUTES = [
  { path: "/admin/community/posts", heading: "Publications communauté", statLabel: "Publications totales" },
  { path: "/admin/community/comments", heading: "Commentaires", statLabel: "Commentaires total" },
  { path: "/admin/spots", heading: "Spots photo", statLabel: "Spots total" },
  { path: "/admin/spots/pending", heading: "File d'attente — Spots", statLabel: "Approuvés" },
];

test.describe("admin community and spots moderation", () => {
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
      await expect(page.getByText(route.statLabel).first()).toBeVisible({ timeout: 15000 });
    });

    test(`non-staff users are denied on ${route.path}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "nonstaff", "Non-staff-project test.");

      await page.goto(route.path);
      await expect(page).toHaveURL(/\/login$/);
    });
  }

  test("staff post detail shows the unknown-record state for a missing post", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "staff", "Staff-project test.");

    await page.goto("/admin/community/posts/999999999");
    await expect(page.getByRole("heading", { name: "Détail publication" })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText("Cet enregistrement est introuvable.")).toBeVisible({ timeout: 15000 });
  });

  test("staff spot detail shows the unknown-record state for a missing spot", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "staff", "Staff-project test.");

    await page.goto("/admin/spots/999999999");
    await expect(page.getByRole("heading", { name: "Détail du spot" })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Cet enregistrement est introuvable.")).toBeVisible({ timeout: 15000 });
  });
});
