import { MotionConfig } from 'motion/react'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { TournamentScene } from './components/TournamentScene'
import { ScrollButton } from './components/ScrollButton'
import { DailyChallenge } from './components/DailyChallenge'
import { Categories } from './components/Categories'
import { CommunityGames } from './components/CommunityGames'
import { Creators } from './components/Creators'
import { Publish } from './components/Publish'
import { About } from './components/About'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'
import { START_NG } from './data/games'
import './App.css'
import './sections.css'
import './card-fx.css'

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
        <div className="sections">
          <DailyChallenge />
          <Categories />
          <CommunityGames />
          <Creators />
          <Publish />
          <About />
          <Faq />
        </div>
      </main>
      <Footer />
      <a className="concept-badge" href={START_NG}>
        <span className="concept-dot" aria-hidden="true" />
        Unofficial concept · play on start.ng
      </a>
      <ScrollButton />
    </MotionConfig>
  )
}
