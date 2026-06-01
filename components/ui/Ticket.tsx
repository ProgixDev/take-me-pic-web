import { cn } from "@/lib/cn";

interface TicketProps {
  children: React.ReactNode;
  className?: string;
  /** color of the page behind the perforations */
  notch?: string;
  dark?: boolean;
}

/** Paper ticket with side perforations (booking / boarding pass look). */
export function Ticket({ children, className, notch = "var(--color-paper)", dark }: TicketProps) {
  return (
    <div
      className={cn(
        "relative rounded-[4px] shadow-soft",
        dark ? "bg-ink text-paper-warm" : "bg-card",
        className
      )}
    >
      <span
        className="absolute top-1/2 -translate-y-1/2 -left-[7px] w-3.5 h-3.5 rounded-full"
        style={{ background: notch }}
      />
      <span
        className="absolute top-1/2 -translate-y-1/2 -right-[7px] w-3.5 h-3.5 rounded-full"
        style={{ background: notch }}
      />
      {children}
    </div>
  );
}
