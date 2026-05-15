import express from 'express'
import User from '../models/User.js'
import Subscription from '../models/Subscription.js'
import { requireAuth } from '../middleware/auth.js'
import {
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
  razorpayConfigured,
  RAZORPAY_KEY_ID,
  BLUE_TICK_AMOUNT,
} from '../utils/razorpay.js'

const router = express.Router()

/* Add 30 days to a starting date (or extend an existing future date). */
function periodEndFrom(start) {
  const base = start && start.getTime() > Date.now() ? new Date(start) : new Date()
  base.setDate(base.getDate() + 30)
  return base
}

/* ───────────────────────── CONFIG (public) ──────────────────────────
 * GET /api/payments/config
 * Tells the frontend the Razorpay key id + price so it can open Checkout.
 */
router.get('/config', (req, res) => {
  res.json({
    enabled: razorpayConfigured,
    keyId: RAZORPAY_KEY_ID || null,
    amount: BLUE_TICK_AMOUNT,
    currency: 'INR',
  })
})

/* ─────────────────── CREATE ORDER — signed-in user ──────────────────
 * POST /api/payments/create-order
 * Creates a ₹99 Razorpay order for the blue tick.
 */
router.post('/create-order', requireAuth, async (req, res, next) => {
  try {
    if (!razorpayConfigured) {
      return res.status(503).json({ message: 'Payments are not configured yet.' })
    }
    // Gold users never need to pay.
    if (req.user.verifiedType === 'gold') {
      return res.status(400).json({ message: 'Your account is already verified.' })
    }

    const order = await createRazorpayOrder({
      amount: BLUE_TICK_AMOUNT,
      receipt: `bluetick_${req.user._id}_${Date.now()}`,
      notes: { userId: String(req.user._id), purpose: 'blue-tick' },
    })

    await Subscription.create({
      user: req.user._id,
      razorpayOrderId: order.id,
      amount: BLUE_TICK_AMOUNT,
      currency: 'INR',
      status: 'created',
    })

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
    })
  } catch (err) {
    next(err)
  }
})

/* ─────────────────── VERIFY PAYMENT — signed-in user ────────────────
 * POST /api/payments/verify
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * Called by the frontend right after Razorpay Checkout succeeds.
 */
router.post('/verify', requireAuth, async (req, res, next) => {
  try {
    const {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    } = req.body

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ message: 'Missing payment details.' })
    }

    const ok = verifyPaymentSignature({ orderId, paymentId, signature })
    if (!ok) {
      return res.status(400).json({ message: 'Payment verification failed.' })
    }

    const sub = await Subscription.findOne({
      razorpayOrderId: orderId,
      user: req.user._id,
    })
    if (!sub) {
      return res.status(404).json({ message: 'Order not found.' })
    }
    if (sub.status === 'paid') {
      // Already processed (e.g. webhook beat us to it) — just return current state.
      return res.json({ user: req.user.toPublic() })
    }

    // Extend the user's blue verification by 30 days.
    const periodStart = new Date()
    const periodEnd = periodEndFrom(req.user.verifiedUntil)

    sub.razorpayPaymentId = paymentId
    sub.status = 'paid'
    sub.periodStart = periodStart
    sub.periodEnd = periodEnd
    await sub.save()

    // Don't downgrade a gold user to blue.
    if (req.user.verifiedType !== 'gold') {
      req.user.verifiedType = 'blue'
      req.user.verifiedUntil = periodEnd
      await req.user.save()
    }

    res.json({ user: req.user.toPublic() })
  } catch (err) {
    next(err)
  }
})

/* ───────────────────────────── WEBHOOK ───────────────────────────────
 * POST /api/payments/webhook
 * Razorpay calls this server-to-server. Mounted with a raw body parser
 * in server.js so the signature can be verified against the exact bytes.
 */
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature']
    // req.body is a Buffer here (raw parser mounted in server.js)
    const rawBody = req.body
    if (!verifyWebhookSignature(rawBody, signature)) {
      return res.status(400).json({ message: 'Invalid webhook signature.' })
    }

    const event = JSON.parse(rawBody.toString('utf8'))

    if (event.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity
      const orderId = payment?.order_id
      const paymentId = payment?.id
      if (orderId) {
        const sub = await Subscription.findOne({ razorpayOrderId: orderId })
        if (sub && sub.status !== 'paid') {
          const user = await User.findById(sub.user)
          if (user) {
            const periodEnd = periodEndFrom(user.verifiedUntil)
            sub.razorpayPaymentId = paymentId
            sub.status = 'paid'
            sub.periodStart = new Date()
            sub.periodEnd = periodEnd
            await sub.save()
            if (user.verifiedType !== 'gold') {
              user.verifiedType = 'blue'
              user.verifiedUntil = periodEnd
              await user.save()
            }
          }
        }
      }
    }

    // Always 200 so Razorpay stops retrying.
    res.json({ ok: true })
  } catch (err) {
    console.error('Webhook error:', err?.message)
    res.status(500).json({ message: 'Webhook processing error.' })
  }
})

export default router
