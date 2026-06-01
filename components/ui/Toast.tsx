"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { Check, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";

type Toast = { id: number; msg: string; tone: "ok" | "info" | "err" };
type Ctx = { push: (msg: string, tone?: Toast["tone"]) => void };

const ToastCtx = createContext<Ctx | null>(null);

/** Wrap a subtree to get `useToast().push(...)`. Mounted in admin + marketing layouts. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((msg: string, tone: Toast["tone"] = "ok") => {
    const id = Date.now() + Math.floor(performance.now());
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-2.5 px-4 py-3 rounded-[4px] border-[1.5px] shadow-ink-sm bg-card animate-fade-up font-[family-name:var(--font-serif)] text-sm",
              t.tone === "ok" && "border-stamp-green",
              t.tone === "info" && "border-stamp-blue",
              t.tone === "err" && "border-stamp-red"
            )}
          >
            <span
              className={cn(
                "grid place-items-center w-5 h-5 rounded-full text-polaroid",
                t.tone === "ok" && "bg-stamp-green",
                t.tone === "info" && "bg-stamp-blue",
                t.tone === "err" && "bg-stamp-red"
              )}
            >
              {t.tone === "err" ? <X size={12} /> : t.tone === "info" ? <Info size={12} /> : <Check size={12} />}
            </span>
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  // Fallback no-op so components work even outside a provider during isolated dev.
  return ctx ?? { push: () => {} };
}
