import { test } from "@playwright/test";

type Creds = {
  email?: string;
  password?: string;
  storagePath: string;
};

// @supabase/ssr chunks the auth cookie at this size.
const MAX_CHUNK = 3180;

function chunkCookie(name: string, value: string): { name: string; value: string }[] {
  if (value.length <= MAX_CHUNK) return [{ name, value }];
  const out: { name: string; value: string }[] = [];
  for (let i = 0; i * MAX_CHUNK < value.length; i += 1) {
    out.push({ name: `${name}.${i}`, value: value.slice(i * MAX_CHUNK, (i + 1) * MAX_CHUNK) });
  }
  return out;
}

// Establish the session by minting tokens directly from the Supabase auth API and
// writing the @supabase/ssr cookie, instead of driving the marketing /login UI.
// The UI login is flaky under the local dev server (the submit can trigger a
// native form reload before signInWithPassword runs), which made this setup
// non-deterministic. Tokens → cookie is env-independent and matches exactly what
// the SSR server reads back.
async function saveSessionState(creds: Creds, baseURL: string | undefined) {
  test.skip(!creds.email || !creds.password, "Missing credentials for this auth setup project.");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  }

  const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: supabaseKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email: creds.email, password: creds.password }),
  });
  if (!res.ok) {
    throw new Error(`Supabase password grant failed: ${res.status} ${await res.text()}`);
  }
  const session = await res.json();

  const ref = new URL(supabaseUrl).hostname.split(".")[0];
  const value = `base64-${Buffer.from(JSON.stringify(session)).toString("base64url")}`;
  const host = new URL(baseURL ?? "http://127.0.0.1:3000").hostname;
  const cookies = chunkCookie(`sb-${ref}-auth-token`, value).map((c) => ({
    name: c.name,
    value: c.value,
    domain: host,
    path: "/",
    httpOnly: false,
    secure: false,
    sameSite: "Lax" as const,
  }));

  return cookies;
}

test("prepare staff storage state", async ({ context, baseURL }, testInfo) => {
  test.skip(
    testInfo.project.name !== "setup-staff",
    "This project only prepares the staff storage state.",
  );
  const storagePath = "playwright/.auth/staff.json";
  const cookies = await saveSessionState(
    { email: process.env.E2E_STAFF_EMAIL, password: process.env.E2E_STAFF_PASSWORD, storagePath },
    baseURL,
  );
  if (!cookies) return;
  await context.addCookies(cookies);
  await context.storageState({ path: storagePath });
});

test("prepare non-staff storage state", async ({ context, baseURL }, testInfo) => {
  test.skip(
    testInfo.project.name !== "setup-nonstaff",
    "This project only prepares the non-staff storage state.",
  );
  const storagePath = "playwright/.auth/nonstaff.json";
  const cookies = await saveSessionState(
    {
      email: process.env.E2E_NON_STAFF_EMAIL,
      password: process.env.E2E_NON_STAFF_PASSWORD,
      storagePath,
    },
    baseURL,
  );
  if (!cookies) return;
  await context.addCookies(cookies);
  await context.storageState({ path: storagePath });
});
