import { motion } from 'framer-motion'
import { Github, Mail, ArrowUpRight } from 'lucide-react'
import RelativityLogo from './RelativityLogo.jsx'

export default function Footer() {
  return (
    <footer className="relative z-10 mt-32 border-t border-white/10 bg-black overflow-hidden">
      {/* Giant ghosted brand wordmark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="font-display font-black text-[22vw] leading-none tracking-tightest text-white/[0.03] uppercase whitespace-nowrap">
          RELATIVITY
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-end"
        >
          <div>
            <div className="flex items-center gap-3">
              <RelativityLogo size={48} />
              <div
                className="text-white font-medium text-2xl leading-none"
                style={{
                  fontFamily: '"DM Sans", "Google Sans", system-ui, sans-serif',
                  letterSpacing: '-0.01em',
                }}
              >
                Relativity
              </div>
            </div>
            <div className="mt-3 font-mono text-[0.65rem] tracking-[0.3em] uppercase text-coral-500/80">
              Relativity OpenSource
            </div>
            <p className="mt-6 font-body text-sm text-white/45 max-w-sm leading-relaxed">
              A first-year B.Tech CSE student — learning AI and Cyber Security in the open.
            </p>
          </div>

          <div className="flex md:justify-end">
            <div className="flex flex-col gap-3">
              <span className="section-eyebrow">Contact</span>
              <a
                href="https://github.com/Pranav1295-P"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 font-sans text-base text-white hover:text-coral-500 transition-colors"
              >
                <Github size={16} />
                <span>github.com/Pranav1295-P</span>
                <ArrowUpRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </a>
              <a
                href="mailto:officepranav820@gmail.com"
                className="group flex items-center gap-2 font-sans text-base text-white hover:text-coral-500 transition-colors"
              >
                <Mail size={16} />
                <span>officepranav820@gmail.com</span>
                <ArrowUpRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </a>
            </div>
          </div>
        </motion.div>

        <div className="mt-20 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-white/40">
            All rights Reserved 2026 By <span className="text-coral-500">Pranav Murthy</span> And <span className="text-coral-500">Relativity</span>
          </p>
          <p className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-white/30">
            Built with intent.
          </p>
        </div>
      </div>
    </footer>
  )
}
