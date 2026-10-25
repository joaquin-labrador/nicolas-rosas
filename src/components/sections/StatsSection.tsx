import { ArrowUpRight } from "lucide-react";
import { HISTORICAL_STATS, LINKS, PLAYER } from "../../data/player";
import type { FootballFeed } from "../../lib/footballFeed";
import { useI18n } from "../../i18n/I18nProvider";
import { formatDate, formatDateTime, formatMessage } from "../../i18n/helpers";
import { ExternalLink } from "../ui/ExternalLink";

export function StatsSection({ feed }: { feed: FootballFeed | null }) {
  const { copy, language } = useI18n();
  const text = copy.stats;
  const historic = HISTORICAL_STATS;
  const percentage = Math.round((historic.starts / historic.appearances) * 100);
  const metrics = [
    {
      value: String(feed?.stats.appearances ?? historic.appearances).padStart(
        2,
        "0",
      ),
      unit: "",
      label: text.appearances,
    },
    {
      value: String(feed?.stats.starts ?? historic.starts).padStart(2, "0"),
      unit: "",
      label: text.starts,
    },
    {
      value: feed?.stats.minutes ?? historic.minutes,
      unit: "′",
      label: text.minutes,
    },
    {
      value: feed ? feed.stats.goals : percentage,
      unit: feed ? "" : "%",
      label: feed ? text.goals : text.startingPercentage,
    },
  ];
  const sourceNote = feed
    ? formatMessage(text.liveSource, {
        source: feed.source.name,
        date: formatDateTime(language, feed.updatedAt),
      })
    : formatMessage(text.historicalSource, {
        date: formatDate(language, historic.publishedAt, "medium"),
      });
  return (
    <section
      className="season-section section-shell reveal"
      aria-label={text.accessibility}
    >
      <div className="season-heading">
        <span className="eyebrow red">{text.title}</span>
        <div>
          <span className="season-pill">{feed?.season ?? historic.season}</span>
          <span className="stats-club">{PLAYER.club.toUpperCase()}</span>
        </div>
      </div>
      <div className="stats-grid">
        {metrics.map((metric, index) => (
          <div key={index}>
            <strong>
              {metric.value}
              {metric.unit && <i>{metric.unit}</i>}
            </strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>
      <p className="source-note">
        {sourceNote}
        <ExternalLink href={feed?.source.url ?? LINKS.renewal}>
          {text.source}
          <ArrowUpRight size={12} />
        </ExternalLink>
      </p>
    </section>
  );
}
