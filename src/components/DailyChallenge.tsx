import { motion, useReducedMotion } from 'motion/react'
import { SNAPSHOT_DATE, START_NG } from '../data/games'
import { useChallenge } from '../hooks/useChallenge'
import { useCountdown } from '../hooks/useCountdown'
import { usePointerLean } from '../hooks/usePointerLean'
import { reveal } from '../reveal'

const LOOP = 'M8 30C6 14 30 4 56 6s46 12 44 26-28 22-52 20S10 44 8 30c-1-8 6-15 14-19'
const SPARK = 'M10 0c1 5 4 8 10 10-6 2-9 5-10 10-1-5-4-8-10-10 6-2 9-5 10-10z'

export function DailyChallenge() {
  const { challenge: c, live } = useChallenge()
  const left = useCountdown(c?.ends_at ?? '')
  const lean = usePointerLean(6)
  if (!c) return null

  const day = new Date(`${c.day}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
  const status = left ? `${left.h}h ${left.m}m left` : live ? 'resetting now' : `Saved from ${day}`
  const href = `${START_NG}/games/${c.game}`

  return (
    <section id="challenge" className="sec chal" aria-labelledby="chal-title">
      {/* the reveal sits on a wrapper so its inline transform can't override the card's hover and press */}
      <motion.div {...reveal()}>
        <a className="chal-card" href={href} {...lean}>
          <div className="chal-text">
            <p className="eyebrow sec-eyebrow">
              <span className="sec-num">02</span>
              <span className="sec-rule" aria-hidden="true" />
              Daily challenge · <span className="chal-status">{status}</span>
            </p>
            <h2 id="chal-title" className="sec-title chal-title">
              {/* start.ng's wording: "Reach 10 in Git Quest", or "Finish X in 0:45 or less" for time goals */}
              {c.ceiling ? (
                <>
                  Finish {c.title} in <Goal value={c.goal} /> or less.
                </>
              ) : (
                <>
                  Reach <Goal value={c.goal} /> in {c.title}.
                </>
              )}
            </h2>
            <p className="chal-sub">One goal a day, set from how people really play.</p>
            <p className="chal-stat">
              Counted in <b>{c.stat}</b>
            </p>
            <span className="btn btn-solid chal-btn">
              Take the challenge <span aria-hidden="true">→</span>
            </span>
            {!live && !left && (
              <p className="tour-note">
                Showing a saved challenge from{' '}
                {new Date(SNAPSHOT_DATE).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}. Today's is on
                start.ng.
              </p>
            )}
          </div>

          <div className="chal-art" aria-hidden="true">
            <span className="chal-ticket">
              <span>Today</span>
              <b>{day}</b>
            </span>
            <span className="chal-cover">
              {c.cover_url ? (
                <img src={c.cover_url} alt="" loading="lazy" decoding="async" width={1600} height={1000} />
              ) : (
                <span className="gc-fallback">{c.title.charAt(0)}</span>
              )}
            </span>
            {/* three lime sparkles slip out of the cover's corner on hover, then fade */}
            <svg className="chal-sparks" viewBox="0 0 80 80">
              {[0, 1, 2].map((i) => (
                <path key={i} className={`chal-spark s${i}`} d={SPARK} />
              ))}
            </svg>
          </div>
        </a>
      </motion.div>
    </section>
  )
}

// The goal, circled in ink like a note on the fridge.
function Goal({ value }: { value: string }) {
  const reduce = useReducedMotion()
  return (
    <span className="chal-goal">
      {value}
      <svg viewBox="0 0 110 56" preserveAspectRatio="none" aria-hidden="true">
        {/* a lime pen goes round it again whenever the card is hovered or focused */}
        <path className="chal-goal-lime" d={LOOP} pathLength={1} vectorEffect="non-scaling-stroke" />
        <motion.path
          d={LOOP}
          fill="none"
          stroke="var(--ink)"
          strokeWidth="2.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: 'easeInOut' }}
        />
      </svg>
    </span>
  )
}
