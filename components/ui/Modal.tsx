"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  /** stamp text shown rotated in the corner */
  stampLabel?: string;
}

const SIZES = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

/** Paper-sheet modal with a torn-note feel. Closes on backdrop / Esc. */
export function Modal({ open, onClose, title, children, footer, size = "md" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-bg-2/55 backdrop-blur-[2px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full bg-card border-[1.5px] border-ink shadow-ink rounded-[4px] paper animate-fade-up max-h-[88vh] flex flex-col",
          SIZES[size]
        )}
      >
        {title && (
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b-[1.5px] border-dashed border-[var(--ink-line)]">
            <h3 className="font-[family-name:var(--font-serif)] font-bold text-xl tracking-[-0.01em]">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="grid place-items-center w-8 h-8 rounded hover:bg-paper-2 transition cursor-pointer"
              aria-label="Fermer"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="px-5 py-4 overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-5 py-4 border-t-[1.5px] border-dashed border-[var(--ink-line)] flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
