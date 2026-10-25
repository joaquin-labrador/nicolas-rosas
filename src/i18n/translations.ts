import { es } from "./locales/es.ts";
import { en } from "./locales/en.ts";
import { pt } from "./locales/pt.ts";
import { it } from "./locales/it.ts";
import { fr } from "./locales/fr.ts";
import type { Language, Translation } from "./types";
export const translations: Record<Language, Translation> = {
  es,
  en,
  pt,
  it,
  fr,
};
