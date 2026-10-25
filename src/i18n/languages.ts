import type { Language } from "./types";
export const DEFAULT_LANGUAGE: Language = "es";
export const LANGUAGE_STORAGE_KEY = "nicolas-rosas.language";
export const LANGUAGE_OPTIONS = [
  { code: "es", label: "Español", shortLabel: "ES", locale: "es-AR" },
  { code: "en", label: "English", shortLabel: "EN", locale: "en-GB" },
  { code: "pt", label: "Português", shortLabel: "PT", locale: "pt-PT" },
  { code: "it", label: "Italiano", shortLabel: "IT", locale: "it-IT" },
  { code: "fr", label: "Français", shortLabel: "FR", locale: "fr-FR" },
] as const;
export function isLanguage(value: unknown): value is Language {
  return LANGUAGE_OPTIONS.some((option) => option.code === value);
}
export function getLanguageLocale(language: Language): string {
  return LANGUAGE_OPTIONS.find((option) => option.code === language)!.locale;
}
