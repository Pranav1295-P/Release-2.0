import { motion } from 'framer-motion'
import { Github, Mail, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative z-10 mt-32 border-t border-cream-200/10 bg-ink-950/40 backdrop-blur-sm overflow-hidden">
      {/* Big watermark word */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="font-display italic text-[18vw] leading-none text-cream-50/[0.02]">
          Relativity
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 items-end"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-sm border border-lime-400/40 flex items-center justify-center font-display italic text-2xl text-lime-400 leading-none">
                P
              </div>
              <div>
                <div className="font-display italic text-xl text-cream-50">Pranav Murthy</div>
                <div className="font-mono text-[0.6rem] tracking-[0.3em] uppercase text-lime-400/70">
                  Relativity OpenSource
                </div>
              </div>
            </div>
            <p className="font-body text-sm text-cream-100/50 max-w-sm leading-relaxed">
              A first-year B.Tech CSE student, learning AI and Cyber Security — in public, in lime.
            </p>
          </div>

          <div className="flex md:justify-end">
            <div className="flex flex-col gap-3">
              <span className="section-eyebrow">Reach out</span>
              <a
                href="https://github.com/Pranav1295-P"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 font-sans text-base text-cream-50 hover:text-lime-400 transition-colors"
              >
                <Github size={16} />
                <span>github.com/Pranav1295-P</span>
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="mailto:officepranav820@gmail.com"
                className="group flex items-center gap-2 font-sans text-base text-cream-50 hover:text-lime-400 transition-colors"
              >
                <Mail size={16} />
                <span>officepranav820@gmail.com</span>
                <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </motion.div>

        <div className="mt-16 pt-6 border-t border-cream-200/10 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-cream-100/40">
            All rights Reserved 2026 By <span className="text-lime-400">Pranav Murthy</span> And <span className="text-lime-400">Relativity</span>
          </p>
          <p className="font-mono text-[0.65rem] tracking-[0.25em] uppercase text-cream-100/30">
            ✦ Made with care ✦
          </p>
        </div>
      </div>
    </footer>
  )
}
