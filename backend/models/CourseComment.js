import mongoose from 'mongoose'

/**
 * Comment on a course or a specific lecture.
 * If `lectureId` is set, the comment belongs to that lecture; otherwise it's
 * a course-level comment.
 */
const courseCommentSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    lectureId: { type: mongoose.Schema.Types.ObjectId, default: null },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
)

courseCommentSchema.index({ course: 1, createdAt: -1 })

export default mongoose.model('CourseComment', courseCommentSchema)
