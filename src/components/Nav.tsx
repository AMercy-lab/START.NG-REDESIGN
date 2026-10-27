import { useEffect, useState } from 'react'
import { Logo } from './Logo'
import { START_NG } from '../data/games'

const LINKS = [
  { label: 'Games', href: `${START_NG}/games` },
  { label: 'Tournament', href: `${START_NG}/tournament` },
  { label: 'Creators', href: `${START_NG}/creators` },
  { label: 'Docs', href: `${START_NG}/docs` },
]

function currentTheme(): 'light' | 'dark' {
  const set = document.documentElement.dataset.theme
  if (set === 'light' || set === 'dark') return set
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(currentTheme)

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 8)
    onScroll()
    addEventListener('scroll', onScroll, { passive: true })
    return () => removeEventListener('scroll', onScroll)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('sng-theme', next)
    } catch {
      // storage blocked (private mode); the theme still applies for this visit
    }
    setTheme(next)
  }

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="nav-inner">
        <a className="nav-logo" href="#top" aria-label="start.ng, back to top">
          <Logo />
        </a>
        <nav className="nav-links" aria-label="Main">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href}>
              <span>{l.label}</span>
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          aria-pressed={theme === 'dark'}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <g className="sun">
              <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <line
                  key={a}
                  x1="12"
                  y1="2.5"
                  x2="12"
                  y2="4.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  transform={`rotate(${a} 12 12)`}
                />
              ))}
            </g>
            <path
              className="moon"
              d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <a className="btn btn-solid nav-signin" href={START_NG}>
          Sign in
        </a>
      </div>
    </header>
  )
}
