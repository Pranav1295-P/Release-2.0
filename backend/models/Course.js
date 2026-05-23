import mongoose from 'mongoose'

/** One lecture inside a course. */
const lectureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: '' },
    // Video — uploaded directly to Cloudinary from the browser.
    videoUrl: { type: String },
    videoPublicId: { type: String },
    // PDF notes — Cloudinary raw asset.
    notesUrl: { type: String },
    notesPublicId: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: '' },
    bannerUrl: { type: String },
    bannerPublicId: { type: String },
    // Price in paise. 0 means the course is free.
    price: { type: Number, default: 0, min: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lectures: { type: [lectureSchema], default: [] },
  },
  { timestamps: true }
)

courseSchema.index({ createdAt: -1 })

export default mongoose.model('Course', courseSchema)
