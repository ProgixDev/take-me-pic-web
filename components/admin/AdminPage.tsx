import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** Standard admin content wrapper: breadcrumb + title row + actions + body. */
export function AdminPage({
  title,
  eyebrow,
  breadcrumb,
  actions,
  children,
}: {
  title: string;
  eyebrow?: string;
  breadcrumb?: { href?: string; label: string }[];
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-6 md:px-8 md:py-8">
      {breadcrumb && (
        <nav className="flex items-center gap-1.5 font-[family-name:var(--font-type)] text-[10px] uppercase tracking-[0.1em] text-ink-faded mb-3 flex-wrap">
          {breadcrumb.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {b.href ? (
                <Link href={b.href} className="hover:text-ink transition">{b.label}</Link>
              ) : (
                <span className="text-ink">{b.label}</span>
              )}
              {i < breadcrumb.length - 1 && <ChevronRight size={11} className="opacity-50" />}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          {eyebrow && (
            <div className="font-[family-name:var(--font-hand)] text-xl text-gold-deep -rotate-1">{eyebrow}</div>
          )}
          <h1 className="font-[family-name:var(--font-serif)] font-bold text-[28px] tracking-[-0.02em] leading-none mt-0.5">
            {title}
          </h1>
        </div>
        {actions && <div className="flex items-center gap-2.5">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
