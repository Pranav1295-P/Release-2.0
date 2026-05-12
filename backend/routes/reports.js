import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import Report from '../models/Report.js'
import { requireAuth } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = '.pdf'
    const name = crypto.randomBytes(16).toString('hex') + ext
    cb(null, name)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' && file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are accepted'))
    }
  },
})

const router = express.Router()

// GET /api/reports — public list
router.get('/', async (req, res, next) => {
  try {
    const list = await Report.find().sort({ createdAt: -1 }).populate('author', 'username').lean()
    res.json(list)
  } catch (err) {
    next(err)
  }
})

// POST /api/reports — auth + PDF upload
router.post('/', requireAuth, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message })
    ;(async () => {
      try {
        const { title } = req.body
        if (!title?.trim()) {
          if (req.file) fs.unlink(req.file.path, () => {})
          return res.status(400).json({ message: 'Title required' })
        }
        if (!req.file) return res.status(400).json({ message: 'PDF file required' })

        const publicBase = (process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`).replace(/\/$/, '')
        const fileUrl = `${publicBase}/uploads/${req.file.filename}`

        const report = await Report.create({
          title: String(title).trim(),
          fileName: req.file.originalname,
          storedName: req.file.filename,
          fileSize: req.file.size,
          fileUrl,
          author: req.user._id,
        })

        await report.populate('author', 'username')
        res.status(201).json(report)
      } catch (e) {
        if (req.file) fs.unlink(req.file.path, () => {})
        next(e)
      }
    })()
  })
})

// DELETE /api/reports/:id — owner only
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
    if (!report) return res.status(404).json({ message: 'Not found' })
    if (String(report.author) !== String(req.user._id) && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    const filePath = path.join(UPLOAD_DIR, report.storedName)
    fs.unlink(filePath, () => {})
    await report.deleteOne()
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
