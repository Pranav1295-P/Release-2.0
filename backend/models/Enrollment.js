import mongoose from 'mongoose'

/** A record of a user buying access to a course (via Razorpay). */
const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    amount: { type: Number, required: true }, // paise
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  },
  { timestamps: true }
)

enrollmentSchema.index({ user: 1, course: 1 })
enrollmentSchema.index({ razorpayOrderId: 1 })

export default mongoose.model('Enrollment', enrollmentSchema)
