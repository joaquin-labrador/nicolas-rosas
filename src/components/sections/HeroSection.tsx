import { ArrowDown, ArrowUpRight, Play, Plus } from "lucide-react";
import { PLAYER, imagePath } from "../../data/player";
import { useI18n } from "../../i18n/I18nProvider";
import { formatDate } from "../../i18n/helpers";
import { ageAt } from "../../utils/player";
import { Lines } from "../ui/Lines";

export function HeroSection() {
  const { copy, language } = useI18n();
  const text = copy.hero;
  return (
    <>
      <section id="inicio" className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="short-rule" />
            {text.route}
            <span className="hero-season">{PLAYER.currentSeason}</span>
          </div>
          <h1>
            {PLAYER.firstName.toUpperCase()}
            <br />
            <span>
              {PLAYER.lastName.toUpperCase()}
              <span className="period">.</span>
            </span>
          </h1>
          <div className="hero-description">
            <span className="vertical-rule" />
            <p>
              {text.character}
              <br />
              <strong>{text.competitive}</strong>
            </p>
          </div>
          <p className="hero-summary">
            <Lines text={text.summary} />
          </p>
          <div className="hero-actions">
            <a className="button red-button" href="#perfil">
              {text.meetPlayer}
              <ArrowUpRight size={19} />
            </a>
            <a className="hero-secondary" href="#media">
              <span className="small-play">
                <Play size={12} fill="currentColor" />
              </span>
              {text.inAction}
            </a>
          </div>
          <div className="hero-bottom">
            <div>
              <b>{text.positionCode}</b>
              <span>{text.positionLabel}</span>
            </div>
            <div>
              <b>{PLAYER.nationalityCode}</b>
              <span>{text.nationalityLabel}</span>
            </div>
            <div>
              <b>
                {ageAt()}
                <i>{text.years}</i>
              </b>
              <span>
                {formatDate(language, PLAYER.birthDate, "medium").toUpperCase()}
              </span>
            </div>
            <a
              href="#perfil"
              aria-label={copy.accessibility.discoverProfile}
              className="down-link"
            >
              <ArrowDown size={21} />
            </a>
          </div>
        </div>
        <div className="hero-photo">
          <img
            src={imagePath("control.jpg")}
            alt={text.photoAlt}
            fetchPriority="high"
          />
          <div className="photo-shade" />
          <span className="hero-photo-label">{text.photoLabel}</span>
          <div className="club-caption">
            <span className="club-symbol" aria-hidden="true">
              S<span>SD</span>
            </span>
            <div>
              <span>{text.currentClub}</span>
              <strong>{PLAYER.club.toUpperCase()}</strong>
              <p>{text.competition}</p>
            </div>
            <span className="club-dot" />
          </div>
          <span className="side-caption">{text.sideCaption}</span>
        </div>
      </section>
      <div className="identity-strip">
        {copy.identity.map((label, index) => (
          <span className="identity-item" key={index}>
            <span>{label}</span>
            <Plus aria-hidden="true" />
          </span>
        ))}
      </div>
    </>
  );
}
