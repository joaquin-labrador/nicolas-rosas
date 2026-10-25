import { ArrowUpRight } from "lucide-react";
import { PLAYER, SOURCE_URLS } from "../../data/player";
import { useI18n } from "../../i18n/I18nProvider";
import { formatDate, formatMessage } from "../../i18n/helpers";
import { ExternalLink } from "../ui/ExternalLink";
import { Lines } from "../ui/Lines";

export function SourcesContent() {
  const { copy, language } = useI18n();
  const text = copy.sources;
  return (
    <>
      <span className="eyebrow red">{text.eyebrow}</span>
      <h2>
        <Lines text={text.title} />
      </h2>
      <p>
        {formatMessage(text.description, {
          date: formatDate(language, PLAYER.reviewedAt),
        })}
      </p>
      <div className="sources-list">
        {text.entries.map((source, index) => (
          <ExternalLink href={SOURCE_URLS[index]} key={SOURCE_URLS[index]}>
            <strong>
              {source.name}
              <ArrowUpRight size={16} />
            </strong>
            <span>{source.detail}</span>
          </ExternalLink>
        ))}
      </div>
      <p className="small-note">{text.note}</p>
    </>
  );
}
