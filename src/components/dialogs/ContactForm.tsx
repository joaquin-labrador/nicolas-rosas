import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import {
  CONTACT_LIMITS,
  CONTACT_REASONS,
  EMPTY_CONTACT,
} from "../../data/contact";
import type { ContactFields, ContactReason } from "../../data/contact";
import { LINKS } from "../../data/player";
import { useI18n } from "../../i18n/I18nProvider";
import { formatMessage } from "../../i18n/helpers";
import { ExternalLink } from "../ui/ExternalLink";
import { Lines } from "../ui/Lines";

type CopyStatus = "idle" | "copied" | "error";
export function ContactForm() {
  const { copy, language } = useI18n();
  const text = copy.form;
  const [fields, setFields] = useState<ContactFields>(EMPTY_CONTACT);
  const [prepared, setPrepared] = useState(false);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const copyAttempt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const draft = formatMessage(text.draft, {
    ...fields,
    reason: text.reasons[CONTACT_REASONS.indexOf(fields.reason)],
  });

  // Conserva lo que escribió el visitante. El borrador se retraduce sin alterar sus datos.
  useEffect(() => {
    copyAttempt.current += 1;
    setCopyStatus("idle");
    formRef.current
      ?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
        "input, textarea",
      )
      .forEach((field) => field.setCustomValidity(""));
  }, [language]);

  function changeField<Key extends keyof ContactFields>(
    key: Key,
    value: ContactFields[Key],
  ) {
    copyAttempt.current += 1;
    setFields((previous) => ({ ...previous, [key]: value }));
    setPrepared(false);
    setCopyStatus("idle");
  }

  async function prepareMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const attempt = ++copyAttempt.current;
    setPrepared(true);
    try {
      await navigator.clipboard.writeText(draft);
      if (attempt === copyAttempt.current) setCopyStatus("copied");
    } catch {
      if (attempt === copyAttempt.current) setCopyStatus("error");
    }
  }

  return (
    <>
      <span className="eyebrow red">{text.eyebrow}</span>
      <h2>
        <Lines text={text.title} />
      </h2>
      <p>{text.description}</p>
      <form
        ref={formRef}
        onSubmit={prepareMessage}
        className="contact-form"
        onInvalid={(event) => {
          const field = event.target;
          if (!(
            field instanceof HTMLInputElement ||
            field instanceof HTMLTextAreaElement
          ))
            return;
          if (field.validity.valueMissing)
            field.setCustomValidity(text.requiredField);
          else if (field.validity.typeMismatch)
            field.setCustomValidity(text.invalidEmail);
        }}
        onChange={(event) => {
          const field = event.target;
          if (
            field instanceof HTMLInputElement ||
            field instanceof HTMLTextAreaElement ||
            field instanceof HTMLSelectElement
          )
            field.setCustomValidity("");
        }}
      >
        <label>
          {text.name}
          <input
            name="name"
            required
            autoComplete="name"
            placeholder={text.namePlaceholder}
            maxLength={CONTACT_LIMITS.name}
            value={fields.name}
            onChange={(event) => changeField("name", event.target.value)}
          />
        </label>
        <label>
          {text.club}
          <input
            name="club"
            required
            placeholder={text.clubPlaceholder}
            maxLength={CONTACT_LIMITS.club}
            value={fields.club}
            onChange={(event) => changeField("club", event.target.value)}
          />
        </label>
        <label>
          {text.email}
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={text.emailPlaceholder}
            maxLength={CONTACT_LIMITS.email}
            value={fields.email}
            onChange={(event) => changeField("email", event.target.value)}
          />
        </label>
        <label>
          {text.reason}
          <select
            name="reason"
            value={fields.reason}
            onChange={(event) =>
              changeField("reason", event.target.value as ContactReason)
            }
          >
            {CONTACT_REASONS.map((reason, index) => (
              <option key={reason} value={reason}>
                {text.reasons[index]}
              </option>
            ))}
          </select>
        </label>
        <label className="full">
          {text.message}
          <textarea
            name="message"
            required
            rows={3}
            placeholder={text.messagePlaceholder}
            maxLength={CONTACT_LIMITS.message}
            value={fields.message}
            onChange={(event) => changeField("message", event.target.value)}
          />
        </label>
        <button className="button red-button full" type="submit">
          {copyStatus === "copied" ? <Check size={18} /> : <Copy size={18} />}
          {copyStatus === "copied" ? text.copied : text.copy}
        </button>
      </form>
      {prepared && (
        <div className="draft-box" aria-live="polite">
          <p>{copyStatus === "copied" ? text.ready : text.copyFallback}</p>
          <textarea
            aria-label={text.draftLabel}
            readOnly
            value={draft}
            rows={5}
            onFocus={(event) => event.currentTarget.select()}
          />
          <ExternalLink href={LINKS.instagram} className="text-link">
            {text.openInstagram}
            <ArrowUpRight size={17} />
          </ExternalLink>
        </div>
      )}
      <p className="form-note">{text.privacy}</p>
    </>
  );
}
