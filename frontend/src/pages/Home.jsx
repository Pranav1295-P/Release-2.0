import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Shield, Code2, Sparkles } from 'lucide-react'
import PageTransition from '../components/PageTransition.jsx'

export default function Home() {
  return (
    <PageTransition>
      {/* Hero with portrait */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0 grid-bg" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full relative">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Left — text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="lg:col-span-7"
            >
              <span className="section-eyebrow">— Relativity OpenSource · Under Construction —</span>

              <h1 className="mt-8 font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
                <span className="block text-white/90">Pranav</span>
                <span className="block italic text-gradient-gold">Murthy</span>
              </h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="mt-8 h-px w-32 bg-gradient-to-r from-gold-500 to-transparent origin-left"
              />

              <p className="mt-8 max-w-xl text-lg md:text-xl text-white/70 leading-relaxed">
                I'm a college student — first year{' '}
                <span className="text-gold-400 font-medium">B.Tech CSE</span> — and I'm
                interested to learn{' '}
                <span className="text-gold-400 font-medium">AI</span> and{' '}
                <span className="text-gold-400 font-medium">Cyber Security</span>.
              </p>

              <div className="mt-12 flex flex-wrap items-center gap-4">
                <Link to="/projects" className="btn-premium">
                  Explore Projects <ArrowRight size={16} />
                </Link>
                <Link to="/blogs" className="btn-ghost">
                  Free-Conversations
                </Link>
              </div>
            </motion.div>

            {/* Right — premium portrait */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex justify-center lg:justify-end"
            >
              <div className="relative group">
                {/* Decorative rotating ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-6 rounded-full border border-gold-500/15"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-12 rounded-full border border-accent-violet/10"
                />

                {/* Glow */}
                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-gold-500/25 via-transparent to-accent-violet/20 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Portrait frame */}
                <div className="relative w-[280px] h-[360px] md:w-[340px] md:h-[440px] rounded-[1.5rem] overflow-hidden border border-gold-500/30 bg-ink-900">
                  {/* The photo — drop your image at /public/pranav.jpg */}
                  <img
                    src="/pranav.jpg"
                    alt="Pranav Murthy"
                    className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.05] brightness-95 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                    onError={(e) => {
                      // graceful fallback if image not yet uploaded
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement.classList.add('portrait-fallback')
                    }}
                  />
                  {/* Fallback monogram (shown if image missing) */}
                  <div className="portrait-fallback-content absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-ink-800 to-ink-900">
                    <span className="font-display text-9xl italic text-gradient-gold">P</span>
                  </div>

                  {/* Inner gradient overlay for cinematic depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-[1.5rem] pointer-events-none" />

                  {/* Corner ornaments */}
                  <div className="absolute top-3 left-3 w-5 h-5 border-l border-t border-gold-400/60" />
                  <div className="absolute top-3 right-3 w-5 h-5 border-r border-t border-gold-400/60" />
                  <div className="absolute bottom-3 left-3 w-5 h-5 border-l border-b border-gold-400/60" />
                  <div className="absolute bottom-3 right-3 w-5 h-5 border-r border-b border-gold-400/60" />

                  {/* Caption */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center">
                    <div className="font-display text-white text-lg italic">Pranav Murthy</div>
                    <div className="text-[0.55rem] tracking-[0.4em] uppercase text-gold-400/80 mt-1">
                      Founder · Relativity
                    </div>
                  </div>
                </div>

                {/* Sparkle accent */}
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-2 -right-2 text-gold-400"
                >
                  <Sparkles size={20} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <span className="section-eyebrow">— 01 / About —</span>
            <h2 className="mt-6 font-display text-4xl md:text-6xl">
              <span className="text-white/90">Curious by</span>{' '}
              <span className="italic text-gradient-gold">design.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { Icon: Brain, title: 'AI', desc: 'Exploring machine learning, neural networks, and the systems that learn.' },
              { Icon: Shield, title: 'Cyber Security', desc: 'Studying how to defend systems and understand the offensive mindset.' },
              { Icon: Code2, title: 'CSE — Year One', desc: 'Building foundations in algorithms, data structures, and software craft.' },
            ].map(({ Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass glass-hover rounded-2xl p-8"
              >
                <div className="w-12 h-12 rounded-xl border border-gold-500/30 flex items-center justify-center bg-gold-500/5 mb-5">
                  <Icon size={20} className="text-gold-400" />
                </div>
                <h3 className="font-display text-2xl text-white mb-2">{title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company */}
      <section className="relative py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative glass rounded-3xl p-12 md:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-transparent to-accent-violet/5" />
            <div className="relative">
              <Sparkles size={28} className="mx-auto text-gold-400 mb-6" />
              <span className="section-eyebrow">— Company —</span>
              <h2 className="mt-6 font-display text-4xl md:text-5xl text-gradient-gold italic">
                Relativity OpenSource
              </h2>
              <p className="mt-6 text-white/60 text-sm tracking-[0.3em] uppercase">
                Under Construction
              </p>
              <motion.div
                className="mt-8 mx-auto h-px w-48 bg-gradient-to-r from-transparent via-gold-500 to-transparent"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}
