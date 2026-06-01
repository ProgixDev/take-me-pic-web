"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useT } from "@/i18n/I18nProvider";

const NAV = [
  { href: "/how-it-works", label: "comment ça marche" },
  { href: "/features", label: "fonctions" },
  { href: "/spots-vitrine", label: "spots" },
  { href: "/pricing", label: "premium" },
  { href: "/blog", label: "le carnet" },
  { href: "/about", label: "à propos" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const t = useT();
  return (
    <header
      // Inline style: the layout's `.paper > *` rule pins every direct child to
      // position:relative; z-index:1, which would drop the sticky header (and
      // its language dropdown) behind the maps. Inline styles outrank that rule.
      style={{ position: "sticky", top: 0, zIndex: 1100 }}
      className="bg-paper/85 backdrop-blur-md border-b-[1.5px] border-[var(--ink-line)]"
    >
      <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="group">
          <Logo size={34} />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="font-[family-name:var(--font-hand)] text-[19px] text-ink-faded hover:text-ink transition relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-gold hover:after:w-full after:transition-all"
            >
              {t(n.label)}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/download">
            <Button size="sm" variant="ink">{t("télécharger l’app")}</Button>
          </Link>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <button
            className="grid place-items-center w-10 h-10 cursor-pointer"
            onClick={() => setOpen((o) => !o)}
            aria-label={t("Menu")}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 border-t border-[var(--ink-line)]",
          open ? "max-h-[420px]" : "max-h-0"
        )}
      >
        <div className="px-5 py-4 flex flex-col gap-3 bg-paper-warm">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="font-[family-name:var(--font-hand)] text-2xl text-ink"
            >
              {t(n.label)}
            </Link>
          ))}
          <div className="pt-2">
            <Link href="/download" onClick={() => setOpen(false)}>
              <Button variant="ink" full>{t("télécharger l’app")}</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
