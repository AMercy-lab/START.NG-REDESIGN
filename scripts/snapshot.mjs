// Saves a snapshot of start.ng's public data into src/data/snapshot.json.
// The browser can't read api.start.ng directly (no CORS), so the build reads it here.
// If the network is down, the existing snapshot is kept.
import { readFile, writeFile } from 'node:fs/promises';

const API = 'https://api.start.ng';
const OUT = new URL('../src/data/snapshot.json', import.meta.url);

async function get(path) {
  const res = await fetch(API + path, { headers: { accept: 'application/json' } });
  if (!res.ok) throw new Error(`${path} returned ${res.status}`);
  return res.json();
}

const pickGame = (g) => ({ name: g.name, url: g.url, by: g.by ?? null, cover_url: g.cover_url ?? null });

try {
  const [games, shelves, tournament] = await Promise.all([
    get('/games'),
    get('/discover/shelves'),
    get('/tournaments/current'),
  ]);
  const snapshot = {
    fetched_at: new Date().toISOString(),
    total_games: games.filter((g) => !g.hidden).length,
    most_played: shelves.most_played ?? [],
    games: games.filter((g) => !g.hidden).map(pickGame),
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
  console.log(`snapshot: ${snapshot.total_games} games, ${snapshot.tournament.games.length} in today's tournament`);
} catch (err) {
  try {
    await readFile(OUT);
    console.warn(`snapshot: kept the existing file (${err.message})`);
  } catch {
    console.error(`snapshot: no data and no existing file (${err.message})`);
    process.exit(1);
  }
}
