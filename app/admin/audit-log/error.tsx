"use client";

import { useEffect } from "react";
import { AdminPage } from "@/components/admin/AdminPage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AdminPage title="Journal d'audit" eyebrow="traçabilité & sécurité" breadcrumb={[{ href: "/admin", label: "Admin" }, { label: "Journal d'audit" }]}>
      <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-6 shadow-ink-sm space-y-3">
        <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">
          Une erreur a empêché le chargement du journal d'audit.
        </p>
        <button
          type="button"
          onClick={reset}
          className="px-3 py-1.5 border-[1.5px] border-ink rounded-[4px] bg-card text-sm hover:bg-paper-warm transition cursor-pointer"
        >
          Réessayer
        </button>
      </div>
    </AdminPage>
  );
}
