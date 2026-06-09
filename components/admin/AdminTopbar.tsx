"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search, Menu, LogOut } from "lucide-react";
import { Avatar, useToast } from "@/components/ui";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

/** Admin topbar: breadcrumb slot, search, notifications, profile. */
export function AdminTopbar({
  title,
  onMenu,
}: {
  title?: string;
  onMenu?: () => void;
}) {
  const router = useRouter();
  const toast = useToast();
  async function logout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    toast.push("Déconnexion réussie. À bientôt ✦", "ok");
    router.replace("/login");
    router.refresh();
  }
  return (
    <header className="h-16 shrink-0 bg-paper/85 backdrop-blur border-b-[1.5px] border-[var(--ink-line)] flex items-center gap-4 px-5">
      <button className="lg:hidden grid place-items-center w-9 h-9 cursor-pointer" onClick={onMenu} aria-label="Menu">
        <Menu size={20} />
      </button>
      {title && (
        <h1 className="font-[family-name:var(--font-serif)] font-bold text-lg tracking-[-0.01em] hidden sm:block">
          {title}
        </h1>
      )}
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-card border-[1.5px] border-ink rounded-[4px] px-3 py-1.5 w-64">
          <Search size={15} className="text-ink-faded" />
          <input
            placeholder="rechercher partout…"
            className="bg-transparent outline-none w-full font-[family-name:var(--font-hand)] text-base placeholder:text-ink-faded"
          />
        </div>
        <Link
          href="/admin/notifications"
          className="relative grid place-items-center w-9 h-9 bg-card border-[1.5px] border-ink rounded-[4px] hover:bg-paper-warm transition"
        >
          <Bell size={17} />
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-stamp-red text-polaroid rounded-full text-[9px] grid place-items-center font-[family-name:var(--font-type)]">
            5
          </span>
        </Link>
        <Link href="/admin/profile" className="flex items-center gap-2 hover:opacity-80 transition">
          <Avatar src="https://i.pravatar.cc/100?img=47" size={34} ring />
          <div className="hidden sm:block leading-tight">
            <div className="font-[family-name:var(--font-serif)] font-semibold text-[13px]">Claire B.</div>
            <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.1em] text-ink-faded">
              admin
            </div>
          </div>
        </Link>
        <button
          onClick={logout}
          title="Se déconnecter"
          aria-label="Se déconnecter"
          className="grid place-items-center w-9 h-9 bg-card border-[1.5px] border-ink rounded-[4px] hover:bg-stamp-red hover:text-polaroid transition cursor-pointer"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
