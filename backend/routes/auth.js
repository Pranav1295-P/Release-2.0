import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { issueOtp, verifyOtp } from '../utils/otp.js'

const router = express.Router()

const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || 'pranav').toLowerCase()

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e || ''))
const usernameOk = (u) => /^[a-z0-9_]{3,32}$/.test(String(u || '').toLowerCase())

/* ───────────────────────── REGISTER (step 1) ─────────────────────────
 * POST /api/auth/register/request-otp
 * Body: { email }
 * Sends a 6-digit code to the email if it's not already registered.
 */
router.post('/register/request-otp', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim()
    if (!emailOk(email)) {
      return res.status(400).json({ message: 'Enter a valid email address.' })
    }
    const exists = await User.findOne({ email })
    if (exists) {
      return res.status(409).json({ message: 'An account with this email already exists. Try signing in.' })
    }
    await issueOtp(email, 'register')
    res.json({ ok: true, message: 'Verification code sent. Check your inbox.' })
  } catch (err) {
    next(err)
  }
})

/* ───────────────────────── REGISTER (step 2) ─────────────────────────
 * POST /api/auth/register/verify
 * Body: { email, code, username, password }
 * Verifies the OTP, then creates the account.
 */
router.post('/register/verify', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim()
    const username = String(req.body.username || '').toLowerCase().trim()
    const { code, password } = req.body

    if (!emailOk(email)) return res.status(400).json({ message: 'Invalid email.' })
    if (!code) return res.status(400).json({ message: 'Verification code required.' })
    if (!usernameOk(username)) {
      return res.status(400).json({
        message: 'Username must be 3–32 chars: letters, numbers, underscore only.',
      })
    }
    if (String(password || '').length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    // Verify the OTP first
    const otpResult = await verifyOtp(email, 'register', code)
    if (!otpResult.ok) {
      return res.status(400).json({ message: otpResult.message })
    }

    // Re-check uniqueness (race-safety)
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: 'Email already registered.' })
    }
    if (await User.findOne({ username })) {
      return res.status(409).json({ message: 'Username already taken.' })
    }

    const user = new User({ username, email })
    await user.setPassword(password)
    if (username === ADMIN_USERNAME) user.isAdmin = true
    await user.save()

    const token = signToken(user)
    res.status(201).json({ token, user: user.toPublic() })
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'Email or username already in use.' })
    }
    next(err)
  }
})

/* ───────────────────────────── LOGIN ─────────────────────────────────
 * POST /api/auth/login
 * Body: { username, password }
 */
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required.' })
    }
    const user = await User.findOne({
      username: String(username).toLowerCase().trim(),
    })
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' })

    const ok = await user.verifyPassword(password)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials.' })

    const token = signToken(user)
    res.json({ token, user: user.toPublic() })
  } catch (err) {
    next(err)
  }
})

/* ─────────────────── FORGOT PASSWORD (step 1) ────────────────────────
 * POST /api/auth/forgot-password
 * Body: { email }
 * Sends a reset code if an account exists. Always responds 200 so the
 * endpoint can't be used to probe which emails are registered.
 */
router.post('/forgot-password', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim()
    if (!emailOk(email)) {
      return res.status(400).json({ message: 'Enter a valid email address.' })
    }
    const user = await User.findOne({ email })
    if (user) {
      await issueOtp(email, 'reset')
    }
    // Same response whether or not the account exists
    res.json({
      ok: true,
      message: 'If an account exists for that email, a reset code has been sent.',
    })
  } catch (err) {
    next(err)
  }
})

/* ─────────────────── FORGOT PASSWORD (step 2) ────────────────────────
 * POST /api/auth/reset-password
 * Body: { email, code, password }
 * Verifies the OTP and sets a new password.
 */
router.post('/reset-password', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim()
    const { code, password } = req.body

    if (!emailOk(email)) return res.status(400).json({ message: 'Invalid email.' })
    if (!code) return res.status(400).json({ message: 'Reset code required.' })
    if (String(password || '').length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    const otpResult = await verifyOtp(email, 'reset', code)
    if (!otpResult.ok) {
      return res.status(400).json({ message: otpResult.message })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'Account not found.' })
    }

    await user.setPassword(password)
    await user.save()

    // Log them straight in after a successful reset
    const token = signToken(user)
    res.json({ token, user: user.toPublic(), message: 'Password updated.' })
  } catch (err) {
    next(err)
  }
})

/* ──────────────── RECOVER USERNAME (optional helper) ─────────────────
 * POST /api/auth/recover-username
 * Body: { email }
 * If they forgot their username, email it to them. Always 200.
 */
router.post('/recover-username', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').toLowerCase().trim()
    if (!emailOk(email)) {
      return res.status(400).json({ message: 'Enter a valid email address.' })
    }
    const user = await User.findOne({ email })
    if (user) {
      const { sendEmail } = await import('../utils/email.js')
      await sendEmail({
        to: email,
        subject: 'Your username',
        html: `<div style="background:#000;padding:40px;font-family:Inter,Arial,sans-serif;color:#fff;">
          <p style="color:#a3a3a3;">The username for your account is:</p>
          <p style="font-size:24px;font-weight:800;color:#ff5722;">${user.username}</p>
        </div>`,
      })
    }
    res.json({
      ok: true,
      message: 'If an account exists for that email, the username has been sent.',
    })
  } catch (err) {
    next(err)
  }
})

export default router
