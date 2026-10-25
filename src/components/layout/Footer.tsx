import { ArrowUpRight, ExternalLink as ExternalLinkIcon } from "lucide-react";
import { LINKS, PLAYER } from "../../data/player";
import { useI18n } from "../../i18n/I18nProvider";
import { BrandMark } from "../ui/BrandMark";
import { ExternalLink } from "../ui/ExternalLink";

export function Footer({ onSources }: { onSources: () => void }) {
  const { copy } = useI18n();
  return (
    <footer className="footer section-shell">
      <a href="#inicio" className="footer-brand">
        <BrandMark />
        <span>{PLAYER.fullName.toUpperCase()}</span>
      </a>
      <span>
        © {new Date().getFullYear()} · {copy.footer.profile}
      </span>
      <div>
        <button onClick={onSources}>
          {copy.footer.sources}
          <ExternalLinkIcon size={12} />
        </button>
        <ExternalLink href={LINKS.instagram}>
          {copy.footer.instagram}
          <ArrowUpRight size={12} />
        </ExternalLink>
        <a href="#inicio" aria-label={copy.accessibility.backToTop}>
          <ArrowUpRight size={20} />
        </a>
      </div>
    </footer>
  );
}
