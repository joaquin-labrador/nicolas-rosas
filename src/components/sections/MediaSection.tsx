import { useCallback, useState } from "react";
import type { KeyboardEvent } from "react";
import { ArrowUpRight, Play, Plus } from "lucide-react";
import { PHOTOS, imagePath } from "../../data/player";
import { useI18n } from "../../i18n/I18nProvider";
import { formatMessage } from "../../i18n/helpers";
import { PhotoLightbox } from "../dialogs/PhotoLightbox";
import { Lines } from "../ui/Lines";
import { SectionHeading } from "../ui/SectionHeading";

type MediaTab = "photos" | "videos";
export function MediaSection({ onContact }: { onContact: () => void }) {
  const { copy } = useI18n();
  const text = copy.media;
  const [tab, setTab] = useState<MediaTab>("photos");
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const closeGallery = useCallback(() => setPhotoIndex(null), []);
  function handleTabKey(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? "photos"
        : event.key === "End"
          ? "videos"
          : tab === "photos"
            ? "videos"
            : "photos";
    setTab(next);
    document.getElementById(next + "-tab")?.focus();
  }
  return (
    <section id="media" className="media-section section-shell">
      <SectionHeading
        eyebrow={text.index}
        title={text.title}
        accent={text.titleAccent}
      >
        <div
          className="media-tabs"
          role="tablist"
          aria-label={text.tabsLabel}
          onKeyDown={handleTabKey}
        >
          <button
            id="photos-tab"
            tabIndex={tab === "photos" ? 0 : -1}
            role="tab"
            aria-selected={tab === "photos"}
            aria-controls="photos-panel"
            onClick={() => setTab("photos")}
            className={tab === "photos" ? "active" : ""}
          >
            {text.photosLabel}
            <span>{String(PHOTOS.length).padStart(2, "0")}</span>
          </button>
          <button
            id="videos-tab"
            tabIndex={tab === "videos" ? 0 : -1}
            role="tab"
            aria-selected={tab === "videos"}
            aria-controls="videos-panel"
            onClick={() => setTab("videos")}
            className={tab === "videos" ? "active" : ""}
          >
            {text.videosLabel}
            <Play size={13} />
          </button>
        </div>
      </SectionHeading>
      <div
        role="tabpanel"
        id="photos-panel"
        aria-labelledby="photos-tab"
        hidden={tab !== "photos"}
      >
        <div className="gallery-grid">
          {PHOTOS.slice(0, 4).map((photo, index) => {
            const translated = text.photos[index];
            return (
              <button
                className={"gallery-photo photo-" + index}
                key={photo.file}
                onClick={() => setPhotoIndex(index)}
                aria-label={formatMessage(text.enlarge, {
                  title: translated.title,
                })}
              >
                <img
                  src={imagePath(photo.file)}
                  alt={translated.caption}
                  loading="lazy"
                  style={{ objectPosition: photo.position }}
                />
                <span className="gallery-photo-overlay">
                  <span>{translated.title}</span>
                  <span className="gallery-plus">
                    <Plus size={20} />
                  </span>
                </span>
                <span className="gallery-photo-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
        <div className="gallery-footer">
          <span>{text.galleryCaption}</span>
          <button className="text-link" onClick={() => setPhotoIndex(0)}>
            {formatMessage(text.explore, { count: PHOTOS.length })}
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
      <div
        className="video-empty"
        role="tabpanel"
        id="videos-panel"
        aria-labelledby="videos-tab"
        hidden={tab !== "videos"}
      >
        <div className="video-still">
          <img
            src={imagePath("pase.jpg")}
            alt={text.videoPhotoAlt}
            loading="lazy"
          />
          <span>
            <Play size={35} />
          </span>
        </div>
        <div>
          <span className="eyebrow red">{text.videoEyebrow}</span>
          <h3>
            <Lines text={text.videoTitle} />
          </h3>
          <p>{text.videoDescription}</p>
          <button className="button outline-button" onClick={onContact}>
            {text.requestMaterial}
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
      {photoIndex !== null && (
        <PhotoLightbox
          index={photoIndex}
          onIndexChange={setPhotoIndex}
          onClose={closeGallery}
        />
      )}
    </section>
  );
}
