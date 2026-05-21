import mongoose from 'mongoose'

const reportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    fileName: { type: String, required: true },
    // Cloudinary public id — used to delete the file later. (Older records
    // created with local-disk storage may have a storedName instead.)
    publicId: { type: String },
    storedName: { type: String },
    fileSize: { type: Number, required: true },
    fileUrl: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

reportSchema.index({ createdAt: -1 })

export default mongoose.model('Report', reportSchema)
