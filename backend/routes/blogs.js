import express from 'express'
import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// GET /api/blogs — list (public)
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

// GET /api/blogs/:id — single (public)
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Blog.findById(req.params.id).populate('author', 'username').lean()
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json(post)
  } catch (err) {
    if (err?.name === 'CastError') return res.status(404).json({ message: 'Post not found' })
    next(err)
  }
})

// POST /api/blogs — admin only (only Pranav can publish)
router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { title, body, excerpt } = req.body
    if (!title || !body) return res.status(400).json({ message: 'Title and body required' })
    const post = await Blog.create({
      title: String(title).trim(),
      excerpt: excerpt ? String(excerpt).trim() : '',
      body: String(body),
      author: req.user._id,
    })
    res.status(201).json(post)
  } catch (err) {
    next(err)
  }
})

// PUT /api/blogs/:id — admin
router.put('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { title, body, excerpt } = req.body
    const post = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, body, excerpt },
      { new: true, runValidators: true }
    )
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json(post)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/blogs/:id — admin
router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const post = await Blog.findByIdAndDelete(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    await Comment.deleteMany({ blog: post._id })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
