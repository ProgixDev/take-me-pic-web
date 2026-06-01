"use client";

import { useState } from "react";
import { Save, Zap, Plus } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  PaperCard,
  Button,
  Input,
  Toggle,
  Stamp,
  Badge,
  useToast,
} from "@/components/ui";

interface KarmaRule {
  id: string;
  action: string;
  description: string;
  category: "photo" | "social" | "spot" | "quality" | "fidelite";
  points: number;
  active: boolean;
}

const INITIAL_RULES: KarmaRule[] = [
  {
    id: "kr1",
    action: "Prendre une photo pour quelqu'un",
    description: "Karma gagné à chaque session photo complétée en tant que photographe",
    category: "photo",
    points: 12,
    active: true,
  },
  {
    id: "kr2",
    action: "Être noté 5 étoiles",
    description: "Bonus karma pour une note parfaite reçue après une session",
    category: "quality",
    points: 15,
    active: true,
  },
  {
    id: "kr3",
    action: "Ajouter un spot photo",
    description: "Récompense pour chaque spot ajouté et validé par la communauté",
    category: "spot",
    points: 8,
    active: true,
  },
  {
    id: "kr4",
    action: "Premier déclic du jour",
    description: "Bonus pour la première photo prise dans la journée",
    category: "photo",
    points: 5,
    active: true,
  },
  {
    id: "kr5",
    action: "7 jours consécutifs actif",
    description: "Récompense de fidélité pour une semaine complète d'activité",
    category: "fidelite",
    points: 50,
    active: true,
  },
  {
    id: "kr6",
    action: "Recevoir un commentaire positif",
    description: "Karma pour chaque commentaire d'appréciation reçu sur une session",
    category: "social",
    points: 3,
    active: true,
  },
  {
    id: "kr7",
    action: "Partager un guide photo",
    description: "Récompense pour avoir partagé un conseil technique dans la communauté",
    category: "social",
    points: 6,
    active: false,
  },
  {
    id: "kr8",
    action: "Session de 20 min ou plus",
    description: "Bonus pour les sessions longues — plus de qualité, plus de karma",
    category: "photo",
    points: 8,
    active: true,
  },
  {
    id: "kr9",
    action: "Aider un débutant (< 5 sessions)",
    description: "Bonus spécial pour les photographes bienveillants envers les nouveaux",
    category: "social",
    points: 20,
    active: true,
  },
  {
    id: "kr10",
    action: "Spot validé par 10+ utilisateurs",
    description: "Bonus supplémentaire quand un spot que tu as ajouté devient populaire",
    category: "spot",
    points: 25,
    active: false,
  },
  {
    id: "kr11",
    action: "Note moyenne 4,8★ sur 30 jours",
    description: "Récompense mensuelle d'excellence pour les top photographes",
    category: "quality",
    points: 100,
    active: true,
  },
  {
    id: "kr12",
    action: "Photo de groupe (3+ personnes)",
    description: "Bonus pour les sessions plus complexes impliquant plusieurs sujets",
    category: "photo",
    points: 18,
    active: true,
  },
];

const CATEGORY_LABELS: Record<KarmaRule["category"], string> = {
  photo: "Photo",
  social: "Social",
  spot: "Spots",
  quality: "Qualité",
  fidelite: "Fidélité",
};

const CATEGORY_COLORS: Record<KarmaRule["category"], "gold" | "blue" | "green" | "sunset" | "neutral"> = {
  photo: "gold",
  social: "blue",
  spot: "green",
  quality: "sunset",
  fidelite: "neutral",
};

export default function KarmaRulesPage() {
  const { push } = useToast();
  const [rules, setRules] = useState<KarmaRule[]>(INITIAL_RULES);
  const [editedPoints, setEditedPoints] = useState<Record<string, string>>(
    Object.fromEntries(INITIAL_RULES.map((r) => [r.id, String(r.points)]))
  );

  function handleToggle(id: string, val: boolean) {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: val } : r))
    );
  }

  function handlePointsChange(id: string, val: string) {
    setEditedPoints((prev) => ({ ...prev, [id]: val }));
  }

  function handleSave(id: string) {
    const pts = parseInt(editedPoints[id], 10);
    if (isNaN(pts) || pts < 0) {
      push("Valeur invalide — entrez un nombre positif.", "err");
      return;
    }
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, points: pts } : r))
    );
    push("Règle enregistrée avec succès.", "ok");
  }

  const totalActive = rules.filter((r) => r.active).length;
  const totalPoints = rules.filter((r) => r.active).reduce((s, r) => s + r.points, 0);

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
          onClick={() => push("Fonctionnalité bientôt disponible.", "info")}
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
            Règles inactives
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-ink-faded">
            {rules.length - totalActive}
          </div>
        </div>
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm">
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Max karma/session
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl text-gold-deep">
            {totalPoints}
          </div>
        </div>
        <div className="bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm relative overflow-hidden">
          <Stamp color="gold" size={56} fontSize={7} rotate={10} className="absolute -right-1 top-0.5">
            {`KARMA\n★`}
          </Stamp>
          <div className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded mb-1">
            Total règles
          </div>
          <div className="font-[family-name:var(--font-serif)] font-extrabold text-3xl">
            {rules.length}
          </div>
        </div>
      </div>

      {/* Rules list */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <PaperCard
            key={rule.id}
            shadow={rule.active ? "soft" : "none"}
            className={`p-4 transition ${!rule.active ? "opacity-60" : ""}`}
          >
            <div className="flex items-start gap-4">
              {/* Icon / Category */}
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-9 h-9 rounded-[4px] bg-paper-2 border-[1.5px] border-[var(--ink-line)] flex items-center justify-center">
                  <Zap size={16} className="text-gold-deep" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-[family-name:var(--font-serif)] font-semibold text-[14px]">
                    {rule.action}
                  </span>
                  <Badge tone={CATEGORY_COLORS[rule.category]} className="text-[9px]">
                    {CATEGORY_LABELS[rule.category]}
                  </Badge>
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

              {/* Points input */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-24">
                  <Input
                    label=""
                    type="number"
                    value={editedPoints[rule.id]}
                    onChange={(e) => handlePointsChange(rule.id, e.target.value)}
                    className="text-center font-[family-name:var(--font-serif)] font-bold"
                  />
                </div>
                <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded">
                  pts
                </span>
                <Button
                  variant="paper"
                  size="sm"
                  icon={<Save size={13} />}
                  onClick={() => handleSave(rule.id)}
                >
                  Enregistrer
                </Button>
              </div>

              {/* Toggle */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded">
                  actif
                </span>
                <Toggle
                  checked={rule.active}
                  onChange={(v) => {
                    handleToggle(rule.id, v);
                    push(
                      v
                        ? `Règle "${rule.action}" activée.`
                        : `Règle "${rule.action}" désactivée.`,
                      v ? "ok" : "info"
                    );
                  }}
                />
              </div>
            </div>
          </PaperCard>
        ))}
      </div>
    </AdminPage>
  );
}
