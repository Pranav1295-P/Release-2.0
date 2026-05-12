import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes from './routes/auth.js'
import blogRoutes from './routes/blogs.js'
import commentRoutes from './routes/comments.js'
import reportRoutes from './routes/reports.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Trust proxy headers when behind Render / Vercel / etc.
app.set('trust proxy', 1)

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true)
      if (allowedOrigins.includes(origin)) return cb(null, true)
      cb(new Error('CORS: origin not allowed'))
    },
    credentials: true,
  })
)

app.use(express.json({ limit: '1mb' }))
app.use(morgan('tiny'))

// Rate limit on auth + write endpoints
const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(['/api/auth', '/api/blogs', '/api/reports'], (req, res, next) => {
  if (req.method === 'GET') return next()
  return writeLimiter(req, res, next)
})

// Static serving for uploaded PDFs
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/blogs', commentRoutes) // nested under /api/blogs/:id/comments
app.use('/api/reports', reportRoutes)

app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }))

// 404
app.use((req, res) => res.status(404).json({ message: 'Not found' }))

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

// ✅ FIXED: Changed fallback from 5000 to 5001 to match your backend .env file
const PORT = process.env.PORT || 5001
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pranav-portfolio'

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✓ MongoDB connected')
    app.listen(PORT, () => console.log(`✓ API listening on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  })