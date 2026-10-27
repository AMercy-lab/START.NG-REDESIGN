import snapshot from './snapshot.json'

export type Game = {
  name: string
  url: string
  by: string | null
  cover_url: string | null
}

export type TournamentGame = {
  name: string
  url: string
  cover_url: string | null
  stats: string[]
}

export type Tournament = {
  starts_at: string
  ends_at: string
  entrants: number
  games: TournamentGame[]
}

export const SNAPSHOT_DATE = snapshot.fetched_at
export const TOTAL_GAMES = snapshot.total_games
export const SNAPSHOT_TOURNAMENT: Tournament = snapshot.tournament

const BY_NAME = new Map<string, Game>(snapshot.games.map((g) => [g.name, g]))

export const gameByName = (name: string) => BY_NAME.get(name)

// start.ng builds titles the same way: "lagos-bike-rush" -> "Lagos Bike Rush".
export const titleOf = (slug: string) =>
  slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

export const hostOf = (url: string) => {
  try {
    return new URL(url).host
  } catch {
    return url
  }
}

// The hero shows the most-played shelf. Git Quest's cover is ~3MB, so it's left out.
const HEAVY = new Set(['git-quest'])
export const HERO_GAMES: Game[] = snapshot.most_played
  .filter((n) => !HEAVY.has(n))
  .map((n) => BY_NAME.get(n))
  .filter((g): g is Game => !!g?.cover_url)
  .slice(0, 6)

// Short real addresses for the hero chip, like start.ng's "bingo.start.ng".
export const CHIP_HOSTS: { host: string; url: string }[] = [
  'bingo',
  'ludo',
  'whot',
  'ayo',
  'tesla-skyrun',
  'danfo-make-way',
]
  .map((n) => BY_NAME.get(n))
  .filter((g): g is Game => !!g)
  .map((g) => ({ host: hostOf(g.url), url: g.url }))

export const START_NG = 'https://start.ng'
