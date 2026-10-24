/** A public, same-origin or CORS-enabled JSON feed. Never expose provider keys here. */
export interface FootballFeed {
  updatedAt: string;
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
    kickoff: string;
    competition: string;
    status: "scheduled" | "live" | "finished";
    homeScore?: number;
    awayScore?: number;
    watchUrl?: string;
  };
}

export type FeedFreshness = "fresh" | "stale";

export const FEED_MAX_AGE_MS = 24 * 60 * 60 * 1_000;
export const LIVE_MAX_AGE_MS = 5 * 60 * 1_000;
const CLOCK_SKEW_MS = 30 * 1_000;

export class FootballFeedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FootballFeedError";
  }
}

function record(value: unknown, field: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new FootballFeedError(`${field} debe ser un objeto.`);
  }
  return value as Record<string, unknown>;
}

function text(value: unknown, field: string, limit = 150): string {
  if (typeof value !== "string" || !value.trim() || value.length > limit) {
    throw new FootballFeedError(`${field} debe ser un texto válido.`);
  }
  return value.trim();
}

function integer(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new FootballFeedError(`${field} debe ser un entero no negativo.`);
  }
  return value;
}

function url(value: unknown, field: string): string {
  const candidate = text(value, field, 2_048);
  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new FootballFeedError(`${field} debe ser una URL absoluta.`);
  }
  if (
    !["https:", "http:"].includes(parsed.protocol) ||
    parsed.username ||
    parsed.password
  ) {
    throw new FootballFeedError(
      `${field} debe ser una URL HTTP(S) sin credenciales.`,
    );
  }
  return parsed.href;
}

function timestamp(value: unknown, field: string): string {
  const candidate = text(value, field, 40);
  // Require an explicit timezone; avoid interpreting a provider's local time as the visitor's.
  const match =
    /^(\d{4})-(\d{2})-(\d{2})T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(?:\.\d{1,3})?(?:Z|[+-](?:0\d|1[0-4]):[0-5]\d)$/.exec(
      candidate,
    );
  if (!match || !Number.isFinite(Date.parse(candidate))) {
    throw new FootballFeedError(
      `${field} debe ser una fecha ISO 8601 con zona horaria.`,
    );
  }
  const [, year, month, day] = match;
  const calendarDay = new Date(`${year}-${month}-${day}T00:00:00Z`);
  // Date.parse normalizes values such as February 30; reject these instead of silently changing them.
  if (calendarDay.toISOString().slice(0, 10) !== `${year}-${month}-${day}`) {
    throw new FootballFeedError(`${field} contiene una fecha inexistente.`);
  }
  return candidate;
}

/** Validate and copy only the supported fields; missing statistics are never converted to zero. */
export function parseFootballFeed(raw: unknown): FootballFeed {
  const input = record(raw, "feed");
  const source = record(input.source, "source");
  const stats = record(input.stats, "stats");
  const feed: FootballFeed = {
    updatedAt: timestamp(input.updatedAt, "updatedAt"),
    source: {
      name: text(source.name, "source.name", 120),
      url: url(source.url, "source.url"),
    },
    season: text(input.season, "season", 32),
    stats: {
      appearances: integer(stats.appearances, "stats.appearances"),
      starts: integer(stats.starts, "stats.starts"),
      minutes: integer(stats.minutes, "stats.minutes"),
      goals: integer(stats.goals, "stats.goals"),
    },
  };
  if (feed.stats.starts > feed.stats.appearances) {
    throw new FootballFeedError(
      "Las titularidades no pueden superar los partidos jugados.",
    );
  }

  if (input.nextMatch !== undefined) {
    const match = record(input.nextMatch, "nextMatch");
    if (
      match.status !== "scheduled" &&
      match.status !== "live" &&
      match.status !== "finished"
    ) {
      throw new FootballFeedError("nextMatch.status no es válido.");
    }
    feed.nextMatch = {
      home: text(match.home, "nextMatch.home", 100),
      away: text(match.away, "nextMatch.away", 100),
      kickoff: timestamp(match.kickoff, "nextMatch.kickoff"),
      competition: text(match.competition, "nextMatch.competition"),
      status: match.status,
    };
    const hasHomeScore = match.homeScore !== undefined;
    const hasAwayScore = match.awayScore !== undefined;
    if (hasHomeScore !== hasAwayScore) {
      throw new FootballFeedError(
        "El marcador debe incluir los goles de ambos equipos.",
      );
    }
    if (hasHomeScore) {
      feed.nextMatch.homeScore = integer(
        match.homeScore,
        "nextMatch.homeScore",
      );
      feed.nextMatch.awayScore = integer(
        match.awayScore,
        "nextMatch.awayScore",
      );
    }
    if (match.watchUrl !== undefined) {
      feed.nextMatch.watchUrl = url(match.watchUrl, "nextMatch.watchUrl");
    }
    if (
      feed.nextMatch.status === "live" &&
      getFeedFreshness(feed) === "stale"
    ) {
      throw new FootballFeedError(
        "El dato en directo tiene más de cinco minutos o una fecha futura.",
      );
    }
  }
  return feed;
}

/** A live badge expires after five minutes; ordinary snapshots expire after 24 hours. */
export function getFeedFreshness(
  feed: FootballFeed,
  now: number | Date = Date.now(),
): FeedFreshness {
  const time = now instanceof Date ? now.getTime() : now;
  const age = time - Date.parse(feed.updatedAt);
  const maxAge =
    feed.nextMatch?.status === "live" ? LIVE_MAX_AGE_MS : FEED_MAX_AGE_MS;
  return Number.isFinite(time) &&
    Number.isFinite(age) &&
    age >= -CLOCK_SKEW_MS &&
    age <= maxAge
    ? "fresh"
    : "stale";
}
