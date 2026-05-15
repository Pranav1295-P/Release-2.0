import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

/**
 * One-time codes for two flows:
 *  - purpose: 'register'  → verify email ownership before creating an account
 *  - purpose: 'reset'     → verify email ownership before resetting a password
 *
 * Codes auto-expire after 10 minutes via a TTL index.
 */
const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    purpose: { type: String, required: true, enum: ['register', 'reset'] },
    codeHash: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
)

// TTL index — MongoDB removes the document automatically once expiresAt passes
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

otpSchema.methods.setCode = async function (code) {
  this.codeHash = await bcrypt.hash(String(code), 8)
}

otpSchema.methods.verifyCode = function (code) {
  return bcrypt.compare(String(code), this.codeHash)
}

export default mongoose.model('Otp', otpSchema)
