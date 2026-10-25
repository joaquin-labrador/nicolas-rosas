// Datos verificables y enlaces: independientes del idioma y de React.
export const PLAYER = {
  firstName: "Nicolás",
  lastName: "Rosas",
  fullName: "Nicolás Rosas",
  birthDate: "2005-11-29",
  birthYear: "2005",
  nationalityCode: "ARG",
  club: "Silva SD",
  location: "A Coruña",
  clubAndLocation: "Silva SD · A Coruña",
  currentSeason: "2026 / 27",
  instagramHandle: "@nicorosasd",
  instagramProfile: "instagram.com/nicorosasd",
  reviewedAt: "2026-10-24",
} as const;

export const LINKS = {
  instagram: "https://www.instagram.com/nicorosasd/",
  club: "https://clubsilva.com/",
  renewal: "https://clubsilva.com/nico-rosas-decima-renovacion-del-silva2627/",
  federation: "https://www.futgal.es/",
  agalega: "https://www.agalega.gal/",
  g24: "https://www.g24.gal/deportes",
} as const;

export const HISTORICAL_STATS = {
  season: "2025 / 26",
  appearances: 6,
  starts: 6,
  minutes: 460,
  publishedAt: "2026-07-02",
} as const;

export const SOURCE_URLS = [
  LINKS.renewal,
  "https://www.lavozdegalicia.es/noticia/santiago/2024/12/11/joven-argentino-crece-garcia-calvo/0003_202412S11P48994.htm",
  "https://www.7enpunto.com/noticias/2023/01/30/171253-nicolas-rosas-debuto-en-la-primera-division-del-cd-proas-de-madrid",
  "https://es.besoccer.com/jugador/n-rosas-3502532",
] as const;

export const CAREER_SOURCES = [
  SOURCE_URLS[0],
  SOURCE_URLS[0],
  SOURCE_URLS[1],
  SOURCE_URLS[1],
  SOURCE_URLS[2],
  SOURCE_URLS[2],
] as const;

export const PHOTOS = [
  { file: "accion.jpg", position: "center 60%" },
  { file: "duelo.jpg", position: "center 54%" },
  { file: "rosas-19.jpg", position: "center 48%" },
  { file: "pase.jpg", position: "center 58%" },
  { file: "control.jpg", position: "center 55%" },
  { file: "carrera.jpg", position: "center 50%" },
  { file: "concentracion.jpg", position: "center 53%" },
] as const;

export const WATCH_CHANNELS = [
  { name: "AGalega", url: LINKS.agalega },
  { name: "G24 Deportes", url: LINKS.g24 },
  { name: PLAYER.club, url: LINKS.club },
] as const;

export const imagePath = (file: string) =>
  import.meta.env.BASE_URL + "images/" + file;
