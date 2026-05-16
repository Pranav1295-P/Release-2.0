import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import RelativityLogo from './RelativityLogo.jsx'

/**
 * Welcome overlay — two beats:
 *   Phase 0 (0.0 – 1.6 s) : logo alone, centered
 *   Phase 1 (1.6 – 4.0 s) : logo slides to the left, the welcome text
 *                            slides in to its right (Core Committee layout)
 *   Phase 2 (4.0 s)       : fade out, hand off to the page
 */
export default function IntroOverlay({ onDone }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1600)
    const t2 = setTimeout(onDone, 4000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] },
      }}
      className="fixed inset-0 z-[100] bg-black overflow-hidden flex items-center justify-center"
    >
      {/* Subtle blue + violet glows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1.6 }}
        className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full blur-[140px]"
        style={{ background: 'radial-gradient(circle, rgba(79,111,255,0.4), transparent 70%)' }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.6, delay: 0.2 }}
        className="absolute bottom-1/3 right-1/3 translate-x-1/2 translate-y-1/2 w-[45vw] h-[45vw] rounded-full blur-[140px]"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)' }}
      />

      {/* Faint grid + grain */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 noise" />

      {/* Center stage — logo + (later) text */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Logo — entrance, then slides to the left in phase 1 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
            x: phase === 0 ? 0 : -16,
          }}
          transition={{
            opacity: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
            rotate: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
            x: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
          }}
          className="flex-shrink-0"
        >
          <RelativityLogo size={120} />
        </motion.div>

        {/* Welcome text — slides in from the right in phase 1 */}
        <motion.div
          initial={{ opacity: 0, x: -20, width: 0 }}
          animate={{
            opacity: phase >= 1 ? 1 : 0,
            x: phase >= 1 ? 0 : -20,
            width: phase >= 1 ? 'auto' : 0,
          }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden ml-6"
        >
          <div
            className="text-white whitespace-nowrap"
            style={{
              fontFamily: '"DM Sans", "Google Sans", system-ui, sans-serif',
              fontWeight: 500,
              letterSpacing: '-0.01em',
              lineHeight: 1.05,
            }}
          >
            <div className="text-2xl md:text-4xl">Welcome To</div>
            <div className="text-2xl md:text-4xl">Pranav's Official Webpage</div>
          </div>
        </motion.div>
      </div>

      {/* Bottom-right tag */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 0.6 }}
        className="absolute bottom-8 right-8 font-mono text-[0.6rem] tracking-[0.3em] uppercase text-white/30"
      >
        Relativity OpenSource · 2026
      </motion.div>
    </motion.div>
  )
}
