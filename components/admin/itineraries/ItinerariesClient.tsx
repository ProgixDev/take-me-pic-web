"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Map, Plus, Pencil, Trash2, MapPin, X } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Button, Input, Select, PaperCard, Badge, Modal, useToast } from "@/components/ui";
import {
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getTemplateSteps,
  type TemplateRow,
  type StepInput,
  type TemplateActionResult,
} from "@/lib/admin/itinerary-templates-actions";
import { STEP_KINDS, type StepKind } from "@/lib/admin/itinerary-step-kinds";

const ERROR_MESSAGES: Record<string, string> = {
  unauthenticated: "Session expirée — reconnecte-toi.",
  unauthorized: "Accès réservé au staff.",
};

const KIND_LABELS: Record<StepKind, string> = {
  photo: "Photo 📷",
  coffee: "Café ☕",
  ticket: "Billet 🎟",
  walk: "Marche 🚶",
  view: "Point de vue 🌄",
};

function errText(result: TemplateActionResult): string {
  return result.kind === "error" ? result.message : ERROR_MESSAGES[result.kind] ?? "Erreur.";
}

// Per-row step state — all strings so the inputs stay controlled.
type StepFormRow = {
  timeLabel: string;
  title: string;
  subtitle: string;
  kind: StepKind;
  price: string; // euros, only meaningful for 'ticket'
};

type FormState = {
  title: string;
  areaLabel: string;
  city: string;
  lat: string;
  lng: string;
  radiusM: string;
  steps: StepFormRow[];
};

function emptyStep(): StepFormRow {
  return { timeLabel: "", title: "", subtitle: "", kind: "photo", price: "" };
}

function initialCreateState(): FormState {
  return {
    title: "",
    areaLabel: "",
    city: "",
    lat: "",
    lng: "",
    radiusM: "3000",
    steps: [emptyStep()],
  };
}

// Edit prefills template fields + a single placeholder step row (steps are not
// read back here). lat/lng are left blank = keep current location.
function stateFromRow(t: TemplateRow): FormState {
  return {
    title: t.title,
    areaLabel: t.areaLabel ?? "",
    city: t.city ?? "",
    lat: "",
    lng: "",
    radiusM: t.radiusM != null ? String(t.radiusM) : "3000",
    steps: [emptyStep()],
  };
}

// Build the server-action step payload from the form rows. Drops fully-empty
// rows; returns a client-side error when a non-empty row lacks a title.
function buildSteps(rows: StepFormRow[]): { steps: StepInput[] } | { error: string } {
  const steps: StepInput[] = [];
  for (const [i, row] of rows.entries()) {
    const title = row.title.trim();
    const time = row.timeLabel.trim();
    const subtitle = row.subtitle.trim();
    const priceRaw = row.price.trim();
    const isEmpty = !title && !time && !subtitle && !priceRaw;
    if (isEmpty) continue;
    if (!title) return { error: `L'étape ${i + 1} doit avoir un titre.` };

    let priceCents: number | null = null;
    if (priceRaw) {
      const euros = Number(priceRaw.replace(",", "."));
      if (!Number.isFinite(euros) || euros < 0) return { error: `Prix invalide à l'étape ${i + 1}.` };
      priceCents = Math.round(euros * 100);
    }

    steps.push({
      timeLabel: time || null,
      title,
      subtitle: subtitle || null,
      kind: row.kind,
      priceCents,
    });
  }
  return { steps };
}

// Shared steps editor (add/remove rows).
function StepsEditor({
  steps,
  set,
}: {
  steps: StepFormRow[];
  set: (steps: StepFormRow[]) => void;
}) {
  const patch = (i: number, p: Partial<StepFormRow>) =>
    set(steps.map((s, idx) => (idx === i ? { ...s, ...p } : s)));
  const remove = (i: number) => set(steps.filter((_, idx) => idx !== i));
  const add = () => set([...steps, emptyStep()]);

  return (
    <div className="flex flex-col gap-3">
      <div className="font-[family-name:var(--font-hand)] text-lg text-ink-2 pl-1">Étapes</div>
      {steps.map((step, i) => (
        <div
          key={i}
          className="border-[1.5px] border-dashed border-[var(--ink-line)] rounded-[4px] p-3 bg-paper-2/40"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.08em] text-ink-faded">
              Étape {i + 1}
            </span>
            {steps.length > 1 && (
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-ink-faded hover:text-stamp-red transition"
                aria-label="Supprimer l'étape"
              >
                <X size={15} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-3">
            <Input
              label="Horaire"
              value={step.timeLabel}
              onChange={(e) => patch(i, { timeLabel: e.target.value })}
              placeholder="Ex. 09H00"
            />
            <Select
              label="Type"
              value={step.kind}
              onChange={(e) => patch(i, { kind: e.target.value as StepKind })}
            >
              {STEP_KINDS.map((k) => (
                <option key={k} value={k}>
                  {KIND_LABELS[k]}
                </option>
              ))}
            </Select>
          </div>
          <Input
            label="Titre *"
            value={step.title}
            onChange={(e) => patch(i, { title: e.target.value })}
            placeholder="Ex. Café au Marais"
          />
          <Input
            label="Sous-titre"
            value={step.subtitle}
            onChange={(e) => patch(i, { subtitle: e.target.value })}
            placeholder="Optionnel"
          />
          {step.kind === "ticket" && (
            <Input
              label="Prix (€)"
              value={step.price}
              onChange={(e) => patch(i, { price: e.target.value })}
              placeholder="Ex. 12.50"
              inputMode="decimal"
            />
          )}
        </div>
      ))}
      <Button variant="paper" size="sm" icon={<Plus size={14} />} onClick={add}>
        Ajouter une étape
      </Button>
    </div>
  );
}

// Shared create/edit field set. `geoLocationOptional` lets edit keep the existing
// point when lat/lng are left blank.
function TemplateFields({
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
        label="Titre *"
        value={state.title}
        onChange={(e) => set({ title: e.target.value })}
        placeholder="Ex. Une journée à Montmartre"
      />
      <Input
        label="Zone (libellé)"
        value={state.areaLabel}
        onChange={(e) => set({ areaLabel: e.target.value })}
        placeholder="Ex. Montmartre"
      />
      <Input
        label="Ville"
        value={state.city}
        onChange={(e) => set({ city: e.target.value })}
        placeholder="Ex. Paris"
      />
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
        placeholder="3000"
        inputMode="numeric"
      />
      {geoLocationOptional && (
        <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded -mt-2 mb-2 pl-1">
          Laisse lat/lng vides pour conserver la position actuelle.
        </p>
      )}
      <div className="mt-2">
        <StepsEditor steps={state.steps} set={(steps) => set({ steps })} />
      </div>
    </div>
  );
}

export function ItinerariesClient({ templates }: { templates: TemplateRow[] }) {
  const router = useRouter();
  const toast = useToast();

  const [create, setCreate] = useState<FormState>(initialCreateState);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState<TemplateRow | null>(null);
  const [edit, setEdit] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);

  const patchCreate = (patch: Partial<FormState>) => setCreate((s) => ({ ...s, ...patch }));
  const patchEdit = (patch: Partial<FormState>) => setEdit((s) => (s ? { ...s, ...patch } : s));

  // Validate the shared template fields. `geoOptional` => blank lat/lng allowed.
  function parseGeo(
    state: FormState,
    geoOptional: boolean,
  ): { lat: number | null; lng: number | null; radiusM: number | null } | { error: string } {
    const hasLat = state.lat.trim() !== "";
    const hasLng = state.lng.trim() !== "";
    if (!geoOptional && (!hasLat || !hasLng)) {
      return { error: "Latitude et longitude sont requises." };
    }
    if (hasLat !== hasLng) return { error: "Renseigne latitude ET longitude." };
    const lat = hasLat ? Number(state.lat) : null;
    const lng = hasLng ? Number(state.lng) : null;
    if (lat !== null && (!Number.isFinite(lat) || lat < -90 || lat > 90)) return { error: "Latitude invalide (±90)." };
    if (lng !== null && (!Number.isFinite(lng) || lng < -180 || lng > 180)) return { error: "Longitude invalide (±180)." };
    const radiusM = state.radiusM.trim() ? Number(state.radiusM.trim()) : null;
    if (radiusM !== null && (!Number.isFinite(radiusM) || radiusM <= 0)) return { error: "Rayon invalide (mètres)." };
    return { lat, lng, radiusM };
  }

  const handleCreate = async () => {
    const title = create.title.trim();
    if (!title) {
      toast.push("Le titre est requis.", "err");
      return;
    }
    const geo = parseGeo(create, false);
    if ("error" in geo) {
      toast.push(geo.error, "err");
      return;
    }
    const built = buildSteps(create.steps);
    if ("error" in built) {
      toast.push(built.error, "err");
      return;
    }
    setSaving(true);
    const result = await createTemplate({
      title,
      areaLabel: create.areaLabel.trim() || null,
      city: create.city.trim() || null,
      lat: geo.lat as number,
      lng: geo.lng as number,
      radiusM: geo.radiusM,
      steps: built.steps,
    });
    setSaving(false);
    if (result.kind === "ok") {
      toast.push(`Itinéraire « ${title} » créé.`, "ok");
      setCreate(initialCreateState());
      router.refresh();
      return;
    }
    toast.push(errText(result), "err");
  };

  const openEdit = async (t: TemplateRow) => {
    setEditing(t);
    setEdit(stateFromRow(t));
    // Load the real steps so editing doesn't wipe them (update replaces steps).
    const res = await getTemplateSteps(t.id);
    if (res.kind === "ok" && res.data.length > 0) {
      const rows: StepFormRow[] = res.data.map((s) => ({
        timeLabel: s.timeLabel ?? "",
        title: s.title,
        subtitle: s.subtitle ?? "",
        kind: s.kind,
        price: s.priceCents != null ? String(s.priceCents / 100) : "",
      }));
      setEdit((prev) => (prev ? { ...prev, steps: rows } : prev));
    }
  };
  const closeEdit = () => {
    setEditing(null);
    setEdit(null);
  };

  const handleUpdate = async () => {
    if (!editing || !edit) return;
    const title = edit.title.trim();
    if (!title) {
      toast.push("Le titre est requis.", "err");
      return;
    }
    const geo = parseGeo(edit, true);
    if ("error" in geo) {
      toast.push(geo.error, "err");
      return;
    }
    const built = buildSteps(edit.steps);
    if ("error" in built) {
      toast.push(built.error, "err");
      return;
    }
    setBusy(true);
    const result = await updateTemplate({
      id: editing.id,
      title,
      areaLabel: edit.areaLabel.trim() || null,
      city: edit.city.trim() || null,
      lat: geo.lat,
      lng: geo.lng,
      radiusM: geo.radiusM,
      steps: built.steps,
    });
    setBusy(false);
    if (result.kind === "ok") {
      toast.push("Itinéraire mis à jour.", "ok");
      closeEdit();
      router.refresh();
      return;
    }
    toast.push(errText(result), "err");
  };

  const handleDelete = async () => {
    if (!editing) return;
    if (!window.confirm(`Supprimer l'itinéraire « ${editing.title} » ? Cette action est définitive.`)) return;
    setBusy(true);
    const result = await deleteTemplate(editing.id);
    setBusy(false);
    if (result.kind === "ok") {
      toast.push("Itinéraire supprimé.", "ok");
      closeEdit();
      router.refresh();
      return;
    }
    toast.push(errText(result), "err");
  };

  return (
    <AdminPage
      title="Itinéraires"
      eyebrow="curation de modèles"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { label: "Itinéraires" },
      ]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create form */}
        <div className="lg:col-span-1">
          <PaperCard shadow="soft" className="p-6">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-[18px] mb-4 flex items-center gap-2">
              <Map size={18} /> Nouvel itinéraire
            </h3>
            <TemplateFields state={create} set={patchCreate} />
            <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded mt-2 mb-3">
              Modèle de journée proposé aux utilisateurs, ancré sur un point et un rayon.
            </p>
            <Button variant="gold" size="sm" icon={<Plus size={14} />} onClick={handleCreate} disabled={saving}>
              {saving ? "Création…" : "Créer l'itinéraire"}
            </Button>
          </PaperCard>
        </div>

        {/* Template list */}
        <div className="lg:col-span-2">
          <PaperCard shadow="soft" className="p-6">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-[18px] mb-4">
              Itinéraires ({templates.length})
            </h3>
            {templates.length === 0 ? (
              <p className="font-[family-name:var(--font-serif)] text-[14px] text-ink-faded">
                Aucun itinéraire pour l'instant.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => openEdit(t)}
                    className="flex items-center gap-3 p-3 text-left border-[1.5px] border-dashed border-[var(--ink-line)] rounded-[4px] hover:bg-paper-2 transition cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-[family-name:var(--font-serif)] font-bold text-[15px] truncate">
                        {t.title}
                      </div>
                      <div className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded truncate flex items-center gap-1">
                        <MapPin size={11} />
                        {[t.areaLabel, t.city].filter(Boolean).join(" · ") || "zone non définie"}
                        {` · ${t.radiusM ?? 3000} m`}
                      </div>
                    </div>
                    <Badge tone="gold">{`${t.stepCount} étape${t.stepCount > 1 ? "s" : ""}`}</Badge>
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
        title="Modifier l'itinéraire"
        size="lg"
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
        {edit && (
          <>
            <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded mb-3 pl-1">
              Enregistrer remplace toutes les étapes par celles ci-dessous.
            </p>
            <TemplateFields state={edit} set={patchEdit} geoLocationOptional />
          </>
        )}
      </Modal>
    </AdminPage>
  );
}
