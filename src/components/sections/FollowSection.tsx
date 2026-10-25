import { ArrowUpRight, CalendarDays, FileText, Radio } from "lucide-react";
import { LINKS } from "../../data/player";
import type { FootballFeedState } from "../../lib/useFootballFeed";
import { useI18n } from "../../i18n/I18nProvider";
import { formatDateTime, formatMessage } from "../../i18n/helpers";
import { ExternalLink } from "../ui/ExternalLink";
import { Lines } from "../ui/Lines";

interface FollowSectionProps {
  football: FootballFeedState;
  onWatch: () => void;
}
export function FollowSection({ football, onWatch }: FollowSectionProps) {
  const { copy, language } = useI18n();
  const text = copy.follow;
  const { feed, loading, status } = football;
  const match = feed?.nextMatch;
  const matchStatus = match
    ? { live: text.live, finished: text.finished, scheduled: text.scheduled }[
        match.status
      ]
    : "";
  return (
    <section id="seguimiento" className="follow-section">
      <div className="section-shell follow-layout">
        <div className="follow-copy reveal">
          <span className="eyebrow">{text.index}</span>
          <h2>
            <Lines text={text.title} />
            <span>.</span>
          </h2>
          <p>{text.description}</p>
          <div className="follow-status">
            <span
              className={match?.status === "live" ? "live-dot" : "neutral-dot"}
            />
            {feed
              ? formatMessage(text.connected, { source: feed.source.name })
              : loading
                ? text.loading
                : text.channels}
          </div>
          {(status === "stale" || status === "error") && (
            <span className="feed-note">{text.unavailable}</span>
          )}
        </div>
        <div className="follow-links reveal">
          {match && (
            <div className="next-match">
              <span className="eyebrow">{matchStatus}</span>
              <h3>
                {match.home}
                <span>
                  {match.homeScore !== undefined
                    ? match.homeScore + " — " + match.awayScore
                    : text.versus}
                </span>
                {match.away}
              </h3>
              <p>
                {formatDateTime(language, match.kickoff)} · {match.competition}
              </p>
              {match.watchUrl && (
                <ExternalLink href={match.watchUrl}>
                  {text.watch}
                  <ArrowUpRight size={15} />
                </ExternalLink>
              )}
            </div>
          )}
          <ExternalLink href={LINKS.federation} className="follow-link">
            <span className="follow-icon">
              <CalendarDays size={23} />
            </span>
            <div>
              <span>{text.competitionLabel}</span>
              <h3>{text.resultsTitle}</h3>
              <p>{text.resultsDescription}</p>
            </div>
            <ArrowUpRight size={25} />
          </ExternalLink>
          <ExternalLink href={LINKS.club} className="follow-link">
            <span className="follow-icon">
              <FileText size={23} />
            </span>
            <div>
              <span>{text.clubLabel}</span>
              <h3>{text.newsTitle}</h3>
              <p>{text.newsDescription}</p>
            </div>
            <ArrowUpRight size={25} />
          </ExternalLink>
          <button className="follow-link" onClick={onWatch}>
            <span className="follow-icon">
              <Radio size={23} />
            </span>
            <div>
              <span>{text.broadcastLabel}</span>
              <h3>{text.watchTitle}</h3>
              <p>{text.watchDescription}</p>
            </div>
            <ArrowUpRight size={25} />
          </button>
          <p className="follow-disclaimer">
            {text.disclaimer}{" "}
            {feed ? text.connectedDisclaimer : text.historicalDisclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
