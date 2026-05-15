import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ImagePlus, Film, X, Send } from 'lucide-react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'

const MAX_FILES = 4
const MAX_SIZE = 50 * 1024 * 1024 // 50 MB

/**
 * Twitter-style composer — title, body, up to 4 image/video attachments.
 * Calls onPosted() after a successful publish so the parent can refresh.
 */
export default function BlogComposer({ onPosted }) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [files, setFiles] = useState([]) // { file, url, type }
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  if (!user) return null

  const addFiles = (fileList) => {
    setError('')
    const incoming = Array.from(fileList || [])
    const room = MAX_FILES - files.length
    if (incoming.length > room) {
      setError(`You can attach up to ${MAX_FILES} files per post.`)
    }
    const accepted = []
    for (const file of incoming.slice(0, room)) {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      if (!isImage && !isVideo) {
        setError('Only images and videos can be attached.')
        continue
      }
      if (file.size > MAX_SIZE) {
        setError('Each file must be 50MB or smaller.')
        continue
      }
      accepted.push({
        file,
        url: URL.createObjectURL(file),
        type: isVideo ? 'video' : 'image',
      })
    }
    setFiles((prev) => [...prev, ...accepted])
  }

  const removeFile = (idx) => {
    setFiles((prev) => {
      const next = [...prev]
      URL.revokeObjectURL(next[idx].url)
      next.splice(idx, 1)
      return next
    })
  }

  const submit = async (e) => {
    e.preventDefault()
    const t = title.trim()
    const b = body.trim()
    if (!t || !b) {
      setError('Add a title and some text.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const form = new FormData()
      form.append('title', t)
      form.append('body', b)
      files.forEach((f) => form.append('media', f.file))
      // NOTE: don't set Content-Type manually — axios adds it WITH the
      // multipart boundary automatically when the body is a FormData.
      // Setting it by hand drops the boundary and the server can't parse fields.
      await api.post('/blogs', form)
      // reset
      setTitle('')
      setBody('')
      files.forEach((f) => URL.revokeObjectURL(f.url))
      setFiles([])
      onPosted?.()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to publish. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      className="border border-white/12 bg-white/[0.015] p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-coral-500 text-black flex items-center justify-center font-display font-bold text-sm">
          {user.username?.[0]?.toUpperCase() || '?'}
        </div>
        <span className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-white/55">
          Posting as @{user.username}
        </span>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        maxLength={200}
        className="w-full bg-transparent border-b border-white/10 focus:border-coral-500 outline-none py-2 text-white text-lg font-display font-bold placeholder-white/25 transition-colors"
      />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What's on your mind? Share a thought, a finding, a question…"
        rows={4}
        className="w-full bg-transparent outline-none py-3 mt-2 text-white/85 placeholder-white/25 resize-none text-sm leading-relaxed"
      />

      {/* media previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-3">
          {files.map((f, i) => (
            <div key={i} className="relative group border border-white/10 overflow-hidden aspect-video bg-black">
              {f.type === 'video' ? (
                <video src={f.url} className="w-full h-full object-cover" muted />
              ) : (
                <img src={f.url} alt="" className="w-full h-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute top-1.5 right-1.5 bg-black/80 text-white p-1 hover:bg-coral-500 hover:text-black transition-colors"
              >
                <X size={12} />
              </button>
              <span className="absolute bottom-1.5 left-1.5 font-mono text-[0.55rem] uppercase tracking-widest bg-black/80 px-1.5 py-0.5 text-white/70">
                {f.type}
              </span>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-coral-400 text-xs mt-3 border-l-2 border-coral-500 pl-3">{error}</p>
      )}

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/8">
        <div className="flex items-center gap-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) => {
              addFiles(e.target.files)
              e.target.value = ''
            }}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={files.length >= MAX_FILES}
            className="flex items-center gap-1.5 px-3 py-2 text-coral-500 hover:bg-coral-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Add images or videos"
          >
            <ImagePlus size={16} />
            <Film size={16} />
            <span className="font-mono text-[0.6rem] uppercase tracking-widest">
              {files.length}/{MAX_FILES}
            </span>
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-premium !py-2 !px-5 disabled:opacity-50"
        >
          <Send size={13} />
          {submitting ? 'Posting…' : 'Post'}
        </button>
      </div>
    </motion.form>
  )
}
