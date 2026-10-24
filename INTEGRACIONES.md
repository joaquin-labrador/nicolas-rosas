# Integraciones deportivas

Documento técnico · Investigación: 24/10/2026

La landing funciona como sitio estático React + TypeScript. La conexión deportiva es **opcional** y acepta un feed JSON público de solo lectura. El proveedor, la cuenta y el proxy todavía deben configurarse antes de ofrecer actualizaciones automáticas. No se afirma que exista cobertura en directo de Nicolás Rosas ni una retransmisión de cada partido.

## Qué se puede mostrar ahora

Los datos históricos del sitio tienen temporada y fuente. La [renovación publicada por Silva SD](https://clubsilva.com/nico-rosas-decima-renovacion-del-silva2627/) permite documentar su primera campaña y continuidad en 2026/27. Es una publicación editorial; no es un feed en vivo.

Para seguir al equipo, usar enlaces a [Silva SD](https://clubsilva.com/), [Futgal / RFGF](https://www.futgal.es/), [G24 Deportes](https://www.g24.gal/deportes) y [AGalega](https://www.agalega.gal/). El club publica resúmenes; la disponibilidad de una emisión debe comprobarse para cada jornada. «Consultar programación» es el texto adecuado mientras no exista un enlace específico confirmado.

## Proveedores investigados

| Opción | Evidencia encontrada | Qué queda pendiente |
| --- | --- | --- |
| [API-Football: cobertura](https://www.api-football.com/coverage) | Incluye Tercera División RFEF — Group 1 en su catálogo. | Validar temporada, ID del Silva, identidad de Nicolás y campos realmente disponibles con una cuenta. |
| [API-Football: documentación](https://www.api-football.com/documentation_v3) | Expone calendario, resultados y cobertura por temporada. | Comprobar las respuestas reales; estar en el catálogo no garantiza seguimiento en directo ni estadísticas individuales. |
| [BeSoccer API](https://api.besoccer.com/) | Ofrece datos de equipos, jugadores y encuentros. | Solicitar prueba/presupuesto y confirmar expresamente Grupo I, Silva y Nicolás en 2026/27. |
| [BeSoccer: presupuestos y operaciones](https://api.besoccer.com/es/presupuestos) | Enumera trayectoria, estadísticas, partidos y televisión; no ofrece cuentas gratuitas. | Acordar cobertura, licencia, cuota y nivel de detalle. |
| [Federación](https://www.futgal.es/) y [club](https://clubsilva.com/) | Fuentes oficiales para contraste y enlaces. | No se ha verificado una API pública documentada para consumo desde la landing. |

El [tutorial oficial de API-Football](https://www.api-football.com/news/post/how-to-get-started-with-api-football-the-complete-beginners-guide) explica el alta y las cuotas. La [información legal de BeSoccer](https://es.besoccer.com/legal) distingue la información pública sobre la API de la contratación de su uso. No se ha contratado ningún servicio.

También se exploró la posible API WordPress del club para novedades. Su disponibilidad y CORS no se pudieron comprobar; no forma parte de una integración operativa.

## Arquitectura propuesta

```text
API-Football o BeSoccer
        │ clave privada + respuestas del proveedor
        ▼
Función serverless / proxy propio
        │ valida identidad, temporada, cobertura y fecha
        │ normaliza, limita peticiones y cachea
        ▼
GET /api/football → JSON público sin secretos
        │
        ▼
Landing React
```

Una función serverless permite conservar la landing estática sin añadir un servidor persistente. El proxy debe usar una configuración fija de jugador y competición; no debe reenviar libremente URLs o consultas indicadas por el visitante.

Guardar credenciales exclusivamente en variables del entorno del servidor, por ejemplo `API_FOOTBALL_KEY` o `BESOCCER_API_KEY`. **Toda variable `VITE_*` termina en código público del navegador.** `VITE_FOOTBALL_FEED_URL` contiene solamente una URL pública, nunca un token, contraseña o URL con credenciales.

## Configuración del frontend

Sin configuración, la landing conserva el contenido editorial y enlaces externos.

Para conectar un endpoint del mismo dominio, crear `.env.local`:

```dotenv
VITE_FOOTBALL_FEED_URL=/api/football
```

También se admite una URL absoluta pública, por ejemplo `https://datos.example.com/football`. En ese caso el servidor debe permitir mediante CORS el origen de la landing, incluido el origen local durante desarrollo. El cliente no envía cookies ni credenciales. El servidor debe responder a `GET` con `Content-Type: application/json` y código `200` solo cuando tenga un payload válido. Después de modificar variables Vite, reiniciar desarrollo o reconstruir la aplicación.

## Contrato del feed

```ts
interface FootballFeed {
  updatedAt: string; // ISO 8601, con Z o desplazamiento horario explícito
  source: { name: string; url: string };
  season: string;
  stats: {
    appearances: number;
    starts: number;
    minutes: number;
    goals: number;
  };
  nextMatch?: {
    home: string;
    away: string;
    kickoff: string; // ISO 8601 con zona horaria
    competition: string;
    status: 'scheduled' | 'live' | 'finished';
    homeScore?: number;
    awayScore?: number;
    watchUrl?: string;
  };
}
```

Reglas de datos:

- `stats` describe exclusivamente la temporada de `season` y al jugador configurado. Todos sus campos son obligatorios y deben ser enteros no negativos. `starts` no puede superar `appearances`.
- **Un valor desconocido no es cero.** Si falta una estadística obligatoria, no fabricar un payload: responder con un error de disponibilidad y dejar que se muestre el contenido histórico. Para aceptar estadísticas parciales habría que ampliar el contrato y la interfaz de manera explícita.
- `updatedAt` representa la última comprobación real y correcta de los datos con el proveedor. No cambiarlo en cada visita si no hubo una comprobación nueva; mantenerlo al servir una respuesta cacheada.
- `source.name` y `source.url` identifican la procedencia. Las URLs de fuente y emisión deben ser absolutas HTTP(S), sin credenciales; usar HTTPS en producción.
- `nextMatch` es opcional. El mismo objeto puede conservar el encuentro seleccionado durante su desarrollo y al finalizarlo. No deducir el estado por la hora del navegador: usar el estado confirmado del proveedor.
- Si se incluye marcador, enviar **ambos** valores. Omitirlos cuando no estén disponibles.
- `watchUrl` solo debe incluirse después de verificar una emisión del encuentro en el canal o plataforma con derechos. El proxy debería mantener una lista de dominios permitidos. Una página genérica de apuestas o un listado automático no confirma una retransmisión.

### Ejemplo ficticio de documentación

**Los equipos, cifras y fecha siguientes son inventados. No corresponden a Nicolás ni a Silva y no deben cargarse como datos de producción.**

```json
{
  "updatedAt": "2030-01-15T12:00:00Z",
  "source": {
    "name": "Proveedor de ejemplo — datos ficticios",
    "url": "https://example.com/fuente"
  },
  "season": "2029/30",
  "stats": {
    "appearances": 12,
    "starts": 9,
    "minutes": 845,
    "goals": 1
  },
  "nextMatch": {
    "home": "Equipo Local",
    "away": "Equipo Visitante",
    "kickoff": "2030-01-20T16:00:00Z",
    "competition": "Competición de ejemplo",
    "status": "scheduled"
  }
}
```

## Actualización y fallos

El cliente consulta al abrir la página y después cada **60 segundos** mientras la pestaña está visible. Al volver a ella solicita una actualización. Cada petición tiene un límite de 12 segundos y no se superpone con otra.

Se considera reciente una lectura de hasta **24 horas**; si el encuentro viene con estado `live`, el máximo es **5 minutos**. Se admite un desfase de reloj de hasta 30 segundos hacia el futuro. El cliente descarta payloads inválidos y datos caducados. Ante un fallo puede conservar una lectura anterior únicamente mientras siga vigente; si no existe, utiliza el contenido histórico con fuente. Un error no se convierte en una tabla de ceros ni en un marcador simulado.

La consulta del navegador cada minuto no exige llamar al proveedor cada minuto por visitante. El proxy debe compartir caché, proteger la cuota y ajustar sus consultas a la cobertura y al plan. Durante partidos realmente cubiertos se puede usar una cadencia mayor; fuera de ellos, espaciar actualizaciones. Comprobar cuotas antes de activar tráfico público.

## Pasos antes de habilitar datos automáticos

1. Obtener cuenta o prueba y confirmar permiso de publicación de los campos requeridos.
2. Resolver IDs y contrastar **Nicolás Rosas, nacido el 29/11/2005**, con club y temporada; evitar homónimos y fichas con fecha diferente.
3. Verificar respuestas del jugador y varios encuentros. Si solo existen resultados finales, presentarlos como resultados finales.
4. Crear el proxy, guardar secretos en su entorno y producir el contrato anterior.
5. Probar datos válidos, campos ausentes, cuotas agotadas, CORS y lecturas caducadas. Confirmar que no aparece una etiqueta de directo sin cobertura real.
6. Configurar `VITE_FOOTBALL_FEED_URL` y reconstruir la landing.

La integración está preparada para un proveedor futuro. **Hasta conectar y validar esa fuente, la web no tiene estadísticas en tiempo real.**
