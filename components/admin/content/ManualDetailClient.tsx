"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, ArrowLeft } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { Button, PaperCard, Stamp, Badge, Input, Textarea, Select } from "@/components/ui";
import type { ManualTip } from "@/lib/admin/content";

const COLOR_OPTIONS = [
  { value: "gold", label: "Or" },
  { value: "blue", label: "Bleu" },
  { value: "green", label: "Vert" },
  { value: "sunset", label: "Coucher de soleil" },
];

const COLOR_PREVIEW: Record<string, { bg: string; text: string; border: string; stamp: "gold" | "blue" | "green" | "ink" }> = {
  gold: { bg: "bg-gold-light/20", text: "text-gold-deep", border: "border-gold-deep", stamp: "gold" },
  blue: { bg: "bg-stamp-blue/10", text: "text-stamp-blue", border: "border-stamp-blue", stamp: "blue" },
  green: { bg: "bg-stamp-green/10", text: "text-stamp-green", border: "border-stamp-green", stamp: "green" },
  sunset: { bg: "bg-sunset/10", text: "text-sunset", border: "border-sunset", stamp: "ink" },
};

export function ManualDetailClient({ tip }: { tip: ManualTip }) {
  const router = useRouter();

  const [title, setTitle] = useState(tip.title);
  const [number, setNumber] = useState(String(tip.position).padStart(2, "0"));
  const [color, setColor] = useState(tip.color);
  const [body, setBody] = useState(tip.body ?? "");
  const [previewOpen, setPreviewOpen] = useState(false);

  const previewStyle = COLOR_PREVIEW[color] ?? COLOR_PREVIEW.gold;

  return (
    <AdminPage
      title={title || `Secret #${tip.id}`}
      eyebrow="éditeur du manuel"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/content", label: "Contenu" },
        { href: "/admin/content/manual", label: "Manuel" },
        { label: tip.title },
      ]}
      actions={
        <>
          <Button
            variant="paper"
            size="sm"
            icon={<ArrowLeft size={14} />}
            onClick={() => router.push("/admin/content/manual")}
          >
            Retour
          </Button>
          <Button
            variant="paper"
            size="sm"
            icon={<Eye size={14} />}
            onClick={() => setPreviewOpen(!previewOpen)}
          >
            {previewOpen ? "Masquer l'aperçu" : "Aperçu"}
          </Button>
          <Button variant="gold" size="sm" icon={<Save size={14} />} disabled>
            Enregistrer
          </Button>
        </>
      }
    >
      <div className={`grid gap-6 ${previewOpen ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 max-w-2xl"}`}>
        {/* Editor */}
        <PaperCard shadow="ink" className="p-6">
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-5">
            Édition du secret
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-1">
            <Input
              label="Numéro"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="01"
              className="font-[family-name:var(--font-type)] text-center text-xl font-bold"
            />
            <Select
              label="Couleur du cadre"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              {COLOR_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </div>

          <Input
            label="Titre du secret"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex : La règle des tiers"
          />

          <Textarea
            label="Corps du texte"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Explique le secret photo en termes simples…"
            className="min-h-52"
          />

          <div className="flex items-center justify-between pt-4 border-t border-dashed border-[var(--ink-line)] mt-2">
            <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded max-w-[70%]">
              Contenu live de l'app mobile (<code className="font-[family-name:var(--font-mono)] text-[11px]">framing_tips</code>)
              — l'enregistrement arrive avec les écritures de contenu ; pas d'état brouillon côté backend.
            </p>
            <Badge tone={tip.big ? "gold" : "neutral"}>{tip.big ? "grand format" : "standard"}</Badge>
          </div>
        </PaperCard>

        {/* Live Preview */}
        {previewOpen && (
          <div className="space-y-4">
            <h2 className="font-[family-name:var(--font-hand)] text-2xl text-gold-deep -rotate-1">
              aperçu en direct
            </h2>

            {/* Manual card preview */}
            <PaperCard
              shadow="gold"
              tilt={-1}
              className={`p-6 relative overflow-hidden ${previewStyle.bg}`}
            >
              <div className="absolute top-4 right-4 opacity-20">
                <Stamp color={previewStyle.stamp} size={72} fontSize={9} rotate={15}>
                  {`SECRET\n★\n${number}`}
                </Stamp>
              </div>

              <div className={`font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.18em] mb-2 ${previewStyle.text}`}>
                Secret n° {number}
              </div>

              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-full border-2 font-[family-name:var(--font-type)] font-bold text-lg mb-4 ${previewStyle.border} ${previewStyle.bg} ${previewStyle.text}`}
              >
                {number}
              </div>

              <h3 className={`font-[family-name:var(--font-serif)] font-bold text-[22px] leading-tight mb-2 ${previewStyle.text}`}>
                {title || "Titre du secret"}
              </h3>

              <div className="w-8 h-[1.5px] bg-current opacity-30 mb-3" />

              <div className="font-[family-name:var(--font-serif)] text-[14px] text-ink leading-relaxed whitespace-pre-line">
                {body.split("\n\n")[0] || "—"}
              </div>

              {body.split("\n\n").length > 1 && (
                <p className={`font-[family-name:var(--font-hand)] text-base mt-4 ${previewStyle.text}`}>
                  lire la suite →
                </p>
              )}
            </PaperCard>

            {/* Article view preview */}
            <PaperCard shadow="soft" className="p-6">
              <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded mb-3">
                Vue article complète
              </div>
              <h3 className="font-[family-name:var(--font-serif)] font-bold text-xl mb-1">
                {title || "Titre du secret"}
              </h3>
              <p className="font-[family-name:var(--font-serif)] text-[13px] text-ink-faded italic mb-4">
                Astuce n° {number} · manuel du voyageur
              </p>
              <div className="font-[family-name:var(--font-serif)] text-[14px] text-ink leading-relaxed whitespace-pre-line border-t border-dashed border-[var(--ink-line)] pt-4">
                {body || "—"}
              </div>
            </PaperCard>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
