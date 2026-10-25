// Node 22+: node --experimental-strip-types --test tests/*.test.ts
import test from "node:test";
import assert from "node:assert/strict";
import {
  formatDate,
  formatDateTime,
  formatMessage,
  pickInitialLanguage,
} from "../src/i18n/helpers.ts";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_OPTIONS,
  LANGUAGE_STORAGE_KEY,
  getLanguageLocale,
  isLanguage,
} from "../src/i18n/languages.ts";
import { translations } from "../src/i18n/translations.ts";
import {
  CAREER_SOURCES,
  PHOTOS,
  SOURCE_URLS,
  WATCH_CHANNELS,
} from "../src/data/player.ts";
import { CONTACT_REASONS } from "../src/data/contact.ts";

type Leaf = { path: string; value: string };

function leaves(value: unknown, path = ""): Leaf[] {
  if (typeof value === "string") return [{ path, value }];
  assert.ok(
    value !== null && typeof value === "object",
    path + " must contain strings, objects or arrays",
  );
  return Object.entries(value).flatMap(([key, child]) =>
    leaves(child, path ? path + "." + key : key),
  );
}

function shape(value: unknown): unknown {
  if (typeof value === "string") return "string";
  if (Array.isArray(value)) return value.map(shape);
  assert.ok(value !== null && typeof value === "object");
  return Object.fromEntries(
    Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, child]) => [key, shape(child)]),
  );
}

function placeholders(value: string): string[] {
  return [
    ...new Set([...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1])),
  ].sort();
}

test("five supported languages have unique codes and usable locales", () => {
  const expected = ["en", "es", "fr", "it", "pt"];
  assert.deepEqual(LANGUAGE_OPTIONS.map(({ code }) => code).sort(), expected);
  assert.deepEqual(Object.keys(translations).sort(), expected);
  assert.equal(DEFAULT_LANGUAGE, "es");
  assert.equal(LANGUAGE_STORAGE_KEY, "nicolas-rosas.language");
  for (const option of LANGUAGE_OPTIONS) {
    assert.ok(option.label.trim());
    assert.ok(option.shortLabel.trim());
    assert.equal(isLanguage(option.code), true);
    assert.equal(getLanguageLocale(option.code), option.locale);
    assert.doesNotThrow(() => new Intl.DateTimeFormat(option.locale));
  }
  for (const unsupported of [
    undefined,
    null,
    "",
    "de",
    "EN",
    "en-GB",
    0,
    {},
    ["es"],
  ]) {
    assert.equal(isLanguage(unsupported), false);
  }
});

for (const { code } of LANGUAGE_OPTIONS) {
  test(
    code +
      ": every translation key, array item and interpolation parameter is present",
    () => {
      const dictionary = translations[code];
      const baseline = new Map(
        leaves(translations.es).map(({ path, value }) => [path, value]),
      );
      assert.deepEqual(
        shape(dictionary),
        shape(translations.es),
        code + " has missing/extra keys or array items",
      );
      for (const { path, value } of leaves(dictionary)) {
        assert.ok(value.trim(), code + "." + path + " is empty");
        assert.deepEqual(
          placeholders(value),
          placeholders(baseline.get(path)!),
          code + "." + path + " changes required parameters",
        );
        const parameters = Object.fromEntries(
          placeholders(value).map((key) => [key, "VALUE_" + key]),
        );
        const rendered = formatMessage(value, parameters);
        assert.doesNotMatch(
          rendered,
          /\{\w+\}/,
          code + "." + path + " leaves an unresolved parameter",
        );
      }
      assert.equal(
        dictionary.career.entries.length,
        CAREER_SOURCES.length,
        "career text must remain aligned with its evidence links",
      );
      assert.equal(
        dictionary.media.photos.length,
        PHOTOS.length,
        "all gallery images need translated titles and alt text",
      );
      assert.equal(
        dictionary.sources.entries.length,
        SOURCE_URLS.length,
        "all evidence links need translated descriptions",
      );
      assert.equal(
        dictionary.watch.channels.length,
        WATCH_CHANNELS.length,
        "all broadcast links need translated descriptions",
      );
      assert.equal(
        dictionary.form.reasons.length,
        CONTACT_REASONS.length,
        "stable contact reason IDs need corresponding translated options",
      );
      assert.equal(
        dictionary.print.career.length,
        CAREER_SOURCES.length,
        "print profile must include every career stage",
      );
    },
  );
}

test("English translates navigation, media, form, dialogs, print and metadata instead of copying Spanish", () => {
  const en = translations.en;
  const es = translations.es;
  const translatedPairs = [
    [en.nav.player, es.nav.player],
    [en.hero.summary, es.hero.summary],
    [en.media.galleryLabel, es.media.galleryLabel],
    [en.form.namePlaceholder, es.form.namePlaceholder],
    [en.form.draft, es.form.draft],
    [en.sources.description, es.sources.description],
    [en.watch.note, es.watch.note],
    [en.print.summary, es.print.summary],
    [en.meta.description, es.meta.description],
    [en.accessibility.closeDialog, es.accessibility.closeDialog],
  ];
  for (const [english, spanish] of translatedPairs)
    assert.notEqual(english, spanish);
  assert.match(en.hero.summary, /Silva SD/);
  assert.match(en.meta.title, /Nicol\u00e1s Rosas/);
});

test("message interpolation supports reordered/repeated parameters, zero and plain user text", () => {
  assert.equal(
    formatMessage("{goals} goals / {minutes} minutes / {goals}", {
      minutes: 0,
      goals: 0,
    }),
    "0 goals / 0 minutes / 0",
  );
  assert.equal(
    formatMessage("{second}, {first}", { first: "A", second: "B" }),
    "B, A",
  );
  assert.equal(
    formatMessage("Message: {message}", {
      message: "$& <script>text only</script>",
    }),
    "Message: $& <script>text only</script>",
  );
  assert.equal(
    formatMessage("Hello {name}", { name: "", unused: "ignored" }),
    "Hello ",
  );
  assert.equal(formatMessage("No parameters", {}), "No parameters");
});

test("missing, undefined, null and inherited interpolation values fail instead of leaking undefined", () => {
  assert.throws(() => formatMessage("Hello {name}", {}), /name/);
  for (const name of [undefined, null]) {
    assert.throws(
      () =>
        formatMessage("Hello {name}", { name } as unknown as Record<
          string,
          string | number
        >),
      /name/,
    );
  }
  assert.throws(
    () => formatMessage("Hello {name}", Object.create({ name: "inherited" })),
    /name/,
  );
});

test("shared URL language wins over saved choice and browser preference", () => {
  assert.equal(
    pickInitialLanguage({
      queryLanguage: "fr",
      storedLanguage: "it",
      browserLanguages: ["en-GB"],
    }),
    "fr",
  );
  assert.equal(
    pickInitialLanguage({
      queryLanguage: "pt",
      storedLanguage: "es",
      browserLanguages: ["en-US"],
    }),
    "pt",
  );
});

test("saved choice wins when URL language is absent or unsupported", () => {
  for (const queryLanguage of [undefined, null, "", "de", "invalid"]) {
    assert.equal(
      pickInitialLanguage({
        queryLanguage,
        storedLanguage: "it",
        browserLanguages: ["en-GB", "fr-FR"],
      }),
      "it",
    );
  }
});

test("browser preference uses the first supported language and regional/case variants", () => {
  assert.equal(
    pickInitialLanguage({
      queryLanguage: "invalid",
      storedLanguage: "invalid",
      browserLanguages: ["de-DE", "EN-us", "fr-CA"],
    }),
    "en",
  );
  assert.equal(
    pickInitialLanguage({ browserLanguages: ["pt-BR", "es-ES"] }),
    "pt",
  );
  assert.equal(
    pickInitialLanguage({ browserLanguages: ["zh-Hant-TW", "it-CH"] }),
    "it",
  );
  assert.equal(pickInitialLanguage({ browserLanguages: ["FR"] }), "fr");
});

test("Spanish remains the deterministic fallback without browser or saved preferences", () => {
  assert.equal(pickInitialLanguage({}), "es");
  assert.equal(
    pickInitialLanguage({
      queryLanguage: "xx",
      storedLanguage: null,
      browserLanguages: ["de", "zh-CN"],
    }),
    "es",
  );
});

test("birth dates retain the calendar day and use each selected language", () => {
  assert.equal(formatDate("en", "2005-11-29"), "29 November 2005");
  assert.match(formatDate("es", "2005-11-29"), /29.*noviembre.*2005/);
  assert.match(formatDate("pt", "2005-11-29"), /29.*novembro.*2005/);
  assert.match(formatDate("it", "2005-11-29"), /29.*novembre.*2005/);
  assert.match(formatDate("fr", "2005-11-29"), /29.*novembre.*2005/);
  assert.notEqual(
    formatDate("en", "2005-11-29", "short"),
    formatDate("en", "2005-11-29", "long"),
  );
  assert.throws(() => formatDate("en", "not-a-date"), RangeError);
});

test("match times use Madrid winter/summer offsets while date text follows selected language", () => {
  assert.match(formatDateTime("en", "2026-01-15T12:30:00Z"), /13:30/);
  assert.match(formatDateTime("en", "2026-07-15T12:30:00Z"), /14:30/);
  assert.notEqual(
    formatDateTime("en", "2026-07-15T12:30:00Z"),
    formatDateTime("es", "2026-07-15T12:30:00Z"),
  );
});
