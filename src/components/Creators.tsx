import { motion } from 'motion/react'
import { INDIE_NEW, INDIE_POPULAR, START_NG, indiePage } from '../data/games'
import { GameCard } from './GameCard'
import { Mark, SectionHead } from './Section'
import { reveal } from '../reveal'

export function Creators() {
  const top = INDIE_POPULAR.filter((g) => g.cover_url).slice(0, 3)

  return (
    <section id="creators" className="sec" aria-labelledby="creators-title">
      <div className="indie">
        <div className="indie-text">
          <SectionHead num="05" label="Independent creators" id="creators-title">
            Explore games from independent <Mark tail=".">creators</Mark>
          </SectionHead>
          <motion.p className="sec-sub" {...reveal(0.05)}>
            Games made and hosted by creators everywhere, from itch.io to their own sites. Find something new, or show the
            community what you've made.
          </motion.p>
          <motion.div className="sec-actions" {...reveal(0.1)}>
            <a className="btn btn-solid" href={`${START_NG}/creators`}>
              Explore games
            </a>
            <a className="btn btn-ghost" href={`${START_NG}/creators`}>
              Submit your game
            </a>
          </motion.div>
        </div>

        {top.length > 0 && (
          <div className="indie-hand" role="group" aria-label="Most clicked from independent creators">
            {top.map((g, i) => (
              <motion.a
                key={g.id}
                className={`indie-tile t${i}`}
                href={indiePage(g)}
                aria-label={`${g.name} by ${g.by ?? 'a creator'}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.1 + i * 0.08 }}
              >
                <img src={g.cover_url ?? ''} alt="" loading="lazy" decoding="async" />
                {i === 0 && <span className="indie-badge">Most clicked</span>}
              </motion.a>
            ))}
          </div>
        )}
      </div>

      {INDIE_NEW.length > 0 && (
        <>
          <motion.div className="sub-head" {...reveal()}>
            <h3>New from independent creators</h3>
            <a className="sec-link" href={`${START_NG}/creators`}>
              See all <span aria-hidden="true">→</span>
            </a>
          </motion.div>
          <ul className="gc-grid">
            {INDIE_NEW.map((g) => (
              <GameCard
                key={g.id}
                href={indiePage(g)}
                name={g.name}
                title={g.name}
                by={g.by}
                url={g.url}
                cover={g.cover_url}
                description={g.description}
                fx="spark"
              />
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
