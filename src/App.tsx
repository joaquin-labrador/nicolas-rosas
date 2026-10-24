import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  Menu,
  X,
  Instagram,
  Download,
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
  ExternalLink,
  Play,
  Radio,
  CalendarDays,
  MapPin,
  Plus,
  FileText,
} from "lucide-react";
import {
  ageAt,
  career,
  clubUrl,
  imagePath,
  instagram,
  photos,
  renewalUrl,
  sources,
} from "./data/player";
import { useFootballFeed } from "./lib/useFootballFeed";

function Mark({ light = false }: { light?: boolean }) {
  return (
    <span className={`brand-mark ${light ? "light" : ""}`} aria-hidden="true">
      N<span>R</span>
      <i />
    </span>
  );
}
function ExtLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
function Modal({
  children,
  onClose,
  label,
  className = "",
}: {
  children: ReactNode;
  onClose: () => void;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const elements = ref.current?.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input,textarea,select,[tabindex="0"]',
        );
        if (!elements?.length) return;
        const first = elements[0],
          last = elements[elements.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            document.activeElement === ref.current)
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      before?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="modal-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        ref={ref}
        className={`modal ${className}`}
      >
        <button
          className="modal-close icon-button"
          onClick={onClose}
          aria-label="Cerrar ventana"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}

function ContactForm() {
  const [copied, setCopied] = useState(false);
  const [draft, setDraft] = useState("");
  const [copyError, setCopyError] = useState(false);
  const createDraft = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = `Hola Nicolás, soy ${data.get("name")}, de ${data.get("club")}.\n\nMotivo: ${data.get("reason")}.\n${data.get("message")}\n\nPodés contactarme en: ${data.get("email")}.\nGracias.`;
    setDraft(text);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  };
  return (
    <>
      <span className="eyebrow red">CONTACTO PROFESIONAL</span>
      <h2>
        El próximo paso
        <br />
        empieza hablando.
      </h2>
      <p>
        Prepará tu consulta para Nicolás y compartila por mensaje privado en
        Instagram.
      </p>
      <form
        onSubmit={createDraft}
        onChange={() => {
          setCopied(false);
          setDraft("");
          setCopyError(false);
        }}
        className="contact-form"
      >
        <label>
          Tu nombre
          <input
            name="name"
            required
            autoComplete="name"
            placeholder="Nombre y apellido"
            maxLength={100}
          />
        </label>
        <label>
          Club u organización
          <input
            name="club"
            required
            placeholder="Nombre del club o agencia"
            maxLength={120}
          />
        </label>
        <label>
          Email de contacto
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="tu@club.com"
            maxLength={160}
          />
        </label>
        <label>
          Motivo
          <select name="reason">
            <option>Interés deportivo</option>
            <option>Solicitud de material de scouting</option>
            <option>Representación</option>
            <option>Prensa y colaboraciones</option>
          </select>
        </label>
        <label className="full">
          Tu mensaje
          <textarea
            name="message"
            required
            rows={3}
            placeholder="Contanos un poco más sobre tu consulta…"
            maxLength={2500}
          />
        </label>
        <button className="button red-button full" type="submit">
          {copied ? <Check size={18} /> : <Copy size={18} />}{" "}
          {copied ? "Mensaje copiado" : "Preparar y copiar mensaje"}
        </button>
      </form>
      {draft && (
        <div className="draft-box" aria-live="polite">
          <p>
            {copyError
              ? "Copiá el texto de abajo y pegalo en Instagram."
              : "Listo. Abrí Instagram y pegá el mensaje en un DM a @nicorosasd."}
          </p>
          <textarea
            aria-label="Mensaje preparado para copiar"
            readOnly
            value={draft}
            rows={5}
            onFocus={(e) => e.currentTarget.select()}
          />
          <ExtLink href={instagram} className="text-link">
            Abrir Instagram <ArrowUpRight size={17} />
          </ExtLink>
        </div>
      )}
      <p className="form-note">
        Este formulario prepara un mensaje en tu dispositivo. No envía ni guarda
        tus datos.
      </p>
    </>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [careerIndex, setCareerIndex] = useState(0);
  const [mediaTab, setMediaTab] = useState<"photos" | "videos">("photos");
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [modal, setModal] = useState<"contact" | "sources" | "watch" | null>(
    null,
  );
  const { feed, status, loading } = useFootballFeed(
    import.meta.env.VITE_FOOTBALL_FEED_URL,
  );
  const item = career[careerIndex];
  const closeModal = useRef(() => {
    setModal(null);
    setGalleryIndex(null);
  }).current;
  useEffect(() => {
    if (galleryIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight")
        setGalleryIndex((i) => (i === null ? null : (i + 1) % photos.length));
      if (event.key === "ArrowLeft")
        setGalleryIndex((i) =>
          i === null ? null : (i + photos.length - 1) % photos.length,
        );
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [galleryIndex]);
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.07 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  const navClick = () => setMenuOpen(false);
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <header className="header">
        <a
          href="#inicio"
          aria-label="Nicolás Rosas, inicio"
          className="brand"
          onClick={navClick}
        >
          <Mark />
          <span>
            NICOLÁS
            <br />
            <strong>ROSAS</strong>
          </span>
        </a>
        <nav
          id="mobile-navigation"
          aria-label="Navegación principal"
          className={menuOpen ? "nav is-open" : "nav"}
        >
          <a href="#perfil" onClick={navClick}>
            El jugador
          </a>
          <a href="#trayectoria" onClick={navClick}>
            Trayectoria
          </a>
          <a href="#media" onClick={navClick}>
            En acción
          </a>
          <a href="#seguimiento" onClick={navClick}>
            Actualidad
          </a>
          <a href="#contacto" className="mobile-contact" onClick={navClick}>
            Contacto
          </a>
        </nav>
        <a className="header-contact" href="#contacto">
          Hablemos <ArrowUpRight size={17} />
        </a>
        <button
          className="menu-button icon-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>
      <main id="contenido">
        <section id="inicio" className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="short-rule" /> ARGENTINA → ESPAÑA{" "}
              <span className="hero-season">2026 / 27</span>
            </div>
            <h1>
              NICOLÁS
              <br />
              <span>
                ROSAS<span className="period">.</span>
              </span>
            </h1>
            <div className="hero-description">
              <span className="vertical-rule" />
              <p>
                Carácter argentino.
                <br />
                <strong>Hecho para competir.</strong>
              </p>
            </div>
            <p className="hero-summary">
              Defensa central del Silva SD.
              <br />
              Un camino propio en el fútbol español.
            </p>
            <div className="hero-actions">
              <a className="button red-button" href="#perfil">
                Conocé al jugador <ArrowUpRight size={19} />
              </a>
              <a className="hero-secondary" href="#media">
                <span className="small-play">
                  <Play size={12} fill="currentColor" />
                </span>{" "}
                En acción
              </a>
            </div>
            <div className="hero-bottom">
              <div>
                <b>DFC</b>
                <span>POSICIÓN</span>
              </div>
              <div>
                <b>ARG</b>
                <span>NACIONALIDAD</span>
              </div>
              <div>
                <b>
                  {ageAt()}
                  <i>AÑOS</i>
                </b>
                <span>29 NOV 2005</span>
              </div>
              <a
                href="#perfil"
                aria-label="Descubrir el perfil"
                className="down-link"
              >
                <ArrowDown size={21} />
              </a>
            </div>
          </div>
          <div className="hero-photo">
            <img
              src={imagePath("control.jpg")}
              alt="Nicolás Rosas controlando el balón con la camiseta blanca del Silva SD"
              fetchPriority="high"
            />
            <div className="photo-shade" />
            <span className="hero-photo-label">EN EL CAMPO, TODO.</span>
            <div className="club-caption">
              <span className="club-symbol">
                S<span>SD</span>
              </span>
              <div>
                <span>CLUB ACTUAL</span>
                <strong>SILVA SD</strong>
                <p>Tercera Federación · Grupo I</p>
              </div>
              <span className="club-dot" />
            </div>
            <span className="side-caption">
              NICOLÁS ROSAS / FOOTBALL PLAYER
            </span>
          </div>
        </section>
        <div className="identity-strip">
          <span>MENTALIDAD COMPETITIVA</span>
          <Plus />
          <span>RAÍCES ARGENTINAS</span>
          <Plus />
          <span>PRESENTE EN GALICIA</span>
          <Plus />
          <span>SIEMPRE HACIA ADELANTE</span>
          <Plus />
        </div>
        <section
          className="season-section section-shell reveal"
          aria-label="Estadísticas de temporada"
        >
          <div className="season-heading">
            <span className="eyebrow red">LA TEMPORADA, EN NÚMEROS</span>
            <div>
              <span className="season-pill">{feed?.season ?? "2025 / 26"}</span>
              <span className="stats-club">SILVA SD</span>
            </div>
          </div>
          <div className="stats-grid">
            <div>
              <strong>
                {String(feed?.stats.appearances ?? 6).padStart(2, "0")}
              </strong>
              <span>PARTIDOS JUGADOS</span>
            </div>
            <div>
              <strong>
                {String(feed?.stats.starts ?? 6).padStart(2, "0")}
              </strong>
              <span>TITULARIDADES</span>
            </div>
            <div>
              <strong>
                {feed?.stats.minutes ?? 460}
                <i>′</i>
              </strong>
              <span>MINUTOS EN EL CAMPO</span>
            </div>
            <div>
              <strong>
                {feed ? feed.stats.goals : "100"}
                <i>{feed ? "" : "%"}</i>
              </strong>
              <span>{feed ? "GOLES" : "DE PARTIDOS COMO TITULAR"}</span>
            </div>
          </div>
          <p className="source-note">
            {feed ? (
              <>
                Datos de {feed.source.name} · Actualizados el{" "}
                {new Date(feed.updatedAt).toLocaleString("es-ES")}{" "}
                <ExtLink href={feed.source.url}>
                  Ver fuente <ArrowUpRight size={12} />
                </ExtLink>
              </>
            ) : (
              <>
                Primera temporada en el Silva · Datos publicados por el club el
                02.07.2026.{" "}
                <ExtLink href={renewalUrl}>
                  Ver fuente <ArrowUpRight size={12} />
                </ExtLink>
              </>
            )}
          </p>
        </section>
        <section id="perfil" className="profile-section section-shell">
          <div className="profile-visual reveal">
            <div className="section-index">
              <span>01 / EL JUGADOR</span>
              <span>ARG → ESP</span>
            </div>
            <img
              className="profile-main-photo"
              src={imagePath("duelo.jpg")}
              alt="Nicolás Rosas disputando la posición durante un partido"
              loading="lazy"
            />
            <div className="profile-image-caption">
              <span>
                EL FÚTBOL COMO
                <br />
                <b>PUNTO DE PARTIDA.</b>
              </span>
              <ArrowUpRight size={32} />
            </div>
            <div className="floating-year">
              <span>CLASE</span>
              <b>2005</b>
            </div>
          </div>
          <div className="profile-copy reveal">
            <span className="eyebrow red">UN NOMBRE. UN CAMINO.</span>
            <h2>
              RAÍCES QUE
              <br />
              IMPULSAN.
              <br />
              <span>
                FÚTBOL QUE
                <br />
                CONECTA.
              </span>
            </h2>
            <p>
              De Argentina al fútbol español. Nicolás Rosas construye su
              recorrido como defensa central, con una etapa de formación a ambos
              lados del Atlántico y un presente en el Silva SD, en A Coruña.
            </p>
            <p>
              Tras pasar por el fútbol juvenil de Santiago y competir con
              Negreira y Céltiga, hoy forma parte de la Tercera Federación.
            </p>
            <dl className="player-facts">
              <div>
                <dt>Nacimiento</dt>
                <dd>29 de noviembre de 2005</dd>
              </div>
              <div>
                <dt>Nacionalidad</dt>
                <dd>
                  <span className="arg-flag" />
                  Argentina
                </dd>
              </div>
              <div>
                <dt>Posición</dt>
                <dd>Defensa central</dd>
              </div>
              <div>
                <dt>Club actual</dt>
                <dd>Silva SD · A Coruña</dd>
              </div>
              <div>
                <dt>Competición</dt>
                <dd>Tercera Federación · Grupo I</dd>
              </div>
            </dl>
            <button
              className="text-link download-link"
              onClick={() => window.print()}
            >
              <Download size={18} /> Guardar ficha deportiva{" "}
              <ArrowUpRight size={17} />
            </button>
            <span className="small-note">
              Lista para guardar en PDF desde tu navegador.
            </span>
          </div>
        </section>
        <section id="trayectoria" className="career-section">
          <div className="section-shell">
            <div className="section-heading reveal">
              <div>
                <span className="eyebrow red">02 / TRAYECTORIA</span>
                <h2>
                  EL CAMINO
                  <br />
                  <span>SE HACE JUGANDO.</span>
                </h2>
              </div>
              <p>
                Distintos lugares. La misma dirección.
                <br />
                Un recorrido de formación y competición.
              </p>
            </div>
            <div className="career-layout reveal">
              <div
                className="career-tabs"
                role="tablist"
                aria-label="Etapas de la carrera"
                aria-orientation="vertical"
              >
                {career.map((entry, index) => (
                  <button
                    key={entry.year}
                    id={`career-tab-${index}`}
                    role="tab"
                    aria-selected={index === careerIndex}
                    aria-controls={`career-panel-${index}`}
                    tabIndex={index === careerIndex ? 0 : -1}
                    onClick={() => setCareerIndex(index)}
                    onKeyDown={(event) => {
                      if (
                        ["ArrowDown", "ArrowUp", "Home", "End"].includes(
                          event.key,
                        )
                      ) {
                        event.preventDefault();
                        const next =
                          event.key === "Home"
                            ? 0
                            : event.key === "End"
                              ? career.length - 1
                              : (careerIndex +
                                  (event.key === "ArrowDown"
                                    ? 1
                                    : career.length - 1)) %
                                career.length;
                        setCareerIndex(next);
                        document.getElementById(`career-tab-${next}`)?.focus();
                      }
                    }}
                    className={index === careerIndex ? "active" : ""}
                  >
                    <span>{entry.year}</span>
                    <strong>{entry.club}</strong>
                    <ArrowUpRight size={19} />
                  </button>
                ))}
              </div>
              <div
                className="career-panel"
                role="tabpanel"
                id={`career-panel-${careerIndex}`}
                aria-labelledby={`career-tab-${careerIndex}`}
                tabIndex={0}
              >
                <span className="career-large-number" aria-hidden="true">
                  {item.number}
                </span>
                <div className="career-panel-top">
                  <span className="tag">
                    {careerIndex === 0 ? "ETAPA ACTUAL" : "TRAYECTORIA"}
                  </span>
                  <MapPin size={21} />
                </div>
                <div className="career-panel-body">
                  <span className="eyebrow">{item.label}</span>
                  <h3>{item.club}</h3>
                  <span className="career-place">{item.place}</span>
                  <p>{item.text}</p>
                  <div className="career-note">{item.note}</div>
                </div>
                <ExtLink href={item.url} className="career-source">
                  Leer sobre esta etapa <ArrowUpRight size={17} />
                </ExtLink>
              </div>
            </div>
          </div>
        </section>
        <section id="media" className="media-section section-shell">
          <div className="section-heading reveal">
            <div>
              <span className="eyebrow red">03 / DENTRO DEL CAMPO</span>
              <h2>
                EL JUEGO
                <br />
                <span>HABLA.</span>
              </h2>
            </div>
            <div
              className="media-tabs"
              role="tablist"
              aria-label="Material audiovisual"
              onKeyDown={(event) => {
                if (
                  ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
                ) {
                  event.preventDefault();
                  const next =
                    event.key === "Home"
                      ? "photos"
                      : event.key === "End"
                        ? "videos"
                        : mediaTab === "photos"
                          ? "videos"
                          : "photos";
                  setMediaTab(next);
                  document
                    .getElementById(
                      next === "photos" ? "photos-tab" : "videos-tab",
                    )
                    ?.focus();
                }
              }}
            >
              <button
                id="photos-tab"
                tabIndex={mediaTab === "photos" ? 0 : -1}
                role="tab"
                aria-selected={mediaTab === "photos"}
                aria-controls="photos-panel"
                onClick={() => setMediaTab("photos")}
                className={mediaTab === "photos" ? "active" : ""}
              >
                Fotografías <span>07</span>
              </button>
              <button
                id="videos-tab"
                tabIndex={mediaTab === "videos" ? 0 : -1}
                role="tab"
                aria-selected={mediaTab === "videos"}
                aria-controls="videos-panel"
                onClick={() => setMediaTab("videos")}
                className={mediaTab === "videos" ? "active" : ""}
              >
                Vídeo <Play size={13} />
              </button>
            </div>
          </div>
          {mediaTab === "photos" ? (
            <div role="tabpanel" id="photos-panel" aria-labelledby="photos-tab">
              <div className="gallery-grid">
                {photos.slice(0, 4).map((photo, i) => (
                  <button
                    className={`gallery-photo photo-${i}`}
                    key={photo.file}
                    onClick={() => setGalleryIndex(i)}
                    aria-label={`Ampliar: ${photo.title}`}
                  >
                    <img
                      src={imagePath(photo.file)}
                      alt={photo.caption}
                      loading="lazy"
                      style={{ objectPosition: photo.position }}
                    />
                    <span className="gallery-photo-overlay">
                      <span>{photo.title}</span>
                      <span className="gallery-plus">
                        <Plus size={20} />
                      </span>
                    </span>
                    <span className="gallery-photo-number">0{i + 1}</span>
                  </button>
                ))}
              </div>
              <div className="gallery-footer">
                <span>Instantes reales. Dentro del campo.</span>
                <button
                  className="text-link"
                  onClick={() => setGalleryIndex(0)}
                >
                  Explorar las 7 fotografías <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div
              className="video-empty"
              role="tabpanel"
              id="videos-panel"
              aria-labelledby="videos-tab"
            >
              <div className="video-still">
                <img
                  src={imagePath("pase.jpg")}
                  alt="Nicolás Rosas realizando un pase"
                  loading="lazy"
                />
                <span>
                  <Play size={35} />
                </span>
              </div>
              <div>
                <span className="eyebrow red">MATERIAL AUDIOVISUAL</span>
                <h3>
                  La próxima jugada,
                  <br />
                  en movimiento.
                </h3>
                <p>
                  Los highlights y partidos de Nicolás se incorporarán a este
                  espacio cuando estén disponibles.
                </p>
                <button
                  className="button outline-button"
                  onClick={() => setModal("contact")}
                >
                  Solicitar material de scouting <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          )}
        </section>
        <section id="seguimiento" className="follow-section">
          <div className="section-shell follow-layout">
            <div className="follow-copy reveal">
              <span className="eyebrow">04 / ACTUALIDAD</span>
              <h2>
                EL FÚTBOL
                <br />
                NO SE DETIENE<span>.</span>
              </h2>
              <p>
                Seguí la actualidad del Silva SD, consultá sus resultados y
                encontrá la programación de cada jornada.
              </p>
              <div className="follow-status">
                <span
                  className={
                    feed?.nextMatch?.status === "live"
                      ? "live-dot"
                      : "neutral-dot"
                  }
                />
                {feed
                  ? `Fuente conectada · ${feed.source.name}`
                  : loading
                    ? "Consultando datos…"
                    : "Canales de seguimiento del equipo"}
              </div>
              {status === "stale" || status === "error" ? (
                <span className="feed-note">
                  La conexión de datos no está disponible. Podés consultar los
                  canales externos.
                </span>
              ) : null}
            </div>
            <div className="follow-links reveal">
              {feed?.nextMatch && (
                <div className="next-match">
                  <span className="eyebrow">
                    {feed.nextMatch.status === "live"
                      ? "EN JUEGO"
                      : feed.nextMatch.status === "finished"
                        ? "FINALIZADO"
                        : "PRÓXIMO PARTIDO"}
                  </span>
                  <h3>
                    {feed.nextMatch.home}{" "}
                    <span>
                      {feed.nextMatch.homeScore !== undefined
                        ? `${feed.nextMatch.homeScore} — ${feed.nextMatch.awayScore}`
                        : "vs"}
                    </span>{" "}
                    {feed.nextMatch.away}
                  </h3>
                  <p>
                    {new Date(feed.nextMatch.kickoff).toLocaleString("es-ES")} ·{" "}
                    {feed.nextMatch.competition}
                  </p>
                  {feed.nextMatch.watchUrl && (
                    <ExtLink href={feed.nextMatch.watchUrl}>
                      Consultar emisión <ArrowUpRight size={15} />
                    </ExtLink>
                  )}
                </div>
              )}
              <ExtLink href="https://www.futgal.es/" className="follow-link">
                <span className="follow-icon">
                  <CalendarDays size={23} />
                </span>
                <div>
                  <span>COMPETICIÓN</span>
                  <h3>Resultados y calendario</h3>
                  <p>Consultar en la Federación Galega de Fútbol</p>
                </div>
                <ArrowUpRight size={25} />
              </ExtLink>
              <ExtLink href={clubUrl} className="follow-link">
                <span className="follow-icon">
                  <FileText size={23} />
                </span>
                <div>
                  <span>EL CLUB</span>
                  <h3>La actualidad del Silva</h3>
                  <p>Noticias, crónicas y vídeos del equipo</p>
                </div>
                <ArrowUpRight size={25} />
              </ExtLink>
              <button className="follow-link" onClick={() => setModal("watch")}>
                <span className="follow-icon">
                  <Radio size={23} />
                </span>
                <div>
                  <span>RETRANSMISIONES</span>
                  <h3>Dónde seguir los partidos</h3>
                  <p>Canales y programación deportiva</p>
                </div>
                <ArrowUpRight size={25} />
              </button>
              <p className="follow-disclaimer">
                Las emisiones y la cobertura dependen de cada jornada.{" "}
                {feed
                  ? "Los datos muestran la fecha de su última actualización."
                  : "Las cifras de esta página corresponden a la temporada indicada."}
              </p>
            </div>
          </div>
        </section>
        <section id="contacto" className="contact-section section-shell">
          <div className="contact-top reveal">
            <span className="eyebrow red">05 / CONTACTO</span>
            <span className="contact-location">
              <span className="neutral-dot" /> A CORUÑA, ESPAÑA
            </span>
          </div>
          <div className="contact-layout reveal">
            <div>
              <h2>
                HABLEMOS
                <br />
                DE <span>FÚTBOL.</span>
              </h2>
              <p>
                Para clubes, ojeadores, agencias y profesionales.
                <br />
                El próximo capítulo empieza con una conversación.
              </p>
              <div className="contact-actions">
                <ExtLink href={instagram} className="button red-button">
                  <Instagram size={19} /> Contactar por Instagram{" "}
                  <ArrowUpRight size={19} />
                </ExtLink>
                <button
                  className="text-link"
                  onClick={() => setModal("contact")}
                >
                  Preparar una propuesta <ArrowRight size={18} />
                </button>
              </div>
              <span className="contact-handle">@nicorosasd</span>
            </div>
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-art"
              aria-label="Ver el Instagram de Nicolás Rosas"
            >
              <img
                src={imagePath("rosas-19.jpg")}
                alt="Camiseta de Rosas, dorsal 19"
                loading="lazy"
              />
              <span className="contact-art-word">
                EL PRÓXIMO
                <br />
                CAPÍTULO.
              </span>
              <span className="contact-art-arrow">
                <ArrowUpRight size={40} />
              </span>
            </a>
          </div>
        </section>
      </main>
      <footer className="footer section-shell">
        <a href="#inicio" className="footer-brand">
          <Mark />
          <span>NICOLÁS ROSAS</span>
        </a>
        <span>© {new Date().getFullYear()} · Perfil deportivo</span>
        <div>
          <button onClick={() => setModal("sources")}>
            Fuentes y datos <ExternalLink size={12} />
          </button>
          <ExtLink href={instagram}>
            Instagram <ArrowUpRight size={12} />
          </ExtLink>
          <a href="#inicio" aria-label="Volver al inicio">
            <ArrowUpRight size={20} />
          </a>
        </div>
      </footer>
      <article id="print-profile">
        <div className="print-header">
          <Mark />
          <span>FICHA DEPORTIVA · NICOLÁS ROSAS</span>
        </div>
        <div className="print-content">
          <img src={imagePath("control.jpg")} alt="Nicolás Rosas" />
          <div>
            <h1>
              NICOLÁS
              <br />
              ROSAS
            </h1>
            <p>Defensa central · Argentina · {ageAt()} años</p>
            <dl>
              <dt>Fecha de nacimiento</dt>
              <dd>29.11.2005</dd>
              <dt>Club actual</dt>
              <dd>Silva SD · A Coruña</dd>
              <dt>Competición</dt>
              <dd>Tercera Federación · Grupo I</dd>
              <dt>Contacto</dt>
              <dd>instagram.com/nicorosasd</dd>
            </dl>
          </div>
        </div>
        <h2>Trayectoria</h2>
        <p>
          2026–actualidad · Silva SD
          <br />
          2025–26 · Céltiga FC
          <br />
          2024–25 · SD Negreira
          <br />
          2023–24 · SD Compostela / CD Conxo (juvenil)
          <br />
          2022–23 · Antalyaspor (experiencia formativa) / CD Proas
          <br />
          Formación en Argentina · Sportsman / Deportivo Mac Allister
        </p>
        <h2>Silva SD · Temporada 2025/26</h2>
        <p>6 partidos · 6 titularidades · 460 minutos</p>
        <small>
          Fuente: Silva SD, anuncio de renovación 02.07.2026.
          <br />
          {renewalUrl}
          <br />
          Perfil revisado el 24.10.2026. Fotografías facilitadas para el
          proyecto; créditos originales conservados.
        </small>
      </article>
      {galleryIndex !== null && (
        <Modal
          label="Galería de Nicolás Rosas"
          onClose={closeModal}
          className="lightbox"
        >
          <img
            className="lightbox-image"
            src={imagePath(photos[galleryIndex].file)}
            alt={photos[galleryIndex].caption}
          />
          <div className="lightbox-bottom">
            <div>
              <span className="eyebrow">
                {String(galleryIndex + 1).padStart(2, "0")} / 07
              </span>
              <p>{photos[galleryIndex].title}</p>
            </div>
            <div>
              <button
                className="icon-button"
                onClick={() =>
                  setGalleryIndex(
                    (galleryIndex + photos.length - 1) % photos.length,
                  )
                }
                aria-label="Fotografía anterior"
              >
                <ChevronLeft />
              </button>
              <button
                className="icon-button"
                onClick={() =>
                  setGalleryIndex((galleryIndex + 1) % photos.length)
                }
                aria-label="Fotografía siguiente"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </Modal>
      )}
      {modal === "contact" && (
        <Modal label="Preparar una propuesta profesional" onClose={closeModal}>
          <ContactForm />
        </Modal>
      )}
      {modal === "sources" && (
        <Modal label="Fuentes y datos del perfil" onClose={closeModal}>
          <span className="eyebrow red">TRANSPARENCIA</span>
          <h2>
            La historia,
            <br />
            con sus fuentes.
          </h2>
          <p>
            Perfil revisado el 24 de octubre de 2026. La ficha combina los datos
            facilitados para el proyecto con información pública contrastada.
          </p>
          <div className="sources-list">
            {sources.map((source) => (
              <ExtLink href={source.url} key={source.url}>
                <strong>
                  {source.name} <ArrowUpRight size={16} />
                </strong>
                <span>{source.detail}</span>
              </ExtLink>
            ))}
          </div>
          <p className="small-note">
            Las cifras 2025/26 son un registro histórico del Silva SD. La edad
            se calcula a partir del 29.11.2005. No se publican altura o peso sin
            confirmación. El Instagram fue facilitado para el proyecto.
            Fotografías con sus créditos originales conservados.
          </p>
        </Modal>
      )}
      {modal === "watch" && (
        <Modal label="Dónde seguir los partidos" onClose={closeModal}>
          <span className="eyebrow red">FÚTBOL GALLEGO</span>
          <h2>
            Cada jornada,
            <br />
            una nueva cita.
          </h2>
          <p>
            Consultá estos canales para encontrar noticias, resúmenes y posibles
            emisiones del Silva. La disponibilidad se confirma para cada
            encuentro.
          </p>
          <div className="sources-list">
            <ExtLink href="https://www.agalega.gal/">
              <strong>
                AGalega <ArrowUpRight size={18} />
              </strong>
              <span>Consultar la programación de la plataforma gallega.</span>
            </ExtLink>
            <ExtLink href="https://www.g24.gal/deportes">
              <strong>
                G24 Deportes <ArrowUpRight size={18} />
              </strong>
              <span>Actualidad y resúmenes del fútbol gallego.</span>
            </ExtLink>
            <ExtLink href={clubUrl}>
              <strong>
                Silva SD <ArrowUpRight size={18} />
              </strong>
              <span>Canales del club y anuncios de cada partido.</span>
            </ExtLink>
          </div>
          <p className="small-note">
            Todavía no hay una emisión concreta confirmada en este portfolio.
          </p>
        </Modal>
      )}
    </>
  );
}
