import { useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { hostOf, SNAPSHOT_DATE, START_NG, titleOf, type TournamentGame } from '../data/games'
import { useTournament } from '../hooks/useTournament'
import { hoursBetween, useCountdown } from '../hooks/useCountdown'
import { Highlight } from './Highlight'

// Pinned-scroll timeline (0..1 while the stage is pinned):
// deal the tiles one by one, then draw the highlighter, then show the call to action.
const DEAL = [0.05, 0.6]
const HIGHLIGHT = [0.64, 0.76]
const CTA = [0.74, 0.86]
const DECK_TILT = [-6, 5, -3, 8, -5, 4, -7]

// Piecewise-linear map computed in JS. Motion hands plain range transforms of
// opacity to the browser's scroll timeline, which mis-maps this section's offsets
// (tested: CTA opacity fell back to 0 at the end), so these stay on the main thread.
function ramp(input: number[], output: number[]) {
  return (v: number) => {
    if (v <= input[0]) return output[0]
    for (let i = 1; i < input.length; i++) {
      if (v <= input[i]) {
        const t = (v - input[i - 1]) / (input[i] - input[i - 1])
        return output[i - 1] + (output[i] - output[i - 1]) * t
      }
    }
    return output[output.length - 1]
  }
}

export function TournamentScene() {
  const reduce = !!useReducedMotion()
  const { tournament, live } = useTournament()
  const games = tournament.games
  const n = games.length
  const hours = hoursBetween(tournament.starts_at, tournament.ends_at)
  const left = useCountdown(tournament.ends_at)
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const { scrollYProgress: pin } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // Each tile gets its own slice of the deal, overlapping a little so it flows.
  const slice = (DEAL[1] - DEAL[0]) / n
  const range = (i: number) => [DEAL[0] + i * slice, DEAL[0] + (i + 1.35) * slice] as const

  const [dealt, setDealt] = useState(reduce ? n : 0)
  const [active, setActive] = useState<number | null>(null)
  useMotionValueEvent(pin, 'change', (p) => {
    if (reduce) return
    let c = 0
    for (let i = 0; i < n; i++) if (p >= (range(i)[0] + range(i)[1]) / 2) c++
    if (c !== dealt) setDealt(c)
  })

  const headOpacity = useTransform(pin, ramp([0.03, 0.1, HIGHLIGHT[0] - 0.04, HIGHLIGHT[0] + 0.04], [1, 0.32, 0.32, 1]))
  const highlight = useTransform(pin, ramp(HIGHLIGHT, [0, 1]))
  const ctaOpacity = useTransform(pin, ramp(CTA, [0, 1]))
  const ctaY = useTransform(pin, ramp(CTA, [24, 0]))
  const deckOpacity = useTransform(enter, ramp([0.55, 0.9], [0, 1]))

  const lines = [`${n} games.`, `${hours} hours.`]
  const status = live
    ? left
      ? `${left.h}h ${left.m}m left`
      : 'Finished · next one soon'
    : left
      ? `${left.h}h ${left.m}m left`
      : `Line-up from ${new Date(tournament.starts_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`
  const caption = games[active ?? Math.max(0, dealt - 1)]

  return (
    <section
      id="tournament"
      ref={ref}
      className={`tour${reduce ? ' is-static' : ''}`}
      aria-labelledby="tour-title"
      style={{ '--n': n } as React.CSSProperties}
    >
      <div className="tour-stage">
        <div className="tour-head">
          <p className="eyebrow tour-eyebrow">
            <span className="tour-num">01</span>
            <span className="tour-rule" aria-hidden="true" />
            Today's tournament · <span className="tour-status">{status}</span>
          </p>

          <motion.h2 id="tour-title" className="tour-title" style={reduce ? undefined : { opacity: headOpacity }}>
            {lines.map((text, i) => (
              <RevealLine key={text} progress={enter} index={i} reduce={reduce}>
                {text}
              </RevealLine>
            ))}
            <RevealLine progress={enter} index={2} reduce={reduce}>
              <Highlight progress={reduce ? undefined : highlight}>One winner.</Highlight>
            </RevealLine>
          </motion.h2>
        </div>

        <motion.ol
          className="tour-deck"
          style={reduce ? undefined : { opacity: deckOpacity }}
          aria-label={`${n} games in today's tournament`}
          onMouseLeave={() => setActive(null)}
        >
          {games.map((g, i) => (
            <TourTile
              key={g.name}
              game={g}
              index={i}
              count={n}
              pin={pin}
              range={range(i)}
              reduce={reduce}
              dealt={i < dealt}
              onActive={() => setActive(i)}
            />
          ))}
        </motion.ol>

        <div className="tour-meter" aria-hidden="true">
          <span className="tour-meter-dashes">
            {games.map((g, i) => (
              <span key={g.name} className={i < dealt ? 'on' : ''} />
            ))}
          </span>
          <span className="tour-meter-label">
            {String(dealt).padStart(2, '0')}/{String(n).padStart(2, '0')} dealt
          </span>
        </div>

        {caption && (
          <p className="tour-caption" aria-hidden="true">
            <b>{titleOf(caption.name)}</b>
            {caption.stats.length > 0 && <span> · ranked by {caption.stats.join(', ')}</span>}
          </p>
        )}

        <motion.div className="tour-cta" style={reduce ? undefined : { opacity: ctaOpacity, y: ctaY }}>
          <p className="tour-sub">
            Share to enter, then play.
            {live && ` ${tournament.entrants} ${tournament.entrants === 1 ? 'player has' : 'players have'} entered.`}
          </p>
          <a className="btn btn-solid" href={`${START_NG}/tournament`}>
            See the tournament <span aria-hidden="true">→</span>
          </a>
          {!live && (
            <p className="tour-note">
              Showing a saved line-up from {new Date(SNAPSHOT_DATE).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}.
              The live one is on start.ng.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function RevealLine({
  progress,
  index,
  reduce,
  children,

}: {
  progress: MotionValue<number>
  index: number
  reduce: boolean
  children: React.ReactNode
}) {
  const a = 0.35 + index * 0.12
  const y = useTransform(progress, (v) => `${ramp([a, a + 0.3], [100, 0])(v)}%`)
  return (
    <span className="line">
      <motion.span className="line-inner" style={reduce ? undefined : { y }}>
        {children}
      </motion.span>
    </span>
  )
}

function TourTile({
  game,
  index,
  count,
  pin,
  range,
  reduce,
  dealt,
  onActive,
}: {
  game: TournamentGame
  index: number
  count: number
  pin: MotionValue<number>
  range: readonly [number, number]
  reduce: boolean
  dealt: boolean
  onActive: () => void
}) {
  // k goes 1 -> 0 as this tile travels from the deck (centre) to its own slot.
  const k = useTransform(pin, ramp([range[0], range[1]], [1, 0]))
  const centre = (count - 1) / 2
  const x = useTransform(k, (v) => `calc(${((centre - index) * v).toFixed(4)} * (100% + var(--gap)))`)
  const y = useTransform(k, (v) => v * 34 - Math.sin(Math.PI * v) * 70)
  const rotate = useTransform(k, (v) => v * DECK_TILT[index % DECK_TILT.length])
  const scale = useTransform(k, (v) => 1 - v * 0.06)
  const title = titleOf(game.name)

  return (
    <motion.li
      className={`tt${dealt ? ' is-dealt' : ''}`}
      style={reduce ? undefined : { x, y, rotate, scale, zIndex: count - index }}
    >
      <a className="tt-link" href={game.url} onMouseEnter={onActive} onFocus={onActive}>
        <span className="tt-art">
          {game.cover_url ? (
            <img src={game.cover_url} alt="" loading="lazy" decoding="async" width={1600} height={1000} />
          ) : (
            <span className="tt-fallback">{title.charAt(0)}</span>
          )}
          <span className="tt-index" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        </span>
        <span className="tt-info">
          <span className="tt-title">{title}</span>
          <span className="tt-host">{hostOf(game.url)}</span>
          {game.stats.length > 0 && <span className="tt-stats">Ranked by {game.stats.join(', ')}</span>}
        </span>
      </a>
    </motion.li>
  )
}
