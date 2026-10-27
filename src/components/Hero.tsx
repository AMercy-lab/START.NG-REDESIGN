import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { HERO_GAMES, START_NG } from '../data/games'
import { HeroCover } from './HeroCover'
import { Highlight } from './Highlight'
import { HostChip } from './HostChip'
import { TypeLine } from './TypeLine'
import { useMediaQuery } from '../hooks/useMediaQuery'

// Clicking "Good games." cycles the highlighter through start.ng's rarity tiers.
const RARITIES = [
  { name: null, color: 'var(--lime)' },
  { name: 'Uncommon', color: 'var(--r-uncommon)' },
  { name: 'Rare', color: 'var(--r-rare)' },
  { name: 'Epic', color: 'var(--r-epic)' },
  { name: 'Legendary', color: 'var(--r-legendary)' },
  { name: 'Limited', color: 'var(--r-limited)' },
]

const rise = (delay: number, reduce: boolean | null) => ({
  initial: reduce ? false : { y: '105%' },
  animate: { y: '0%' },
  transition: { type: 'spring' as const, stiffness: 170, damping: 19, delay },
})

const fadeUp = (delay: number, reduce: boolean | null) => ({
  initial: reduce ? false : { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay },
})

export function Hero() {
  const reduce = useReducedMotion()
  const narrow = useMediaQuery('(max-width: 860px)')
  const [flipped, setFlipped] = useState<number | null>(null)
  const [rarity, setRarity] = useState(0)
  const [taps, setTaps] = useState(0)
  const ref = useRef<HTMLElement>(null)

  // Pointer position across the hero, -1..1, smoothed. Covers drift by their depth.
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 })
  const my = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 })

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    rawX.set(((e.clientX - r.left) / r.width) * 2 - 1)
    rawY.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }
  const onPointerLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  // Clicking anywhere outside a flipped cover flips it back.
  useEffect(() => {
    if (flipped === null) return
    const close = (e: PointerEvent) => {
      if (!(e.target as Element).closest?.('.hc.is-flipped')) setFlipped(null)
    }
    addEventListener('pointerdown', close)
    return () => removeEventListener('pointerdown', close)
  }, [flipped])

  const r = RARITIES[rarity]
  const cycleRarity = () => {
    setRarity((n) => (n + 1) % RARITIES.length)
    setTaps((n) => n + 1)
  }

  const scrollToTournament = () => {
    document.getElementById('tournament')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section
      id="top"
      ref={ref}
      className="hero"
      aria-labelledby="hero-title"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="hero-dots" aria-hidden="true" />

      <div className="hero-copy">
        <TypeLine className="eyebrow hero-eyebrow" text="Big imagination. Played everywhere." delay={0.1} />

        <h1 id="hero-title" className="hero-title">
          <span className="line">
            <motion.span className="line-inner" {...rise(0.15, reduce)}>
              Good vibes.
              <Sparkle reduce={reduce} />
            </motion.span>
          </span>
          <span className="line">
            <motion.span className="line-inner" {...rise(0.27, reduce)}>
              <button
                type="button"
                className="rarity-btn"
                onClick={cycleRarity}
                title="Psst. Click me."
                aria-describedby="rarity-hint"
              >
                <Highlight delay={reduce || taps ? 0 : 0.7} color={r.color} drawKey={taps}>
                  Good games.
                </Highlight>
              </button>
            </motion.span>
          </span>
          <span id="rarity-hint" className="visually-hidden">
            Changes the highlighter's rarity colour
          </span>
          <AnimatePresence>
            {r.name && (
              <motion.span
                key={r.name}
                className="rarity-tag"
                style={{ background: r.color }}
                initial={{ opacity: 0, y: 8, rotate: -8, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, rotate: -4, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                aria-hidden="true"
              >
                {r.name}
              </motion.span>
            )}
          </AnimatePresence>
        </h1>
        <span className="visually-hidden" aria-live="polite">
          {taps > 0 ? `Highlighter: ${r.name ?? 'lime'}` : ''}
        </span>

        <motion.p className="hero-sub" {...fadeUp(0.75, reduce)}>
          Games made by builders in the community.{' '}
          <br />
          Each one lives at its own address, like <HostChip />.{' '}
          <br />
          Pick one and play right in your browser.
        </motion.p>

        <motion.div className="hero-ctas" {...fadeUp(0.85, reduce)}>
          <button type="button" className="btn btn-solid" onClick={scrollToTournament}>
            Play now
          </button>
          <a className="btn btn-ghost" href={START_NG}>
            Create free account
          </a>
          <CtaDoodle reduce={reduce} />
        </motion.div>
      </div>

      {/* After the copy in the DOM so keyboard users reach the headline buttons first. */}
      <div className="hero-covers" role="group" aria-label="Most played on start.ng">
        {HERO_GAMES.map((g, i) => (
          <HeroCover
            key={g.name}
            game={g}
            index={i}
            mx={mx}
            my={my}
            reduce={!!reduce}
            baseDelay={0.45}
            flipScale={narrow ? 1.6 : 1.1}
            flipped={flipped === i}
            onToggle={(open) => setFlipped(open ? i : null)}
          />
        ))}
      </div>

      <motion.button
        type="button"
        className="scroll-cue"
        onClick={scrollToTournament}
        {...fadeUp(1.3, reduce)}
      >
        <span className="eyebrow">Today's tournament</span>
        <span className="scroll-cue-play" aria-hidden="true">
          ▶
        </span>
      </motion.button>
    </section>
  )
}

// A small ink sparkle that draws itself beside "vibes." and twinkles on hover.
function Sparkle({ reduce }: { reduce: boolean | null }) {
  return (
    <svg className="sparkle" viewBox="0 0 40 40" aria-hidden="true">
      <motion.path
        d="M20 3c1.6 9.5 7.5 15.4 17 17-9.5 1.6-15.4 7.5-17 17-1.6-9.5-7.5-15.4-17-17 9.5-1.6 15.4-7.5 17-17z"
        fill="var(--lime)"
        stroke="var(--ink)"
        strokeWidth="2.4"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0, scale: 0.4, rotate: -40 }}
        animate={{ pathLength: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

const ARROW = 'M6 6C10 26 26 40 48 44 66 47 82 50 100 58'

// A hand-drawn dotted arrow pointing at "Play now".
function CtaDoodle({ reduce }: { reduce: boolean | null }) {
  return (
    <svg className="cta-doodle" viewBox="0 0 120 70" aria-hidden="true">
      {/* The dotted line is revealed by a solid stroke drawing itself in the mask. */}
      <mask id="cta-doodle-mask" maskUnits="userSpaceOnUse">
        <motion.path
          d={ARROW}
          fill="none"
          stroke="#fff"
          strokeWidth="10"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 1.25, ease: 'easeInOut' }}
        />
      </mask>
      <path
        d={ARROW}
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="0.1 7"
        mask="url(#cta-doodle-mask)"
      />
      <motion.path
        d="M88 50l12 8-12 6"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.95, duration: 0.2 }}
      />
    </svg>
  )
}
