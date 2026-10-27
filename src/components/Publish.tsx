import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { START_NG } from '../data/games'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { ramp } from '../ramp'
import { reveal } from '../reveal'
import { Mark, SectionHead } from './Section'

// start.ng's own four steps, word for word.
const STEPS = [
  {
    title: 'Build it',
    body: (
      <>Any static browser game: HTML, JavaScript, three.js, Phaser. Players bring their start.ng character, scores and friends.</>
    ),
  },
  {
    title: 'Push it to GitHub',
    body: (
      <>
        A public repo with a ready-to-play <code>index.html</code> at the top or in <code>dist/</code>, plus a{' '}
        <code>cover.png</code> for its card.
      </>
    ),
  },
  {
    title: 'Publish it',
    body: (
      <>
        One API call with your repo link, no key needed. Or hand your AI <code>start.ng/docs</code> and let it do the lot.
      </>
    ),
  },
  {
    title: 'Approve it once',
    body: (
      <>
        Open the link you get back and it's live at <code>yourgame.start.ng</code>, with its own leaderboard if you want
        one. After that, every push updates it.
      </>
    ),
  },
]

// Scroll progress (0..1) at which each step lights up, and the stretch the dotted line draws over.
const REACH = [0.06, 0.3, 0.54, 0.78]
const DRAW = [0.04, 0.8]
const THREAD = 'M40 20C160 6 260 34 390 20S640 6 770 20'

export function Publish() {
  const reduce = !!useReducedMotion()
  const wide = useMediaQuery('(min-width: 861px)')
  const pinned = wide && !reduce
  const section = useRef<HTMLElement>(null)
  const list = useRef<HTMLOListElement>(null)

  // Wide screens pin the section and play the steps across its scroll;
  // narrow screens play them as the list itself moves up the screen.
  const { scrollYProgress: pinProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const { scrollYProgress: flowProgress } = useScroll({ target: list, offset: ['start 80%', 'end 55%'] })

  return (
    <section
      id="how"
      ref={section}
      className={`sec sec-ink how${pinned ? ' is-pinned' : ''}`}
      aria-labelledby="how-title"
    >
      <div className="how-stage">
        <SectionHead num="06" label="Make games" id="how-title">
          Got a game? Put it on <Mark tail=".">start.ng</Mark>
        </SectionHead>

        {/* Remounts when the layout mode changes, so it follows the right scroll source. */}
        <Steps key={pinned ? 'pin' : 'flow'} progress={pinned ? pinProgress : flowProgress} reduce={reduce} listRef={list} />

        <motion.div className="sec-actions" {...reveal()}>
          <a className="btn btn-solid" href={`${START_NG}/docs`}>
            Read the docs
          </a>
          <a className="btn btn-ghost" href={`${START_NG}/docs.md`}>
            Docs for your AI (.md)
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function Steps({
  progress,
  reduce,
  listRef,
}: {
  progress: MotionValue<number>
  reduce: boolean
  listRef: React.RefObject<HTMLOListElement | null>
}) {
  const [reached, setReached] = useState(reduce ? STEPS.length : 0)
  const draw = useTransform(progress, ramp(DRAW, [0, 1]))

  useMotionValueEvent(progress, 'change', (p) => {
    if (reduce) return
    const n = REACH.filter((t) => p >= t).length
    if (n !== reached) setReached(n)
  })

  return (
    <div className="steps-wrap">
      <svg className="steps-thread" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true">
        <mask id="steps-thread-mask" maskUnits="userSpaceOnUse">
          <motion.path d={THREAD} fill="none" stroke="#fff" strokeWidth="14" style={{ pathLength: reduce ? 1 : draw }} />
        </mask>
        <path
          d={THREAD}
          fill="none"
          stroke="var(--lime)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeDasharray="0.1 9"
          vectorEffect="non-scaling-stroke"
          mask="url(#steps-thread-mask)"
        />
      </svg>
      <motion.span className="steps-vline" aria-hidden="true" style={{ scaleY: reduce ? 1 : draw }} />
      <ol className="steps" ref={listRef}>
        {STEPS.map((s, i) => (
          <li key={s.title} className={`step${i < reached ? ' is-reached' : ''}`}>
            <span className="step-num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
