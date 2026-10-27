import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ALL_GAMES, fxFor, MOST_PLAYED, NEW_THIS_WEEK, START_NG, TOTAL_GAMES, titleOf, type Game } from '../data/games'
import { GameCard } from './GameCard'
import { Mark, SectionHead } from './Section'
import { reveal } from '../reveal'

const SHELVES = [
  { key: 'most', label: 'Most played', note: "What everyone's playing this week", games: MOST_PLAYED },
  { key: 'new', label: 'New this week', note: 'Every new game shows here first', games: NEW_THIS_WEEK },
].filter((s) => s.games.length > 0)

// Games grouped by the first letter of their title; numbers go under "#".
const letterOf = (g: Game) => {
  const ch = titleOf(g.name).charAt(0).toUpperCase()
  return /[A-Z]/.test(ch) ? ch : '#'
}
const AZ = ALL_GAMES.reduce<[string, Game[]][]>((groups, g) => {
  const l = letterOf(g)
  const last = groups[groups.length - 1]
  if (last && last[0] === l) last[1].push(g)
  else groups.push([l, [g]])
  return groups
}, [])

export function CommunityGames() {
  const [shelf, setShelf] = useState(0)
  const current = SHELVES[shelf]

  return (
    <section id="games" className="sec" aria-labelledby="games-title">
      <SectionHead num="04" label="Community games" id="games-title">
        Games from the <Mark tail=".">community</Mark>
      </SectionHead>

      {current && (
        <>
          <motion.div className="shelf-bar" {...reveal(0.05)}>
            <div className="shelf-switch" role="group" aria-label="Which games to show">
              {SHELVES.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  className="shelf-btn"
                  aria-pressed={i === shelf}
                  onClick={() => setShelf(i)}
                >
                  {i === shelf && (
                    <motion.span
                      layoutId="shelf-pill"
                      className="shelf-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
            <p className="shelf-note" aria-live="polite">
              {current.note}
            </p>
          </motion.div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={current.key}
              className="gc-grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {current.games.map((g) => (
                <GameCard
                  key={g.name}
                  href={g.url}
                  name={g.name}
                  by={g.by}
                  url={g.url}
                  cover={g.cover_url}
                  fx={fxFor(g.name)}
                />
              ))}
            </motion.ul>
          </AnimatePresence>
        </>
      )}

      <motion.div className="see-all" {...reveal()}>
        <a className="btn btn-ghost" href={`${START_NG}/games`}>
          See all {TOTAL_GAMES} games <span aria-hidden="true">→</span>
        </a>
      </motion.div>

      <motion.details className="az" {...reveal()}>
        <summary>
          <span>
            Every game on start.ng, A to Z <span className="az-count">({ALL_GAMES.length})</span>
          </span>
          <span className="az-icon" aria-hidden="true" />
        </summary>
        <nav className="az-jump" aria-label="Jump to a letter">
          {AZ.map(([l]) => (
            <a key={l} href={`#az-${l === '#' ? 'num' : l}`}>
              {l}
            </a>
          ))}
        </nav>
        <div className="az-groups">
          {AZ.map(([l, games]) => (
            <div key={l} className="az-group" id={`az-${l === '#' ? 'num' : l}`}>
              <h3 className="az-letter">{l}</h3>
              <ul>
                {games.map((g) => (
                  <li key={g.name}>
                    <a href={`${START_NG}/games/${g.name}`}>{titleOf(g.name)}</a> <span>by {g.by ?? 'a creator'}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.details>
    </section>
  )
}
