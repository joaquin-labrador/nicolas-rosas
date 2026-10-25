import type { Language } from "../../i18n/types";

// Local vectors keep flags crisp and consistent across systems without emoji fonts.
export function LanguageFlag({ language }: { language: Language }) {
  return (
    <svg
      className="language-flag"
      viewBox="0 0 30 20"
      aria-hidden="true"
      focusable="false"
    >
      {language === "es" && (
        <>
          <path fill="#75aadb" d="M0 0h30v20H0z" />
          <path fill="#fff" d="M0 6.67h30v6.66H0z" />
          <g stroke="#e9b341" strokeWidth=".8">
            <path d="M15 7v6m-3-3h6m-5.1-2.1 4.2 4.2m0-4.2-4.2 4.2" />
            <circle cx="15" cy="10" r="1.4" fill="#f5c754" />
          </g>
        </>
      )}
      {language === "en" && (
        <>
          <path fill="#20366b" d="M0 0h30v20H0z" />
          <path stroke="#fff" strokeWidth="5" d="m0 0 30 20M30 0 0 20" />
          <path stroke="#c72c41" strokeWidth="1.8" d="m0 0 30 20M30 0 0 20" />
          <path stroke="#fff" strokeWidth="7" d="M15 0v20M0 10h30" />
          <path stroke="#c72c41" strokeWidth="4" d="M15 0v20M0 10h30" />
        </>
      )}
      {language === "pt" && (
        <>
          <path fill="#d52b35" d="M0 0h30v20H0z" />
          <path fill="#087a45" d="M0 0h12v20H0z" />
          <circle
            cx="12"
            cy="10"
            r="4"
            fill="none"
            stroke="#f5ce46"
            strokeWidth="1.1"
          />
          <path
            d="M9.5 7h5v4a2.5 2.5 0 0 1-5 0z"
            fill="#fff"
            stroke="#d52b35"
            strokeWidth="1"
          />
          <path stroke="#285f9d" strokeWidth="1" d="M12 8v4m-1.4-2h2.8" />
        </>
      )}
      {(language === "it" || language === "fr") && (
        <>
          <path
            fill={language === "it" ? "#18835a" : "#20458c"}
            d="M0 0h10v20H0z"
          />
          <path fill="#fff" d="M10 0h10v20H10z" />
          <path
            fill={language === "it" ? "#d43c43" : "#e0444e"}
            d="M20 0h10v20H20z"
          />
        </>
      )}
    </svg>
  );
}
