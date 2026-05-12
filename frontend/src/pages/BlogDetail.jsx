import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageCircle, Send, User, Calendar } from 'lucide-react'
import PageTransition from '../components/PageTransition.jsx'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'

export default function BlogDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([
      api.get(`/blogs/${id}`),
      api.get(`/blogs/${id}/comments`),
    ])
      .then(([p, c]) => {
        setPost(p.data)
        setComments(c.data)
      })
      .catch(() => setError('Failed to load post'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  const submitComment = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitting(true)
    setError('')
    try {
      await api.post(`/blogs/${id}/comments`, { body: text })
      setText('')
      load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-6 py-16 animate-pulse">
        <div className="h-8 w-1/3 bg-white/10 rounded mb-6" />
        <div className="h-12 w-3/4 bg-white/10 rounded mb-4" />
        <div className="h-4 w-full bg-white/5 rounded mb-2" />
        <div className="h-4 w-full bg-white/5 rounded mb-2" />
      </div>
    </PageTransition>
  )

  if (!post) return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-white/60">Post not found.</p>
        <Link to="/blogs" className="btn-ghost mt-6 inline-flex">Back to blog</Link>
      </div>
    </PageTransition>
  )

  return (
    <PageTransition>
      <article className="max-w-3xl mx-auto px-6 lg:px-10 py-16">
        <Link to="/blogs" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-gold-400 transition-colors mb-10">
          <ArrowLeft size={14} /> Back to Free-Conversations
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 text-xs text-white/40 mb-4 uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString()}</span>
            <span>by Pranav Murthy</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl leading-tight text-white/95">
            {post.title}
          </h1>
          <div className="mt-8 h-px w-24 bg-gradient-to-r from-gold-500 to-transparent" />
        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none text-white/80 leading-relaxed whitespace-pre-wrap"
        >
          {post.body}
        </motion.div>

        {/* Comments */}
        <section className="mt-20 pt-12 border-t border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <MessageCircle size={20} className="text-gold-400" />
            <h2 className="font-display text-2xl text-white">
              Conversation <span className="text-white/40 text-base">({comments.length})</span>
            </h2>
          </div>

          {user ? (
            <form onSubmit={submitComment} className="glass rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
                <User size={14} className="text-gold-400" />
                <span>@{user.username}</span>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                placeholder="Add to the conversation…"
                className="w-full bg-transparent border-b border-white/10 focus:border-gold-500/50 outline-none py-3 text-white/90 placeholder-white/30 resize-none transition-colors"
              />
              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
              <div className="flex justify-end mt-4">
                <button type="submit" disabled={submitting || !text.trim()} className="btn-premium disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send size={14} /> {submitting ? 'Posting…' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="glass rounded-2xl p-6 mb-8 text-center">
              <p className="text-white/60 text-sm mb-4">Sign in to join the conversation.</p>
              <Link to="/auth" className="btn-ghost">Sign in / Register</Link>
            </div>
          )}

          <div className="space-y-4">
            {comments.length === 0 && (
              <p className="text-center text-white/40 text-sm py-8">No comments yet. Start the conversation.</p>
            )}
            {comments.map((c, i) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-xs text-gold-400 font-medium">
                      {c.author?.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span className="text-sm text-white/85">@{c.author?.username || 'anonymous'}</span>
                  </div>
                  <span className="text-xs text-white/40">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap pl-9">{c.body}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </article>
    </PageTransition>
  )
}
