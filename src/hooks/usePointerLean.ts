import { useReducedMotion } from 'motion/react'

const VARS = ['--rx', '--ry', '--px', '--py', '--mx', '--my']

// Lets a card lean toward the cursor and its artwork drift inside the frame.
// Writes CSS variables straight onto the element (no re-render per move);
// the CSS decides what leans, drifts or catches the light. Mouse only, and
// nothing at all for people who ask for reduced motion.
export function usePointerLean(max = 4) {
  const reduce = useReducedMotion()

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${((0.5 - y) * max).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${((x - 0.5) * max).toFixed(2)}deg`)
    el.style.setProperty('--px', `${((0.5 - x) * 8).toFixed(1)}px`)
    el.style.setProperty('--py', `${((0.5 - y) * 6).toFixed(1)}px`)
    el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
    el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
  }

  const onPointerLeave = (e: React.PointerEvent<HTMLElement>) => {
    for (const v of VARS) e.currentTarget.style.removeProperty(v)
  }

  return { onPointerMove, onPointerLeave }
}
