import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FileText, Upload, Download, Calendar, User, Plus, X } from 'lucide-react'
import PageTransition from '../components/PageTransition.jsx'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'
import { Link } from 'react-router-dom'

export default function Reports() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const load = () => {
    setLoading(true)
    api.get('/reports')
      .then(({ data }) => setReports(data))
      .catch(() => setReports([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleFile = (f) => {
    if (!f) return
    if (f.type !== 'application/pdf') {
      setError('Only PDF files are accepted.')
      return
    }
    if (f.size > 25 * 1024 * 1024) {
      setError('PDF must be 25MB or smaller.')
      return
    }
    setError('')
    setFile(f)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !file) {
      setError('Provide a title and a PDF file.')
      return
    }
    const formData = new FormData()
    formData.append('title', title)
    formData.append('file', file)
    setSubmitting(true)
    setError('')
    try {
      await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setShowUpload(false)
      setTitle('')
      setFile(null)
      load()
    } catch (err) {
      setError(err?.response?.data?.message || 'Upload failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageTransition>
      <section className="relative py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          >
            <div>
              <span className="section-eyebrow">— 04 / Reports —</span>
              <h1 className="mt-6 font-display text-5xl md:text-7xl leading-tight">
                <span className="text-white/90">Published</span>{' '}
                <span className="italic text-gradient-gold">Reports</span>
              </h1>
              <p className="mt-6 max-w-2xl text-white/60">
                A public board for PDF reports. Anyone with an account can publish.
              </p>
            </div>

            {user ? (
              <button onClick={() => setShowUpload(true)} className="btn-premium">
                <Plus size={16} /> Publish Report
              </button>
            ) : (
              <Link to="/auth" className="btn-ghost">Sign in to publish</Link>
            )}
          </motion.div>

          {loading && (
            <div className="grid md:grid-cols-2 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-6 animate-pulse h-32" />
              ))}
            </div>
          )}

          {!loading && reports.length === 0 && (
            <div className="glass rounded-3xl p-16 text-center">
              <FileText size={32} className="mx-auto text-white/30 mb-4" />
              <div className="font-display text-2xl text-white/80 mb-2">No reports yet.</div>
              <p className="text-white/50 text-sm">Be the first to publish.</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-5">
            {reports.map((r, i) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass glass-hover rounded-2xl p-6 flex items-start gap-4"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-500/20 to-accent-violet/20 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                  <FileText size={22} className="text-gold-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl text-white mb-2 truncate">{r.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-white/50 mb-4">
                    <span className="flex items-center gap-1"><User size={11} /> @{r.author?.username || 'unknown'}</span>
                    <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(r.createdAt).toLocaleDateString()}</span>
                    <span>{(r.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <a
                    href={r.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 transition-colors"
                  >
                    <Download size={14} /> View PDF
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload modal */}
      {showUpload && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowUpload(false)}
          className="fixed inset-0 z-50 bg-ink-950/80 backdrop-blur-xl flex items-center justify-center p-6"
        >
          <motion.form
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="w-full max-w-md glass rounded-3xl p-8 relative"
          >
            <button type="button" onClick={() => setShowUpload(false)} className="absolute top-5 right-5 text-white/40 hover:text-white">
              <X size={20} />
            </button>

            <h3 className="font-display text-3xl text-white mb-2">Publish Report</h3>
            <p className="text-sm text-white/50 mb-6">PDF format only · max 25MB</p>

            <label className="block mb-4">
              <span className="text-xs uppercase tracking-wider text-white/50 mb-2 block">Title</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Report title"
                className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-gold-500/50 transition-colors text-white"
              />
            </label>

            <label className="block mb-4">
              <span className="text-xs uppercase tracking-wider text-white/50 mb-2 block">PDF File</span>
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFile(e.target.files?.[0])}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-full border border-dashed border-gold-500/30 rounded-xl px-4 py-8 text-center hover:border-gold-500/60 hover:bg-gold-500/5 transition-colors"
              >
                <Upload size={20} className="mx-auto text-gold-400 mb-2" />
                <div className="text-sm text-white/70">
                  {file ? file.name : 'Click to choose PDF'}
                </div>
              </button>
            </label>

            {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-premium w-full justify-center disabled:opacity-50">
              {submitting ? 'Uploading…' : 'Publish Report'}
            </button>
          </motion.form>
        </motion.div>
      )}
    </PageTransition>
  )
}
