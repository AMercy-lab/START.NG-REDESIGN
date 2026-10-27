import { motion, type MotionValue } from 'motion/react'
import type { ReactNode } from 'react'

// start.ng's lime <mark>, drawn as a bar behind the text so it can sweep in.
// Pass `progress` to drive it from scroll, or `delay` to draw it once on mount.
export function Highlight({
  children,
  progress,
  delay = 0,
  color,
  drawKey,
}: {
  children: ReactNode
  progress?: MotionValue<number>
  delay?: number
  color?: string
  drawKey?: string | number
}) {
  return (
    <span className="hl">
      <motion.span
        key={drawKey}
        className="hl-bar"
        aria-hidden="true"
        style={progress ? { scaleX: progress, background: color } : { background: color }}
        initial={progress ? undefined : { scaleX: 0 }}
        animate={progress ? undefined : { scaleX: 1 }}
        transition={{ duration: 0.55, delay, ease: [0.65, 0, 0.35, 1] }}
      />
      <span className="hl-text">{children}</span>
    </span>
  )
}
