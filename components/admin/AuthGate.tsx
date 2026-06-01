"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminSignedIn } from "@/lib/auth";
import { Stamp } from "@/components/ui";

/**
 * Client-side guard for the admin console. Redirects to the admin /login when
 * there's no mock admin session. Front-end only — replace with a real session
 * check (cookie/JWT) when a backend exists.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    if (isAdminSignedIn()) {
      setOk(true);
    } else {
      setOk(false);
      router.replace("/login");
    }
  }, [router]);

  if (ok) return <>{children}</>;

  // Brief paper splash while we check / redirect (avoids flashing the console).
  return (
    <div className="h-screen grid place-items-center bg-paper paper">
      <div className="flex flex-col items-center gap-4">
        <Stamp color="gold" size={84} rotate={-8} fontSize={9}>
          {`TAKE\nME PIC\n★`}
        </Stamp>
        <p className="font-[family-name:var(--font-hand)] text-xl text-ink-faded">
          {ok === false ? "redirection vers la connexion…" : "vérification…"}
        </p>
      </div>
    </div>
  );
}
