import { cn } from "@/lib/cn";

type ChipColor = "ink" | "gold" | "red" | "blue" | "green";
type ChipVariant = "outline" | "filled" | "dashed";

const COLORS: Record<ChipColor, { border: string; text: string; fill: string }> = {
  ink: { border: "border-ink", text: "text-ink", fill: "bg-ink text-paper-warm" },
  gold: { border: "border-gold-deep", text: "text-gold-deep", fill: "bg-gold-deep text-paper-warm" },
  red: { border: "border-stamp-red", text: "text-stamp-red", fill: "bg-stamp-red text-paper-warm" },
  blue: { border: "border-stamp-blue", text: "text-stamp-blue", fill: "bg-stamp-blue text-paper-warm" },
  green: { border: "border-stamp-green", text: "text-stamp-green", fill: "bg-stamp-green text-paper-warm" },
};

interface ChipProps {
  children: React.ReactNode;
  color?: ChipColor;
  variant?: ChipVariant;
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
  mono?: boolean;
}

/** Small tag / pill — handwritten by default; mono for stat chips. */
export function Chip({
  children,
  color = "ink",
  variant = "outline",
  size = "md",
  className,
  onClick,
  mono,
}: ChipProps) {
  const c = COLORS[color];
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[4px] border-[1.5px] leading-none",
        size === "sm" ? "px-2 py-1 text-[13px]" : "px-2.5 py-1.5 text-[15px]",
        mono ? "font-[family-name:var(--font-type)]" : "font-[family-name:var(--font-hand)] font-medium",
        variant === "filled" ? c.fill : "bg-card",
        variant !== "filled" && [c.border, c.text],
        variant === "dashed" && "border-dashed bg-transparent",
        onClick && "cursor-pointer transition hover:brightness-95",
        className
      )}
    >
      {children}
    </Tag>
  );
}
