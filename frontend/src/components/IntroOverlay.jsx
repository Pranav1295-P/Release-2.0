import { motion } from 'framer-motion'
import { useEffect } from 'react'

export default function IntroOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] },
      }}
      className="fixed inset-0 z-[100] bg-ink-950 overflow-hidden flex items-center justify-center"
    >
      {/* Blue + violet aurora glows */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full blur-[150px]"
        style={{ background: 'radial-gradient(circle, rgba(79,111,255,0.45), transparent 70%)' }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.45, scale: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut', delay: 0.2 }}
        className="absolute bottom-1/3 right-1/3 translate-x-1/2 translate-y-1/2 w-[45vw] h-[45vw] rounded-full blur-[150px]"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)' }}
      />

      {/* Subtle grid + grain */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 noise" />

      {/* Dark vignette overlay — keeps WELCOME crisp at center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(5,5,9,0.75) 75%, #050509 100%)',
        }}
      />

      {/* Center — just WELCOME */}
      <div className="relative z-10 text-center px-6">
        <div className="reveal-mask">
          <motion.h1
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[20vw] md:text-[15vw] leading-none tracking-tightest"
            style={{
              background: 'linear-gradient(135deg, #ffffff 30%, #7c9cff 65%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            WELCOME
          </motion.h1>
        </div>

        {/* Thin gradient underline */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 mx-auto h-px w-48 origin-center"
          style={{ background: 'linear-gradient(90deg, transparent, #4f6fff, #8b5cf6, transparent)' }}
        />

        {/* Small caption */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.7 }}
          className="mt-6 font-mono text-[0.65rem] md:text-[0.7rem] tracking-[0.45em] uppercase text-white/45"
        >
          Pranav Murthy · Relativity OpenSource
        </motion.div>
      </div>

      {/* Corner marks */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.6 }}
        className="absolute top-8 left-8 font-mono text-[0.6rem] tracking-[0.3em] uppercase text-white/30"
      >
        Est. 2026
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.6 }}
        className="absolute bottom-8 right-8 font-mono text-[0.6rem] tracking-[0.3em] uppercase text-white/30"
      >
        Entering →
      </motion.div>
    </motion.div>
  )
}
