import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  label: string;
  className?: string;
}
export function Modal({
  children,
  onClose,
  label,
  className = "",
}: ModalProps) {
  const { copy } = useI18n();
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const elements = dialog.current?.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input,textarea,select,[tabindex="0"]',
      );
      if (!elements?.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === dialog.current)
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          document.activeElement === dialog.current)
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      previousFocus?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        ref={dialog}
        className={"modal " + className}
      >
        <button
          className="modal-close icon-button"
          onClick={onClose}
          aria-label={copy.accessibility.closeDialog}
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}
