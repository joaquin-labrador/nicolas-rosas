import { Globe2 } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { isLanguage, LANGUAGE_OPTIONS } from "../../i18n/languages";

export function LanguageSwitcher() {
  const { language, setLanguage, copy } = useI18n();
  return (
    <label className="language-switcher">
      <Globe2 size={15} aria-hidden="true" />
      <select
        value={language}
        aria-label={copy.accessibility.language}
        onChange={(event) => {
          if (isLanguage(event.target.value)) setLanguage(event.target.value);
        }}
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.code} value={option.code} lang={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
