import { useState } from "react";
import type { KeyboardEvent } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { CAREER_SOURCES } from "../../data/player";
import { useI18n } from "../../i18n/I18nProvider";
import { ExternalLink } from "../ui/ExternalLink";
import { Lines } from "../ui/Lines";
import { SectionHeading } from "../ui/SectionHeading";

export function CareerSection() {
  const { copy } = useI18n();
  const text = copy.career;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = text.entries[selectedIndex];
  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>) {
    const count = text.entries.length;
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? count - 1
          : event.key === "ArrowDown"
            ? (selectedIndex + 1) % count
            : event.key === "ArrowUp"
              ? (selectedIndex + count - 1) % count
              : null;
    if (next === null) return;
    event.preventDefault();
    setSelectedIndex(next);
    document.getElementById("career-tab-" + next)?.focus();
  }
  return (
    <section id="trayectoria" className="career-section">
      <div className="section-shell">
        <SectionHeading
          eyebrow={text.index}
          title={text.title}
          accent={text.titleAccent}
        >
          <p>
            <Lines text={text.description} />
          </p>
        </SectionHeading>
        <div className="career-layout reveal">
          <div
            className="career-tabs"
            role="tablist"
            aria-label={text.tabsLabel}
            aria-orientation="vertical"
          >
            {text.entries.map((entry, index) => (
              <button
                key={index}
                id={"career-tab-" + index}
                role="tab"
                aria-selected={index === selectedIndex}
                aria-controls="career-panel"
                tabIndex={index === selectedIndex ? 0 : -1}
                onClick={() => setSelectedIndex(index)}
                onKeyDown={handleTabKey}
                className={index === selectedIndex ? "active" : ""}
              >
                <span>{entry.period}</span>
                <strong>{entry.club}</strong>
                <ArrowUpRight size={19} />
              </button>
            ))}
          </div>
          <div
            className="career-panel"
            role="tabpanel"
            id="career-panel"
            aria-labelledby={"career-tab-" + selectedIndex}
            tabIndex={0}
          >
            <span className="career-large-number" aria-hidden="true">
              {String(selectedIndex + 1).padStart(2, "0")}
            </span>
            <div className="career-panel-top">
              <span className="tag">
                {selectedIndex === 0 ? text.current : text.previous}
              </span>
              <MapPin size={21} />
            </div>
            <div className="career-panel-body">
              <span className="eyebrow">{selected.label}</span>
              <h3>{selected.club}</h3>
              <span className="career-place">{selected.place}</span>
              <p>{selected.text}</p>
              <div className="career-note">{selected.note}</div>
            </div>
            <ExternalLink
              href={CAREER_SOURCES[selectedIndex]}
              className="career-source"
            >
              {text.readMore}
              <ArrowUpRight size={17} />
            </ExternalLink>
          </div>
        </div>
      </div>
    </section>
  );
}
