import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Mark, SectionHead } from './Section'
import { reveal } from '../reveal'

// start.ng's own questions and answers.
const QUESTIONS: { q: string; a: ReactNode }[] = [
  {
    q: 'What is start.ng?',
    a: (
      <>
        A home for free browser games made by the HNG community. Each game has its own address, like{' '}
        <code>yourgame.start.ng</code>, and you play it right in your browser.
      </>
    ),
  },
  { q: 'Is it free?', a: 'Yes. Every game on start.ng is free to play in your browser, with nothing to download.' },
  {
    q: 'Are there Nigerian or African web games?',
    a: 'Yes. Many games here are Naija-themed, from danfo rush hour to jollof and Lagos markets, and we welcome games from across Africa.',
  },
  {
    q: 'Do I need an account to play?',
    a: 'No. Sign in to get your start.ng character, keep your scores on the leaderboards and join the daily tournament.',
  },
  {
    q: 'What is the daily tournament?',
    a: 'Every day a few start.ng games are picked for 24 hours, and the best player wins. Points count towards the overall leaderboard.',
  },
  {
    q: 'How do I put my game on start.ng?',
    a: (
      <>
        Push your browser game to a public GitHub repo, publish it with one API call and approve it once. It goes live at{' '}
        <code>yourgame.start.ng</code>. The <a href="#how">docs</a> have every step.
      </>
    ),
  },
]

export function Faq() {
  return (
    <section id="faq" className="sec faq" aria-labelledby="faq-title">
      <SectionHead num="08" label="Questions" id="faq-title">
        Good <Mark tail=".">questions</Mark>
      </SectionHead>
      <div className="faq-list">
        {QUESTIONS.map(({ q, a }, i) => (
          <motion.details key={q} className="faq-item" {...reveal(0.04 * i)}>
            <summary>
              <span>{q}</span>
              <span className="faq-icon" aria-hidden="true" />
            </summary>
            <p>{a}</p>
          </motion.details>
        ))}
      </div>
    </section>
  )
}
