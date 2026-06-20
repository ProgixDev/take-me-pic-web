"use client";

import { AdminPage } from "@/components/admin/AdminPage";
import { PaperCard, StatCard } from "@/components/ui";
import type { RetentionModel } from "@/lib/admin/retention";

function valueAt(points: { week: string; value: number }[], week: string): number {
  return points.find((p) => p.week === week)?.value ?? 0;
}

function retentionColor(v: number): string {
  if (v >= 80) return "bg-stamp-green/80 text-paper-warm";
  if (v >= 60) return "bg-stamp-green/40 text-ink";
  if (v >= 40) return "bg-gold-light/60 text-ink";
  if (v >= 25) return "bg-sunset/40 text-ink";
  if (v > 0) return "bg-stamp-red/30 text-stamp-red";
  return "bg-paper-warm text-ink-faded";
}

export function RetentionClient({ model }: { model: RetentionModel }) {
  const { curve, cohorts } = model;
  const weekLabels = curve.map((p) => p.week);

  const week1 = valueAt(curve, "S1");
  const week4 = valueAt(curve, "S4");
  const week12 = valueAt(curve, "S12");
  const churn = (100 - week4).toFixed(0);

  return (
    <AdminPage
      title="Rétention"
      eyebrow="fidélité & engagement long terme ✦"
      breadcrumb={[
        { href: "/admin", label: "Admin" },
        { href: "/admin/analytics", label: "Analytics" },
        { label: "Rétention" },
      ]}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Semaine 1" value={`${week1}%`} />
        <StatCard label="Semaine 4" value={`${week4}%`} tone="gold" />
        <StatCard label="Semaine 12" value={`${week12}%`} tone="green" />
        <StatCard label="Churn (S4)" value={`${churn}%`} tone="red" />
      </div>

      {/* Overall curve */}
      <PaperCard shadow="ink" className="p-5 mb-6">
        <h2 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-4">Courbe de rétention globale</h2>
        {curve.length === 0 ? (
          <p className="font-[family-name:var(--font-hand)] text-ink-faded py-8 text-center">Pas encore de données.</p>
        ) : (
          <div className="flex items-end gap-2 h-40">
            {curve.map((p) => (
              <div key={p.week} className="flex-1 flex flex-col items-center justify-end gap-1">
                <span className="font-[family-name:var(--font-type)] text-[10px] text-ink-faded">{p.value}%</span>
                <div className="w-full bg-ink/80 rounded-t-[3px]" style={{ height: `${Math.max(2, p.value)}%` }} />
                <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded">{p.week}</span>
              </div>
            ))}
          </div>
        )}
      </PaperCard>

      {/* Cohort heatmap */}
      <PaperCard shadow="ink" className="p-5">
        <h2 className="font-[family-name:var(--font-serif)] font-bold text-lg mb-1">Cohortes mensuelles</h2>
        <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[12px] mb-4">
          % d&apos;utilisateurs actifs (demande, message, publication ou note) par semaine après inscription.
        </p>
        {cohorts.length === 0 ? (
          <p className="font-[family-name:var(--font-hand)] text-ink-faded py-8 text-center">Pas encore de cohortes.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr>
                  <th className="text-left font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded p-2">Cohorte</th>
                  <th className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded p-2">Taille</th>
                  {weekLabels.map((w) => (
                    <th key={w} className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-widest text-ink-faded p-2">{w}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohorts.map((c) => (
                  <tr key={c.label}>
                    <td className="text-left font-[family-name:var(--font-serif)] font-semibold p-2">{c.label}</td>
                    <td className="font-[family-name:var(--font-serif)] text-ink-faded p-2">{c.size}</td>
                    {weekLabels.map((w) => {
                      const v = valueAt(c.points, w);
                      return (
                        <td key={w} className="p-1">
                          <div className={`rounded-[3px] py-2 font-[family-name:var(--font-serif)] font-bold text-[12px] ${retentionColor(v)}`}>
                            {v}%
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PaperCard>
    </AdminPage>
  );
}
