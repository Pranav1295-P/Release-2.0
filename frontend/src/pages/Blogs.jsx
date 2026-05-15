import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Trash2, ArrowUpRight } from 'lucide-react'
import PageTransition from '../components/PageTransition.jsx'
import BlogComposer from '../components/BlogComposer.jsx'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'

export default function Blogs() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const load = () => {
    setLoading(true)
    api
      .get('/blogs')
      .then(({ data }) => setPosts(data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const canDelete = (post) =>
    user && (user.isAdmin || String(post.author?._id || post.author) === String(user._id))

  const handleDelete = async (id) => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    setDeleting(id)
    try {
      await api.delete(`/blogs/${id}`)
      setPosts((prev) => prev.filter((p) => p._id !== id))
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <PageTransition>
      <section className="relative py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <span className="section-eyebrow">03 — The Feed</span>
            <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[0.9] tracking-tightest">
              <span className="text-coral-500">Free-</span>
              <span className="text-white">Conversations.</span>
            </h1>
            <p className="mt-5 font-body text-sm text-white/55 leading-relaxed">
              An open feed. Share a thought with text, images, or video — anyone with an
              account can post and join in. Your posts, your call to delete.
            </p>
          </motion.div>

          {/* Composer (signed-in only) or sign-in prompt */}
          {user ? (
            <div className="mb-8">
              <BlogComposer onPosted={load} />
            </div>
          ) : (
            <div className="mb-8 border border-white/12 p-6 text-center">
              <p className="text-white/60 text-sm mb-4">
                Sign in to post and join the conversation.
              </p>
              <Link to="/auth" className="btn-premium !py-2 !px-5">
                Sign in / Register
              </Link>
            </div>
          )}

          {/* Feed */}
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border border-white/10 p-6 animate-pulse h-40" />
              ))}
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="border border-white/10 p-14 text-center">
              <div className="font-display text-2xl font-bold text-white/80 mb-2">
                Nothing here yet.
              </div>
              <p className="text-white/45 text-sm">
                Be the first to start a conversation.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <AnimatePresence>
              {posts.map((post, i) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  className="border border-white/12 hover:border-white/25 transition-colors group"
                >
                  <div className="p-6">
                    {/* author row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-coral-500 text-white flex items-center justify-center font-display font-bold text-sm">
                          {post.author?.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="text-sm text-white font-medium leading-none">
                            @{post.author?.username || 'unknown'}
                          </div>
                          <div className="font-mono text-[0.6rem] tracking-wider uppercase text-white/35 mt-1">
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>

                      {canDelete(post) && (
                        <button
                          onClick={() => handleDelete(post._id)}
                          disabled={deleting === post._id}
                          className="text-white/30 hover:text-coral-500 transition-colors p-1.5 disabled:opacity-40"
                          title="Delete post"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>

                    {/* title + body */}
                    <Link to={`/blogs/${post._id}`} className="block">
                      <h2 className="font-display text-2xl font-bold text-white leading-tight group-hover:text-coral-500 transition-colors">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-sm text-white/65 leading-relaxed line-clamp-4 whitespace-pre-wrap">
                        {post.body}
                      </p>
                    </Link>

                    {/* media grid */}
                    {post.media?.length > 0 && (
                      <div
                        className={`mt-4 grid gap-1.5 ${
                          post.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                        }`}
                      >
                        {post.media.map((m, idx) => (
                          <div
                            key={idx}
                            className="relative overflow-hidden border border-white/10 bg-black aspect-video"
                          >
                            {m.type === 'video' ? (
                              <video
                                src={m.url}
                                controls
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={m.url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* footer */}
                    <div className="mt-4 pt-3 border-t border-white/8 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs text-white/40">
                        <MessageCircle size={13} />
                        {post.commentCount || 0} comments
                      </span>
                      <Link
                        to={`/blogs/${post._id}`}
                        className="flex items-center gap-1 text-xs text-coral-500 hover:text-coral-400 transition-colors"
                      >
                        Open thread <ArrowUpRight size={12} />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
