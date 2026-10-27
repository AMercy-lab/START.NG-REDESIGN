// Saves a snapshot of start.ng's public data into src/data/snapshot.json.
// The browser can't read api.start.ng directly (no CORS), so the build reads it here.
// If the network is down, the existing snapshot is kept.
import { readFile, writeFile } from 'node:fs/promises';

const API = 'https://api.start.ng';
const OUT = new URL('../src/data/snapshot.json', import.meta.url);

// The eight categories start.ng's homepage shows, in its order.
const HOME_TAGS = [
  'endless-runners',
  'nigerian-themed',
  'brainy-games',
  'space-and-sci-fi',
  'racing-and-driving',
  'catch-and-dodge',
  'ancient-ruins-and-treasure',
  'with-friends',
];

// Tags that decide a game card's little illustration (see fxFor in src/data/games.ts).
const FX_TAGS = [
  'board-and-card',
  'two-player-classics',
  'football-and-sports',
  'space-and-sci-fi',
  'racing-and-driving',
  'shooting-and-action',
  'platformers',
  'food-and-cooking',
  'ancient-ruins-and-treasure',
  'coin-collecting',
  'catch-and-dodge',
  'brainy-games',
  'coding-and-tech',
  'endless-runners',
  'nigerian-themed',
];

async function get(path) {
  const res = await fetch(API + path, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`${path} returned ${res.status}`);
  return res.json();
}

const clip = (s, n) => (s && s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s ?? null);

const pickGame = (g) => ({
  name: g.name,
  url: g.url,
  by: g.by ?? null,
  cover_url: g.cover_url ?? null,
  description: clip(g.description, 180),
  leaderboard: !!g.leaderboard,
});

const pickIndie = (g) => ({
  id: g.id,
  name: g.name,
  url: g.url,
  by: g.by ?? null,
  cover_url: g.cover_path ? API + g.cover_path : null,
  description: clip(g.description, 160),
});

try {
  const [games, shelves, tournament, spotlight, tags, indieNew, indiePopular] = await Promise.all([
    get('/games'),
    get('/discover/shelves'),
    get('/tournaments/current'),
    get('/spotlight'),
    get('/tags'),
    get('/indie?limit=8&sort=newest'),
    get('/indie?limit=8&sort=popular'),
  ]);
  const allTags = tags.groups.flatMap((g) => g.tags);
  const categories = [];
  for (const slug of HOME_TAGS) {
    const tag = allTags.find((t) => t.slug === slug);
    if (!tag) continue;
    const detail = await get(`/tags/${slug}`);
    categories.push({
      slug,
      label: tag.label,
      blurb: tag.blurb ?? null,
      count: tag.games,
      games: (detail.games ?? []).map((g) => g.name),
    });
  }
  // Full game lists (every page) for the tags that pick a game card's illustration.
  const fxTags = {};
  for (const slug of FX_TAGS) {
    if (!allTags.some((t) => t.slug === slug)) continue;
    const names = [];
    for (let page = 1, pages = 1; page <= pages; page++) {
      const res = await get(`/tags/${slug}?page=${page}`);
      pages = res.pages ?? 1;
      names.push(...(res.games ?? []).map((g) => g.name));
    }
    fxTags[slug] = names;
  }
  const visible = games.filter((g) => !g.hidden);
  const snapshot = {
    fetched_at: new Date().toISOString(),
    total_games: visible.length,
    most_played: shelves.most_played ?? [],
    new_this_week: shelves.new ?? [],
    games: visible.map(pickGame),
    categories,
    fx_tags: fxTags,
    challenge: spotlight.challenge
      ? {
          day: spotlight.challenge.day,
          game: spotlight.challenge.game,
          title: spotlight.challenge.game_title,
          cover_url: spotlight.challenge.cover_url ?? null,
          stat: spotlight.challenge.stat,
          goal: spotlight.challenge.goal_shown ?? String(spotlight.challenge.goal),
          ceiling: !!spotlight.challenge.goal_is_a_ceiling,
          ends_at: spotlight.challenge.ends_at,
        }
      : null,
    indie_new: indieNew.map(pickIndie),
    indie_popular: indiePopular.map(pickIndie),
    tournament: {
      starts_at: tournament.starts_at,
      ends_at: tournament.ends_at,
      entrants: tournament.entrants ?? 0,
      games: tournament.games.map((g) => ({
        name: g.name,
        url: g.url,
        cover_url: g.cover_url ?? null,
        stats: (g.leaderboard ?? []).map((s) => s.label),
      })),
    },
  };
  await writeFile(OUT, JSON.stringify(snapshot, null, 2) + '\n');
  console.log(
    `snapshot: ${snapshot.total_games} games, ${categories.length} categories, ` +
      `${snapshot.indie_new.length} indie, tournament of ${snapshot.tournament.games.length}`,
  );
} catch (err) {
  try {
    await readFile(OUT);
    console.warn(`snapshot: kept the existing file (${err.message})`);
  } catch {
    console.error(`snapshot: no data and no existing file (${err.message})`);
    process.exit(1);
  }
}
