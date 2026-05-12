import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Send, Trash2 } from 'lucide-react'
import PageTransition from '../components/PageTransition.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../lib/api'

export default function AdminBlog() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [posts, setPosts] = useState([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user) navigate('/auth')
    else if (!user.isAdmin) navigate('/blogs')
  }, [user, navigate])

  const load = () => api.get('/blogs').then(({ data }) => setPosts(data))
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await api.post('/blogs', { title, body, excerpt })
      setTitle(''); setBody(''); setExcerpt('')
      load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to publish')
    } finally {
      setSubmitting(false)
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this post?')) return
    try {
      await api.delete(`/blogs/${id}`)
      load()
    } catch {}
  }

  if (!user?.isAdmin) return null

  return (
    <PageTransition>
      <section className="max-w-4xl mx-auto px-6 lg:px-10 py-16">
        <span className="section-eyebrow">— Admin —</span>
        <h1 className="mt-5 font-display text-4xl md:text-5xl">
          <span className="text-white/90">Write a </span>
          <span className="italic text-gradient-gold">Post</span>
        </h1>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submit}
          className="glass rounded-3xl p-8 mt-10"
        >
          <label className="block mb-5">
            <span className="text-xs uppercase tracking-wider text-white/50 mb-2 block">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-gold-500/50 text-white"
            />
          </label>

          <label className="block mb-5">
            <span className="text-xs uppercase tracking-wider text-white/50 mb-2 block">Excerpt (optional)</span>
            <input
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              maxLength={240}
              className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-gold-500/50 text-white"
            />
          </label>

          <label className="block mb-5">
            <span className="text-xs uppercase tracking-wider text-white/50 mb-2 block">Body</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={14}
              className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-gold-500/50 text-white/90 resize-y"
            />
          </label>

          {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-premium disabled:opacity-50">
            <Send size={14} /> {submitting ? 'Publishing…' : 'Publish'}
          </button>
        </motion.form>

        <h2 className="font-display text-2xl mt-16 mb-6 text-white/90">Your Posts</h2>
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p._id} className="glass rounded-xl p-4 flex items-center justify-between">
              <Link to={`/blogs/${p._id}`} className="text-white/80 hover:text-gold-400 transition-colors">
                {p.title}
              </Link>
              <button onClick={() => remove(p._id)} className="text-white/40 hover:text-red-400 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </PageTransition>
  )
}
