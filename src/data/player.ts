export const instagram = "https://www.instagram.com/nicorosasd/";
export const clubUrl = "https://clubsilva.com/";
export const renewalUrl =
  "https://clubsilva.com/nico-rosas-decima-renovacion-del-silva2627/";
export const sources = [
  {
    name: "Silva SD · Renovación 2026/27",
    detail:
      "Club actual, trayectoria reciente y estadísticas 2025/26. Publicado el 02.07.2026.",
    url: renewalUrl,
  },
  {
    name: "La Voz de Galicia · Perfil de Nico Rosas",
    detail: "Formación, posición y recorrido hasta SD Negreira. 11.12.2024.",
    url: "https://www.lavozdegalicia.es/noticia/santiago/2024/12/11/joven-argentino-crece-garcia-calvo/0003_202412S11P48994.htm",
  },
  {
    name: "7enpunto · Etapa en CD Proas",
    detail:
      "Experiencia en Turquía, formación argentina y llegada al primer equipo de Proas. 30.01.2023.",
    url: "https://www.7enpunto.com/noticias/2023/01/30/171253-nicolas-rosas-debuto-en-la-primera-division-del-cd-proas-de-madrid",
  },
  {
    name: "BeSoccer · Ficha del jugador",
    detail:
      "Fecha de nacimiento y nacionalidad, coincidentes con los datos facilitados.",
    url: "https://es.besoccer.com/jugador/n-rosas-3502532",
  },
];
export const career = [
  {
    year: "2026 — HOY",
    club: "Silva SD",
    place: "A Coruña, España",
    label: "TERCERA FEDERACIÓN · GRUPO I",
    text: "Un nuevo capítulo en el fútbol nacional. Llegó en enero de 2026 desde el Céltiga y renovó para la temporada 2026/27, su segunda campaña con el club coruñés.",
    note: "Vínculo anunciado hasta junio de 2027.",
    url: renewalUrl,
    number: "01",
  },
  {
    year: "2025 — 2026",
    club: "Céltiga FC",
    place: "A Illa de Arousa, España",
    label: "FÚTBOL GALLEGO",
    text: "Tras su paso por Negreira, continuó su recorrido en el Céltiga. Desde el conjunto de A Illa dio el salto al Silva en el mercado de enero de 2026.",
    note: "La procedencia está confirmada por el Silva SD.",
    url: renewalUrl,
    number: "02",
  },
  {
    year: "2024 — 2025",
    club: "SD Negreira",
    place: "Negreira, España",
    label: "PREFERENTE GALICIA",
    text: "Una etapa de crecimiento en el fútbol sénior gallego. Se incorporó en el verano de 2024, después de completar su etapa juvenil en Santiago de Compostela.",
    note: "Su primera temporada sénior en Galicia.",
    url: sources[1].url,
    number: "03",
  },
  {
    year: "2023 — 2024",
    club: "Compostela / Conxo",
    place: "Santiago de Compostela, España",
    label: "FÚTBOL JUVENIL · DIVISIÓN DE HONOR",
    text: "Llegó al Conxo juvenil en 2023 y terminó su formación juvenil en la SD Compostela, con ocho participaciones en División de Honor entre enero y mayo de 2024.",
    note: "Dos etapas dentro del fútbol formativo de Santiago.",
    url: sources[1].url,
    number: "04",
  },
  {
    year: "2022 — 2023",
    club: "De Turquía a Madrid",
    place: "Antalya → Madrid",
    label: "ANTALYASPOR · CD PROAS",
    text: "Con 16 años viajó a Turquía para una experiencia formativa con Antalyaspor. Las limitaciones federativas por ser menor lo llevaron a continuar en España, donde se incorporó al primer equipo del CD Proas.",
    note: "La etapa en Turquía no se presenta como un debut profesional.",
    url: sources[2].url,
    number: "05",
  },
  {
    year: "LOS INICIOS",
    club: "Raíces argentinas",
    place: "Argentina",
    label: "SPORTSMAN · DEPORTIVO MAC ALLISTER",
    text: "Sus primeros pasos fueron en Sportsman, antes de continuar su formación en Deportivo Mac Allister. El punto de partida de un camino que lo llevaría al fútbol europeo.",
    note: "Formación documentada en la prensa de su lugar de origen.",
    url: sources[2].url,
    number: "06",
  },
];
export const photos = [
  {
    file: "accion.jpg",
    title: "Con el balón, hacia adelante.",
    caption: "Nicolás Rosas durante un partido con el Silva SD.",
    position: "center 60%",
  },
  {
    file: "duelo.jpg",
    title: "Cada balón se disputa.",
    caption: "Una acción de juego con la camiseta del Silva SD.",
    position: "center 54%",
  },
  {
    file: "rosas-19.jpg",
    title: "Un nombre. Un camino.",
    caption: "Rosas, de espaldas con el dorsal 19.",
    position: "center 48%",
  },
  {
    file: "pase.jpg",
    title: "La siguiente jugada.",
    caption: "Nicolás Rosas en una acción de pase.",
    position: "center 58%",
  },
  {
    file: "control.jpg",
    title: "El juego, de frente.",
    caption: "Control de balón durante un partido del Silva SD.",
    position: "center 55%",
  },
  {
    file: "carrera.jpg",
    title: "Siempre en movimiento.",
    caption: "Rosas en carrera con el dorsal 19.",
    position: "center 50%",
  },
  {
    file: "concentracion.jpg",
    title: "Dentro del partido.",
    caption: "Nicolás Rosas en el terreno de juego.",
    position: "center 53%",
  },
];
export function ageAt(date = new Date()) {
  return (
    date.getFullYear() -
    2005 -
    (date.getMonth() < 10 || (date.getMonth() === 10 && date.getDate() < 29)
      ? 1
      : 0)
  );
}
export const imagePath = (file: string) =>
  `${import.meta.env.BASE_URL}images/${file}`;
