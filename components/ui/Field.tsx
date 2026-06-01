"use client";

import { cn } from "@/lib/cn";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const labelCls = "font-[family-name:var(--font-hand)] text-lg text-ink-2 mb-1 block pl-1";
const baseCls =
  "w-full bg-card border-[1.5px] border-ink rounded-[4px] px-3.5 py-2.5 font-[family-name:var(--font-serif)] text-[15px] text-ink outline-none focus:shadow-ink-sm transition";

export function Input({
  label,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="block mb-3.5">
      {label && <span className={labelCls}>{label}</span>}
      <input className={cn(baseCls, className)} {...rest} />
    </label>
  );
}

export function Textarea({
  label,
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="block mb-3.5">
      {label && <span className={labelCls}>{label}</span>}
      <textarea className={cn(baseCls, "min-h-24 resize-y", className)} {...rest} />
    </label>
  );
}

export function Select({
  label,
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <label className="block mb-3.5">
      {label && <span className={labelCls}>{label}</span>}
      <select className={cn(baseCls, "cursor-pointer", className)} {...rest}>
        {children}
      </select>
    </label>
  );
}
