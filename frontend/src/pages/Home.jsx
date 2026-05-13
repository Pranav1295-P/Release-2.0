import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Brain, Shield, Code2 } from 'lucide-react'
import PageTransition from '../components/PageTransition.jsx'

export default function Home() {
  return (
    <PageTransition>
      {/* HERO ——————————————————————————————————————— */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Background — coral glow on the right behind the photo */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[55%] h-full opacity-30"
            style={{ background: 'radial-gradient(ellipse at right center, rgba(255,87,34,0.35), transparent 70%)' }}
          />
          {/* Vertical coral light bars echoing Radiant */}
          <div className="absolute top-0 bottom-0 right-[30%] w-px opacity-30"
            style={{ background: 'linear-gradient(180deg, transparent, #ff5722, transparent)' }} />
          <div className="absolute top-0 bottom-0 right-[10%] w-px opacity-20"
            style={{ background: 'linear-gradient(180deg, transparent, #ff5722, transparent)' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full relative grid lg:grid-cols-12 gap-12 items-center pt-24 pb-20">

          {/* LEFT — bold statement */}
          <div className="lg:col-span-7 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="section-eyebrow">Pranav Murthy · Relativity OpenSource</span>

              <h1 className="mt-8 font-display text-[14vw] md:text-[8.5vw] leading-[0.88] tracking-tightest text-white">
                A fit body, a calm mind, a house full of love
              </h1>
              <h1 className="font-display text-[14vw] md:text-[8.5vw] leading-[0.88] tracking-tightest text-coral-500">
                Don’t take yourself so seriously
              </h1>
              <h1 className="mt-8 font-display text-[14vw] md:text-[8.5vw] leading-[0.88] tracking-tightest text-white">
                You’re just a monkey with a plan.” - Naval

              </h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 1 }}
                className="mt-10 h-px w-40 bg-white/30 origin-left"
              />

              <p className="mt-8 max-w-xl font-body text-base md:text-lg text-white/65 leading-relaxed">
                A first-year B.Tech CSE student building in the open — learning{' '}
                <span className="text-white font-semibold">AI</span> and{' '}
                <span className="text-white font-semibold">Cyber Security</span>, one
                quiet commit at a time.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link to="/projects" className="btn-premium">
                  See work <ArrowUpRight size={14} />
                </Link>
                <Link to="/blogs" className="btn-ghost">
                  Free-Conversations
                </Link>
              </div>

              {/* Meta strip */}
              <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-3 font-mono text-[0.65rem] tracking-[0.25em] uppercase text-white/35">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral-500 animate-pulse" />
                  Online — Building in public
                </div>
                <div>India · GMT+5:30</div>
                <div>Est. 2026</div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — photo, Radiant-style clean rectangular */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative z-10"
          >
            <div className="relative max-w-sm mx-auto lg:ml-auto lg:mr-0">
              {/* Number tag floating top-left */}
              <div className="absolute -top-4 -left-4 z-20 font-mono text-[0.6rem] tracking-[0.3em] uppercase text-coral-500 bg-black px-2 py-1 border border-coral-500/40">
                01 / Founder
              </div>

              {/* Photo frame */}
              <div className="relative aspect-[3/4] overflow-hidden border border-white/10 bg-ink-900">
                <img
                  src="/pranav.jpg"
                  alt="Pranav Murthy"
                  className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.1] brightness-90"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.parentElement.classList.add('portrait-fallback')
                  }}
                />
                <div className="portrait-fallback-content absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-ink-800 to-black">
                  <span className="font-display text-[10rem] font-bold text-coral-500">P</span>
                </div>

                {/* Coral vertical bar through photo */}
                <div className="absolute top-0 bottom-0 right-8 w-px opacity-60"
                  style={{ background: 'linear-gradient(180deg, transparent, #ff5722, transparent)' }} />

                {/* Filmic gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Caption inside bottom */}
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="font-display text-2xl font-bold text-white leading-none">
                    Pranav Murthy
                  </div>
                  <div className="mt-2 font-mono text-[0.55rem] tracking-[0.3em] uppercase text-white/60">
                    Founder · Relativity OpenSource
                  </div>
                </div>
              </div>

              {/* Bottom-right meta block */}
              <div className="absolute -bottom-4 -right-4 z-20 bg-coral-500 text-black px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.25em] uppercase font-semibold">
                ✦ 2026 ✦
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom marquee */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-y border-white/10 py-3 bg-black/60 backdrop-blur-sm z-10">
          <div className="marquee font-mono text-[0.65rem] tracking-[0.35em] uppercase text-white/40">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center gap-10 px-6 whitespace-nowrap">
                <span>Artificial Intelligence</span>
                <span className="text-coral-500">/</span>
                <span>Cyber Security</span>
                <span className="text-coral-500">/</span>
                <span>Free-Conversations</span>
                <span className="text-coral-500">/</span>
                <span>Relativity OpenSource</span>
                <span className="text-coral-500">/</span>
                <span>Building Tomorrow</span>
                <span className="text-coral-500">/</span>
                <span>B.Tech · CSE · 2026</span>
                <span className="text-coral-500">/</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT —————————————————————————————————————— */}
      <section className="relative py-28 md:py-36 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="max-w-3xl mb-20"
          >
            <span className="section-eyebrow">01 — Focus</span>
            <h2 className="mt-6 font-display text-5xl md:text-7xl leading-[0.92] tracking-tightest">
              <span className="text-white">Three threads.</span>{' '}
              <span className="text-coral-500">One direction.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-px bg-white/10">
            {[
              {
                Icon: Brain,
                title: 'AI',
                desc: 'Studying how machines learn — neural networks, the math underneath, the systems on top.',
                n: '01',
              },
              {
                Icon: Shield,
                title: 'Cyber Security',
                desc: 'Defense and offense — understanding both is how systems get harder to break.',
                n: '02',
              },
              {
                Icon: Code2,
                title: 'B.Tech CSE',
                desc: 'Year one. Algorithms, data structures, and the slow build of intuition for software.',
                n: '03',
              },
            ].map(({ Icon, title, desc, n }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-black p-10 group hover:bg-coral-500/5 transition-colors"
              >
                <div className="flex items-start justify-between mb-8">
                  <Icon size={24} className="text-coral-500" strokeWidth={1.5} />
                  <span className="font-mono text-[0.65rem] tracking-[0.3em] text-white/30">
                    {n}
                  </span>
                </div>
                <h3 className="font-display text-4xl font-bold text-white mb-4">{title}</h3>
                <p className="font-body text-sm text-white/55 leading-relaxed">{desc}</p>

                <div className="mt-8 h-px w-12 bg-coral-500 group-hover:w-24 transition-all duration-300" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPANY ——————————————————————————————————— */}
      <section className="relative py-32 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse at center, rgba(255,87,34,0.4), transparent 60%)' }} />

        <div className="max-w-5xl mx-auto px-6 lg:px-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-center"
          >
            <span className="section-eyebrow">02 — The Company</span>

            <h2 className="mt-8 font-display text-6xl md:text-8xl leading-[0.9] tracking-tightest">
              <span className="text-white">Relativity</span>
              <br />
              <span className="text-coral-500">OpenSource.</span>
            </h2>

            <div className="mt-10 inline-flex items-center gap-3 px-4 py-2 border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-coral-500 animate-pulse" />
              <span className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-white/70">
                Under Construction
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
