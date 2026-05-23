import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Lock, PlayCircle, FileText, MessageCircle,
  Send, Settings, Check,
} from 'lucide-react'
import PageTransition from '../components/PageTransition.jsx'
import VerifiedBadge from '../components/VerifiedBadge.jsx'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'

const inr = (paise) =>
  paise && paise > 0 ? `₹${(paise / 100).toLocaleString('en-IN')}` : 'Free'

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

export default function CourseDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [comments, setComments] = useState([])
  const [active, setActive] = useState(0) // active lecture index
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([api.get(`/courses/${id}`), api.get(`/courses/${id}/comments`)])
      .then(([c, cm]) => {
        setCourse(c.data)
        setComments(cm.data)
      })
      .catch(() => setError('Failed to load course'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  const enroll = async () => {
    setError('')
    if (!user) return (window.location.href = '/auth')
    setPaying(true)
    try {
      const ok = await loadRazorpay()
      if (!ok) throw new Error("Couldn't load the payment window.")
      const { data: order } = await api.post(`/courses/${id}/enroll/create-order`)
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Pranav Murthy',
        description: order.courseTitle,
        order_id: order.orderId,
        prefill: { email: user.email, name: user.username },
        theme: { color: '#4f6fff' },
        handler: async (resp) => {
          try {
            await api.post(`/courses/${id}/enroll/verify`, {
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            })
            load() // reload — content now unlocked
          } catch (e) {
            setError(e?.response?.data?.message || 'Verification failed.')
          } finally {
            setPaying(false)
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      })
      rzp.open()
    } catch (e) {
      setError(e?.response?.data?.message || e.message)
      setPaying(false)
    }
  }

  const submitComment = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    try {
      const lectureId = course?.lectures?.[active]?._id
      await api.post(`/courses/${id}/comments`, { body: text, lectureId })
      setText('')
      api.get(`/courses/${id}/comments`).then(({ data }) => setComments(data))
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to comment.')
    }
  }

  if (loading)
    return (
      <PageTransition>
        <div className="max-w-5xl mx-auto px-6 py-16 animate-pulse">
          <div className="h-8 w-1/3 bg-white/10 mb-6" />
          <div className="aspect-video bg-white/10 mb-4" />
        </div>
      </PageTransition>
    )

  if (!course)
    return (
      <PageTransition>
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <p className="text-white/60">Course not found.</p>
          <Link to="/courses" className="btn-ghost mt-6 inline-flex">All courses</Link>
        </div>
      </PageTransition>
    )

  const locked = course.locked
  const lecture = course.lectures?.[active]

  return (
    <PageTransition>
      <article className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        <Link to="/courses" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-coral-500 transition-colors mb-8">
          <ArrowLeft size={14} /> All courses
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tightest text-white">
              {course.title}
            </h1>
            <div className="mt-3 flex items-center gap-3 text-sm text-white/55">
              <span className="flex items-center gap-1">
                by @{course.createdBy?.username}
                <VerifiedBadge user={course.createdBy} size={13} />
              </span>
              <span className="text-coral-400 font-mono text-xs tracking-wider uppercase">
                {inr(course.price)}
              </span>
            </div>
          </div>
          {course.canManage && (
            <Link to={`/courses/manage/${course._id}`} className="btn-ghost !py-2 !px-4 text-xs">
              <Settings size={14} /> Manage
            </Link>
          )}
        </div>

        {course.description && (
          <p className="text-white/70 leading-relaxed max-w-3xl mb-10 whitespace-pre-wrap">
            {course.description}
          </p>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main — player + notes */}
          <div className="lg:col-span-2">
            {course.lectures?.length === 0 && (
              <div className="border border-white/10 p-12 text-center text-white/50">
                No lectures yet.
              </div>
            )}

            {lecture && (
              <div>
                {/* Video / lock */}
                <div className="relative aspect-video bg-black border border-white/10 overflow-hidden">
                  {locked ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
                      <Lock size={32} className="text-coral-500" />
                      <p className="text-white/70 text-sm max-w-xs">
                        Enroll to unlock all lectures, notes, and downloads.
                      </p>
                    </div>
                  ) : lecture.videoUrl ? (
                    <video
                      key={lecture._id}
                      src={lecture.videoUrl}
                      controls
                      controlsList="nodownload"
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/40">
                      No video for this lecture.
                    </div>
                  )}
                </div>

                {/* Lecture meta */}
                <div className="mt-5">
                  <h2 className="font-display text-2xl font-bold text-white">
                    {lecture.title}
                  </h2>
                  {lecture.description && (
                    <p className="mt-2 text-sm text-white/65 leading-relaxed whitespace-pre-wrap">
                      {lecture.description}
                    </p>
                  )}
                  {!locked && lecture.notesUrl && (
                    <a
                      href={lecture.notesUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm text-coral-400 hover:text-coral-300 transition-colors"
                    >
                      <FileText size={15} /> View lecture notes (PDF)
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Comments */}
            <section className="mt-12 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2 mb-5">
                <MessageCircle size={18} className="text-coral-500" />
                <h3 className="font-display text-xl font-bold text-white">
                  Discussion <span className="text-white/40 text-sm">({comments.length})</span>
                </h3>
              </div>

              {user ? (
                <form onSubmit={submitComment} className="border border-white/12 p-4 mb-5">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={2}
                    placeholder="Ask a question or share a thought…"
                    className="w-full bg-transparent outline-none text-sm text-white/90 placeholder-white/30 resize-none"
                  />
                  <div className="flex justify-end">
                    <button type="submit" disabled={!text.trim()} className="btn-premium !py-1.5 !px-4 text-xs disabled:opacity-50">
                      <Send size={12} /> Post
                    </button>
                  </div>
                </form>
              ) : (
                <div className="border border-white/12 p-4 mb-5 text-center text-sm text-white/55">
                  <Link to="/auth" className="text-coral-400">Sign in</Link> to join the discussion.
                </div>
              )}

              <div className="space-y-3">
                {comments.map((c) => (
                  <div key={c._id} className="border border-white/10 p-4">
                    <div className="flex items-center gap-1.5 mb-1 text-sm text-white/85">
                      @{c.author?.username || 'anonymous'}
                      <VerifiedBadge user={c.author} size={12} />
                      <span className="ml-auto font-mono text-[0.6rem] uppercase tracking-wider text-white/35">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{c.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar — lecture list + enroll */}
          <aside className="lg:col-span-1">
            {/* Enroll card (only if locked + paid) */}
            {locked && course.price > 0 && (
              <div className="border border-coral-500/40 p-6 mb-6">
                <div className="font-display text-3xl font-bold text-white">{inr(course.price)}</div>
                <p className="text-xs text-white/50 mt-1 mb-4">One-time · lifetime access</p>
                {error && <p className="text-coral-400 text-xs mb-3">{error}</p>}
                <button onClick={enroll} disabled={paying} className="btn-premium w-full justify-center disabled:opacity-50">
                  {paying ? 'Opening…' : 'Enroll now'}
                </button>
                <p className="mt-3 text-center font-mono text-[0.55rem] tracking-wider uppercase text-white/30">
                  Secured by Razorpay
                </p>
              </div>
            )}
            {!locked && (
              <div className="border border-white/12 p-4 mb-6 flex items-center gap-2 text-sm text-white/70">
                <Check size={16} className="text-coral-500" /> You have full access
              </div>
            )}

            {/* Lecture list */}
            <div className="border border-white/12">
              <div className="px-4 py-3 border-b border-white/10 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-white/50">
                {course.lectures?.length || 0} Lectures
              </div>
              <div className="divide-y divide-white/8 max-h-[480px] overflow-y-auto">
                {course.lectures?.map((l, i) => (
                  <button
                    key={l._id}
                    onClick={() => setActive(i)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                      i === active ? 'bg-coral-500/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <span className="text-white/40">
                      {locked ? <Lock size={14} /> : <PlayCircle size={14} className="text-coral-400" />}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm text-white/85 truncate">{l.title}</span>
                      <span className="font-mono text-[0.55rem] uppercase tracking-wider text-white/35">
                        Lecture {i + 1}
                        {(l.hasNotes || l.notesUrl) ? ' · notes' : ''}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>
    </PageTransition>
  )
}
