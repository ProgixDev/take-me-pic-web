"use client";

/**
 * Client-side i18n provider for the marketing site.
 *
 * - Auto-detects the browser language on first visit (navigator.languages),
 *   falling back to French.
 * - Persists the user's explicit choice in localStorage.
 * - Sets <html lang> and <html dir> so Arabic renders right-to-left.
 * - Exposes `useT()` returning a `t(frenchSource, vars?)` translator that looks
 *   up the active dictionary and falls back to the French source string.
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  DEFAULT_LOCALE,
  STORAGE_KEY,
  isRTL,
  normalizeLocale,
  type Locale,
} from "./config";
import { TRANSLATIONS } from "./dictionaries/translations";

type Translator = (source: string, vars?: Record<string, string | number>) => string;

interface I18nContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: Translator;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextValue | null>(null);

function interpolate(value: string, vars?: Record<string, string | number>): string {
  if (!vars) return value;
  return value.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{{${key}}}`
  );
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Start from the server-rendered default (fr) to keep hydration stable, then
  // resolve the real preference on the client in an effect.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    let resolved: Locale | null = null;
    try {
      resolved = normalizeLocale(localStorage.getItem(STORAGE_KEY));
    } catch {
      resolved = null;
    }
    if (!resolved) {
      const langs =
        typeof navigator !== "undefined"
          ? navigator.languages ?? [navigator.language]
          : [];
      for (const tag of langs) {
        const candidate = normalizeLocale(tag);
        if (candidate) {
          resolved = candidate;
          break;
        }
      }
    }
    if (resolved && resolved !== locale) setLocaleState(resolved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep <html lang/dir> in sync with the active locale.
  useEffect(() => {
    const html = document.documentElement;
    html.lang = locale;
    html.dir = isRTL(locale) ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — keep in-memory locale for this session */
    }
  }, []);

  const t = useCallback<Translator>(
    (source, vars) => {
      if (locale === "fr") return interpolate(source, vars);
      const entry = TRANSLATIONS[source];
      const translated = entry?.[locale] || source;
      return interpolate(translated, vars);
    },
    [locale]
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t, dir: isRTL(locale) ? "rtl" : "ltr" }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Safe fallback so a component used outside the provider still renders FR.
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: (s, vars) => interpolate(s, vars),
      dir: "ltr",
    };
  }
  return ctx;
}

/** Shorthand: const t = useT(); t("Bonjour"). */
export function useT(): Translator {
  return useI18n().t;
}
