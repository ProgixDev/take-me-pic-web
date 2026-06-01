import { cn } from "@/lib/cn";

export function Avatar({
  src,
  size = 40,
  online,
  className,
  ring,
}: {
  src?: string;
  size?: number;
  online?: boolean;
  className?: string;
  ring?: boolean;
}) {
  return (
    <span className={cn("relative inline-block shrink-0", className)} style={{ width: size, height: size }}>
      <span
        className={cn("block rounded-full bg-center bg-cover bg-kraft", ring && "ring-2 ring-gold-deep")}
        style={{ width: size, height: size, backgroundImage: src ? `url(${src})` : undefined }}
      />
      {online && (
        <span className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-stamp-green border-2 border-polaroid" />
      )}
    </span>
  );
}
