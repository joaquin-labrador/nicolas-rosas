import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PHOTOS, imagePath } from "../../data/player";
import { useI18n } from "../../i18n/I18nProvider";
import { Modal } from "../ui/Modal";

interface PhotoLightboxProps {
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}
export function PhotoLightbox({
  index,
  onIndexChange,
  onClose,
}: PhotoLightboxProps) {
  const { copy } = useI18n();
  const photo = PHOTOS[index];
  const caption = copy.media.photos[index];
  const previous = () =>
    onIndexChange((index + PHOTOS.length - 1) % PHOTOS.length);
  const next = () => onIndexChange((index + 1) % PHOTOS.length);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight")
        onIndexChange((index + 1) % PHOTOS.length);
      if (event.key === "ArrowLeft")
        onIndexChange((index + PHOTOS.length - 1) % PHOTOS.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, onIndexChange]);
  return (
    <Modal
      label={copy.media.galleryLabel}
      onClose={onClose}
      className="lightbox"
    >
      <img
        className="lightbox-image"
        src={imagePath(photo.file)}
        alt={caption.caption}
      />
      <div className="lightbox-bottom">
        <div>
          <span className="eyebrow">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(PHOTOS.length).padStart(2, "0")}
          </span>
          <p>{caption.title}</p>
        </div>
        <div>
          <button
            className="icon-button"
            onClick={previous}
            aria-label={copy.media.previousPhoto}
          >
            <ChevronLeft />
          </button>
          <button
            className="icon-button"
            onClick={next}
            aria-label={copy.media.nextPhoto}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </Modal>
  );
}
