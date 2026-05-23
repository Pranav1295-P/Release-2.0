import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Upload, Film, FileText, Image as ImageIcon, Trash2, Plus, Check } from 'lucide-react'
import PageTransition from '../components/PageTransition.jsx'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'
import { uploadToCloudinary } from '../lib/cloudinaryUpload'

export default function CourseManage() {
  const { id } = useParams() // 'new' or a course id
  const navigate = useNavigate()
  const { user } = useAuth()
  const isGold = user && (user.isAdmin || user.verifiedType === 'gold')

  const isNew = id === 'new'
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(!isNew)

  // course form
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priceRupees, setPriceRupees] = useState('')
  const [banner, setBanner] = useState(null) // {url, publicId}
  const [bannerPct, setBannerPct] = useState(0)
  const bannerRef = useRef(null)

  // lecture form
  const [lTitle, setLTitle] = useState('')
  const [lDesc, setLDesc] = useState('')
  const [video, setVideo] = useState(null)
  const [videoPct, setVideoPct] = useState(0)
  const [notes, setNotes] = useState(null)
  const [notesPct, setNotesPct] = useState(0)
  const videoRef = useRef(null)
  const notesRef = useRef(null)

  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!user) return navigate('/auth')
    if (!isGold) return navigate('/courses')
  }, [user, isGold, navigate])

  useEffect(() => {
    if (isNew) return
    api
      .get(`/courses/${id}`)
      .then(({ data }) => {
        setCourse(data)
        setTitle(data.title)
        setDescription(data.description || '')
        setPriceRupees(data.price ? String(data.price / 100) : '')
        if (data.bannerUrl) setBanner({ url: data.bannerUrl, publicId: data.bannerPublicId })
      })
      .catch(() => setError('Failed to load course'))
      .finally(() => setLoading(false))
  }, [id, isNew])

  if (!isGold) return null

  const priceToPaise = () => Math.max(0, Math.round((parseFloat(priceRupees) || 0) * 100))

  const handleBanner = async (file) => {
    if (!file) return
    setError('')
    try {
      setBannerPct(1)
      const up = await uploadToCloudinary(file, 'image', setBannerPct)
      setBanner({ url: up.url, publicId: up.publicId })
    } catch (e) {
      setError(e.message || 'Banner upload failed.')
    } finally {
      setBannerPct(0)
    }
  }

  const saveCourse = async (e) => {
    e.preventDefault()
    if (!title.trim()) return setError('Course title required.')
    setBusy(true)
    setError('')
    try {
      const payload = {
        title,
        description,
        price: priceToPaise(),
        bannerUrl: banner?.url,
        bannerPublicId: banner?.publicId,
      }
      if (isNew) {
        const { data } = await api.post('/courses', payload)
        navigate(`/courses/manage/${data._id}`, { replace: true })
        setCourse(data)
      } else {
        const { data } = await api.put(`/courses/${id}`, payload)
        setCourse(data)
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Save failed.')
    } finally {
      setBusy(false)
    }
  }

  const addLecture = async (e) => {
    e.preventDefault()
    if (!lTitle.trim()) return setError('Lecture title required.')
    setBusy(true)
    setError('')
    try {
      let videoData = {}
      let notesData = {}
      if (video) {
        setVideoPct(1)
        const up = await uploadToCloudinary(video, 'video', setVideoPct)
        videoData = { videoUrl: up.url, videoPublicId: up.publicId }
      }
      if (notes) {
        setNotesPct(1)
        const up = await uploadToCloudinary(notes, 'raw', setNotesPct)
        notesData = { notesUrl: up.url, notesPublicId: up.publicId }
      }
      const { data } = await api.post(`/courses/${course._id}/lectures`, {
        title: lTitle,
        description: lDesc,
        ...videoData,
        ...notesData,
      })
      setCourse(data)
      // reset lecture form
      setLTitle(''); setLDesc(''); setVideo(null); setNotes(null)
      setVideoPct(0); setNotesPct(0)
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Adding lecture failed.')
    } finally {
      setBusy(false)
    }
  }

  const deleteLecture = async (lectureId) => {
    if (!confirm('Delete this lecture? Its video and notes are removed too.')) return
    try {
      await api.delete(`/courses/${course._id}/lectures/${lectureId}`)
      const { data } = await api.get(`/courses/${course._id}`)
      setCourse(data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Delete failed.')
    }
  }

  const deleteCourse = async () => {
    if (!confirm('Delete the WHOLE course? This cannot be undone.')) return
    try {
      await api.delete(`/courses/${course._id}`)
      navigate('/courses')
    } catch (err) {
      setError(err?.response?.data?.message || 'Delete failed.')
    }
  }

  const inputClass =
    'w-full bg-transparent border border-white/15 px-4 py-3 outline-none focus:border-coral-500 transition-colors text-white placeholder-white/30 text-sm'
  const labelClass = 'text-[0.65rem] uppercase tracking-[0.2em] text-white/45 mb-2 block'

  if (loading)
    return (
      <PageTransition>
        <div className="max-w-3xl mx-auto px-6 py-16 animate-pulse">
          <div className="h-10 w-1/2 bg-white/10 mb-6" />
        </div>
      </PageTransition>
    )

  return (
    <PageTransition>
      <section className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/courses" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-coral-500 transition-colors mb-8">
          <ArrowLeft size={14} /> All courses
        </Link>

        <span className="section-eyebrow">Manage</span>
        <h1 className="mt-5 font-display text-4xl md:text-5xl font-bold tracking-tightest">
          {isNew ? <><span className="text-white">New </span><span className="text-coral-500">course</span></>
                 : <><span className="text-white">Edit </span><span className="text-coral-500">course</span></>}
        </h1>

        {error && <p className="text-coral-400 text-sm mt-6 border-l-2 border-coral-500 pl-3 py-1">{error}</p>}

        {/* Course form */}
        <form onSubmit={saveCourse} className="mt-8 border border-white/12 p-6 space-y-5">
          <div>
            <label className={labelClass}>Course title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} placeholder="e.g. Intro to Cyber Security" />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={inputClass} placeholder="What this course covers…" />
          </div>
          <div>
            <label className={labelClass}>Price in ₹ (0 = free)</label>
            <input value={priceRupees} onChange={(e) => setPriceRupees(e.target.value.replace(/[^0-9.]/g, ''))} inputMode="decimal" className={inputClass} placeholder="499" />
          </div>
          <div>
            <label className={labelClass}>Banner image</label>
            <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleBanner(e.target.files?.[0])} />
            <button type="button" onClick={() => bannerRef.current?.click()} className="w-full border border-dashed border-white/20 hover:border-coral-500/60 px-4 py-6 text-center transition-colors">
              {banner ? (
                <img src={banner.url} alt="" className="mx-auto max-h-32 object-contain" />
              ) : (
                <span className="flex flex-col items-center gap-2 text-white/55 text-sm">
                  <ImageIcon size={20} className="text-coral-400" />
                  {bannerPct ? `Uploading… ${bannerPct}%` : 'Click to upload banner'}
                </span>
              )}
            </button>
          </div>
          <button type="submit" disabled={busy} className="btn-premium disabled:opacity-50">
            <Check size={14} /> {isNew ? 'Create course' : 'Save changes'}
          </button>
        </form>

        {/* Lectures (only after course exists) */}
        {!isNew && course && (
          <>
            <h2 className="font-display text-2xl font-bold text-white mt-14 mb-4">Lectures</h2>

            {/* Existing lectures */}
            <div className="space-y-2 mb-8">
              {course.lectures?.length === 0 && (
                <p className="text-white/45 text-sm">No lectures yet — add the first one below.</p>
              )}
              {course.lectures?.map((l, i) => (
                <div key={l._id} className="border border-white/10 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs text-white/40">{String(i + 1).padStart(2, '0')}</span>
                    <div className="min-w-0">
                      <div className="text-white text-sm truncate">{l.title}</div>
                      <div className="font-mono text-[0.55rem] uppercase tracking-wider text-white/35 flex gap-2">
                        {(l.videoUrl || l.hasVideo) && <span>video</span>}
                        {(l.notesUrl || l.hasNotes) && <span>notes</span>}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => deleteLecture(l._id)} className="text-white/40 hover:text-coral-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add lecture */}
            <form onSubmit={addLecture} className="border border-white/12 p-6 space-y-5">
              <div className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-coral-400">Add a lecture</div>
              <div>
                <label className={labelClass}>Lecture title</label>
                <input value={lTitle} onChange={(e) => setLTitle(e.target.value)} className={inputClass} placeholder="Lecture 1 — Getting started" />
              </div>
              <div>
                <label className={labelClass}>Description / text notes</label>
                <textarea value={lDesc} onChange={(e) => setLDesc(e.target.value)} rows={3} className={inputClass} placeholder="What this lecture covers…" />
              </div>

              {/* Video upload */}
              <div>
                <label className={labelClass}>Video (max 100MB on free Cloudinary)</label>
                <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => setVideo(e.target.files?.[0] || null)} />
                <button type="button" onClick={() => videoRef.current?.click()} className="w-full border border-dashed border-white/20 hover:border-coral-500/60 px-4 py-4 text-center transition-colors text-sm text-white/60">
                  <span className="flex items-center justify-center gap-2">
                    <Film size={16} className="text-coral-400" />
                    {video ? video.name : 'Choose video file'}
                  </span>
                  {videoPct > 0 && <span className="block mt-2 text-coral-400 font-mono text-xs">Uploading… {videoPct}%</span>}
                </button>
              </div>

              {/* Notes upload */}
              <div>
                <label className={labelClass}>PDF notes (optional)</label>
                <input ref={notesRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => setNotes(e.target.files?.[0] || null)} />
                <button type="button" onClick={() => notesRef.current?.click()} className="w-full border border-dashed border-white/20 hover:border-coral-500/60 px-4 py-4 text-center transition-colors text-sm text-white/60">
                  <span className="flex items-center justify-center gap-2">
                    <FileText size={16} className="text-coral-400" />
                    {notes ? notes.name : 'Choose PDF'}
                  </span>
                  {notesPct > 0 && <span className="block mt-2 text-coral-400 font-mono text-xs">Uploading… {notesPct}%</span>}
                </button>
              </div>

              <button type="submit" disabled={busy} className="btn-premium w-full justify-center disabled:opacity-50">
                <Plus size={14} /> {busy ? 'Uploading…' : 'Add lecture'}
              </button>
            </form>

            {/* Danger zone */}
            <div className="mt-10 pt-6 border-t border-white/10">
              <button onClick={deleteCourse} className="text-coral-500/80 hover:text-coral-400 text-xs font-mono uppercase tracking-wider transition-colors">
                Delete this course
              </button>
            </div>
          </>
        )}
      </section>
    </PageTransition>
  )
}
