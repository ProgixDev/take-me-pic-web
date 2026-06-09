import { NextResponse } from "next/server";

import { getSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { supabaseUrl, supabasePublishableKey } = getSupabaseEnv();
    const startedAt = Date.now();
    const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
      cache: "no-store",
      headers: {
        apikey: supabasePublishableKey,
      },
    });

    return NextResponse.json(
      {
        ok: response.ok,
        status: response.status,
        latencyMs: Date.now() - startedAt,
        projectUrl: supabaseUrl,
      },
      { status: response.ok ? 200 : 502 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown Supabase health check error",
      },
      { status: 500 },
    );
  }
}
