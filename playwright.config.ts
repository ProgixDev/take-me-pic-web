import { defineConfig, devices, type Project } from "@playwright/test";

// Playwright does not load Next.js env files; pick up E2E_* credentials from
// .env.local without overriding values already exported in the shell.
try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local — credential-dependent projects will be skipped.
}

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const hasStaffCreds = Boolean(process.env.E2E_STAFF_EMAIL && process.env.E2E_STAFF_PASSWORD);
const hasNonStaffCreds = Boolean(
  process.env.E2E_NON_STAFF_EMAIL && process.env.E2E_NON_STAFF_PASSWORD,
);

const projects: Project[] = [
  {
    name: "anonymous",
    use: { ...devices["Desktop Chrome"] },
  },
];

if (hasStaffCreds) {
  projects.push(
    {
      name: "setup-staff",
      testMatch: /auth\.setup\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "staff",
      dependencies: ["setup-staff"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/staff.json",
      },
    },
  );
}

if (hasNonStaffCreds) {
  projects.push(
    {
      name: "setup-nonstaff",
      testMatch: /auth\.setup\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "nonstaff",
      dependencies: ["setup-nonstaff"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/nonstaff.json",
      },
    },
  );
}

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  // Parallel staff tests share one storage state; a concurrent refresh-token
  // rotation can transiently bounce a request to /login. One retry absorbs it.
  retries: 1,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    viewport: { width: 1440, height: 960 },
    // The specs assert against the French UI; the marketing pages localize
    // from the browser locale, so pin it.
    locale: "fr-FR",
  },
  projects,
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run start",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120000,
      },
});
