import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { gameByName, START_NG, titleOf } from '../data/games'
import { Mark, SectionHead } from './Section'
import { reveal } from '../reveal'

// start.ng's About copy. The games it mentions link to real ones, and their
// covers peek out on hover or focus.
export function About() {
  return (
    <section id="about" className="sec about" aria-labelledby="about-title">
      <SectionHead num="07" label="About start.ng" id="about-title">
        Nigeria's home for browser <Mark tail=".">games</Mark>
      </SectionHead>
      <div className="about-body">
        <motion.p {...reveal(0.05)}>
          start.ng is Nigeria's home for browser games, built by the HNG community. Every game is free to play in your
          browser with no download, and many are made in Naija: <Peek game="go-slow-danfo">danfo rush hour</Peek>,{' '}
          <Peek game="jollof-catch">jollof catching</Peek>, <Peek game="lagos-market-run">Lagos markets</Peek> and more.
        </motion.p>
        <motion.p {...reveal(0.1)}>
          We're also building a home for web games from across Africa. If you make games anywhere on the continent, you can
          put yours on start.ng for free.
        </motion.p>
        <motion.a className="sec-link" href={`${START_NG}/about`} {...reveal(0.15)}>
          More about start.ng <span aria-hidden="true">→</span>
        </motion.a>
      </div>
    </section>
  )
}

function Peek({ game, children }: { game: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const g = gameByName(game)
  if (!g) return <>{children}</>
  return (
    <a
      className="peek"
      href={g.url}
      title={`${titleOf(g.name)} by ${g.by ?? 'a creator'}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open && g.cover_url && (
          <motion.span
            className="peek-card"
            aria-hidden="true"
            initial={{ opacity: 0, y: 8, rotate: -6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, rotate: -3, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          >
            <img src={g.cover_url} alt="" decoding="async" />
            <span>
              {titleOf(g.name)} <em>by {g.by}</em>
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  )
}
