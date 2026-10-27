import { useEffect, useRef } from 'react'
import { motion, useTransform, type MotionValue } from 'motion/react'
import { hostOf, titleOf, type Game } from '../data/games'

// Tilt and depth per slot. Positions live in CSS (.hc-0 … .hc-5) so they can change per breakpoint.
const SLOTS = [
  { rot: -7, depth: 0.7 },
  { rot: 5, depth: 1.1 },
  { rot: -3, depth: 0.45 },
  { rot: 6, depth: 0.9 },
  { rot: -5, depth: 0.55 },
  { rot: 4, depth: 1.2 },
]

type Props = {
  game: Game
  index: number
  mx: MotionValue<number>
  my: MotionValue<number>
  flipped: boolean
  onToggle: (open: boolean) => void
  reduce: boolean
  baseDelay: number
  flipScale: number
}

export function HeroCover({ game, index, mx, my, flipped, onToggle, reduce, baseDelay, flipScale }: Props) {
  const slot = SLOTS[index % SLOTS.length]
  const x = useTransform(mx, (v) => v * slot.depth * 22)
  const y = useTransform(my, (v) => v * slot.depth * 14)
  const front = useRef<HTMLButtonElement>(null)
  const play = useRef<HTMLAnchorElement>(null)
  const returnFocus = useRef(false)
  const title = titleOf(game.name)

  // Focus the back face when it opens. Focus only returns to the cover when the
  // person closed it themselves (Escape or the flip-back button), not when another cover opened.
  useEffect(() => {
    if (flipped) play.current?.focus({ preventScroll: true })
    else if (returnFocus.current) front.current?.focus({ preventScroll: true })
    returnFocus.current = false
  }, [flipped])

  const close = () => {
    returnFocus.current = true
    onToggle(false)
  }

  return (
    <motion.div
      className={`hc hc-${index}${flipped ? ' is-flipped' : ''}`}
      initial={reduce ? false : { opacity: 0, scale: 0.6, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: baseDelay + index * 0.07 }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && flipped) {
          e.stopPropagation()
          close()
        }
      }}
    >
      <motion.div className="hc-parallax" style={reduce ? undefined : { x, y }}>
        <motion.div
          className="hc-card"
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0, rotate: flipped ? 0 : slot.rot, scale: flipped ? flipScale : 1 }}
          whileHover={flipped || reduce ? undefined : { rotate: slot.rot * 0.35, y: -8, scale: 1.04 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          <button
            ref={front}
            type="button"
            className="hc-front"
            onClick={() => onToggle(true)}
            aria-expanded={flipped}
            aria-label={`${title} by ${game.by ?? 'a creator'}. Show details`}
            inert={flipped}
          >
            <img
              src={game.cover_url ?? ''}
              alt=""
              width={1600}
              height={1000}
              decoding="async"
              fetchPriority={index < 2 ? 'high' : 'auto'}
            />
            <span className="hc-hint" aria-hidden="true">
              ▶
            </span>
          </button>
          <div className="hc-back" inert={!flipped} aria-hidden={!flipped}>
            <p className="hc-host">{hostOf(game.url)}</p>
            <p className="hc-title">{title}</p>
            <p className="hc-by">by {game.by ?? 'a creator'}</p>
            <div className="hc-actions">
              <a ref={play} className="hc-play" href={game.url}>
                Play <span aria-hidden="true">▶</span>
              </a>
              <button type="button" className="hc-close" onClick={close} aria-label={`Flip ${title} back`}>
                ↺
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
