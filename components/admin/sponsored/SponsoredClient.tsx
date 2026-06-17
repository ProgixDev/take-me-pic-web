"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, Plus } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Button, Input, PaperCard, Badge, useToast } from "@/components/ui";
import { createCampaign, type CampaignRow } from "@/lib/admin/campaigns-actions";

const ERROR_MESSAGES: Record<string, string> = {
  unauthenticated: "Session expirée — reconnecte-toi.",
  unauthorized: "Accès réservé au staff.",
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

export function SponsoredClient({ campaigns }: { campaigns: CampaignRow[] }) {
  const router = useRouter();
  const toast = useToast();

  const [businessName, setBusinessName] = useState("");
  const [spotId, setSpotId] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!businessName.trim()) {
      toast.push("Le nom du partenaire est requis.", "err");
      return;
    }
    const parsedSpot = spotId.trim() ? Number(spotId.trim()) : null;
    if (parsedSpot !== null && !Number.isInteger(parsedSpot)) {
      toast.push("L'ID du spot doit être un nombre.", "err");
      return;
    }
    setSaving(true);
    const result = await createCampaign({ businessName, spotId: parsedSpot });
    setSaving(false);

    if (result.kind === "ok") {
      toast.push(`Campagne « ${businessName.trim()} » créée.`, "ok");
      setBusinessName("");
      setSpotId("");
      router.refresh();
      return;
    }
    toast.push(result.kind === "error" ? result.message : ERROR_MESSAGES[result.kind], "err");
  };

  return (
    <AdminPage
      title="Campagnes sponsorisées"
      eyebrow="monétisation B2B"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { label: "Sponsorisé" },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create form */}
        <div className="lg:col-span-1">
          <PaperCard shadow="soft" className="p-6">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-[18px] mb-4 flex items-center gap-2">
              <Megaphone size={18} /> Nouvelle campagne
            </h3>
            <div className="flex flex-col gap-3">
              <Input label="Partenaire *" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Ex. Office de tourisme de Paris" />
              <Input label="ID du spot (optionnel)" value={spotId} onChange={(e) => setSpotId(e.target.value)} placeholder="Ex. 2" />
              <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded">
                Active immédiatement pour 30 jours. Le spot ciblé affichera le badge « partenaire » dans l'app.
              </p>
              <Button variant="gold" size="sm" icon={<Plus size={14} />} onClick={handleCreate} disabled={saving}>
                {saving ? "Création…" : "Créer la campagne"}
              </Button>
            </div>
          </PaperCard>
        </div>

        {/* Campaign list */}
        <div className="lg:col-span-2">
          <PaperCard shadow="soft" className="p-6">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-[18px] mb-4">
              Campagnes ({campaigns.length})
            </h3>
            {campaigns.length === 0 ? (
              <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">
                Aucune campagne pour l'instant.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {campaigns.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 p-3 border-[1.5px] border-dashed border-[var(--ink-line)] rounded-[4px]"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-[family-name:var(--font-serif)] font-bold text-[15px] truncate">
                        {c.businessName}
                      </div>
                      <div className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded truncate">
                        {c.spotId ? `spot #${c.spotId}` : "ciblage géo"}
                        {" · "}
                        {fmtDate(c.startsAt)} → {fmtDate(c.endsAt)}
                      </div>
                    </div>
                    <Badge tone={c.isActive ? "green" : "neutral"}>
                      {c.isActive ? "EN LIGNE" : "EXPIRÉE"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </PaperCard>
        </div>
      </div>
    </AdminPage>
  );
}
