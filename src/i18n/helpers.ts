import {
  DEFAULT_LANGUAGE,
  getLanguageLocale,
  isLanguage,
} from "./languages.ts";
import type { Language } from "./types";

/** Prioridad: enlace compartido, elección guardada, navegador y español. */
export function pickInitialLanguage({
  queryLanguage,
  storedLanguage,
  browserLanguages = [],
}: {
  queryLanguage?: string | null;
  storedLanguage?: string | null;
  browserLanguages?: readonly string[];
}): Language {
  if (isLanguage(queryLanguage)) return queryLanguage;
  if (isLanguage(storedLanguage)) return storedLanguage;
  for (const preferred of browserLanguages) {
    const base = preferred.toLowerCase().split("-")[0];
    if (isLanguage(base)) return base;
  }
  return DEFAULT_LANGUAGE;
}

/** Sustituye parámetros sin HTML ni código ejecutable; también conserva el cero. */
export function formatMessage(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_match, key: string) => {
    if (
      !Object.hasOwn(values, key) ||
      values[key] === undefined ||
      values[key] === null
    ) {
      throw new Error("Missing translation parameter: " + key);
    }
    return String(values[key]);
  });
}

export function formatDate(
  language: Language,
  value: string,
  dateStyle: "long" | "medium" | "short" = "long",
): string {
  return new Intl.DateTimeFormat(getLanguageLocale(language), {
    dateStyle,
    timeZone: "UTC",
  }).format(new Date(value));
}

export function formatDateTime(language: Language, value: string): string {
  return new Intl.DateTimeFormat(getLanguageLocale(language), {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Madrid",
  }).format(new Date(value));
}
