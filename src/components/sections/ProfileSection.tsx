import { ArrowUpRight, Download } from "lucide-react";
import { PLAYER, imagePath } from "../../data/player";
import { useI18n } from "../../i18n/I18nProvider";
import { formatDate } from "../../i18n/helpers";
import { Lines } from "../ui/Lines";

export function ProfileSection() {
  const { copy, language } = useI18n();
  const text = copy.profile;
  const facts = [
    { label: text.facts.birth, value: formatDate(language, PLAYER.birthDate) },
    { label: text.facts.nationality, value: text.nationality, flag: true },
    { label: text.facts.position, value: text.position },
    { label: text.facts.club, value: PLAYER.clubAndLocation },
    { label: text.facts.competition, value: text.competition },
  ];
  return (
    <section id="perfil" className="profile-section section-shell">
      <div className="profile-visual reveal">
        <div className="section-index">
          <span>{text.index}</span>
          <span>{text.route}</span>
        </div>
        <img
          className="profile-main-photo"
          src={imagePath("duelo.jpg")}
          alt={text.photoAlt}
          loading="lazy"
        />
        <div className="profile-image-caption">
          <span>
            {text.caption}
            <br />
            <b>{text.captionAccent}</b>
          </span>
          <ArrowUpRight size={32} />
        </div>
        <div className="floating-year">
          <span>{text.birthClass}</span>
          <b>{PLAYER.birthYear}</b>
        </div>
      </div>
      <div className="profile-copy reveal">
        <span className="eyebrow red">{text.eyebrow}</span>
        <h2>
          <Lines text={text.title} />
          <br />
          <span>
            <Lines text={text.titleAccent} />
          </span>
        </h2>
        {text.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        <dl className="player-facts">
          {facts.map((fact, index) => (
            <div key={index}>
              <dt>{fact.label}</dt>
              <dd>
                {fact.flag && <span className="arg-flag" aria-hidden="true" />}
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
        <button
          className="text-link download-link"
          onClick={() => window.print()}
        >
          <Download size={18} />
          {text.saveProfile}
          <ArrowUpRight size={17} />
        </button>
        <span className="small-note">{text.printHint}</span>
      </div>
    </section>
  );
}
