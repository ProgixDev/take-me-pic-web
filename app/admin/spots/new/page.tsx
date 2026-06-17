"use client";

import { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Button,
  Input,
  Select,
  Textarea,
  PaperCard,
  Stamp,
  useToast,
} from "@/components/ui";
import { createSpot } from "@/lib/admin/spots-actions";

const ERROR_MESSAGES: Record<string, string> = {
  unauthenticated: "Session expirée — reconnecte-toi.",
  unauthorized: "Accès réservé au staff.",
};

export default function NewSpotPage() {
  const toast = useToast();

  const [name, setName] = useState("");
  const [city, setCity] = useState("Paris");
  const [country, setCountry] = useState("🇫🇷");
  const [category, setCategory] = useState("coucher");
  const [bestTime, setBestTime] = useState("");
  const [description, setDescription] = useState("");
  const [heroUrl, setHeroUrl] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [created, setCreated] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.push("Le nom du spot est obligatoire.", "err");
      return;
    }
    const hasLat = lat.trim() !== "";
    const hasLng = lng.trim() !== "";
    if (hasLat !== hasLng) {
      toast.push("Renseigne latitude ET longitude (ou aucune).", "err");
      return;
    }
    if (hasLat && (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng)))) {
      toast.push("Latitude/longitude invalides.", "err");
      return;
    }
    setSaving(true);
    const result = await createSpot({
      name,
      city,
      bestTime,
      heroUrl,
      lat: hasLat ? Number(lat) : null,
      lng: hasLng ? Number(lng) : null,
    });
    setSaving(false);

    if (result.kind === "ok") {
      setCreated(true);
      toast.push(`Spot « ${name} » créé et soumis à validation.`, "ok");
      return;
    }
    toast.push(
      result.kind === "error" ? result.message : ERROR_MESSAGES[result.kind],
      "err",
    );
  };

  if (created) {
    return (
      <AdminPage
        title="Spot créé !"
        eyebrow="succès"
        breadcrumb={[
          { href: "/admin", label: "Admin" },
          { href: "/admin/spots", label: "Spots" },
          { label: "Nouveau spot" },
        ]}
      >
        <div className="max-w-lg mx-auto text-center py-16 flex flex-col items-center gap-6">
          <Stamp color="green" shape="circle" size={96} rotate={-8} fontSize={11}>
            SOUMIS{"\n"}✓
          </Stamp>
          <div>
            <h2 className="font-[family-name:var(--font-serif)] font-bold text-[28px] mb-2">
              Spot « {name} » créé !
            </h2>
            <p className="font-[family-name:var(--font-serif)] text-ink-faded text-[15px] leading-relaxed">
              Le spot a été soumis à la file d'attente de validation.
              Il sera visible par la communauté dès qu'un modérateur l'approuvera.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/spots">
              <Button variant="paper" size="sm">
                Retour aux spots
              </Button>
            </Link>
            <Link href="/admin/spots/pending">
              <Button variant="gold" size="sm">
                File d'attente
              </Button>
            </Link>
          </div>
        </div>
      </AdminPage>
    );
  }

  return (
    <AdminPage
      title="Nouveau spot"
      eyebrow="ajouter un lieu"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/spots", label: "Spots" },
        { label: "Nouveau spot" },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Link href="/admin/spots">
            <Button variant="paper" size="sm" icon={<ArrowLeft size={14} />}>
              Annuler
            </Button>
          </Link>
          <Button
            variant="gold"
            size="sm"
            icon={<Plus size={14} />}
            onClick={handleCreate}
            disabled={saving}
          >
            {saving ? "Création…" : "Créer le spot"}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <PaperCard shadow="soft" className="p-6">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-[18px] mb-1">
              Informations du spot
            </h3>
            <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded mb-5">
              Tous les champs marqués d'un * sont obligatoires.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <div className="sm:col-span-2">
                <Input
                  label="Nom du spot *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex. Pont des Arts, Miradouro da Graça…"
                />
              </div>

              <Select
                label="Ville *"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                {["Paris", "Lisbonne", "Marrakech", "Barcelone", "Rome", "Tokyo", "Lyon", "Berlin", "Amsterdam", "Istanbul"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>

              <Select
                label="Pays *"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {[
                  { label: "France 🇫🇷", value: "🇫🇷" },
                  { label: "Portugal 🇵🇹", value: "🇵🇹" },
                  { label: "Maroc 🇲🇦", value: "🇲🇦" },
                  { label: "Espagne 🇪🇸", value: "🇪🇸" },
                  { label: "Italie 🇮🇹", value: "🇮🇹" },
                  { label: "Japon 🇯🇵", value: "🇯🇵" },
                  { label: "Allemagne 🇩🇪", value: "🇩🇪" },
                  { label: "Pays-Bas 🇳🇱", value: "🇳🇱" },
                  { label: "Turquie 🇹🇷", value: "🇹🇷" },
                ].map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </Select>

              <Select
                label="Catégorie *"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="coucher">Coucher de soleil ☀</option>
                <option value="lever">Lever du soleil 🌅</option>
                <option value="portrait">Portrait</option>
                <option value="archi">Architecture</option>
              </Select>

              <Input
                label="Meilleure heure de visite"
                value={bestTime}
                onChange={(e) => setBestTime(e.target.value)}
                placeholder="Ex. 19H, Heure dorée, 7H30…"
              />

              <Input
                label="Latitude"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="Ex. 48.8566"
                inputMode="decimal"
              />

              <Input
                label="Longitude"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="Ex. 2.3522"
                inputMode="decimal"
              />

              <div className="sm:col-span-2">
                <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded -mt-2 mb-3 pl-1">
                  Coordonnées GPS du spot — utilisées pour l'afficher aux utilisateurs à proximité. Laisse vide si inconnu.
                </p>
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="URL de la photo principale"
                  value={heroUrl}
                  onChange={(e) => setHeroUrl(e.target.value)}
                  placeholder="https://… (optionnel, une image sera générée)"
                />
              </div>

              <div className="sm:col-span-2">
                <Textarea
                  label="Description du spot"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Décrivez ce spot, ses particularités, l'ambiance, les conseils pour y accéder…"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-dashed border-[var(--ink-line)]">
              <Link href="/admin/spots">
                <Button variant="paper" size="sm">
                  Annuler
                </Button>
              </Link>
              <Button
                variant="gold"
                size="sm"
                icon={<Plus size={14} />}
                onClick={handleCreate}
                disabled={saving}
              >
                {saving ? "Création…" : "Créer le spot"}
              </Button>
            </div>
          </PaperCard>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          {/* Preview */}
          <PaperCard shadow="gold" className="overflow-hidden">
            <div
              className="w-full aspect-video bg-cover bg-center bg-paper-warm flex items-center justify-center"
              style={{
                backgroundImage: heroUrl
                  ? `url(${heroUrl})`
                  : `url(https://picsum.photos/seed/newspot/800/450)`,
              }}
            />
            <div className="p-4">
              <div className="font-[family-name:var(--font-serif)] font-bold text-[16px] leading-tight mb-1">
                {name || (
                  <span className="text-ink-faded italic">Nom du spot…</span>
                )}
              </div>
              <div className="font-[family-name:var(--font-type)] text-[12px] text-ink-faded mb-2">
                {country} {city}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-[family-name:var(--font-type)] uppercase tracking-[0.06em] border-gold-deep/40 text-gold-deep bg-gold-light/10">
                  {category === "coucher" ? "Coucher ☀" :
                   category === "lever" ? "Lever 🌅" :
                   category === "portrait" ? "Portrait" :
                   "Architecture"}
                </span>
                {bestTime && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-[family-name:var(--font-type)] uppercase tracking-[0.06em] border-stamp-blue/40 text-stamp-blue bg-stamp-blue/10">
                    {bestTime}
                  </span>
                )}
              </div>
            </div>
          </PaperCard>

          {/* Info */}
          <div className="bg-card border-[1.5px] border-dashed border-[var(--ink-line)] rounded-[4px] p-4 space-y-2.5">
            <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded">
              Processus de validation
            </div>
            {[
              "Le spot est soumis à la file d'attente.",
              "Un modérateur examine et approuve.",
              "Le spot devient visible pour la communauté.",
            ].map((step, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="font-[family-name:var(--font-serif)] font-bold text-gold-deep text-[15px] leading-tight w-4 shrink-0">
                  {i + 1}.
                </span>
                <span className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded leading-snug">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
