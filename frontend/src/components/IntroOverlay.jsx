import { motion } from 'framer-motion'
import { useEffect } from 'react'

export default function IntroOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3600)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] },
      }}
      className="fixed inset-0 z-[100] bg-black overflow-hidden"
    >
      {/* Vertical coral light strips — Radiant style */}
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 0.5 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 bottom-0 left-[20%] w-px origin-top"
        style={{ background: 'linear-gradient(180deg, transparent, #ff5722, transparent)' }}
      />
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 0.5 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="absolute top-0 bottom-0 right-[20%] w-px origin-top"
        style={{ background: 'linear-gradient(180deg, transparent, #ff5722, transparent)' }}
      />
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 0.3 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="absolute top-0 bottom-0 left-[50%] w-px origin-top"
        style={{ background: 'linear-gradient(180deg, transparent, #ff5722, transparent)' }}
      />

      {/* Soft coral glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.18 }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/2 right-0 -translate-y-1/2 w-[60vw] h-[80vh] blur-[140px]"
        style={{ background: 'radial-gradient(ellipse, #ff5722, transparent 70%)' }}
      />

      {/* Brand label top-left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute top-10 left-10 flex items-center gap-3"
      >
        <span className="font-mono text-[0.65rem] tracking-[0.4em] uppercase text-white/70">
          Relativity OpenSource
        </span>
      </motion.div>

      {/* Status indicator top-right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="absolute top-10 right-10 flex items-center gap-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-coral-500 animate-pulse" />
        <span className="font-mono text-[0.6rem] tracking-[0.3em] uppercase text-white/50">
          Online · 2026
        </span>
      </motion.div>

      {/* Center stage */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-10 w-full">

          <div className="reveal-mask">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-[0.7rem] tracking-[0.4em] uppercase text-white/40"
            >
              ← Pranav Murthy presents
            </motion.div>
          </div>

          <div className="reveal-mask mt-6">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.9, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[14vw] md:text-[10vw] leading-[0.85] tracking-tightest text-white"
            >
              You make your own
            </motion.h1>
          </div>

          <div className="reveal-mask mt-2">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ delay: 1.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[14vw] md:text-[10vw] leading-[0.85] tracking-tightest text-coral-500"
            >
              luck if you stay at it long enough - Naval
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="mt-10 h-px w-32 bg-white/30 origin-left"
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.6 }}
            className="mt-6 max-w-md font-sans text-sm text-white/50 leading-relaxed"
          >
            The first-year build log of a curious mind — learning AI, defending systems, shipping code.
          </motion.div>
        </div>
      </div>

      {/* Bottom-left footer mark */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.6 }}
        className="absolute bottom-10 left-10 font-mono text-[0.6rem] tracking-[0.3em] uppercase text-white/30"
      >
        Est. 2026 · India
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.6 }}
        className="absolute bottom-10 right-10 font-mono text-[0.6rem] tracking-[0.3em] uppercase text-white/30"
      >
        Entering site →
      </motion.div>
    </motion.div>
  )
}
