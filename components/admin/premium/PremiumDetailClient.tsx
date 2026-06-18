"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, XCircle, Crown, CheckCircle2, Circle } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Avatar, Badge, Button, PaperCard, Stamp, useToast } from "@/components/ui";
import {
  revokePremium,
  type SubscriptionRow,
  type SubscriptionStatus,
  type SubscriptionActionResult,
} from "@/lib/admin/subscriptions-actions";

const ERROR_MESSAGES: Record<string, string> = {
  unauthenticated: "Session expirée — reconnecte-toi.",
  unauthorized: "Accès réservé au staff.",
};

function errText(result: SubscriptionActionResult): string {
  return result.kind === "error" ? result.message : ERROR_MESSAGES[result.kind] ?? "Erreur.";
}

const STATUS_TONE: Record<SubscriptionStatus, "green" | "gold" | "red" | "neutral" | "blue"> = {
  active: "green",
  in_grace: "gold",
  expired: "neutral",
  cancelled: "red",
  paused: "blue",
};

const PLAN_TONE: Record<string, "blue" | "gold" | "neutral"> = {
  Mensuel: "blue",
  Annuel: "gold",
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function EntitlementRow({ label, on }: { label: string; on: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-[family-name:var(--font-serif)] text-[14px]">{label}</span>
      {on ? (
        <span className="flex items-center gap-1 text-stamp-green text-[13px] font-[family-name:var(--font-mono)]">
          <CheckCircle2 size={14} /> activé
        </span>
      ) : (
        <span className="flex items-center gap-1 text-ink-faded text-[13px] font-[family-name:var(--font-mono)]">
          <Circle size={14} /> inactif
        </span>
      )}
    </div>
  );
}

export function PremiumDetailClient({ sub }: { sub: SubscriptionRow }) {
  const router = useRouter();
  const toast = useToast();
  const [revoking, setRevoking] = useState(false);

  const handleRevoke = async () => {
    if (!window.confirm(`Révoquer le Premium de « ${sub.userName} » ? L'accès sera coupé immédiatement.`)) return;
    setRevoking(true);
    const result = await revokePremium({ id: sub.id });
    setRevoking(false);
    if (result.kind === "ok") {
      toast.push("Premium révoqué.", "ok");
      router.refresh();
      return;
    }
    toast.push(errText(result), "err");
  };

  return (
    <AdminPage
      title={sub.userName}
      eyebrow="détail abonnement"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/premium", label: "Premium" },
        { label: sub.userName },
      ]}
      actions={
        <Button variant="paper" size="sm" icon={<ArrowLeft size={15} />} onClick={() => router.push("/admin/premium")}>
          Retour
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscriber card */}
        <PaperCard shadow="gold" className="p-5 relative overflow-hidden lg:col-span-1">
          <Stamp
            color="gold"
            shape="circle"
            size={64}
            rotate={15}
            fontSize={9}
            className="absolute -top-3 -right-3 opacity-70"
          >
            {"PREMIUM\n✦"}
          </Stamp>
          <div className="flex items-start gap-4">
            <Avatar src={sub.avatarUrl ?? undefined} size={52} ring />
            <div className="flex-1 min-w-0">
              <div className="font-[family-name:var(--font-serif)] font-bold text-[18px] leading-tight">
                {sub.userName}
              </div>
              <div className="font-[family-name:var(--font-mono)] text-[12px] text-ink-faded truncate mt-0.5">
                {sub.username ? `@${sub.username}` : "—"}
              </div>
              <div className="font-[family-name:var(--font-mono)] text-[11px] text-ink-faded truncate">
                {sub.userId}
              </div>
              <div className="mt-2">
                <Badge tone={STATUS_TONE[sub.status] ?? "neutral"} dot>
                  {sub.statusLabel}
                </Badge>
              </div>
            </div>
          </div>
        </PaperCard>

        {/* Plan info card */}
        <PaperCard shadow="ink" className="p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-[16px]">Formule</h3>
            <Badge tone={PLAN_TONE[sub.plan] ?? "neutral"}>{sub.plan}</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded">
                Boutique
              </span>
              <span className="font-[family-name:var(--font-mono)] text-[13px]">
                {sub.store === "apple" ? "Apple App Store" : "Google Play"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded">
                Produit
              </span>
              <span className="font-[family-name:var(--font-mono)] text-[12px] text-ink-faded">{sub.productId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded">
                Souscrit le
              </span>
              <span className="font-[family-name:var(--font-mono)] text-[13px]">{fmtDate(sub.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded">
                Fin de période
              </span>
              <span className="font-[family-name:var(--font-mono)] text-[13px]">{fmtDate(sub.currentPeriodEnd)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded">
                ID abonnement
              </span>
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-ink-faded">#{sub.id}</span>
            </div>
          </div>
        </PaperCard>

        {/* Entitlements + actions */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <PaperCard shadow="soft" className="p-5">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-[16px] mb-4 flex items-center gap-2">
              <Crown size={16} /> Avantages
            </h3>
            <div className="space-y-3">
              <EntitlementRow label="Sans publicité" on={sub.entitlements.adFree} />
              <EntitlementRow label="Boost de profil" on={sub.entitlements.profileBoost} />
              <EntitlementRow label="Spots exclusifs" on={sub.entitlements.exclusiveSpots} />
            </div>
          </PaperCard>

          <PaperCard shadow="soft" className="p-5">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-[16px] mb-4">Actions</h3>
            {sub.status === "active" ? (
              <Button
                variant="danger"
                size="sm"
                full
                icon={<XCircle size={15} />}
                disabled={revoking}
                onClick={handleRevoke}
              >
                {revoking ? "Révocation…" : "Révoquer le Premium"}
              </Button>
            ) : (
              <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">
                Cet abonnement n'est plus actif — aucune action disponible.
              </p>
            )}
          </PaperCard>
        </div>
      </div>
    </AdminPage>
  );
}
