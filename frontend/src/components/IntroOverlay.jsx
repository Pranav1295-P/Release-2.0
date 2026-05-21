import { motion } from 'framer-motion'
import { useEffect } from 'react'

/**
 * Professional text-only welcome animation.
 *   • "WELCOME TO" — small, letter-spaced eyebrow, fades up
 *   • "Pranav's Official Webpage" — large, mask-revealed line by line
 *   • A thin gradient rule draws across underneath
 *   • Calm blue/violet ambience; clean fade-out
 * Total ~3.6s.
 */
export default function IntroOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3600)
    return () => clearTimeout(t)
  }, [onDone])

  const EASE = [0.16, 1, 0.3, 1]
  const sans = '"DM Sans", "Google Sans", system-ui, sans-serif'

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] } }}
      className="fixed inset-0 z-[100] bg-ink-950 overflow-hidden flex items-center justify-center"
    >
      {/* Ambient blue + violet glows */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vw] h-[55vw] rounded-full blur-[150px]"
        style={{ background: 'radial-gradient(circle, rgba(79,111,255,0.4), transparent 70%)' }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.28 }}
        transition={{ duration: 1.8, delay: 0.3 }}
        className="absolute bottom-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full blur-[150px]"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)' }}
      />

      {/* Faint grid + grain for depth */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 noise" />

      {/* Center stage */}
      <div className="relative z-10 px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
          className="mb-6 font-mono text-[0.65rem] md:text-xs tracking-[0.55em] uppercase text-coral-400"
        >
          Welcome To
        </motion.div>

        {/* Line 1 — "Pranav's" */}
        <div className="reveal-mask">
          <motion.div
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.55, duration: 1, ease: EASE }}
            className="text-5xl md:text-8xl font-bold text-white leading-[1.02]"
            style={{ fontFamily: sans, letterSpacing: '-0.02em' }}
          >
            Pranav's
          </motion.div>
        </div>

        {/* Line 2 — "Official Webpage" with a gradient accent */}
        <div className="reveal-mask mt-1 md:mt-2">
          <motion.div
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.72, duration: 1, ease: EASE }}
            className="text-5xl md:text-8xl font-bold leading-[1.02]"
            style={{
              fontFamily: sans,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(100deg, #ffffff 35%, #7c9cff 70%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Official Webpage
          </motion.div>
        </div>

        {/* Animated rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.5, duration: 1, ease: EASE }}
          className="mt-8 md:mt-10 mx-auto h-px w-44 md:w-64 origin-center"
          style={{ background: 'linear-gradient(90deg, transparent, #4f6fff, #8b5cf6, transparent)' }}
        />

        {/* Sub-caption */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9, duration: 0.8 }}
          className="mt-6 font-mono text-[0.6rem] md:text-[0.7rem] tracking-[0.4em] uppercase text-white/40"
        >
          Relativity OpenSource
        </motion.div>
      </div>

      {/* Corner timestamps */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute top-8 left-8 font-mono text-[0.6rem] tracking-[0.3em] uppercase text-white/25"
      >
        Est. 2026
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute bottom-8 right-8 font-mono text-[0.6rem] tracking-[0.3em] uppercase text-white/25"
      >
        Entering →
      </motion.div>
    </motion.div>
  )
}
