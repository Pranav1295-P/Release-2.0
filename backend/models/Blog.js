import mongoose from 'mongoose'

/** A single attached media item (image or video) hosted on Cloudinary. */
const mediaSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['image', 'video'], required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true }, // Cloudinary id — needed to delete it later
    width: Number,
    height: Number,
  },
  { _id: false }
)

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    excerpt: { type: String, trim: true, maxlength: 280 },
    body: { type: String, required: true },
    media: { type: [mediaSchema], default: [] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

blogSchema.index({ createdAt: -1 })

export default mongoose.model('Blog', blogSchema)
