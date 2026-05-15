import express from 'express'
import multer from 'multer'
import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import { requireAuth } from '../middleware/auth.js'
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  cloudinaryConfigured,
} from '../utils/cloudinary.js'

const router = express.Router()

// In-memory multer — files go straight to Cloudinary, never touch disk.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image and video files are allowed.'))
    }
  },
})

/* ───────────────────────── LIST (public) ──────────────────────────── */
router.get('/', async (req, res, next) => {
  try {
    const posts = await Blog.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .lean()
    res.json(posts)
  } catch (err) {
    next(err)
  }
})

/* ─────────────────────── SINGLE POST (public) ─────────────────────── */
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Blog.findById(req.params.id)
      .populate('author', 'username')
      .lean()
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json(post)
  } catch (err) {
    if (err?.name === 'CastError')
      return res.status(404).json({ message: 'Post not found' })
    next(err)
  }
})

/* ─────────────────── CREATE POST — any signed-in user ──────────────────
 * POST /api/blogs   (multipart/form-data)
 * Fields: title, body, excerpt (optional), media[] (optional image/video files)
 */
router.post('/', requireAuth, (req, res, next) => {
  upload.array('media', 4)(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message })
    try {
      const { title, body, excerpt } = req.body
      if (!title?.trim() || !body?.trim()) {
        return res.status(400).json({ message: 'Title and body are required.' })
      }

      // Upload any attached media to Cloudinary
      const media = []
      if (req.files?.length) {
        if (!cloudinaryConfigured) {
          return res.status(503).json({
            message: 'Media uploads are not configured on the server yet.',
          })
        }
        for (const file of req.files) {
          const kind = file.mimetype.startsWith('video/') ? 'video' : 'image'
          const uploaded = await uploadToCloudinary(file.buffer, kind)
          media.push(uploaded)
        }
      }

      const post = await Blog.create({
        title: String(title).trim(),
        excerpt: excerpt ? String(excerpt).trim() : '',
        body: String(body),
        media,
        author: req.user._id,
      })

      await post.populate('author', 'username')
      res.status(201).json(post)
    } catch (e) {
      next(e)
    }
  })
})

/* ─────────────── DELETE POST — author OR admin ────────────────────── */
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const post = await Blog.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })

    const isOwner = String(post.author) === String(req.user._id)
    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: 'You can only delete your own posts.' })
    }

    // Clean up attached media on Cloudinary
    for (const m of post.media || []) {
      await deleteFromCloudinary(m.publicId, m.type)
    }

    await Comment.deleteMany({ blog: post._id })
    await post.deleteOne()
    res.json({ ok: true })
  } catch (err) {
    if (err?.name === 'CastError')
      return res.status(404).json({ message: 'Post not found' })
    next(err)
  }
})

export default router
