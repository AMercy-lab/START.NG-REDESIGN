import snapshot from './snapshot.json'

export type Game = {
  name: string
  url: string
  by: string | null
  cover_url: string | null
  description?: string | null
  leaderboard?: boolean
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

export type Challenge = {
  day: string
  game: string
  title: string
  cover_url: string | null
  stat: string
  goal: string
  ceiling?: boolean
  ends_at: string
}

export type Category = {
  slug: string
  label: string
  blurb: string | null
  count: number
  games: string[]
}

export type IndieGame = {
  id: number
  name: string
  url: string
  by: string | null
  cover_url: string | null
  description: string | null
}

export const SNAPSHOT_CHALLENGE: Challenge | null = snapshot.challenge
export const CATEGORIES: Category[] = snapshot.categories
export const INDIE_NEW: IndieGame[] = snapshot.indie_new
export const INDIE_POPULAR: IndieGame[] = snapshot.indie_popular

const shelf = (names: string[], max: number) =>
  names
    .map((n) => BY_NAME.get(n))
    .filter((g): g is Game => !!g)
    .slice(0, max)

export const MOST_PLAYED: Game[] = shelf(snapshot.most_played, 8)
export const NEW_THIS_WEEK: Game[] = shelf(snapshot.new_this_week, 8)

// Which little illustration a game card plays, from start.ng's own tags.
// Specific tags win over broad ones; anything untagged gets a sparkle.
export type CardFx =
  | 'cards'
  | 'ball'
  | 'space'
  | 'race'
  | 'aim'
  | 'hop'
  | 'food'
  | 'treasure'
  | 'coins'
  | 'catch'
  | 'brainy'
  | 'runner'
  | 'naija'
  | 'spark'
const FX_ORDER: [string, CardFx][] = [
  ['board-and-card', 'cards'],
  ['two-player-classics', 'cards'],
  ['football-and-sports', 'ball'],
  ['space-and-sci-fi', 'space'],
  ['racing-and-driving', 'race'],
  ['shooting-and-action', 'aim'],
  ['platformers', 'hop'],
  ['food-and-cooking', 'food'],
  ['ancient-ruins-and-treasure', 'treasure'],
  ['coin-collecting', 'coins'],
  ['catch-and-dodge', 'catch'],
  ['brainy-games', 'brainy'],
  ['coding-and-tech', 'brainy'],
  ['endless-runners', 'runner'],
  ['nigerian-themed', 'naija'],
]
const FX_TAGS: Record<string, string[]> = snapshot.fx_tags
export const fxFor = (name: string): CardFx =>
  FX_ORDER.find(([slug]) => FX_TAGS[slug]?.includes(name))?.[1] ?? 'spark'

// A to Z by title, the way start.ng's homepage lists every game.
export const ALL_GAMES: Game[] = [...snapshot.games].sort((a, b) => titleOf(a.name).localeCompare(titleOf(b.name)))

// start.ng's own page for an independent creator's game: /creators/74-the-plot.
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/, '')
export const indiePage = (g: IndieGame) => {
  const s = slugify(g.name)
  return `${START_NG}/creators/${s ? `${g.id}-${s}` : g.id}`
}
