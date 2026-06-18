import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service role. Bypasses RLS — use ONLY in
// server code after an app-level authorization check (e.g. staff session), never
// expose to the browser. Used by the Stripe webhook and the admin bookings read.
export function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase service-role config.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
