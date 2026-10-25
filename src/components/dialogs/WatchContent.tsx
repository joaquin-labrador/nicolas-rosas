import { ArrowUpRight } from "lucide-react";
import { WATCH_CHANNELS } from "../../data/player";
import { useI18n } from "../../i18n/I18nProvider";
import { ExternalLink } from "../ui/ExternalLink";
import { Lines } from "../ui/Lines";

export function WatchContent() {
  const { copy } = useI18n();
  const text = copy.watch;
  return (
    <>
      <span className="eyebrow red">{text.eyebrow}</span>
      <h2>
        <Lines text={text.title} />
      </h2>
      <p>{text.description}</p>
      <div className="sources-list">
        {WATCH_CHANNELS.map((channel, index) => (
          <ExternalLink key={channel.url} href={channel.url}>
            <strong>
              {channel.name}
              <ArrowUpRight size={18} />
            </strong>
            <span>{text.channels[index]}</span>
          </ExternalLink>
        ))}
      </div>
      <p className="small-note">{text.note}</p>
    </>
  );
}
