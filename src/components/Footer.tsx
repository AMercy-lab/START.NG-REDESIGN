import { START_NG } from '../data/games'
import { Logo } from './Logo'

// start.ng's footer links, plus a plain note that this page is an unofficial concept.
const COLUMNS = [
  {
    title: 'Play',
    links: [
      ['All games', '/games'],
      ['Daily tournament', '/tournament'],
      ['Leaderboard', '/leaderboard'],
      ['Categories', '/categories'],
      ['The Hangout', '/hangout'],
    ],
  },
  {
    title: 'Make games',
    links: [
      ['Independent creators', '/creators'],
      ['Build a game', '/docs'],
      ['Docs for your AI (.md)', '/docs.md'],
    ],
  },
  { title: 'About', links: [['About start.ng', '/about']] },
]

export function Footer() {
  return (
    <footer className="foot">
      <div className="foot-inner">
        <div className="foot-brand">
          <a className="nav-logo foot-logo" href="#top" aria-label="start.ng, back to top">
            <Logo />
          </a>
          <p>Nigeria's home for browser games, made by the community and by creators across Africa.</p>
        </div>
        {COLUMNS.map((c) => (
          <nav key={c.title} className="foot-col" aria-label={c.title}>
            <h2>{c.title}</h2>
            <ul>
              {c.links.map(([label, path]) => (
                <li key={path}>
                  <a href={`${START_NG}${path}`}>
                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="foot-base">
        <p>© 2026 start.ng · Games from Nigeria and across Africa.</p>
        <p className="foot-concept">
          This page is an unofficial concept redesign, not made by or affiliated with start.ng. Every game and link goes to
          the real <a href={START_NG}>start.ng</a>.
        </p>
      </div>
    </footer>
  )
}
