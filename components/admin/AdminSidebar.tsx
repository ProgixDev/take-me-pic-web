"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, ShieldAlert, Camera, MessageSquare, MapPin, Award,
  CreditCard, Crown, Megaphone, Ticket as TicketIcon, Heart, Bell, BookOpen, BarChart3,
  LifeBuoy, ScrollText, Settings, Star,
} from "lucide-react";
import { cn } from "@/lib/cn";

const GROUPS: { title: string; items: { href: string; label: string; icon: React.ComponentType<{ size?: number }> }[] }[] = [
  {
    title: "pilotage",
    items: [
      { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    title: "gens",
    items: [
      { href: "/admin/users", label: "Utilisateurs", icon: Users },
      { href: "/admin/users/verification", label: "Vérifications", icon: Star },
      { href: "/admin/family", label: "Comptes famille", icon: Heart },
    ],
  },
  {
    title: "activité",
    items: [
      { href: "/admin/sessions", label: "Sessions photo", icon: Camera },
      { href: "/admin/requests", label: "Demandes", icon: MessageSquare },
      { href: "/admin/bookings", label: "Réservations", icon: TicketIcon },
    ],
  },
  {
    title: "communauté",
    items: [
      { href: "/admin/community/posts", label: "Publications", icon: MessageSquare },
      { href: "/admin/spots", label: "Spots photo", icon: MapPin },
      { href: "/admin/karma", label: "Karma & badges", icon: Award },
      { href: "/admin/moderation", label: "Modération", icon: ShieldAlert },
    ],
  },
  {
    title: "argent",
    items: [
      { href: "/admin/premium", label: "Abonnements", icon: Crown },
      { href: "/admin/sponsored", label: "Sponsorisé", icon: Megaphone },
      { href: "/admin/payments", label: "Paiements", icon: CreditCard },
    ],
  },
  {
    title: "contenu & support",
    items: [
      { href: "/admin/content/manual", label: "Le manuel", icon: BookOpen },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
      { href: "/admin/support", label: "Support", icon: LifeBuoy },
      { href: "/admin/audit-log", label: "Journal d'audit", icon: ScrollText },
      { href: "/admin/settings", label: "Réglages", icon: Settings },
    ],
  },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <aside className="w-64 shrink-0 bg-bg-1 text-paper-warm paper paper-dark h-full overflow-y-auto">
      <div className="px-5 py-5 sticky top-0 bg-bg-1/95 backdrop-blur z-10 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2.5" onClick={onNavigate}>
          <span className="grid place-items-center w-9 h-9 bg-gold-light text-ink font-[family-name:var(--font-serif)] font-extrabold rounded-[3px] -rotate-3">
            T
          </span>
          <div className="leading-tight">
            <div className="font-[family-name:var(--font-serif)] font-bold text-[17px]">Take Me Pic</div>
            <div className="font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.16em] text-gold-light/70">
              salle des cartes
            </div>
          </div>
        </Link>
      </div>

      <nav className="px-3 py-4">
        {GROUPS.map((g) => (
          <div key={g.title} className="mb-5">
            <div className="px-2 font-[family-name:var(--font-type)] text-[9px] uppercase tracking-[0.16em] text-gold-light/50 mb-2">
              {g.title}
            </div>
            <ul className="space-y-0.5">
              {g.items.map((it) => {
                const active = pathname === it.href || (it.href !== "/admin" && pathname.startsWith(it.href));
                const Icon = it.icon;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 px-2.5 py-2 rounded-[4px] font-[family-name:var(--font-serif)] text-[14px] transition",
                        active
                          ? "bg-gold-light text-ink font-semibold"
                          : "text-paper-warm/70 hover:bg-white/5 hover:text-paper-warm"
                      )}
                    >
                      <Icon size={17} />
                      {it.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
