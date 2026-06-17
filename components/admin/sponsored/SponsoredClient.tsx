"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Button, Input, Select, PaperCard, Badge, Modal, useToast } from "@/components/ui";
import {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  type CampaignRow,
  type CampaignInput,
  type CampaignType,
  type CampaignActionResult,
} from "@/lib/admin/campaigns-actions";

const ERROR_MESSAGES: Record<string, string> = {
  unauthenticated: "Session expirée — reconnecte-toi.",
  unauthorized: "Accès réservé au staff.",
};

const DAY_MS = 86_400_000;

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

// <input type="date"> wants yyyy-mm-dd; tolerate null.
function toDateInput(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

function errText(result: CampaignActionResult): string {
  return result.kind === "error" ? result.message : ERROR_MESSAGES[result.kind] ?? "Erreur.";
}

type FormState = {
  businessName: string;
  type: CampaignType;
  spotId: string;
  lat: string;
  lng: string;
  radiusM: string;
  startDate: string;
  endDate: string;
};

function initialCreateState(): FormState {
  const today = new Date();
  const in30 = new Date(today.getTime() + 30 * DAY_MS);
  return {
    businessName: "",
    type: "spot",
    spotId: "",
    lat: "",
    lng: "",
    radiusM: "2000",
    startDate: toDateInput(today.toISOString()),
    endDate: toDateInput(in30.toISOString()),
  };
}

function stateFromRow(c: CampaignRow): FormState {
  return {
    businessName: c.businessName === "—" ? "" : c.businessName,
    type: c.type,
    spotId: c.spotId != null ? String(c.spotId) : "",
    lat: "",
    lng: "",
    radiusM: c.radiusM != null ? String(c.radiusM) : "2000",
    startDate: toDateInput(c.startsAt),
    endDate: toDateInput(c.endsAt),
  };
}

// Shared create/edit field set. `geoLocationOptional` lets edit keep the existing
// point when lat/lng are left blank.
function CampaignFields({
  state,
  set,
  geoLocationOptional,
}: {
  state: FormState;
  set: (patch: Partial<FormState>) => void;
  geoLocationOptional?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Input
        label="Partenaire *"
        value={state.businessName}
        onChange={(e) => set({ businessName: e.target.value })}
        placeholder="Ex. Office de tourisme de Paris"
      />

      <Select label="Type de ciblage" value={state.type} onChange={(e) => set({ type: e.target.value as CampaignType })}>
        <option value="spot">Spot ciblé (badge « partenaire »)</option>
        <option value="geo">Ciblage géo (à proximité)</option>
      </Select>

      {state.type === "spot" ? (
        <Input
          label="ID du spot (optionnel)"
          value={state.spotId}
          onChange={(e) => set({ spotId: e.target.value })}
          placeholder="Ex. 2"
          inputMode="numeric"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Latitude"
              value={state.lat}
              onChange={(e) => set({ lat: e.target.value })}
              placeholder={geoLocationOptional ? "garder si vide" : "48.8566"}
              inputMode="decimal"
            />
            <Input
              label="Longitude"
              value={state.lng}
              onChange={(e) => set({ lng: e.target.value })}
              placeholder={geoLocationOptional ? "garder si vide" : "2.3522"}
              inputMode="decimal"
            />
          </div>
          <Input
            label="Rayon (mètres)"
            value={state.radiusM}
            onChange={(e) => set({ radiusM: e.target.value })}
            placeholder="2000"
            inputMode="numeric"
          />
          {geoLocationOptional && (
            <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded -mt-2 mb-2 pl-1">
              Laisse lat/lng vides pour conserver la position actuelle.
            </p>
          )}
        </>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Input label="Début" type="date" value={state.startDate} onChange={(e) => set({ startDate: e.target.value })} />
        <Input label="Fin (validité) *" type="date" value={state.endDate} onChange={(e) => set({ endDate: e.target.value })} />
      </div>
    </div>
  );
}

// Map a form into the server-action input. Returns a client-side error string when
// invalid (so we don't round-trip obviously-bad data).
function buildInput(state: FormState, opts: { geoLocationOptional?: boolean }): { input: CampaignInput } | { error: string } {
  const businessName = state.businessName.trim();
  if (!businessName) return { error: "Le nom du partenaire est requis." };
  if (!state.endDate) return { error: "La date de fin (validité) est requise." };

  const startsAt = state.startDate ? new Date(state.startDate).toISOString() : null;
  const endsAt = new Date(state.endDate).toISOString();
  if (startsAt && new Date(endsAt).getTime() <= new Date(startsAt).getTime()) {
    return { error: "La date de fin doit être après la date de début." };
  }

  if (state.type === "spot") {
    const spotId = state.spotId.trim() ? Number(state.spotId.trim()) : null;
    if (spotId !== null && !Number.isInteger(spotId)) return { error: "L'ID du spot doit être un nombre." };
    return { input: { businessName, type: "spot", spotId, startsAt, endsAt } };
  }

  // geo
  const hasLat = state.lat.trim() !== "";
  const hasLng = state.lng.trim() !== "";
  if (!opts.geoLocationOptional && (!hasLat || !hasLng)) {
    return { error: "Latitude et longitude sont requises pour un ciblage géo." };
  }
  if (hasLat !== hasLng) return { error: "Renseigne latitude ET longitude." };
  const lat = hasLat ? Number(state.lat) : null;
  const lng = hasLng ? Number(state.lng) : null;
  if (lat !== null && (!Number.isFinite(lat) || lat < -90 || lat > 90)) return { error: "Latitude invalide (±90)." };
  if (lng !== null && (!Number.isFinite(lng) || lng < -180 || lng > 180)) return { error: "Longitude invalide (±180)." };
  const radiusM = state.radiusM.trim() ? Number(state.radiusM.trim()) : null;
  if (radiusM !== null && (!Number.isFinite(radiusM) || radiusM <= 0)) return { error: "Rayon invalide (mètres)." };

  return { input: { businessName, type: "geo", lat, lng, radiusM, startsAt, endsAt } };
}

export function SponsoredClient({ campaigns }: { campaigns: CampaignRow[] }) {
  const router = useRouter();
  const toast = useToast();

  const [create, setCreate] = useState<FormState>(initialCreateState);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState<CampaignRow | null>(null);
  const [edit, setEdit] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);

  const patchCreate = (patch: Partial<FormState>) => setCreate((s) => ({ ...s, ...patch }));
  const patchEdit = (patch: Partial<FormState>) => setEdit((s) => (s ? { ...s, ...patch } : s));

  const handleCreate = async () => {
    const built = buildInput(create, { geoLocationOptional: false });
    if ("error" in built) {
      toast.push(built.error, "err");
      return;
    }
    setSaving(true);
    const result = await createCampaign(built.input);
    setSaving(false);
    if (result.kind === "ok") {
      toast.push(`Campagne « ${built.input.businessName} » créée.`, "ok");
      setCreate(initialCreateState());
      router.refresh();
      return;
    }
    toast.push(errText(result), "err");
  };

  const openEdit = (c: CampaignRow) => {
    setEditing(c);
    setEdit(stateFromRow(c));
  };
  const closeEdit = () => {
    setEditing(null);
    setEdit(null);
  };

  const handleUpdate = async () => {
    if (!editing || !edit) return;
    const built = buildInput(edit, { geoLocationOptional: edit.type === "geo" });
    if ("error" in built) {
      toast.push(built.error, "err");
      return;
    }
    setBusy(true);
    const result = await updateCampaign({ ...built.input, id: editing.id });
    setBusy(false);
    if (result.kind === "ok") {
      toast.push("Campagne mise à jour.", "ok");
      closeEdit();
      router.refresh();
      return;
    }
    toast.push(errText(result), "err");
  };

  const handleDelete = async () => {
    if (!editing) return;
    if (!window.confirm(`Supprimer la campagne « ${editing.businessName} » ? Cette action est définitive.`)) return;
    setBusy(true);
    const result = await deleteCampaign(editing.id);
    setBusy(false);
    if (result.kind === "ok") {
      toast.push("Campagne supprimée.", "ok");
      closeEdit();
      router.refresh();
      return;
    }
    toast.push(errText(result), "err");
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
            <CampaignFields state={create} set={patchCreate} />
            <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded mb-3">
              {create.type === "spot"
                ? "Le spot ciblé affichera le badge « partenaire » dans l'app."
                : "Diffusée aux utilisateurs situés dans le rayon autour du point, pendant la fenêtre de validité."}
            </p>
            <Button variant="gold" size="sm" icon={<Plus size={14} />} onClick={handleCreate} disabled={saving}>
              {saving ? "Création…" : "Créer la campagne"}
            </Button>
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
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => openEdit(c)}
                    className="flex items-center gap-3 p-3 text-left border-[1.5px] border-dashed border-[var(--ink-line)] rounded-[4px] hover:bg-paper-2 transition cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-[family-name:var(--font-serif)] font-bold text-[15px] truncate">
                        {c.businessName}
                      </div>
                      <div className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded truncate flex items-center gap-1">
                        {c.type === "geo" ? (
                          <>
                            <MapPin size={11} /> {`ciblage géo · ${c.radiusM ?? 2000} m`}
                          </>
                        ) : (
                          c.spotId ? `spot #${c.spotId}` : "spot non défini"
                        )}
                        {" · "}
                        {fmtDate(c.startsAt)} → {fmtDate(c.endsAt)}
                      </div>
                    </div>
                    <Badge tone={c.isActive ? "green" : "neutral"}>
                      {c.isActive ? "EN LIGNE" : "EXPIRÉE"}
                    </Badge>
                    <Pencil size={14} className="text-ink-faded shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </PaperCard>
        </div>
      </div>

      <Modal
        open={!!editing}
        onClose={closeEdit}
        title="Modifier la campagne"
        footer={
          <>
            <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={handleDelete} disabled={busy}>
              Supprimer
            </Button>
            <Button variant="gold" size="sm" onClick={handleUpdate} disabled={busy}>
              {busy ? "…" : "Enregistrer"}
            </Button>
          </>
        }
      >
        {edit && <CampaignFields state={edit} set={patchEdit} geoLocationOptional={edit.type === "geo"} />}
      </Modal>
    </AdminPage>
  );
}
