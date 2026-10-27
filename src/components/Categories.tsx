import { motion } from 'motion/react'
import { CATEGORIES, START_NG } from '../data/games'
import { Mark, SectionHead } from './Section'
import { reveal } from '../reveal'
import { usePointerLean } from '../hooks/usePointerLean'

// start.ng's eight homepage categories, with its own category art.
export function Categories() {
  const lean = usePointerLean()
  if (CATEGORIES.length === 0) return null
  return (
    <section id="categories" className="sec" aria-labelledby="cat-title">
      <SectionHead
        num="03"
        label="Categories"
        id="cat-title"
        aside={
          <a className="sec-link" href={`${START_NG}/categories`}>
            All categories <span aria-hidden="true">→</span>
          </a>
        }
      >
        Pick a <Mark tail=".">category</Mark>
      </SectionHead>

      <ul className="cat-grid">
        {CATEGORIES.map((c, i) => (
          <motion.li key={c.slug} className={`cat cat-${c.slug}`} {...reveal(0.04 * i)}>
            <a className="cat-link" href={`${START_NG}/categories/${c.slug}`} {...lean}>
              <span className="cat-art">
                {/* the pan follows the cursor; the image inside plays the category's own reaction */}
                <span className="cat-pan">
                  <img
                    src={`${START_NG}/category-art/${c.slug}.webp`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={880}
                    height={600}
                  />
                </span>
              </span>
              <span className="cat-label">
                <b>
                  <span>{c.label}</span>
                </b>
                <span className="cat-count">
                  {c.count} {c.count === 1 ? 'game' : 'games'}
                </span>
              </span>
              {c.blurb && <span className="cat-blurb">{c.blurb}</span>}
            </a>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
