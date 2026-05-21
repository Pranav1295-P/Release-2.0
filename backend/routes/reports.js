import express from 'express'
import multer from 'multer'
import crypto from 'crypto'
import Report from '../models/Report.js'
import { requireAuth } from '../middleware/auth.js'
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  cloudinaryConfigured,
} from '../utils/cloudinary.js'

const router = express.Router()

// In-memory multer — the PDF goes straight to Cloudinary, never touches
// Render's ephemeral disk (which wipes on every redeploy).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/pdf' &&
      file.originalname.toLowerCase().endsWith('.pdf')
    ) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are accepted'))
    }
  },
})

// GET /api/reports — public list
router.get('/', async (req, res, next) => {
  try {
    const list = await Report.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username')
      .lean()
    res.json(list)
  } catch (err) {
    next(err)
  }
})

// POST /api/reports — auth + PDF upload to Cloudinary
router.post('/', requireAuth, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message })
    ;(async () => {
      try {
        const { title } = req.body
        if (!title?.trim()) {
          return res.status(400).json({ message: 'Title required' })
        }
        if (!req.file) {
          return res.status(400).json({ message: 'PDF file required' })
        }
        if (!cloudinaryConfigured) {
          return res.status(503).json({
            message: 'File uploads are not configured on the server yet.',
          })
        }

        // Upload the PDF as a "raw" Cloudinary asset. The publicId ends in
        // .pdf so the delivered URL does too — browsers then render it inline
        // instead of downloading an unknown blob.
        const pdfId = `${crypto.randomBytes(12).toString('hex')}.pdf`
        const uploaded = await uploadToCloudinary(req.file.buffer, 'raw', {
          folder: 'reports',
          publicId: pdfId,
        })

        const report = await Report.create({
          title: String(title).trim(),
          fileName: req.file.originalname,
          publicId: uploaded.publicId,
          fileSize: uploaded.bytes || req.file.size,
          fileUrl: uploaded.url,
          author: req.user._id,
        })

        await report.populate('author', 'username')
        res.status(201).json(report)
      } catch (e) {
        next(e)
      }
    })()
  })
})

// DELETE /api/reports/:id — owner or admin
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
    if (!report) return res.status(404).json({ message: 'Not found' })
    if (
      String(report.author) !== String(req.user._id) &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    // Remove the file from Cloudinary if we have its id.
    if (report.publicId) {
      await deleteFromCloudinary(report.publicId, 'raw')
    }
    await report.deleteOne()
    res.json({ ok: true })
  } catch (err) {
    if (err?.name === 'CastError')
      return res.status(404).json({ message: 'Not found' })
    next(err)
  }
})

export default router
