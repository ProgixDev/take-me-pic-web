/**
 * i18n configuration for the public marketing site.
 *
 * Strategy: French is the source language and doubles as the lookup key.
 * Components keep their readable French text and pass it through `t("…")`;
 * the en/es/ar dictionaries map that French source string to a translation.
 * If a key is missing from a dictionary, `t` returns the French source — so
 * the site never shows a raw key and French always renders.
 */

export const LOCALES = ["fr", "en", "es", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

/** Locales rendered right-to-left. */
export const RTL_LOCALES: Locale[] = ["ar"];

/** Labels shown in the language switcher. */
export const LOCALE_LABELS: Record<Locale, { short: string; name: string; flag: string }> = {
  fr: { short: "FR", name: "Français", flag: "🇫🇷" },
  en: { short: "EN", name: "English", flag: "🇬🇧" },
  es: { short: "ES", name: "Español", flag: "🇪🇸" },
  ar: { short: "AR", name: "العربية", flag: "🇸🇦" },
};

export const STORAGE_KEY = "tmp.locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function isRTL(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

/** Map a raw browser language tag (e.g. "en-US", "ar") to a supported locale. */
export function normalizeLocale(tag: string | undefined | null): Locale | null {
  if (!tag) return null;
  const base = tag.toLowerCase().split("-")[0];
  return isLocale(base) ? base : null;
}
