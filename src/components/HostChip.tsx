import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { CHIP_HOSTS } from '../data/games'

// start.ng's `bingo.start.ng` chip, retyping itself through real game addresses.
// It pauses while hovered or focused, and stays put with reduced motion.
export function HostChip({ startDelay = 1400 }: { startDelay?: number }) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [shown, setShown] = useState(CHIP_HOSTS[0]?.host ?? 'bingo.start.ng')
  const paused = useRef(false)

  useEffect(() => {
    if (reduce || CHIP_HOSTS.length < 2) return
    // Only the game's name is erased and retyped; the ".start.ng" ending stays.
    const SUFFIX = '.start.ng'
    const nameOf = (host: string) => (host.endsWith(SUFFIX) ? host.slice(0, -SUFFIX.length) : host)
    let timer: number
    let i = 0
    let len = nameOf(CHIP_HOSTS[0].host).length
    let phase: 'hold' | 'erase' | 'type' = 'hold'

    const tick = () => {
      if (paused.current || document.hidden) {
        timer = window.setTimeout(tick, 400)
        return
      }
      const from = nameOf(CHIP_HOSTS[i].host)
      const to = nameOf(CHIP_HOSTS[(i + 1) % CHIP_HOSTS.length].host)
      if (phase === 'hold') {
        phase = 'erase'
        timer = window.setTimeout(tick, 40)
      } else if (phase === 'erase') {
        if (len > 0) {
          len--
          setShown(from.slice(0, len) + SUFFIX)
          timer = window.setTimeout(tick, 32)
        } else {
          phase = 'type'
          timer = window.setTimeout(tick, 160)
        }
      } else {
        if (len < to.length) {
          len++
          setShown(to.slice(0, len) + SUFFIX)
          timer = window.setTimeout(tick, 60)
        } else {
          i = (i + 1) % CHIP_HOSTS.length
          setIndex(i)
          phase = 'hold'
          timer = window.setTimeout(tick, 2400)
        }
      }
    }
    timer = window.setTimeout(tick, startDelay + 1200)
    return () => clearTimeout(timer)
  }, [reduce, startDelay])

  const game = CHIP_HOSTS[index]
  return (
    <a
      className="host-chip"
      href={game?.url ?? 'https://bingo.start.ng'}
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
      title={`Open ${game?.host}`}
    >
      <code>
        {shown}
        <span className="caret" aria-hidden="true" />
      </code>
    </a>
  )
}
