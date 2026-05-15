import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 32,
      match: /^[a-z0-9_]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    passwordHash: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },

    // ── Verification badges ──────────────────────────────────────────
    // verifiedType:
    //   'gold' → reserved accounts (admin + a fixed allow-list of emails)
    //   'blue' → paid subscribers (₹99/month via Razorpay)
    //   null   → not verified
    verifiedType: {
      type: String,
      enum: ['gold', 'blue', null],
      default: null,
    },
    // For blue (paid) verification — when the current paid period ends.
    // Null for gold/unverified. The frontend treats blue as active only
    // while this date is in the future.
    verifiedUntil: { type: Date, default: null },
  },
  { timestamps: true }
)

userSchema.methods.setPassword = async function (password) {
  this.passwordHash = await bcrypt.hash(password, 12)
}

userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash)
}

// Returns the verification type that should actually be SHOWN right now.
// Gold never expires. Blue only counts while verifiedUntil is in the future.
userSchema.methods.activeVerifiedType = function () {
  if (this.verifiedType === 'gold') return 'gold'
  if (
    this.verifiedType === 'blue' &&
    this.verifiedUntil &&
    this.verifiedUntil.getTime() > Date.now()
  ) {
    return 'blue'
  }
  return null
}

userSchema.methods.toPublic = function () {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    isAdmin: this.isAdmin,
    verifiedType: this.activeVerifiedType(),
    verifiedUntil: this.verifiedUntil,
    createdAt: this.createdAt,
  }
}

export default mongoose.model('User', userSchema)
