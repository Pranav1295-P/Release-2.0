import { motion } from 'framer-motion'
import { Github, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative z-10 mt-32 border-t border-gold-500/10 bg-ink-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-gold-500/30 flex items-center justify-center font-display text-gradient-gold">
              P
            </div>
            <div>
              <div className="font-display text-white">Pranav Murthy</div>
              <div className="text-[0.65rem] tracking-[0.3em] uppercase text-gold-500/70">
                Relativity OpenSource
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="https://github.com/Pranav1295-P"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-gold-400 transition-colors"
            >
              <Github size={18} />
            </a>
            <a
              href="mailto:officepranav820@gmail.com"
              className="text-white/60 hover:text-gold-400 transition-colors"
            >
              <Mail size={18} />
            </a>
          </div>
        </motion.div>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-white/40">
            All rights Reserved 2026 By <span className="text-gold-400">Pranav Murthy</span> And <span className="text-gold-400">Relativity</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
