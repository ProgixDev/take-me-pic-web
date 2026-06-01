import { cn } from "@/lib/cn";

type TapeColor = "cream" | "red" | "blue";

const COLORS: Record<TapeColor, string> = {
  cream: "linear-gradient(180deg, rgba(232,217,170,0.85), rgba(214,194,138,0.75))",
  red: "linear-gradient(180deg, rgba(217,165,140,0.7), rgba(199,132,108,0.65))",
  blue: "linear-gradient(180deg, rgba(170,200,220,0.7), rgba(140,180,205,0.65))",
};

/** Strip of masking tape — decorative, position it absolutely over a corner. */
export function Tape({
  color = "cream",
  width = 60,
  height = 22,
  rotate = 0,
  className,
  style,
}: {
  color?: TapeColor;
  width?: number;
  height?: number;
  rotate?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn(
        "block border-x border-dashed border-white/40 shadow-[0_2px_4px_rgba(0,0,0,0.08)]",
        className
      )}
      style={{
        width,
        height,
        background: COLORS[color],
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    />
  );
}
