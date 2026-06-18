import { expect, test } from "@playwright/test";

// Karma / leaderboard / badges admin views are now backed by live Supabase
// (the `leaderboard` view, karma_ledger, karma_rules and badge_holder_counts)
// instead of the old mock data layer. Mirror admin-views.spec: anonymous +
// non-staff fail closed to /login; staff see the live page heading.
const ROUTES = [
  { path: "/admin/leaderboard", heading: "Tableau d'honneur" },
  { path: "/admin/karma", heading: "Tableau de bord Karma" },
  { path: "/admin/karma/rules", heading: "Règles de karma" },
  { path: "/admin/badges", heading: "Gestion des badges" },
];

test.describe("admin karma views", () => {
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

  test("staff leaderboard shows a live ranking row", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "staff", "Staff-project test.");
    await page.goto("/admin/leaderboard");
    await expect(page.getByRole("heading", { name: "Tableau d'honneur" })).toBeVisible({ timeout: 15000 });
    // The "N voyageurs" counter is rendered from the live leaderboard view.
    await expect(page.getByText(/voyageurs/i).first()).toBeVisible({ timeout: 15000 });
  });

  test("staff karma rules show the wired rating rule", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "staff", "Staff-project test.");
    await page.goto("/admin/karma/rules");
    await expect(page.getByRole("heading", { name: "Règles de karma" })).toBeVisible({ timeout: 15000 });
    // The seeded rating rule is flagged "câblée" (wired into live karma).
    await expect(page.getByText("câblée").first()).toBeVisible({ timeout: 15000 });
  });
});
