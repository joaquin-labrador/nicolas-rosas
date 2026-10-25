import { ArrowRight, ArrowUpRight, Instagram } from "lucide-react";
import { LINKS, PLAYER, imagePath } from "../../data/player";
import { useI18n } from "../../i18n/I18nProvider";
import { ExternalLink } from "../ui/ExternalLink";
import { Lines } from "../ui/Lines";

export function ContactSection({ onContact }: { onContact: () => void }) {
  const { copy } = useI18n();
  const text = copy.contact;
  return (
    <section id="contacto" className="contact-section section-shell">
      <div className="contact-top reveal">
        <span className="eyebrow red">{text.index}</span>
        <span className="contact-location">
          <span className="neutral-dot" />
          {text.location}
        </span>
      </div>
      <div className="contact-layout reveal">
        <div>
          <h2>
            {text.title}
            <br />
            {text.titleSecond} <span>{text.titleAccent}</span>
          </h2>
          <p>
            <Lines text={text.description} />
          </p>
          <div className="contact-actions">
            <ExternalLink href={LINKS.instagram} className="button red-button">
              <Instagram size={19} />
              {text.instagram}
              <ArrowUpRight size={19} />
            </ExternalLink>
            <button className="text-link" onClick={onContact}>
              {text.proposal}
              <ArrowRight size={18} />
            </button>
          </div>
          <span className="contact-handle">{PLAYER.instagramHandle}</span>
        </div>
        <a
          href={LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-art"
          aria-label={text.instagramLabel}
        >
          <img
            src={imagePath("rosas-19.jpg")}
            alt={text.photoAlt}
            loading="lazy"
          />
          <span className="contact-art-word">
            <Lines text={text.photoCaption} />
          </span>
          <span className="contact-art-arrow">
            <ArrowUpRight size={40} />
          </span>
        </a>
      </div>
    </section>
  );
}
