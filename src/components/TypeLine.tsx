import { motion, useReducedMotion } from 'motion/react'

// Types a mono line in, one character at a time. Screen readers get the whole line.
export function TypeLine({ text, delay = 0, step = 0.022, className }: { text: string; delay?: number; step?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <p className={className}>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">
        {[...text].map((ch, i) => (
          <motion.span
            key={i}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.01, delay: delay + i * step }}
          >
            {ch}
          </motion.span>
        ))}
      </span>
    </p>
  )
}
