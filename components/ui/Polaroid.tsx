import { cn } from "@/lib/cn";

interface PolaroidProps {
  src?: string;
  caption?: string;
  width?: number;
  height?: number;
  tilt?: number;
  captionSize?: number;
  className?: string;
  children?: React.ReactNode;
  /** dark photo well instead of an image */
  dark?: boolean;
}

/** Polaroid frame with optional handwritten caption. */
export function Polaroid({
  src,
  caption,
  width = 160,
  height,
  tilt = 0,
  captionSize = 16,
  className,
  children,
  dark,
}: PolaroidProps) {
  const photoH = height ?? width;
  return (
    <div
      className={cn("bg-polaroid shadow-polaroid relative", className)}
      style={{
        width,
        padding: caption ? "8px 8px 32px" : "8px 8px 10px",
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
      }}
    >
      <div
        className="w-full overflow-hidden bg-center bg-cover"
        style={{
          height: photoH,
          backgroundColor: dark ? "var(--color-ink)" : "#ddd",
          backgroundImage: src && !dark ? `url(${src})` : undefined,
        }}
      />
      {caption && (
        <div
          className="text-center text-ink font-[family-name:var(--font-hand)] mt-2 leading-tight"
          style={{ fontSize: captionSize }}
        >
          {caption}
        </div>
      )}
      {children}
    </div>
  );
}
