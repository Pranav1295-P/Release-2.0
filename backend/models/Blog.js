import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    excerpt: { type: String, trim: true, maxlength: 280 },
    body: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

blogSchema.index({ createdAt: -1 })

export default mongoose.model('Blog', blogSchema)
