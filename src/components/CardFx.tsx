import type { CardFx as Kind } from '../data/games'

// A small ink-and-lime sticker in the cover's corner that acts out the game's
// kind of play once on hover or keyboard focus, then settles. Pure CSS (card-fx.css).
// Drawn around (0, 0) inside a 160 x 100 box that matches the 16:10 cover.
export function CardFx({ kind }: { kind: Kind }) {
  return (
    <svg className={`fx fx-${kind}`} viewBox="0 0 160 100" aria-hidden="true" focusable="false">
      <g transform="translate(133 72)">
        <g className="fx-sticker">
          <circle r="21" className="fx-disc" />
          {SHAPES[kind]}
        </g>
      </g>
    </svg>
  )
}

const SHAPES: Record<Kind, React.ReactNode> = {
  // Two cards fan out from the stack.
  cards: (
    <>
      <rect className="fx-a fx-cream" x="-6" y="-9" width="12" height="17" rx="2" />
      <g className="fx-b">
        <rect className="fx-lime" x="-6" y="-9" width="12" height="17" rx="2" />
        <circle className="fx-ink" cx="0" cy="-0.5" r="2" />
      </g>
    </>
  ),
  // A ball drops and bounces twice before settling.
  ball: (
    <>
      <path className="fx-line" d="M-12 11h24" />
      <g className="fx-a">
        <circle className="fx-lime" cy="3" r="7" />
        <path className="fx-thin" d="M-7 3h14M0 -4c3 3 3 11 0 14" />
      </g>
    </>
  ),
  // A planet with a ring, and a moon that swings round once.
  space: (
    <>
      <circle className="fx-lime" r="7" />
      <g transform="rotate(-18)">
        <ellipse className="fx-ring fx-draw" rx="14" ry="5" pathLength={1} />
      </g>
      <circle className="fx-a fx-ink" cx="-12" cy="-9" r="2.2" />
    </>
  ),
  // A little bus bumps forward as speed lines whip past.
  race: (
    <>
      <path className="fx-c fx-line" d="M-16 -4h7M-18 2h6" />
      <g className="fx-a">
        <rect className="fx-lime" x="-8" y="-7" width="18" height="11" rx="3" />
        <path className="fx-thin" d="M-4 -7v6M3 -7v6" />
        <circle className="fx-ink" cx="-3" cy="5" r="2.6" />
        <circle className="fx-ink" cx="6" cy="5" r="2.6" />
      </g>
    </>
  ),
  // Crosshairs close in and the centre lights up.
  aim: (
    <>
      <g className="fx-a">
        <circle className="fx-ring" r="10" />
        <path className="fx-line" d="M0 -14v6M0 8v6M-14 0h6M8 0h6" />
      </g>
      <circle className="fx-b fx-lime" r="3.2" />
    </>
  ),
  // A block hops from one ledge to the next.
  hop: (
    <>
      <path className="fx-line" d="M-15 8h10M5 8h10" />
      <rect className="fx-a fx-lime" x="-14" y="-1" width="8" height="8" rx="2" />
    </>
  ),
  // Steam rises from a pot.
  food: (
    <>
      <path className="fx-lime" d="M-11 0h22a11 9 0 0 1-22 0z" />
      <path className="fx-thin fx-draw" d="M-4 -3c-3-3 3-5 0-9" pathLength={1} />
      <path className="fx-thin fx-draw fx-late" d="M4 -3c-3-3 3-5 0-9" pathLength={1} />
    </>
  ),
  // A dotted trail leads to a gem that pops up.
  treasure: (
    <>
      <path className="fx-trail fx-wipe" d="M-15 9c6-2 6-10 13-9" />
      <path className="fx-b fx-lime" d="M5 -10l6 6-6 8-6-8z" />
    </>
  ),
  // Three coins pop up one after another.
  coins: (
    <>
      <ellipse className="fx-a fx-lime" cx="-8" cy="4" rx="5" ry="5" />
      <ellipse className="fx-b fx-lime" cx="0" cy="-2" rx="5" ry="5" />
      <ellipse className="fx-c fx-lime" cx="8" cy="4" rx="5" ry="5" />
    </>
  ),
  // Something falls and lands in the bowl, which dips.
  catch: (
    <>
      <circle className="fx-a fx-lime" cy="-2" r="4" />
      <path className="fx-b fx-line" d="M-11 3a11 9 0 0 0 22 0" />
    </>
  ),
  // The bulb lights, with a little bounce.
  brainy: (
    <>
      <path className="fx-b fx-lime" d="M0 -12a8 8 0 0 1 5 14v3h-10v-3a8 8 0 0 1 5-14z" />
      <path className="fx-thin" d="M-3 9h6" />
      <path className="fx-c fx-thin" d="M-13 -10l3 2M13 -10l-3 2M0 -18v3" />
    </>
  ),
  // A dash streaks across with a puff of dust behind it.
  runner: (
    <>
      <path className="fx-c fx-line" d="M-15 -5h8M-17 1h10M-14 7h6" />
      <circle className="fx-a fx-lime" cx="6" cy="1" r="6" />
    </>
  ),
  // Bunting drops in and sways once.
  naija: (
    <g className="fx-a">
      <path className="fx-thin" d="M-15 -8q15 8 30 0" />
      <path className="fx-lime" d="M-11 -5.5l3 9 4-8z" />
      <path className="fx-cream" d="M-2 -3.6l2 9 3-9z" />
      <path className="fx-lime" d="M6 -4.6l3 8 3-9.5z" />
    </g>
  ),
  // A sparkle draws itself and turns.
  spark: (
    <>
      <path
        className="fx-a fx-lime"
        d="M0 -12c1 6 5 10 11 11-6 1-10 5-11 11-1-6-5-10-11-11 6-1 10-5 11-11z"
      />
      <circle className="fx-b fx-ink" cx="12" cy="-10" r="1.8" />
    </>
  ),
}
