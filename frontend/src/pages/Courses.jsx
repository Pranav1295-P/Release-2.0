import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PlayCircle, Plus, Layers, ArrowUpRight } from 'lucide-react'
import PageTransition from '../components/PageTransition.jsx'
import VerifiedBadge from '../components/VerifiedBadge.jsx'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'

const inr = (paise) =>
  paise && paise > 0 ? `₹${(paise / 100).toLocaleString('en-IN')}` : 'Free'

export default function Courses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const isGold = user && (user.isAdmin || user.verifiedType === 'gold')

  useEffect(() => {
    api
      .get('/courses')
      .then(({ data }) => setCourses(data))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageTransition>
      <section className="relative py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          >
            <div>
              <span className="section-eyebrow">05 — Courses</span>
              <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[0.9] tracking-tightest">
                <span className="text-white">Learn, </span>
                <span className="text-coral-500">in depth.</span>
              </h1>
              <p className="mt-5 max-w-2xl font-body text-sm text-white/55">
                Structured courses with video lectures, notes, and discussion.
              </p>
            </div>
            {isGold && (
              <Link to="/courses/manage/new" className="btn-premium">
                <Plus size={16} /> New course
              </Link>
            )}
          </motion.div>

          {loading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border border-white/10 animate-pulse h-72" />
              ))}
            </div>
          )}

          {!loading && courses.length === 0 && (
            <div className="border border-white/10 p-16 text-center">
              <Layers size={32} className="mx-auto text-white/30 mb-4" />
              <div className="font-display text-2xl font-bold text-white/80 mb-2">
                No courses yet.
              </div>
              <p className="text-white/45 text-sm">
                {isGold ? 'Create the first one.' : 'Check back soon.'}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c, i) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.06, 0.4) }}
              >
                <Link
                  to={`/courses/${c._id}`}
                  className="group block border border-white/12 hover:border-coral-500/50 transition-colors overflow-hidden"
                >
                  {/* Banner */}
                  <div className="relative aspect-video bg-ink-900 overflow-hidden">
                    {c.bannerUrl ? (
                      <img
                        src={c.bannerUrl}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ink-800 to-black">
                        <PlayCircle size={40} className="text-coral-500/50" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-black/80 px-2.5 py-1 font-mono text-[0.65rem] tracking-wider uppercase text-coral-400">
                      {inr(c.price)}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="font-display text-xl font-bold text-white leading-tight group-hover:text-coral-500 transition-colors">
                      {c.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/55 line-clamp-2 leading-relaxed">
                      {c.description || 'No description yet.'}
                    </p>
                    <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between text-xs text-white/45">
                      <span className="flex items-center gap-1.5">
                        <Layers size={12} /> {c.lectureCount} lectures
                      </span>
                      <span className="flex items-center gap-1">
                        by @{c.createdBy?.username}
                        <VerifiedBadge user={c.createdBy} size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
