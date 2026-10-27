import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'

// start.ng's round scroll button, with a lime progress ring. It points down near
// the top (to today's tournament) and up once you've scrolled ("Back to the start").
export function ScrollButton() {
  const reduce = useReducedMotion()
  const { scrollYProgress, scrollY } = useScroll()
  const [down, setDown] = useState(true)
  const [hover, setHover] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => setDown(y < innerHeight * 0.5))

  const label = down ? "Today's tournament" : 'Back to the start'
  const go = () => {
    const behavior = reduce ? 'auto' : 'smooth'
    if (down) document.getElementById('tournament')?.scrollIntoView({ behavior })
    else scrollTo({ top: 0, behavior })
  }

  return (
    <div className="scroll-btn-wrap">
      <AnimatePresence>
        {hover && (
          <motion.span
            key={label}
            className="scroll-btn-bubble"
            initial={{ opacity: 0, x: 8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 4 }}
            transition={{ duration: 0.18 }}
            aria-hidden="true"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      <button
        type="button"
        className="scroll-btn"
        onClick={go}
        aria-label={label}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
      >
        <svg viewBox="0 0 56 56" aria-hidden="true">
          <circle cx="28" cy="28" r="25" fill="none" stroke="var(--line)" strokeWidth="3" opacity="0.35" />
          <motion.circle
            cx="28"
            cy="28"
            r="25"
            fill="none"
            stroke="var(--lime)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ pathLength: scrollYProgress, rotate: -90, transformOrigin: '50% 50%' }}
          />
        </svg>
        <motion.span
          className="scroll-btn-icon"
          animate={{ rotate: down ? 90 : -90 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          aria-hidden="true"
        >
          ▶
        </motion.span>
      </button>
    </div>
  )
}
