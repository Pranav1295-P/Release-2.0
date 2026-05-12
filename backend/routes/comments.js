import express from 'express'
import Blog from '../models/Blog.js'
import Comment from '../models/Comment.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// GET /api/blogs/:id/comments — public
router.get('/:id/comments', async (req, res, next) => {
  try {
    const comments = await Comment.find({ blog: req.params.id })
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .lean()
    res.json(comments)
  } catch (err) {
    if (err?.name === 'CastError') return res.json([])
    next(err)
  }
})

// POST /api/blogs/:id/comments — auth required
router.post('/:id/comments', requireAuth, async (req, res, next) => {
  try {
    const { body } = req.body
    if (!body || !String(body).trim()) {
      return res.status(400).json({ message: 'Comment body required' })
    }
    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ message: 'Post not found' })

    const comment = await Comment.create({
      blog: blog._id,
      author: req.user._id,
      body: String(body).trim(),
    })

    blog.commentCount = (blog.commentCount || 0) + 1
    await blog.save()

    await comment.populate('author', 'username')
    res.status(201).json(comment)
  } catch (err) {
    if (err?.name === 'CastError') return res.status(404).json({ message: 'Post not found' })
    next(err)
  }
})

export default router
