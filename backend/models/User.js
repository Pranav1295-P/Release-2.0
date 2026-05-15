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
  },
  { timestamps: true }
)

userSchema.methods.setPassword = async function (password) {
  this.passwordHash = await bcrypt.hash(password, 12)
}

userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash)
}

userSchema.methods.toPublic = function () {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    isAdmin: this.isAdmin,
    createdAt: this.createdAt,
  }
}

export default mongoose.model('User', userSchema)
