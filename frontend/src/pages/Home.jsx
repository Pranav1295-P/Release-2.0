import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Brain, Shield, Code2, Sparkles, MapPin } from 'lucide-react'
import PageTransition from '../components/PageTransition.jsx'

export default function Home() {
  return (
    <PageTransition>
      {/* HERO ——————————————————————————————————————— */}
      <section className="relative min-h-[92vh] flex items-center">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full relative pt-8 pb-16">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* LEFT — PHOTO as hero */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="relative max-w-md mx-auto lg:mx-0">
                {/* Lime backdrop block */}
                <motion.div
                  initial={{ opacity: 0, rotate: -6 }}
                  animate={{ opacity: 1, rotate: -3 }}
                  transition={{ delay: 0.3, duration: 1 }}
                  className="absolute -inset-4 bg-lime-400 rounded-sm"
                />

                {/* Photo frame */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-cream-200/10 bg-ink-900">
                  <img
                    src="/pranav.jpg"
                    alt="Pranav Murthy"
                    className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.08] saturate-0 hover:saturate-100 hover:grayscale-0 transition-all duration-700"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement.classList.add('portrait-fallback')
                    }}
                  />
                  <div className="portrait-fallback-content absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-ink-800 to-ink-900">
                    <span className="font-display italic text-[10rem] text-lime-400">P</span>
                  </div>

                  {/* Filmic overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent pointer-events-none" />

                  {/* Year tag bottom-left */}
                  <div className="absolute bottom-4 left-4 font-mono text-[0.6rem] tracking-[0.3em] uppercase text-cream-50/80">
                    Roll · 01 · 2026
                  </div>
                  {/* Vertical tag right */}
                  <div className="absolute top-4 right-4 font-mono text-[0.55rem] tracking-[0.3em] uppercase text-cream-50/60" style={{ writingMode: 'vertical-rl' }}>
                    Pranav · Murthy
                  </div>
                </div>

                {/* Tape sticker */}
                <div className="tape absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6" />

                {/* Floating caption sticker */}
                <motion.div
                  initial={{ opacity: 0, y: 20, rotate: 12 }}
                  animate={{ opacity: 1, y: 0, rotate: 8 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute -bottom-6 -right-6 bg-cream-50 text-ink-950 px-4 py-2 rounded-sm shadow-lg font-mono text-[0.6rem] tracking-[0.2em] uppercase"
                >
                  ✦ Hi there ✦
                </motion.div>
              </div>
            </motion.div>

            {/* RIGHT — Name + bio */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="lg:col-span-7"
            >
              <span className="section-eyebrow">Relativity OpenSource — Under Construction</span>

              <h1 className="mt-6 font-display text-6xl md:text-8xl lg:text-[8.5rem] leading-[0.88] tracking-tight">
                <span className="block text-cream-50">Pranav</span>
                <span className="block italic text-lime-400">Murthy.</span>
              </h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 1 }}
                className="mt-8 h-px w-40 bg-cream-200/30 origin-left"
              />

              <p className="mt-8 max-w-xl font-body text-base md:text-lg text-cream-100/75 leading-relaxed">
                A college student in his first year of{' '}
                <span className="text-lime-400 font-medium">B.Tech CSE</span> — interested
                to learn{' '}
                <span className="text-lime-400 font-medium">AI</span> and{' '}
                <span className="text-lime-400 font-medium">Cyber Security</span>.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link to="/projects" className="btn-premium">
                  See projects <ArrowUpRight size={16} />
                </Link>
                <Link to="/blogs" className="btn-ghost">
                  Free-Conversations
                </Link>
              </div>

              {/* Meta info row */}
              <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-mono text-cream-100/40 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                  Available for collabs
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={11} />
                  India · GMT+5:30
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom marquee strip */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-y border-cream-200/10 py-3 bg-ink-950/40 backdrop-blur-sm">
          <div className="marquee font-sans text-xs tracking-[0.4em] uppercase text-cream-100/40">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-10 px-6 whitespace-nowrap">
                <span>Artificial Intelligence</span>
                <span className="text-lime-400">✦</span>
                <span>Cyber Security</span>
                <span className="text-lime-400">✦</span>
                <span>Free-Conversations</span>
                <span className="text-lime-400">✦</span>
                <span>Relativity OpenSource</span>
                <span className="text-lime-400">✦</span>
                <span>B.Tech · CSE</span>
                <span className="text-lime-400">✦</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT — three quiet cards ——————————————————— */}
      <section className="relative py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="max-w-3xl mb-20"
          >
            <span className="section-eyebrow">01 — About</span>
            <h2 className="mt-6 font-display text-5xl md:text-7xl leading-[0.95]">
              <span className="text-cream-50">A student</span>{' '}
              <span className="italic text-lime-400">learning</span>{' '}
              <span className="text-cream-50">in public.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { Icon: Brain, title: 'AI', desc: 'Exploring how machines learn — neural nets, fundamentals, the math underneath.', n: '01' },
              { Icon: Shield, title: 'Cyber Security', desc: 'Studying how systems are defended, and the offensive mindset that makes defense make sense.', n: '02' },
              { Icon: Code2, title: 'B.Tech CSE', desc: 'Year one. Algorithms, data structures, and the slow build of software intuition.', n: '03' },
            ].map(({ Icon, title, desc, n }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass glass-hover rounded-sm p-8 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-sm border border-cream-200/15 flex items-center justify-center bg-cream-50/[0.02]">
                    <Icon size={18} className="text-lime-400" />
                  </div>
                  <span className="font-mono text-[0.65rem] tracking-[0.3em] text-cream-100/30">
                    {n}
                  </span>
                </div>
                <h3 className="font-display text-3xl text-cream-50 mb-3">{title}</h3>
                <p className="font-body text-sm text-cream-100/60 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPANY — Relativity OpenSource ——————————————— */}
      <section className="relative py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative rounded-sm p-12 md:p-20 overflow-hidden border border-cream-200/10"
            style={{ background: 'linear-gradient(135deg, rgba(212,245,107,0.04) 0%, transparent 50%, rgba(248,169,120,0.03) 100%)' }}
          >
            <div className="relative text-center">
              <span className="section-eyebrow">02 — The Company</span>

              <h2 className="mt-8 font-display text-5xl md:text-7xl italic">
                <span className="text-lime-400">Relativity</span>{' '}
                <span className="text-cream-50">OpenSource</span>
              </h2>

              <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cream-50/5 border border-cream-200/10">
                <span className="w-2 h-2 rounded-full bg-peach-500 animate-pulse" />
                <span className="font-mono text-[0.7rem] tracking-[0.3em] uppercase text-cream-100/70">
                  Under Construction
                </span>
              </div>

              <motion.div
                className="mt-10 mx-auto h-px w-32 bg-gradient-to-r from-transparent via-lime-400 to-transparent"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>

            {/* Floating corner sparkles */}
            <Sparkles size={20} className="absolute top-8 left-8 text-lime-400/60" />
            <Sparkles size={16} className="absolute bottom-8 right-8 text-peach-500/60" />
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
