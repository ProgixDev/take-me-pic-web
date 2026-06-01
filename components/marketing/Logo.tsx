import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Brand logo lockup: the Take Me Pic pin/aperture icon + wordmark.
 * `variant="dark"` uses the cream icon for dark surfaces (footer).
 */
export function Logo({
  size = 36,
  variant = "light",
  withWordmark = true,
  className,
}: {
  size?: number;
  variant?: "light" | "dark";
  withWordmark?: boolean;
  className?: string;
}) {
  const src =
    variant === "dark"
      ? "/brand/take-me-pic-icon-transparent-dark.svg"
      : "/brand/take-me-pic-icon-transparent.svg";
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Image
        src={src}
        alt="Take Me Pic"
        width={size}
        height={size}
        unoptimized
        className="-rotate-3 group-hover:rotate-0 transition-transform"
      />
      {withWordmark && (
        <span className="font-[family-name:var(--font-serif)] font-bold text-xl tracking-[-0.02em]">
          Take Me Pic
        </span>
      )}
    </span>
  );
}
