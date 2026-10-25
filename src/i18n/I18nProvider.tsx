import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { LANGUAGE_STORAGE_KEY } from "./languages";
import { pickInitialLanguage } from "./helpers";
import { translations } from "./translations";
import type { Language, Translation } from "./types";

interface I18nValue {
  language: Language;
  copy: Translation;
  setLanguage: (language: Language) => void;
}
const I18nContext = createContext<I18nValue | null>(null);

function readInitialLanguage(): Language {
  let storedLanguage: string | null = null;
  try {
    storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    /* La página funciona aunque el almacenamiento esté bloqueado. */
  }
  return pickInitialLanguage({
    queryLanguage: new URL(window.location.href).searchParams.get("lang"),
    storedLanguage,
    browserLanguages: window.navigator.languages,
  });
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(readInitialLanguage);
  const copy = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = copy.meta.title;
    const metadata = [
      ['meta[name="description"]', copy.meta.description],
      ['meta[property="og:title"]', copy.meta.socialTitle],
      ['meta[property="og:description"]', copy.meta.socialDescription],
      ['meta[property="og:locale"]', copy.meta.socialLocale],
    ];
    metadata.forEach(([selector, content]) =>
      document.querySelector(selector)?.setAttribute("content", content),
    );
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      /* Preferencia no persistente en modo restringido. */
    }
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", language);
      window.history.replaceState(window.history.state, "", url);
    } catch {
      /* El modo de archivo local puede restringir history. */
    }
  }, [language, copy]);

  const value = useMemo(
    () => ({ language, copy, setLanguage }),
    [language, copy],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
