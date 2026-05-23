import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ message: 'Authentication required' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) return res.status(401).json({ message: 'User not found' })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

// Sets req.user if a valid token is present, but never rejects the request.
// Used for endpoints that are public but behave differently when signed in
// (e.g. showing locked vs. unlocked course content).
export async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id)
      if (user) req.user = user
    }
  } catch {
    // ignore — just proceed unauthenticated
  }
  next()
}

// Gold = official accounts (admin or verifiedType 'gold'). Only they manage courses.
export function requireGold(req, res, next) {
  const u = req.user
  if (!u || !(u.isAdmin || u.verifiedType === 'gold')) {
    return res.status(403).json({ message: 'Only verified official accounts can do this.' })
  }
  next()
}
