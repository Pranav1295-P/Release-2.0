import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'pranav').toLowerCase()

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' })
    }
    const cleanName = String(username).toLowerCase().trim()
    if (!/^[a-z0-9_]{3,32}$/.test(cleanName)) {
      return res.status(400).json({
        message: 'Username must be 3–32 chars: letters, numbers, underscore only.',
      })
    }
    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const exists = await User.findOne({ username: cleanName })
    if (exists) return res.status(409).json({ message: 'Username already taken' })

    const user = new User({ username: cleanName })
    await user.setPassword(password)
    if (cleanName === ADMIN_USERNAME) user.isAdmin = true
    await user.save()

    const token = signToken(user)
    res.status(201).json({ token, user: user.toPublic() })
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' })
    }
    const user = await User.findOne({ username: String(username).toLowerCase().trim() })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const ok = await user.verifyPassword(password)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

    const token = signToken(user)
    res.json({ token, user: user.toPublic() })
  } catch (err) {
    next(err)
  }
})

export default router
