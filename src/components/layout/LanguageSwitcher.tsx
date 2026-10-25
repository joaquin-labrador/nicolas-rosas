import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";
import { LANGUAGE_OPTIONS } from "../../i18n/languages";
import { LanguageFlag } from "../ui/LanguageFlag";

export function LanguageSwitcher() {
  const { language, setLanguage, copy } = useI18n();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const selectedIndex = LANGUAGE_OPTIONS.findIndex(
    (item) => item.code === language,
  );
  const selected = LANGUAGE_OPTIONS[selectedIndex];

  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  function openMenu(index = selectedIndex) {
    setActiveIndex(index);
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleMenuKey(event: KeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex(
          (index) =>
            (index +
              (event.key === "ArrowDown" ? 1 : -1) +
              LANGUAGE_OPTIONS.length) %
            LANGUAGE_OPTIONS.length,
        );
        break;
      case "Home":
      case "End":
        event.preventDefault();
        setActiveIndex(event.key === "Home" ? 0 : LANGUAGE_OPTIONS.length - 1);
        break;
      case "Escape":
        event.preventDefault();
        event.stopPropagation();
        closeMenu();
        break;
      case "Tab":
        // Return to the trigger so the browser can continue the normal tab order.
        closeMenu();
        break;
      default: {
        if (
          event.key.length !== 1 ||
          event.ctrlKey ||
          event.altKey ||
          event.metaKey
        )
          return;
        const match = LANGUAGE_OPTIONS.findIndex((item) =>
          item.label
            .toLocaleLowerCase()
            .startsWith(event.key.toLocaleLowerCase()),
        );
        if (match !== -1) {
          event.preventDefault();
          setActiveIndex(match);
        }
      }
    }
  }

  return (
    <div
      className="language-switcher"
      ref={rootRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className="language-trigger"
        aria-label={`${copy.accessibility.language}: ${selected.label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openMenu(
              event.key === "ArrowDown" ? 0 : LANGUAGE_OPTIONS.length - 1,
            );
          }
        }}
      >
        <LanguageFlag language={language} />
        <span className="language-current-name" lang={language}>
          {selected.label}
        </span>
        <span className="language-current-code" aria-hidden="true">
          {selected.shortLabel}
        </span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className="language-chevron"
        />
      </button>
      {open && (
        <div className="language-panel">
          <p className="language-panel-label" id={`${id}-label`}>
            {copy.accessibility.language}
          </p>
          <div
            id={`${id}-menu`}
            role="menu"
            aria-labelledby={`${id}-label`}
            onKeyDown={handleMenuKey}
          >
            {LANGUAGE_OPTIONS.map((option, index) => (
              <button
                key={option.code}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={option.code === language}
                tabIndex={index === activeIndex ? 0 : -1}
                className="language-option"
                onFocus={() => setActiveIndex(index)}
                onClick={() => {
                  setLanguage(option.code);
                  closeMenu();
                }}
              >
                <LanguageFlag language={option.code} />
                <span lang={option.code}>{option.label}</span>
                <span className="language-option-code" aria-hidden="true">
                  {option.shortLabel}
                </span>
                {option.code === language && (
                  <Check size={15} aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
