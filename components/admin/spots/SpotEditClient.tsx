"use client";

import { useState } from "react";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminPage } from "@/components/admin/AdminPage";
import { Button, Input, PaperCard, Select } from "@/components/ui";
import type { SpotDetail } from "@/lib/admin/spots";
import { SPOT_STATUS_LABEL } from "@/components/admin/spots/status";

export function SpotEditClient({ detail }: { detail: SpotDetail }) {
  const { spot } = detail;

  const [name, setName] = useState(spot.name);
  const [city, setCity] = useState(spot.city ?? "");
  const [bestTime, setBestTime] = useState(spot.bestTime ?? "");

  return (
    <AdminPage
      title={`Modifier — ${spot.name}`}
      eyebrow="édition du spot"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/spots", label: "Spots" },
        { href: `/admin/spots/${spot.id}`, label: spot.name },
        { label: "Modifier" },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Link href={`/admin/spots/${spot.id}`}>
            <Button variant="paper" size="sm" icon={<ArrowLeft size={14} />}>
              Retour
            </Button>
          </Link>
          <Button variant="gold" size="sm" icon={<Save size={14} />} disabled>
            Enregistrer
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <PaperCard shadow="soft" className="p-6">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-[18px] mb-5">
              Informations du spot
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <div className="sm:col-span-2">
                <Input
                  label="Nom du spot"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex. Pont des Arts"
                />
              </div>

              <Input
                label="Ville"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex. Paris"
              />

              <Select label="Statut" value={spot.status} disabled onChange={() => undefined}>
                <option value={spot.status}>{SPOT_STATUS_LABEL[spot.status]}</option>
              </Select>

              <div className="sm:col-span-2">
                <Input
                  label="Meilleure heure de visite"
                  value={bestTime}
                  onChange={(e) => setBestTime(e.target.value)}
                  placeholder="Ex. 19H, Heure dorée, 7H30…"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-dashed border-[var(--ink-line)]">
              <Link href={`/admin/spots/${spot.id}`}>
                <Button variant="paper" size="sm" icon={<ArrowLeft size={14} />}>
                  Annuler
                </Button>
              </Link>
              <Button variant="gold" size="sm" icon={<Save size={14} />} disabled>
                Enregistrer les modifications
              </Button>
            </div>
          </PaperCard>
        </div>

        {/* Preview sidebar */}
        <div className="flex flex-col gap-5">
          <PaperCard shadow="gold" className="overflow-hidden">
            <div
              className="w-full aspect-video bg-cover bg-center bg-paper-warm"
              style={spot.heroUrl ? { backgroundImage: `url(${spot.heroUrl})` } : undefined}
            />
            <div className="p-4">
              <div className="font-[family-name:var(--font-serif)] font-bold text-[16px] leading-tight mb-1">
                {name || "Nom du spot"}
              </div>
              <div className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded mb-2">
                {city || "—"}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-[family-name:var(--font-type)] uppercase tracking-[0.06em] border-stamp-blue/40 text-stamp-blue bg-stamp-blue/10">
                  {bestTime || "—"}
                </span>
              </div>
            </div>
          </PaperCard>

          <div className="bg-card border-[1.5px] border-dashed border-[var(--ink-line)] rounded-[4px] p-4">
            <p className="font-[family-name:var(--font-hand)] text-[15px] text-ink-faded text-center leading-relaxed">
              L'enregistrement des modifications arrive avec les opérations de
              contenu (TASK-008). Le statut change uniquement via la revue
              staff (approuver / rejeter), qui est journalisée.
            </p>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
