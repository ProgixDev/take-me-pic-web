"use client";

import { useState, useTransition } from "react";
import { Save, Zap, Plus } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { PaperCard, Button, Input, Toggle, Stamp, Badge, useToast } from "@/components/ui";
import { updateKarmaRule, type KarmaActionResult } from "@/lib/admin/karma-actions";
import type { KarmaRule } from "@/lib/admin/karma";

const CATEGORY_LABELS: Record<string, string> = {
  photo: "Photo",
  social: "Social",
  spot: "Spots",
  quality: "Qualité",
  fidelite: "Fidélité",
};

const CATEGORY_COLORS: Record<string, "gold" | "blue" | "green" | "sunset" | "neutral"> = {
  photo: "gold",
  social: "blue",
  spot: "green",
  quality: "sunset",
  fidelite: "neutral",
};

export function KarmaRulesClient({ rules }: { rules: KarmaRule[] }) {
  const { push } = useToast();
  const [pending, startTransition] = useTransition();
  const [editedPoints, setEditedPoints] = useState<Record<string, string>>(
    Object.fromEntries(rules.map((r) => [r.code, String(r.points)])),
  );

  function reportResult(result: KarmaActionResult, okMessage: string) {
    if (result.kind === "ok") push(okMessage, "ok");
    else if (result.kind === "unauthenticated") push("Session Supabase manquante. Reconnecte-toi.", "err");
    else if (result.kind === "unauthorized") push("Ce compte n'a pas les droits staff.", "err");
    else push(result.message, "err");
  }

  function handlePointsChange(code: string, val: string) {
    setEditedPoints((prev) => ({ ...prev, [code]: val }));
  }

  function handleSave(rule: KarmaRule) {
    const pts = parseInt(editedPoints[rule.code], 10);
    if (isNaN(pts) || pts < 0) {
      push("Valeur invalide — entrez un nombre positif.", "err");
      return;
    }
    startTransition(async () => {
      reportResult(await updateKarmaRule(rule.code, { points: pts }), "Règle enregistrée.");
    });
  }

  function handleToggle(rule: KarmaRule, val: boolean) {
    startTransition(async () => {
      reportResult(
        await updateKarmaRule(rule.code, { active: val }),
        val ? `Règle "${rule.label}" activée.` : `Règle "${rule.label}" désactivée.`,
      );
    });
  }

  const totalActive = rules.filter((r) => r.active).length;
  const wiredCount = rules.filter((r) => r.wired).length;

  return (
    <AdminPage
      title="Règles de karma"
      eyebrow="éditeur des règles d'attribution ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/karma", label: "Karma" },
        { label: "Règles" },
      ]}
      actions={
        <Button
          variant="gold"
          size="sm"
          icon={<Plus size={14} />}
          onClick={() => push("Création de règle bientôt disponible.", "info")}
        >
          Nouvelle règle
        </Button>
      }
    >
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Règles actives
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-stamp-green">
            {totalActive}
          </div>
        </div>
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Câblées au karma live
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-gold-deep">
            {wiredCount}
          </div>
        </div>
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Règles inactives
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-ink-faded">
            {rules.length - totalActive}
          </div>
        </div>
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm relative overflow-hidden">
          <Stamp color="gold" size={56} fontSize={7} rotate={10} className="absolute -right-1 top-0.5">
            {`KARMA\n★`}
          </Stamp>
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Total règles
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl">{rules.length}</div>
        </div>
      </div>

      {/* Rules list */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <PaperCard
            key={rule.code}
            shadow={rule.active ? "soft" : "none"}
            className={`p-4 transition ${!rule.active ? "opacity-60" : ""}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-9 h-9 rounded-[4px] bg-paper-2 border-[1.5px] border-[var(--ink-line)] flex items-center justify-center">
                  <Zap size={16} className="text-gold-deep" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">
                    {rule.label}
                  </span>
                  <Badge tone={CATEGORY_COLORS[rule.category] ?? "neutral"} className="text-[9px]">
                    {CATEGORY_LABELS[rule.category] ?? rule.category}
                  </Badge>
                  {rule.wired ? (
                    <Badge tone="green" className="text-[9px]">
                      câblée
                    </Badge>
                  ) : (
                    <Badge tone="neutral" className="text-[9px]">
                      planifiée
                    </Badge>
                  )}
                  {!rule.active && (
                    <Badge tone="neutral" className="text-[9px]">
                      inactif
                    </Badge>
                  )}
                </div>
                <p className="font-[family-name:var(--font-serif)] text-[12px] text-ink-faded">
                  {rule.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="w-24">
                  <Input
                    label=""
                    type="number"
                    value={editedPoints[rule.code] ?? String(rule.points)}
                    onChange={(e) => handlePointsChange(rule.code, e.target.value)}
                    className="text-center font-[family-name:var(--font-serif)] font-bold"
                  />
                </div>
                <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded">
                  {rule.wired ? "/★" : "pts"}
                </span>
                <Button
                  variant="paper"
                  size="sm"
                  icon={<Save size={13} />}
                  disabled={pending}
                  onClick={() => handleSave(rule)}
                >
                  Enregistrer
                </Button>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded">
                  actif
                </span>
                <Toggle checked={rule.active} onChange={(v) => handleToggle(rule, v)} />
              </div>
            </div>
          </PaperCard>
        ))}
      </div>
    </AdminPage>
  );
}
