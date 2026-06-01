import { cn } from "@/lib/cn";

type StampColor = "red" | "blue" | "green" | "gold" | "ink" | "white";
type Shape = "circle" | "rect" | "octagon";

const COLORS: Record<StampColor, string> = {
  red: "border-stamp-red text-stamp-red",
  blue: "border-stamp-blue text-stamp-blue",
  green: "border-stamp-green text-stamp-green",
  gold: "border-gold-deep text-gold-deep",
  ink: "border-ink text-ink",
  white: "border-polaroid text-polaroid",
};

interface StampProps {
  children: React.ReactNode;
  color?: StampColor;
  shape?: Shape;
  size?: number;
  rotate?: number;
  fontSize?: number;
  className?: string;
  filled?: boolean;
}

/** Passport-style wax stamp. Circle by default; rect & octagon variants. */
export function Stamp({
  children,
  color = "red",
  shape = "circle",
  size = 72,
  rotate = -8,
  fontSize = 10,
  className,
  filled,
}: StampProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center border-[2.5px] text-center uppercase font-[family-name:var(--font-type)] tracking-[0.06em] leading-tight opacity-[0.85] select-none",
        COLORS[color],
        shape === "circle" && "rounded-full",
        shape === "rect" && "rounded-[4px]",
        shape === "octagon" && "rounded-[14px]",
        filled && "bg-current",
        className
      )}
      style={{
        width: size,
        height: shape === "rect" ? "auto" : size,
        minHeight: shape === "rect" ? undefined : size,
        fontSize,
        lineHeight: 1.15,
        padding: shape === "rect" ? "5px 10px" : 4,
        transform: `rotate(${rotate}deg)`,
        whiteSpace: "pre-line",
      }}
    >
      {children}
    </span>
  );
}
