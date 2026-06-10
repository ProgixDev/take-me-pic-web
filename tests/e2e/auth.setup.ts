import { test, type Page } from "@playwright/test";

type Creds = {
  email?: string;
  password?: string;
  storagePath: string;
};

async function signInAndSaveState(page: Page, creds: Creds) {
  test.skip(!creds.email || !creds.password, "Missing credentials for this auth setup project.");

  await page.goto("/login");
  await page.getByRole("textbox", { name: "E-mail administrateur" }).fill(creds.email!);
  // Role-scoped: getByLabel would also match the "Afficher le mot de passe" button.
  await page.getByRole("textbox", { name: "Mot de passe" }).fill(creds.password!);
  await page.getByRole("button", { name: "Se connecter" }).click();
  // @supabase/ssr stores the session in sb-*-auth-token cookies, not localStorage.
  await page.waitForFunction(() => document.cookie.includes("auth-token"), null, {
    timeout: 15000,
  });
  await page.context().storageState({ path: creds.storagePath });
}

test("prepare staff storage state", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "setup-staff",
    "This project only prepares the staff storage state.",
  );
  await signInAndSaveState(page, {
    email: process.env.E2E_STAFF_EMAIL,
    password: process.env.E2E_STAFF_PASSWORD,
    storagePath: "playwright/.auth/staff.json",
  });
});

test("prepare non-staff storage state", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "setup-nonstaff",
    "This project only prepares the non-staff storage state.",
  );
  await signInAndSaveState(page, {
    email: process.env.E2E_NON_STAFF_EMAIL,
    password: process.env.E2E_NON_STAFF_PASSWORD,
    storagePath: "playwright/.auth/nonstaff.json",
  });
});
