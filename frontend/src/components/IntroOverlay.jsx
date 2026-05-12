import { motion } from 'framer-motion'
import { useEffect } from 'react'

export default function IntroOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4200)
    return () => clearTimeout(t)
  }, [onDone])

  const text = 'Welcome To Pranav Murthy Official Page'
  const words = text.split(' ')

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950"
    >
      {/* Animated background rays */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -inset-[20%]"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
          style={{
            background:
              'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(245,214,138,0.08) 30deg, transparent 60deg, rgba(167,139,250,0.06) 90deg, transparent 120deg, rgba(245,214,138,0.04) 180deg, transparent 360deg)',
          }}
        />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,6,10,0.9)_70%,#05060a_100%)]" />

      {/* Central monogram */}
      <motion.div
        initial={{ scale: 0, rotate: -90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[200%]"
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 rounded-full blur-2xl"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ background: 'radial-gradient(circle, #f5d68a, transparent 70%)' }}
          />
          <div className="relative w-20 h-20 rounded-full border border-gold-500/40 flex items-center justify-center font-display text-4xl text-gradient-gold">
            P
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-mono text-[0.65rem] tracking-[0.5em] text-gold-500/70 uppercase mb-6"
        >
          — Relativity OpenSource —
        </motion.div>

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-tight">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ y: 60, opacity: 0, filter: 'blur(20px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{
                delay: 0.8 + i * 0.12,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block mr-3"
            >
              {word === 'Pranav' || word === 'Murthy' ? (
                <span className="text-gradient-gold italic">{word}</span>
              ) : (
                <span className="text-white/95">{word}</span>
              )}
            </motion.span>
          ))}
        </h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2.2, duration: 1.2, ease: 'easeInOut' }}
          className="mt-8 mx-auto h-px w-64 bg-gradient-to-r from-transparent via-gold-500 to-transparent origin-left"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.8 }}
          className="mt-6 text-xs tracking-[0.4em] uppercase text-white/40"
        >
          An Official Web Experience
        </motion.p>
      </div>
    </motion.div>
  )
}
