"use client";

import { useState } from "react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { ToastProvider } from "@/components/ui";
import { cn } from "@/lib/cn";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="h-screen flex overflow-hidden paper bg-paper">
        <div className="hidden lg:block h-full">
          <AdminSidebar />
        </div>

        <div
          className={cn(
            "lg:hidden fixed inset-0 z-[80] transition",
            open ? "pointer-events-auto" : "pointer-events-none",
          )}
        >
          <div
            className={cn(
              "absolute inset-0 bg-bg-2/50 transition-opacity",
              open ? "opacity-100" : "opacity-0",
            )}
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              "absolute left-0 top-0 h-full transition-transform duration-300",
              open ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <AdminSidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 h-full">
          <AdminTopbar onMenu={() => setOpen(true)} />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </ToastProvider>
  );
}
