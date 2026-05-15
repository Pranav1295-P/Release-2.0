import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageCircle, Send, Trash2, Calendar } from 'lucide-react'
import PageTransition from '../components/PageTransition.jsx'
import VerifiedBadge from '../components/VerifiedBadge.jsx'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'

export default function BlogDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([api.get(`/blogs/${id}`), api.get(`/blogs/${id}/comments`)])
      .then(([p, c]) => {
        setPost(p.data)
        setComments(c.data)
      })
      .catch(() => setError('Failed to load post'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [id])

  const canDelete =
    user &&
    post &&
    (user.isAdmin ||
      String(post.author?._id || post.author) === String(user._id))

  const deletePost = async () => {
    if (!confirm('Delete this post? This cannot be undone.')) return
    setDeleting(true)
    try {
      await api.delete(`/blogs/${id}`)
      navigate('/blogs')
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete.')
      setDeleting(false)
    }
  }

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

  if (loading)
    return (
      <PageTransition>
        <div className="max-w-2xl mx-auto px-6 py-16 animate-pulse">
          <div className="h-6 w-1/3 bg-white/10 mb-6" />
          <div className="h-10 w-3/4 bg-white/10 mb-4" />
          <div className="h-4 w-full bg-white/5 mb-2" />
          <div className="h-4 w-full bg-white/5 mb-2" />
        </div>
      </PageTransition>
    )

  if (!post)
    return (
      <PageTransition>
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <p className="text-white/60">Post not found.</p>
          <Link to="/blogs" className="btn-ghost mt-6 inline-flex">
            Back to feed
          </Link>
        </div>
      </PageTransition>
    )

  return (
    <PageTransition>
      <article className="max-w-2xl mx-auto px-6 py-16">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-coral-500 transition-colors mb-10"
        >
          <ArrowLeft size={14} /> Back to Free-Conversations
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-coral-500 text-white flex items-center justify-center font-display font-bold">
                {post.author?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <div className="text-sm text-white font-medium leading-none flex items-center gap-1">
                  @{post.author?.username || 'unknown'}
                  <VerifiedBadge user={post.author} size={14} />
                </div>
                <div className="font-mono text-[0.6rem] tracking-wider uppercase text-white/35 mt-1 flex items-center gap-1">
                  <Calendar size={10} />
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {canDelete && (
              <button
                onClick={deletePost}
                disabled={deleting}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-coral-500 transition-colors border border-white/15 hover:border-coral-500 px-3 py-1.5 disabled:opacity-40"
              >
                <Trash2 size={13} />
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            )}
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold leading-[0.95] tracking-tightest text-white">
            {post.title}
          </h1>
          <div className="mt-6 h-px w-20 bg-coral-500" />
        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-white/80 leading-relaxed whitespace-pre-wrap text-base"
        >
          {post.body}
        </motion.div>

        {/* media */}
        {post.media?.length > 0 && (
          <div
            className={`mt-6 grid gap-2 ${
              post.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
            }`}
          >
            {post.media.map((m, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden border border-white/10 bg-black"
              >
                {m.type === 'video' ? (
                  <video src={m.url} controls className="w-full" />
                ) : (
                  <img src={m.url} alt="" className="w-full" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Comments */}
        <section className="mt-16 pt-10 border-t border-white/10">
          <div className="flex items-center gap-2.5 mb-6">
            <MessageCircle size={18} className="text-coral-500" />
            <h2 className="font-display text-xl font-bold text-white">
              Conversation{' '}
              <span className="text-white/40 text-sm">({comments.length})</span>
            </h2>
          </div>

          {user ? (
            <form
              onSubmit={submitComment}
              className="border border-white/12 p-5 mb-6"
            >
              <div className="flex items-center gap-2 text-xs text-white/55 mb-3 font-mono uppercase tracking-wider">
                <span className="w-6 h-6 bg-coral-500 text-white flex items-center justify-center font-display font-bold text-xs">
                  {user.username?.[0]?.toUpperCase()}
                </span>
                @{user.username}
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                placeholder="Add to the conversation…"
                className="w-full bg-transparent border-b border-white/10 focus:border-coral-500 outline-none py-2 text-white/90 placeholder-white/25 resize-none transition-colors text-sm"
              />
              {error && <p className="text-coral-400 text-xs mt-2">{error}</p>}
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={submitting || !text.trim()}
                  className="btn-premium !py-2 !px-4 disabled:opacity-50"
                >
                  <Send size={13} /> {submitting ? 'Posting…' : 'Comment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="border border-white/12 p-5 mb-6 text-center">
              <p className="text-white/60 text-sm mb-3">
                Sign in to join the conversation.
              </p>
              <Link to="/auth" className="btn-premium !py-2 !px-4">
                Sign in / Register
              </Link>
            </div>
          )}

          <div className="space-y-3">
            {comments.length === 0 && (
              <p className="text-center text-white/40 text-sm py-6">
                No comments yet. Start the conversation.
              </p>
            )}
            {comments.map((c, i) => (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="border border-white/10 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-coral-500/20 border border-coral-500/40 flex items-center justify-center text-[0.65rem] text-coral-500 font-bold">
                      {c.author?.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span className="text-sm text-white/85 flex items-center gap-1">
                      @{c.author?.username || 'anonymous'}
                      <VerifiedBadge user={c.author} size={13} />
                    </span>
                  </div>
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider text-white/35">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap pl-8">
                  {c.body}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </article>
    </PageTransition>
  )
}
