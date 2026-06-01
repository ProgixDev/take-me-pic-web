"use client";

import { useState } from "react";
import { Save, CheckCircle2, ArrowRight } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  Button,
  PaperCard,
  Stamp,
  Input,
  Textarea,
  Toggle,
  StatCard,
  useToast,
} from "@/components/ui";
import { plans, fmtNum } from "@/lib/data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface EditablePlan {
  id: string;
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string;
  active: boolean;
  highlight: boolean;
}

const FUNNEL_DATA = [
  { name: "Visiteurs page prix", value: 12400 },
  { name: "Clics sur l'essai", value: 5800 },
  { name: "Essais démarrés", value: 3200 },
  { name: "Convertis (payants)", value: 1560 },
  { name: "Renouvelés au mois 2", value: 1180 },
];

const FUNNEL_COLORS = ["#b8893a", "#b8893a", "#b8893a", "#2a5c8a", "#2a8a42"];

export default function PlansPage() {
  const toast = useToast();

  const [editablePlans, setEditablePlans] = useState<EditablePlan[]>(
    plans.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      period: p.period,
      tagline: p.tagline,
      features: p.features.join("\n"),
      active: true,
      highlight: p.highlight,
    }))
  );

  function updatePlan(id: string, field: keyof EditablePlan, value: string | boolean) {
    setEditablePlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }

  const PLAN_SHADOWS: ("soft" | "gold" | "blue")[] = ["soft", "soft", "gold"];
  const PLAN_STAMP_COLORS: ("ink" | "gold" | "blue")[] = ["ink", "blue", "gold"];

  return (
    <AdminPage
      title="Éditeur de formules"
      eyebrow="gestion des plans ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/premium", label: "Premium" },
        { label: "Formules" },
      ]}
      actions={
        <Button
          variant="gold"
          size="sm"
          icon={<Save size={15} />}
          onClick={() => toast.push("Formules enregistrées avec succès !", "ok")}
        >
          Enregistrer tout
        </Button>
      }
    >
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Plan Carnet" value="Gratuit" delta="base" icon={<CheckCircle2 size={18} />} tone="ink" />
        <StatCard label="Mensuel" value="4,99 €" delta="/ mois" icon={<CheckCircle2 size={18} />} tone="blue" />
        <StatCard label="Annuel" value="39,99 €" delta="/ an · -33 %" icon={<CheckCircle2 size={18} />} tone="gold" />
        <StatCard label="Abonnés actifs" value={fmtNum(12)} delta="+21,0 %" icon={<ArrowRight size={18} />} tone="green" />
      </div>

      {/* Editable plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {editablePlans.map((plan, idx) => (
          <PaperCard key={plan.id} shadow={PLAN_SHADOWS[idx]} className="p-5 relative">
            {plan.highlight && (
              <Stamp
                color={PLAN_STAMP_COLORS[idx]}
                shape="circle"
                size={56}
                rotate={-8}
                fontSize={8}
                className="absolute -top-3 -right-3"
              >
                {"MEILLEUR\nCHOIX"}
              </Stamp>
            )}

            {/* Active toggle */}
            <div className="flex items-center justify-between mb-4">
              <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
                Formule active
              </span>
              <Toggle
                checked={plan.active}
                onChange={(v) => updatePlan(plan.id, "active", v)}
              />
            </div>

            {/* Plan name */}
            <div className="mb-3">
              <label className="font-[family-name:var(--font-hand)] text-lg text-ink-2 mb-1 block pl-1">
                Nom de la formule
              </label>
              <input
                value={plan.name}
                onChange={(e) => updatePlan(plan.id, "name", e.target.value)}
                className="w-full bg-card border-[1.5px] border-ink rounded-[4px] px-3.5 py-2.5 font-[family-name:var(--font-serif)] text-[15px] text-ink outline-none focus:shadow-ink-sm transition"
              />
            </div>

            {/* Price */}
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <label className="font-[family-name:var(--font-hand)] text-lg text-ink-2 mb-1 block pl-1">
                  Prix
                </label>
                <input
                  value={plan.price}
                  onChange={(e) => updatePlan(plan.id, "price", e.target.value)}
                  className="w-full bg-card border-[1.5px] border-ink rounded-[4px] px-3.5 py-2.5 font-[family-name:var(--font-mono)] text-[15px] text-gold-deep outline-none focus:shadow-ink-sm transition"
                />
              </div>
              <div className="flex-1">
                <label className="font-[family-name:var(--font-hand)] text-lg text-ink-2 mb-1 block pl-1">
                  Période
                </label>
                <input
                  value={plan.period}
                  onChange={(e) => updatePlan(plan.id, "period", e.target.value)}
                  className="w-full bg-card border-[1.5px] border-ink rounded-[4px] px-3.5 py-2.5 font-[family-name:var(--font-serif)] text-[15px] text-ink-faded outline-none focus:shadow-ink-sm transition"
                />
              </div>
            </div>

            {/* Tagline */}
            <div className="mb-3">
              <label className="font-[family-name:var(--font-hand)] text-lg text-ink-2 mb-1 block pl-1">
                Tagline
              </label>
              <input
                value={plan.tagline}
                onChange={(e) => updatePlan(plan.id, "tagline", e.target.value)}
                className="w-full bg-card border-[1.5px] border-ink rounded-[4px] px-3.5 py-2.5 font-[family-name:var(--font-serif)] italic text-[14px] text-ink-faded outline-none focus:shadow-ink-sm transition"
              />
            </div>

            {/* Features */}
            <div className="mb-4">
              <label className="font-[family-name:var(--font-hand)] text-lg text-ink-2 mb-1 block pl-1">
                Fonctionnalités (une par ligne)
              </label>
              <textarea
                value={plan.features}
                rows={5}
                onChange={(e) => updatePlan(plan.id, "features", e.target.value)}
                className="w-full bg-card border-[1.5px] border-ink rounded-[4px] px-3.5 py-2.5 font-[family-name:var(--font-serif)] text-[13px] text-ink outline-none focus:shadow-ink-sm transition resize-y min-h-24"
              />
            </div>

            {/* Highlight toggle */}
            <div className="flex items-center justify-between pt-3 border-t border-dashed border-[var(--ink-line)]">
              <span className="font-[family-name:var(--font-hand)] text-[16px] text-ink-faded">
                Mise en avant
              </span>
              <Toggle
                checked={plan.highlight}
                onChange={(v) => updatePlan(plan.id, "highlight", v)}
              />
            </div>

            {/* Save individual */}
            <Button
              variant="ink"
              size="sm"
              full
              icon={<Save size={14} />}
              className="mt-4"
              onClick={() =>
                toast.push(`Formule « ${plan.name} » sauvegardée !`, "ok")
              }
            >
              Enregistrer cette formule
            </Button>
          </PaperCard>
        ))}
      </div>

      {/* Conversion funnel */}
      <PaperCard shadow="soft" className="p-5">
        <div className="mb-5">
          <div className="font-[family-name:var(--font-hand)] text-[22px] text-gold-deep -rotate-1">
            entonnoir de conversion
          </div>
          <h2 className="font-[family-name:var(--font-serif)] font-bold text-[20px] mt-0.5">
            Tunnel Premium — mai 2026
          </h2>
        </div>
        <div className="flex flex-col gap-2 mb-6">
          {FUNNEL_DATA.map((step, i) => {
            const pct = Math.round((step.value / FUNNEL_DATA[0].value) * 100);
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-44 font-[family-name:var(--font-serif)] text-[13px] text-ink-faded text-right shrink-0">
                  {step.name}
                </div>
                <div className="flex-1 bg-paper-warm border border-[var(--ink-line)] rounded-sm h-7 overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: FUNNEL_COLORS[i],
                      opacity: 0.8,
                    }}
                  />
                </div>
                <div className="w-20 font-[family-name:var(--font-mono)] text-[13px] font-semibold text-ink">
                  {step.value.toLocaleString("fr-FR")}
                </div>
                <div className="w-12 font-[family-name:var(--font-mono)] text-[11px] text-ink-faded">
                  {pct} %
                </div>
              </div>
            );
          })}
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={FUNNEL_DATA} layout="vertical" margin={{ left: 170, right: 20, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ink-line)" />
              <XAxis type="number" tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fontFamily: "var(--font-serif)" }} width={160} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1.5px solid var(--color-ink)",
                  borderRadius: 4,
                  fontFamily: "var(--font-serif)",
                }}
              />
              <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                {FUNNEL_DATA.map((_, i) => (
                  <Cell key={i} fill={FUNNEL_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </PaperCard>
    </AdminPage>
  );
}
