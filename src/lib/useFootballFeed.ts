import { useEffect, useState } from "react";
import { getFeedFreshness, parseFootballFeed } from "./footballFeed";
import type { FootballFeed } from "./footballFeed";

export type FootballFeedStatus =
  "unconfigured" | "loading" | "ready" | "stale" | "error";

export interface FootballFeedState {
  /** Only fresh, validated data. Null means the UI should show its sourced historical fallback. */
  feed: FootballFeed | null;
  loading: boolean;
  error: string | null;
  status: FootballFeedStatus;
}

const POLL_INTERVAL_MS = 60_000;
const REQUEST_TIMEOUT_MS = 12_000;
const emptyState: FootballFeedState = {
  feed: null,
  loading: false,
  error: null,
  status: "unconfigured",
};

/**
 * Optional public feed. A private provider must be connected through a backend first.
 * Endpoint servers must allow this site's origin (CORS); no credentials are sent.
 */
export function useFootballFeed(
  endpoint: string | undefined = import.meta.env.VITE_FOOTBALL_FEED_URL,
): FootballFeedState {
  const [state, setState] = useState<FootballFeedState>(emptyState);

  useEffect(() => {
    if (!endpoint?.trim()) {
      setState(emptyState);
      return;
    }

    let endpointUrl: URL;
    try {
      endpointUrl = new URL(endpoint.trim(), window.location.href);
      if (
        !["https:", "http:"].includes(endpointUrl.protocol) ||
        endpointUrl.username ||
        endpointUrl.password
      ) {
        throw new Error("invalid endpoint");
      }
    } catch {
      setState({
        ...emptyState,
        status: "error",
        error: "La dirección del feed deportivo no es válida.",
      });
      return;
    }

    let disposed = false;
    let request: AbortController | null = null;
    let latest: FootballFeed | null = null;
    setState({ feed: null, loading: true, error: null, status: "loading" });

    const freshFeed = () =>
      latest && getFeedFreshness(latest) === "fresh" ? latest : null;

    async function update() {
      if (disposed || document.visibilityState === "hidden" || request) return;
      const controller = new AbortController();
      request = controller;
      const timeout = window.setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT_MS,
      );
      const previous = freshFeed();
      setState({
        feed: previous,
        loading: true,
        error: null,
        status: previous ? "ready" : "loading",
      });
      try {
        const response = await fetch(endpointUrl.href, {
          signal: controller.signal,
          credentials: "omit",
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const feed = parseFootballFeed(await response.json());
        if (disposed) return;
        if (getFeedFreshness(feed) === "stale") {
          latest = null;
          setState({
            feed: null,
            loading: false,
            status: "stale",
            error: "La fuente no tiene una actualización reciente.",
          });
        } else {
          latest = feed;
          setState({ feed, loading: false, error: null, status: "ready" });
        }
      } catch {
        if (disposed) return;
        const feed = freshFeed();
        setState({
          feed,
          loading: false,
          status: "error",
          error: "No se pudo actualizar la información deportiva.",
        });
      } finally {
        window.clearTimeout(timeout);
        if (request === controller) request = null;
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        const feed = freshFeed();
        if (!feed && latest)
          setState({
            feed: null,
            loading: false,
            error: null,
            status: "stale",
          });
        void update();
      } else {
        request?.abort();
      }
    }

    void update();
    const interval = window.setInterval(() => {
      void update();
    }, POLL_INTERVAL_MS);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      disposed = true;
      request?.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [endpoint]);

  // Expire data on any re-render as well as on each poll/visibility change.
  if (state.feed && getFeedFreshness(state.feed) === "stale") {
    return { ...state, feed: null, status: "stale" };
  }
  return state;
}
