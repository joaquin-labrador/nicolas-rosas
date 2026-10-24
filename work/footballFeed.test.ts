// Run with Node 22+: node --experimental-strip-types --test work/footballFeed.test.ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { FEED_MAX_AGE_MS, LIVE_MAX_AGE_MS, getFeedFreshness, parseFootballFeed } from '../src/lib/footballFeed.ts';

const now = Date.now();
const fixture = () => ({
  updatedAt: new Date(now).toISOString(),
  source: { name: 'Club / proveedor autorizado', url: 'https://example.com/player' },
  season: '2026/27',
  stats: { appearances: 4, starts: 2, minutes: 180, goals: 1 },
  nextMatch: {
    home: 'Equipo local', away: 'Equipo visitante',
    kickoff: new Date(now + 86_400_000).toISOString(),
    competition: 'Tercera Federación', status: 'scheduled',
  },
});

test('preserves genuine zero statistics and does not invent missing values', () => {
  const input = fixture();
  input.stats.goals = 0;
  assert.equal(parseFootballFeed(input).stats.goals, 0);
  const missing = { ...input, stats: { appearances: 4, starts: 2, minutes: 180 } };
  assert.throws(() => parseFootballFeed(missing), /stats.goals/);
});

test('rejects corrupt and inconsistent statistics', () => {
  for (const value of [-1, 1.5, NaN, Infinity, '3', null]) {
    assert.throws(() => parseFootballFeed({ ...fixture(), stats: { ...fixture().stats, goals: value } }));
  }
  assert.throws(() => parseFootballFeed({ ...fixture(), stats: { ...fixture().stats, starts: 5 } }), /titularidades/);
});

test('rejects unsafe links, credentials, and dates without a timezone', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,hello', 'https://user:secret@example.com', '/relative']) {
    assert.throws(() => parseFootballFeed({ ...fixture(), source: { name: 'Fuente', url } }));
  }
  for (const updatedAt of ['2026-10-24T12:00:00', '2026-02-30T12:00:00Z', 'garbage']) {
    assert.throws(() => parseFootballFeed({ ...fixture(), updatedAt }));
  }
  assert.throws(() => parseFootballFeed({ ...fixture(), nextMatch: { ...fixture().nextMatch, watchUrl: 'javascript:alert(1)' } }));
});

test('ordinary historical snapshots expire after 24 hours and future dates are stale', () => {
  const feed = parseFootballFeed(fixture());
  assert.equal(getFeedFreshness(feed, now + FEED_MAX_AGE_MS), 'fresh');
  assert.equal(getFeedFreshness(feed, now + FEED_MAX_AGE_MS + 1), 'stale');
  assert.equal(getFeedFreshness(feed, new Date(now - 31_000)), 'stale');
  assert.equal(getFeedFreshness(feed, NaN), 'stale');
});

test('live data expires in five minutes and an old live claim is rejected', () => {
  const feed = parseFootballFeed({ ...fixture(), nextMatch: { ...fixture().nextMatch, status: 'live', homeScore: 0, awayScore: 0 } });
  assert.equal(getFeedFreshness(feed, now + LIVE_MAX_AGE_MS), 'fresh');
  assert.equal(getFeedFreshness(feed, now + LIVE_MAX_AGE_MS + 1), 'stale');
  assert.throws(() => parseFootballFeed({ ...fixture(), updatedAt: new Date(now - LIVE_MAX_AGE_MS - 10_000).toISOString(), nextMatch: { ...fixture().nextMatch, status: 'live' } }), /cinco minutos/);
});

test('requires both scores together, rejects unknown match states, and copies supported data', () => {
  assert.throws(() => parseFootballFeed({ ...fixture(), nextMatch: { ...fixture().nextMatch, homeScore: 1 } }), /ambos equipos/);
  assert.throws(() => parseFootballFeed({ ...fixture(), nextMatch: { ...fixture().nextMatch, status: 'invented' } }), /status/);
  const input = { ...fixture(), apiKey: 'must-not-propagate' };
  const parsed = parseFootballFeed(input);
  input.stats.goals = 99;
  assert.equal(parsed.stats.goals, 1);
  assert.equal('apiKey' in parsed, false);
});
