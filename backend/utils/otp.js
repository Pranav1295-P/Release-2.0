import crypto from 'crypto'
import Otp from '../models/Otp.js'
import { sendEmail, otpEmailHtml } from './email.js'

const OTP_TTL_MINUTES = 10
const MAX_ATTEMPTS = 5

/** Generate a 6-digit numeric code. */
function generateCode() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0')
}

/**
 * Create (or replace) an OTP for an email + purpose, then email it.
 * Any previous unused codes for the same email/purpose are removed first.
 */
export async function issueOtp(email, purpose) {
  const cleanEmail = String(email).toLowerCase().trim()

  // Remove old codes for this email + purpose
  await Otp.deleteMany({ email: cleanEmail, purpose })

  const code = generateCode()
  const otp = new Otp({
    email: cleanEmail,
    purpose,
    expiresAt: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000),
  })
  await otp.setCode(code)
  await otp.save()

  await sendEmail({
    to: cleanEmail,
    subject:
      purpose === 'reset'
        ? 'Your password reset code'
        : 'Your verification code',
    html: otpEmailHtml({ code, purpose }),
  })

  return { ok: true }
}

/**
 * Verify a submitted code. Returns { ok: true } on success.
 * On failure returns { ok: false, message }. Deletes the OTP on success
 * or when attempts are exhausted.
 */
export async function verifyOtp(email, purpose, code) {
  const cleanEmail = String(email).toLowerCase().trim()
  const otp = await Otp.findOne({ email: cleanEmail, purpose })

  if (!otp) {
    return { ok: false, message: 'Code expired or not found. Request a new one.' }
  }

  if (otp.attempts >= MAX_ATTEMPTS) {
    await otp.deleteOne()
    return { ok: false, message: 'Too many attempts. Request a new code.' }
  }

  const valid = await otp.verifyCode(code)
  if (!valid) {
    otp.attempts += 1
    await otp.save()
    return { ok: false, message: 'Incorrect code. Try again.' }
  }

  // Success — consume the code
  await otp.deleteOne()
  return { ok: true }
}
