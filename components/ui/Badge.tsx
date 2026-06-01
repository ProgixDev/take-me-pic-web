import { cn } from "@/lib/cn";

type Tone = "neutral" | "green" | "red" | "blue" | "gold" | "sunset";

const TONES: Record<Tone, string> = {
  neutral: "bg-paper-2 text-ink-faded border-[var(--ink-line)]",
  green: "bg-stamp-green/12 text-stamp-green border-stamp-green/40",
  red: "bg-stamp-red/12 text-stamp-red border-stamp-red/40",
  blue: "bg-stamp-blue/12 text-stamp-blue border-stamp-blue/40",
  gold: "bg-gold-light/20 text-gold-deep border-gold-deep/40",
  sunset: "bg-sunset/12 text-sunset border-sunset/40",
};

/** Status badge for admin tables (active / pending / banned, etc.). */
export function Badge({
  children,
  tone = "neutral",
  className,
  dot,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-[family-name:var(--font-type)] uppercase tracking-[0.08em]",
        TONES[tone],
        className
      )}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
