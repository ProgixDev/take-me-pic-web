"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/** Handwritten "chapter" eyebrow + serif title used across marketing & admin. */
export function SectionHeading({
  eyebrow,
  title,
  highlight,
  sub,
  center,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  highlight?: string;
  sub?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(center && "text-center", className)}>
      {eyebrow && (
        <div className="font-[family-name:var(--font-hand)] text-2xl text-gold-deep -rotate-2">
          {eyebrow}
        </div>
      )}
      <h2 className="font-[family-name:var(--font-serif)] font-bold text-[clamp(28px,4vw,44px)] tracking-[-0.02em] leading-[1.05] mt-1">
        {title} {highlight && <span className="squiggle">{highlight}</span>}
      </h2>
      {sub && (
        <p className="font-[family-name:var(--font-serif)] italic text-ink-faded text-[15px] mt-3 max-w-2xl leading-relaxed [text-align:inherit] mx-auto">
          {sub}
        </p>
      )}
    </div>
  );
}

/** Pill tab switcher (chip styled). */
export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { key: string; label: string }[];
  value: string;
  onChange: (k: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-2 flex-wrap", className)}>
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={cn(
            "px-3 py-1.5 rounded-[4px] border-[1.5px] font-[family-name:var(--font-serif)] text-[13px] font-semibold transition cursor-pointer",
            value === t.key
              ? "bg-ink text-paper-warm border-ink"
              : "bg-card border-ink text-ink hover:bg-paper-warm"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/** iOS-style switch with ink track + gold knob. */
export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-[54px] h-[30px] rounded-full transition-colors cursor-pointer shrink-0",
        checked ? "bg-ink" : "bg-[rgba(42,31,26,0.18)]"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 w-[26px] h-[26px] rounded-full shadow transition-all",
          checked ? "left-[26px] bg-gold-light" : "left-0.5 bg-card"
        )}
      />
    </button>
  );
}

/** Uncontrolled toggle that keeps its own state (handy for settings demos). */
export function ToggleField({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return <Toggle checked={on} onChange={setOn} />;
}
