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
          <path fill="#aa151b" d="M0 0h30v20H0z" />
          <path fill="#f1bf00" d="M0 5h30v10H0z" />
          <g>
            <path
              fill="#c58d23"
              d="m8.3 7.8-.5-1.6 1.4.7.8-1 .8 1 1.4-.7-.5 1.6z"
            />
            <path
              fill="#aa151b"
              stroke="#c58d23"
              strokeWidth=".5"
              d="M8 8h4v3a2 2 0 0 1-4 0z"
            />
            <path
              fill="#f1bf00"
              d="M8.6 8.6h1.1v1.3H8.6zm1.7 1.8h1.1v1.2h-1.1z"
            />
            <path stroke="#eee" strokeWidth=".6" d="M7 8v4m6-4v4" />
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
