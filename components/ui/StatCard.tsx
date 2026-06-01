import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** KPI tile for admin dashboards. */
export function StatCard({
  label,
  value,
  delta,
  icon,
  tone = "ink",
  className,
}: {
  label: string;
  value: ReactNode;
  delta?: string;
  icon?: ReactNode;
  tone?: "ink" | "gold" | "green" | "red" | "blue";
  className?: string;
}) {
  const accent = {
    ink: "text-ink",
    gold: "text-gold-deep",
    green: "text-stamp-green",
    red: "text-stamp-red",
    blue: "text-stamp-blue",
  }[tone];
  const up = delta?.trim().startsWith("+");
  return (
    <div className={cn("bg-card border-[1.5px] border-ink rounded-[4px] p-4 shadow-ink-sm", className)}>
      <div className="flex items-start justify-between">
        <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.12em] text-ink-faded">
          {label}
        </span>
        {icon && <span className={accent}>{icon}</span>}
      </div>
      <div className={cn("font-[family-name:var(--font-serif)] font-extrabold text-[34px] leading-none mt-2", accent)}>
        {value}
      </div>
      {delta && (
        <div
          className={cn(
            "font-[family-name:var(--font-hand)] text-base mt-1",
            up ? "text-stamp-green" : "text-stamp-red"
          )}
        >
          {delta}
        </div>
      )}
    </div>
  );
}
