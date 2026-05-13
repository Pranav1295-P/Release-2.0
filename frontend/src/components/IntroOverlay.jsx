import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function IntroOverlay({ onDone }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1400)
    const t2 = setTimeout(() => setPhase(2), 2800)
    const t3 = setTimeout(onDone, 4400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950 overflow-hidden"
    >
      {/* Soft glow */}
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(212,245,107,0.18), transparent 70%)' }}
      />

      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute inset-0 noise" />

      {/* Top label */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-3"
      >
        <span className="w-8 h-px bg-lime-400" />
        <span className="font-sans text-[0.65rem] tracking-[0.45em] uppercase text-lime-400">
          Relativity OpenSource
        </span>
        <span className="w-8 h-px bg-lime-400" />
      </motion.div>

      {/* Center stage — multiple phases */}
      <div className="relative z-10 px-6 text-center">
        {/* Phase 0 — "Welcome" appears */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: phase < 2 ? 1 : 0,
            scale: phase < 2 ? 1 : 1.1,
            y: phase < 2 ? 0 : -20,
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="font-mono text-[0.7rem] tracking-[0.4em] uppercase text-cream-200/40 mb-4">
            — An aesthetic introduction —
          </div>
          <h1 className="font-display text-7xl md:text-9xl leading-[0.9] text-cream-50">
            Welcome
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6 mx-auto h-px w-32 bg-lime-400 origin-center"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 font-sans text-sm text-cream-200/60 tracking-[0.2em] uppercase"
          >
            to the official page of
          </motion.div>
        </motion.div>

        {/* Phase 2 — Name reveals */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: phase >= 2 ? 1 : 0,
            scale: phase >= 2 ? 1 : 0.95,
          }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={phase >= 2 ? '' : 'absolute inset-0 pointer-events-none'}
        >
          <div className="font-mono text-[0.7rem] tracking-[0.4em] uppercase text-lime-400 mb-6">
            ✦ Est. 2026 ✦
          </div>
          <h2 className="font-display italic text-7xl md:text-[10rem] leading-[0.9] text-cream-50">
            Pranav <span className="text-lime-400">Murthy</span>
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 10 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8 font-sans text-xs tracking-[0.5em] uppercase text-cream-200/50"
          >
            Curiosity · Code · Quiet rebellion
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom — running marquee strip */}
      <div className="absolute bottom-0 left-0 right-0 border-y border-cream-200/10 overflow-hidden py-3 bg-ink-950/40">
        <div className="marquee font-sans text-xs tracking-[0.4em] uppercase text-cream-200/30">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-12 px-6 whitespace-nowrap">
              <span>AI</span> <span>·</span>
              <span>Cyber Security</span> <span>·</span>
              <span>B.Tech CSE</span> <span>·</span>
              <span>Relativity OpenSource</span> <span>·</span>
              <span>Free-Conversations</span> <span>·</span>
              <span>Under Construction</span> <span>·</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
