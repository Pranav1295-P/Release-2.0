import crypto from 'crypto'

/**
 * Razorpay helpers — no SDK, just the REST API + signature verification.
 *
 * Env vars needed:
 *   RAZORPAY_KEY_ID         — your Razorpay key id (starts with rzp_test_ or rzp_live_)
 *   RAZORPAY_KEY_SECRET     — your Razorpay key secret
 *   RAZORPAY_WEBHOOK_SECRET — (optional) webhook signing secret
 *
 * Use Razorpay TEST MODE keys while building — they need no KYC and
 * accept fake test cards. Switch to live keys once your account is verified.
 */

const KEY_ID = process.env.RAZORPAY_KEY_ID
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

export const razorpayConfigured = Boolean(KEY_ID && KEY_SECRET)

/** Price of the blue tick: ₹99/month, expressed in paise. */
export const BLUE_TICK_AMOUNT = 9900 // 99 INR

/**
 * Create a Razorpay order via their REST API.
 * @param {object} opts { amount (paise), receipt, notes }
 * @returns the Razorpay order object (contains `id`)
 */
export async function createRazorpayOrder({ amount, receipt, notes }) {
  if (!razorpayConfigured) {
    throw new Error('Razorpay is not configured on the server.')
  }
  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64')
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency: 'INR',
      receipt,
      notes: notes || {},
    }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Razorpay order failed (${res.status}): ${text}`)
  }
  return res.json()
}

/**
 * Verify the signature Razorpay Checkout returns to the frontend.
 * signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret)
 */
export function verifyPaymentSignature({ orderId, paymentId, signature }) {
  if (!KEY_SECRET) return false
  const expected = crypto
    .createHmac('sha256', KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')
  // timing-safe compare
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(String(signature || ''))
    )
  } catch {
    return false
  }
}

/**
 * Verify a Razorpay webhook signature.
 * signature = HMAC_SHA256(rawBody, webhook_secret)
 */
export function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) return false
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(String(signature || ''))
    )
  } catch {
    return false
  }
}

export const RAZORPAY_KEY_ID = KEY_ID
