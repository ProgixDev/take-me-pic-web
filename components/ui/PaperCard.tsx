import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface PaperCardProps extends HTMLAttributes<HTMLDivElement> {
  /** hard offset shadow color */
  shadow?: "ink" | "gold" | "red" | "blue" | "soft" | "none";
  /** slight rotation in degrees for the pinned-on-page look */
  tilt?: number;
  border?: boolean;
}

const SHADOWS = {
  ink: "shadow-ink",
  gold: "shadow-gold",
  red: "shadow-red",
  blue: "shadow-blue",
  soft: "shadow-soft",
  none: "",
};

/** Cream paper card — the workhorse surface across the whole UI. */
export function PaperCard({
  shadow = "soft",
  tilt,
  border = true,
  className,
  style,
  children,
  ...rest
}: PaperCardProps) {
  return (
    <div
      className={cn(
        "bg-card rounded-[4px]",
        border && "border-[1.5px] border-ink",
        SHADOWS[shadow],
        className
      )}
      style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
