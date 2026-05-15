import mongoose from 'mongoose'

/**
 * A record of every ₹99 blue-tick payment. One row per successful payment.
 * The User's verifiedUntil date is the source of truth for "is blue active";
 * this collection is the audit trail / history.
 */
const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    amount: { type: Number, required: true }, // in paise (₹99 = 9900)
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
    },
    periodStart: { type: Date },
    periodEnd: { type: Date },
  },
  { timestamps: true }
)

subscriptionSchema.index({ razorpayOrderId: 1 })

export default mongoose.model('Subscription', subscriptionSchema)
