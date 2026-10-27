import { MotionConfig } from 'motion/react'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { TournamentScene } from './components/TournamentScene'
import { ScrollButton } from './components/ScrollButton'
import { START_NG } from './data/games'
import './App.css'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#tournament">
        Skip to today's tournament
      </a>
      <Nav />
      <main>
        <Hero />
        <TournamentScene />
        <section className="proto-end" aria-label="About this prototype">
          <p className="eyebrow">Prototype ends here</p>
          <p>
            The rest of the homepage (daily challenge, categories, community games, creators, publishing, FAQ) comes
            after review.
          </p>
        </section>
      </main>
      <a className="concept-badge" href={START_NG}>
        <span className="concept-dot" aria-hidden="true" />
        Unofficial concept · play on start.ng
      </a>
      <ScrollButton />
    </MotionConfig>
  )
}
