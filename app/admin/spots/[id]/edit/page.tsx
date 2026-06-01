"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Button,
  Input,
  Select,
  Textarea,
  PaperCard,
  useToast,
} from "@/components/ui";
import { getSpot } from "@/lib/data";

export default function SpotEditPage() {
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const spot = getSpot(id);

  const [name, setName] = useState(spot.name);
  const [city, setCity] = useState(spot.city);
  const [country, setCountry] = useState(spot.country);
  const [category, setCategory] = useState<string>(spot.category);
  const [status, setStatus] = useState<string>(spot.status);
  const [bestTime, setBestTime] = useState(spot.bestTime);
  const [description, setDescription] = useState(
    `${spot.name} est l'un des spots photo les plus prisés de ${spot.city}. Idéal pour les amateurs de ${
      spot.category === "coucher" ? "couchers de soleil" :
      spot.category === "lever" ? "levers de soleil" :
      spot.category === "portrait" ? "portraits en lumière naturelle" :
      "photographie d'architecture"
    }, ce lieu offre des angles de vue uniques à toute heure de la journée.`
  );

  const handleSave = () => {
    toast.push(`Spot « ${name} » enregistré avec succès.`, "ok");
  };

  return (
    <AdminPage
      title={`Modifier — ${spot.name}`}
      eyebrow="édition du spot"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/spots", label: "Spots" },
        { href: `/admin/spots/${id}`, label: spot.name },
        { label: "Modifier" },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Link href={`/admin/spots/${id}`}>
            <Button variant="paper" size="sm" icon={<ArrowLeft size={14} />}>
              Retour
            </Button>
          </Link>
          <Button
            variant="gold"
            size="sm"
            icon={<Save size={14} />}
            onClick={handleSave}
          >
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

              <Select
                label="Ville"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                {["Paris", "Lisbonne", "Marrakech", "Barcelone", "Rome", "Tokyo", "Lyon", "Berlin", "Amsterdam", "Istanbul"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>

              <Select
                label="Pays (emoji)"
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
                label="Catégorie"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="coucher">Coucher de soleil ☀</option>
                <option value="lever">Lever du soleil 🌅</option>
                <option value="portrait">Portrait</option>
                <option value="archi">Architecture</option>
              </Select>

              <Select
                label="Statut"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="approved">Validé</option>
                <option value="pending">En attente</option>
                <option value="rejected">Rejeté</option>
              </Select>

              <div className="sm:col-span-2">
                <Input
                  label="Meilleure heure de visite"
                  value={bestTime}
                  onChange={(e) => setBestTime(e.target.value)}
                  placeholder="Ex. 19H, Heure dorée, 7H30…"
                />
              </div>

              <div className="sm:col-span-2">
                <Textarea
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Décrivez ce spot, ses particularités, l'ambiance…"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-dashed border-[var(--ink-line)]">
              <Link href={`/admin/spots/${id}`}>
                <Button variant="paper" size="sm" icon={<ArrowLeft size={14} />}>
                  Annuler
                </Button>
              </Link>
              <Button
                variant="gold"
                size="sm"
                icon={<Save size={14} />}
                onClick={handleSave}
              >
                Enregistrer les modifications
              </Button>
            </div>
          </PaperCard>
        </div>

        {/* Preview sidebar */}
        <div className="flex flex-col gap-5">
          <PaperCard shadow="gold" className="overflow-hidden">
            <div
              className="w-full aspect-video bg-cover bg-center"
              style={{ backgroundImage: `url(${spot.hero})` }}
            />
            <div className="p-4">
              <div className="font-[family-name:var(--font-serif)] font-bold text-[16px] leading-tight mb-1">
                {name || "Nom du spot"}
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
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-[family-name:var(--font-type)] uppercase tracking-[0.06em] border-stamp-blue/40 text-stamp-blue bg-stamp-blue/10">
                  {bestTime || "—"}
                </span>
              </div>
            </div>
          </PaperCard>

          <div className="bg-card border-[1.5px] border-dashed border-[var(--ink-line)] rounded-[4px] p-4">
            <p className="font-[family-name:var(--font-hand)] text-[15px] text-ink-faded text-center leading-relaxed">
              Les modifications seront visibles immédiatement après enregistrement.
            </p>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
