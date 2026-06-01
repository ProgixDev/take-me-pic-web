"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { LOCALES, LOCALE_LABELS } from "@/i18n/config";
import { cn } from "@/lib/cn";

/**
 * FR / EN / ES / AR language switcher. Used in the site header (and mobile menu).
 * Persists the choice via the i18n provider.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Language"
        className="flex items-center gap-1.5 h-9 px-2.5 rounded-[3px] border border-[var(--ink-line)] bg-card/60 hover:bg-card transition font-[family-name:var(--font-type)] text-[12px] uppercase tracking-[0.08em] text-ink cursor-pointer"
      >
        <Globe size={14} className="text-ink-faded" />
        {LOCALE_LABELS[locale].short}
      </button>

      {open && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-44 z-[1200] bg-card border border-[var(--ink-line)] rounded-[4px] shadow-ink-sm overflow-hidden py-1">
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setLocale(l);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 text-left rtl:text-right hover:bg-paper-warm transition cursor-pointer",
                l === locale && "bg-paper-warm/60"
              )}
            >
              <span className="text-[15px]">{LOCALE_LABELS[l].flag}</span>
              <span className="flex-1 font-[family-name:var(--font-serif)] text-[14px] text-ink">
                {LOCALE_LABELS[l].name}
              </span>
              {l === locale && <Check size={14} className="text-gold-deep" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
