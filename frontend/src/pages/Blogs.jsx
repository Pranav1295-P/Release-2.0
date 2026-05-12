import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, Calendar, ArrowRight } from 'lucide-react'
import PageTransition from '../components/PageTransition.jsx'
import { api } from '../lib/api'

export default function Blogs() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/blogs')
      .then(({ data }) => setPosts(data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageTransition>
      <section className="relative py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <span className="section-eyebrow">— 03 / Blog —</span>
            <h1 className="mt-6 font-display text-5xl md:text-7xl leading-tight">
              <span className="italic text-gradient-gold">Free-Conversations</span>
            </h1>
            <p className="mt-6 max-w-2xl text-white/60">
              Long-form thoughts from me. Open conversation in the comments — create an
              account and join in.
            </p>
          </motion.div>

          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-8 animate-pulse h-32" />
              ))}
            </div>
          )}

          {!loading && posts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-3xl p-16 text-center"
            >
              <div className="font-display text-2xl text-white/80 mb-3">
                No conversations yet.
              </div>
              <p className="text-white/50 text-sm">
                Posts will appear here once published.
              </p>
            </motion.div>
          )}

          <div className="space-y-5">
            {posts.map((post, i) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/blogs/${post._id}`}
                  className="block glass glass-hover rounded-2xl p-8 group"
                >
                  <div className="flex items-center gap-4 text-xs text-white/40 mb-3 tracking-wider uppercase">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={12} />
                      {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle size={12} />
                      {post.commentCount || 0} comments
                    </span>
                  </div>

                  <h2 className="font-display text-3xl md:text-4xl text-white group-hover:text-gradient-gold transition-all mb-3">
                    {post.title}
                  </h2>

                  <p className="text-white/60 line-clamp-2 leading-relaxed">
                    {post.excerpt || post.body?.slice(0, 200) + '…'}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-gold-400 text-sm">
                    Read conversation
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
