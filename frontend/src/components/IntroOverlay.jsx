import { motion } from 'framer-motion'
import { useEffect } from 'react'

/**
 * RCB-themed welcome — red diagonal sweeps, gold thin rule, bold text reveal.
 *   beat 1 (0.0 – 1.0 s): red slashes sweep in across the frame
 *   beat 2 (0.6 – 2.4 s): "WELCOME TO" eyebrow → big bold title revealed
 *   beat 3 (2.4 – 3.6 s): gold rule draws, sub-caption fades, exits
 */
export default function IntroOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3700)
    return () => clearTimeout(t)
  }, [onDone])

  const EASE = [0.16, 1, 0.3, 1]
  const sans = '"Inter", system-ui, sans-serif'

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] } }}
      className="fixed inset-0 z-[100] bg-ink-950 overflow-hidden flex items-center justify-center"
    >
      {/* Ambient red + gold glows */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.55, scale: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full blur-[160px]"
        style={{ background: 'radial-gradient(circle, rgba(227,6,19,0.55), transparent 70%)' }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1.6, delay: 0.25 }}
        className="absolute bottom-[18%] right-[15%] w-[40vw] h-[40vw] rounded-full blur-[150px]"
        style={{ background: 'radial-gradient(circle, rgba(212,162,76,0.55), transparent 70%)' }}
      />

      {/* Diagonal red slashes — jersey-style accents */}
      <motion.div
        initial={{ x: '-120%', opacity: 0 }}
        animate={{ x: 0, opacity: 0.95 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="absolute -left-[20%] top-[15%] w-[140%] h-[42px] origin-left"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #b80510 18%, #e30613 50%, #ff1f3f 70%, #e30613 82%, transparent 100%)',
          transform: 'rotate(-9deg)',
        }}
      />
      <motion.div
        initial={{ x: '120%', opacity: 0 }}
        animate={{ x: 0, opacity: 0.9 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        className="absolute -right-[20%] bottom-[18%] w-[140%] h-[36px] origin-right"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #d4a24c 20%, #f4c842 50%, #d4a24c 80%, transparent 100%)',
          transform: 'rotate(-9deg)',
          opacity: 0.5,
        }}
      />

      {/* Grid + grain */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 noise" />

      {/* Center stage */}
      <div className="relative z-10 px-6 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
          className="mb-6 flex items-center justify-center gap-3 font-mono text-[0.65rem] md:text-xs tracking-[0.55em] uppercase"
        >
          <span className="w-10 h-px bg-coral-500" />
          <span className="text-coral-500">Welcome To</span>
          <span className="w-10 h-px bg-coral-500" />
        </motion.div>

        {/* Line 1 — "Pranav's" */}
        <div className="reveal-mask">
          <motion.div
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.75, duration: 1, ease: EASE }}
            className="text-5xl md:text-8xl font-extrabold text-white leading-[1.02]"
            style={{ fontFamily: sans, letterSpacing: '-0.02em' }}
          >
            Pranav's
          </motion.div>
        </div>

        {/* Line 2 — "Official Webpage" with red→gold gradient */}
        <div className="reveal-mask mt-1 md:mt-2">
          <motion.div
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.95, duration: 1, ease: EASE }}
            className="text-5xl md:text-8xl font-extrabold leading-[1.02]"
            style={{
              fontFamily: sans,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(100deg, #ffffff 30%, #ff3848 55%, #f4c842 90%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Official Webpage
          </motion.div>
        </div>

        {/* Gold rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.7, duration: 1, ease: EASE }}
          className="mt-8 md:mt-10 mx-auto h-px w-44 md:w-72 origin-center"
          style={{ background: 'linear-gradient(90deg, transparent, #e30613, #d4a24c, #f4c842, #d4a24c, #e30613, transparent)' }}
        />

        {/* Sub-caption */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.8 }}
          className="mt-6 font-mono text-[0.6rem] md:text-[0.7rem] tracking-[0.45em] uppercase text-white/50"
        >
          Relativity OpenSource · Est. 2026
        </motion.div>
      </div>

      {/* Corner accents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.6 }}
        className="absolute top-8 left-8 flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.3em] uppercase text-coral-500/80"
      >
        <span className="w-2 h-2 bg-coral-500 rounded-full animate-pulse" />
        Live
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.6 }}
        className="absolute top-8 right-8 font-mono text-[0.6rem] tracking-[0.3em] uppercase text-gold-500/80"
      >
        ✦ R · P · M
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.6 }}
        className="absolute bottom-8 right-8 font-mono text-[0.6rem] tracking-[0.3em] uppercase text-white/30"
      >
        Entering →
      </motion.div>
    </motion.div>
  )
}
