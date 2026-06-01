"use client";

import Link from "next/link";
import { Stamp } from "@/components/ui";
import { Logo } from "./Logo";
import { useT } from "@/i18n/I18nProvider";

const COLS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "le produit",
    links: [
      { href: "/how-it-works", label: "comment ça marche" },
      { href: "/features", label: "fonctions" },
      { href: "/features/discover", label: "trouver quelqu'un" },
      { href: "/features/community", label: "la communauté" },
      { href: "/features/spots", label: "les spots" },
      { href: "/features/premium", label: "première classe" },
      { href: "/pricing", label: "tarifs" },
      { href: "/download", label: "télécharger" },
    ],
  },
  {
    title: "la maison",
    links: [
      { href: "/about", label: "à propos" },
      { href: "/about/story", label: "notre histoire" },
      { href: "/about/team", label: "l'équipe" },
      { href: "/careers", label: "on recrute" },
      { href: "/press", label: "presse" },
      { href: "/partners", label: "partenaires" },
      { href: "/ambassadors", label: "ambassadeurs" },
    ],
  },
  {
    title: "le carnet",
    links: [
      { href: "/blog", label: "articles" },
      { href: "/stories", label: "histoires" },
      { href: "/help", label: "centre d'aide" },
      { href: "/safety", label: "sécurité" },
      { href: "/community-guidelines", label: "charte" },
      { href: "/contact", label: "nous écrire" },
      { href: "/status", label: "état des services" },
    ],
  },
  {
    title: "légal",
    links: [
      { href: "/legal/terms", label: "conditions" },
      { href: "/legal/privacy", label: "confidentialité" },
      { href: "/legal/gdpr", label: "RGPD" },
      { href: "/legal/cookies", label: "cookies" },
      { href: "/sitemap-page", label: "plan du site" },
    ],
  },
];

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="bg-bg-1 text-paper-warm paper paper-dark mt-24">
      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <div className="mb-4 text-paper-warm">
              <Logo size={36} variant="dark" />
            </div>
            <p className="font-[family-name:var(--font-hand)] text-2xl text-gold-light leading-tight max-w-xs">
              {t("« on se prend en photo ? »")}
            </p>
            <p className="font-[family-name:var(--font-serif)] text-sm text-paper-warm/60 mt-4 max-w-xs leading-relaxed">
              {t("Une appli où les voyageurs photographient les voyageurs. Gratuit, humain, partout.")}
            </p>
            <div className="mt-6">
              <Stamp color="gold" size={64} fontSize={8} rotate={-6}>{`EST.\nMMXXVI\n★ ★ ★`}</Stamp>
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-[family-name:var(--font-type)] text-[11px] uppercase tracking-[0.14em] text-gold-light/80 mb-4">
                {t(col.title)}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="font-[family-name:var(--font-serif)] text-sm text-paper-warm/70 hover:text-gold-light transition"
                    >
                      {t(l.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.18em] text-paper-warm/40">
            {t("© MMXXVI Take Me Pic · fait pour les voyageurs")}
          </span>
          <div className="flex items-center gap-5">
            <span className="font-[family-name:var(--font-hand)] text-lg text-paper-warm/50">
              {t("Paris · Lisbonne · Marrakech ✦")}
            </span>
            <Link
              href="/login"
              className="font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.16em] text-paper-warm/35 hover:text-gold-light transition"
            >
              {t("espace admin")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
