// Fades and lifts a block once as it enters the viewport. MotionConfig's
// reducedMotion="user" drops the lift for people who ask for less motion.
export const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
})
