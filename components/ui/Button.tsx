"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "ink" | "gold" | "paper" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  icon?: ReactNode;
  trailing?: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  ink: "bg-ink text-paper-warm shadow-[0_6px_14px_rgba(42,31,26,0.3)] hover:brightness-110",
  gold: "bg-gradient-to-b from-gold-light to-gold-deep text-ink shadow-[0_6px_14px_rgba(184,137,58,0.35)] hover:brightness-105 border-t border-white/40",
  paper: "bg-card text-ink border-[1.5px] border-ink shadow-ink-sm hover:-translate-x-px hover:-translate-y-px",
  ghost: "bg-transparent text-ink border-[1.5px] border-dashed border-[var(--ink-soft)] hover:bg-card/60",
  danger: "bg-stamp-red text-paper-warm shadow-[0_6px_14px_rgba(168,54,46,0.3)] hover:brightness-110",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-[52px] px-5 text-[15px]",
  lg: "h-[58px] px-7 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "ink", size = "md", full, icon, trailing, className, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[4px] font-[family-name:var(--font-serif)] font-semibold tracking-[-0.005em] transition-all duration-150 active:translate-y-px disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        VARIANTS[variant],
        SIZES[size],
        full && "w-full",
        className
      )}
      {...rest}
    >
      {icon}
      {children}
      {trailing}
    </button>
  );
});
