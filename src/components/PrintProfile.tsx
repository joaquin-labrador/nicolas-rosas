import { HISTORICAL_STATS, LINKS, PLAYER, imagePath } from "../data/player";
import { useI18n } from "../i18n/I18nProvider";
import { formatDate, formatMessage } from "../i18n/helpers";
import { ageAt } from "../utils/player";
import { BrandMark } from "./ui/BrandMark";
import { Lines } from "./ui/Lines";

/** Versión compacta que solo se muestra al imprimir o guardar como PDF. */
export function PrintProfile() {
  const { copy, language } = useI18n();
  const text = copy.print;
  const facts = copy.profile.facts;
  return (
    <article id="print-profile">
      <div className="print-header">
        <BrandMark />
        <span>{text.title}</span>
      </div>
      <div className="print-content">
        <img src={imagePath("control.jpg")} alt={PLAYER.fullName} />
        <div>
          <h1>
            {PLAYER.firstName.toUpperCase()}
            <br />
            {PLAYER.lastName.toUpperCase()}
          </h1>
          <p>{formatMessage(text.summary, { age: ageAt() })}</p>
          <dl>
            <dt>{facts.birth}</dt>
            <dd>{formatDate(language, PLAYER.birthDate)}</dd>
            <dt>{facts.club}</dt>
            <dd>{PLAYER.clubAndLocation}</dd>
            <dt>{facts.competition}</dt>
            <dd>{copy.profile.competition}</dd>
            <dt>{facts.contact}</dt>
            <dd>{PLAYER.instagramProfile}</dd>
          </dl>
        </div>
      </div>
      <h2>{text.careerTitle}</h2>
      <p>
        <Lines text={text.career.join("\n")} />
      </p>
      <h2>
        {formatMessage(text.statsTitle, { season: HISTORICAL_STATS.season })}
      </h2>
      <p>
        {formatMessage(text.stats, {
          appearances: HISTORICAL_STATS.appearances,
          starts: HISTORICAL_STATS.starts,
          minutes: HISTORICAL_STATS.minutes,
        })}
      </p>
      <small>
        {formatMessage(text.source, {
          date: formatDate(language, HISTORICAL_STATS.publishedAt, "medium"),
        })}
        <br />
        {LINKS.renewal}
        <br />
        {formatMessage(text.review, {
          date: formatDate(language, PLAYER.reviewedAt, "medium"),
        })}
      </small>
    </article>
  );
}
