import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { reveal } from '../reveal'

// The hero's lime highlighter, drawn once when its line scrolls into view.
// `tail` (usually the full stop) stays on the same line as the highlighted word.
export function Mark({ children, tail, delay = 0.2 }: { children: ReactNode; tail?: string; delay?: number }) {
  return (
    <span className="hl-wrap">
      <span className="hl">
      <motion.span
        className="hl-bar"
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.55, delay, ease: [0.65, 0, 0.35, 1] }}
      />
        <span className="hl-text">{children}</span>
      </span>
      {tail}
    </span>
  )
}

// Numbered eyebrow and big heading, matching the tournament's "01 —" head.
export function SectionHead({
  num,
  label,
  id,
  children,
  aside,
}: {
  num: string
  label: ReactNode
  id: string
  children: ReactNode
  aside?: ReactNode
}) {
  return (
    <motion.div className="sec-head" {...reveal()}>
      <div>
        <p className="eyebrow sec-eyebrow">
          <span className="sec-num">{num}</span>
          <span className="sec-rule" aria-hidden="true" />
          {label}
        </p>
        <h2 id={id} className="sec-title">
          {children}
        </h2>
      </div>
      {aside && <div className="sec-aside">{aside}</div>}
    </motion.div>
  )
}
