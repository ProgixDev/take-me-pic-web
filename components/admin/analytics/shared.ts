import type { HourlyPoint, MonthlyPoint, WeekdayPoint } from "@/lib/admin/analytics";

export const PALETTE = {
  gold: "#b8893a",
  ink: "#2a1f1a",
  blue: "#2a4f76",
  green: "#3f6b3f",
  red: "#a8362e",
  sunset: "#d77032",
};

export const CHART_TOOLTIP_STYLE = {
  background: "#fbf6e9",
  border: "1.5px solid #2a1f1a",
  borderRadius: 4,
  fontSize: 12,
} as const;

export const AXIS_TICK = { fontSize: 11, fill: "#6e5d4e", fontFamily: "var(--font-type)" } as const;
export const AXIS_TICK_SM = { fontSize: 10, fill: "#6e5d4e", fontFamily: "var(--font-type)" } as const;

const MONTH_LABELS = [
  "jan.", "fév.", "mars", "avr.", "mai", "juin",
  "juil.", "août", "sept.", "oct.", "nov.", "déc.",
];

// "2026-06" → "juin"
export function monthLabel(month: string) {
  const part = Number(month.split("-")[1]);
  return MONTH_LABELS[part - 1] ?? month;
}

export function withMonthLabels(monthly: MonthlyPoint[]) {
  return monthly.map((m) => ({ ...m, m: monthLabel(m.month) }));
}

const WEEKDAY_LABELS = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];

// Fill missing isodow buckets with zeros so the bar chart always shows 7 days.
export function weekdaySeries(weekday: WeekdayPoint[]) {
  return WEEKDAY_LABELS.map((day, i) => ({
    day,
    value: weekday.find((w) => w.dow === i + 1)?.requests ?? 0,
  }));
}

// Fill 0–23h buckets with zeros.
export function hourlySeries(hourly: HourlyPoint[]) {
  return Array.from({ length: 24 }, (_, hour) => ({
    h: `${hour}h`,
    v: hourly.find((p) => p.hour === hour)?.requests ?? 0,
  }));
}

export function fmtEurCents(cents: number) {
  return (cents / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  });
}
