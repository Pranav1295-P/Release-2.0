/**
 * Email sending via Resend (https://resend.com).
 *
 * Env vars needed:
 *   RESEND_API_KEY   — your Resend API key
 *   EMAIL_FROM       — verified sender, e.g. "Pranav Murthy <noreply@yourdomain.com>"
 *                      During testing you can use "onboarding@resend.dev"
 *
 * If RESEND_API_KEY is not set, emails are printed to the server console instead
 * of being sent — handy for local development without a provider.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY
const EMAIL_FROM = process.env.EMAIL_FROM || 'Pranav Murthy <onboarding@resend.dev>'

export async function sendEmail({ to, subject, html }) {
  // Dev fallback — no provider configured
  if (!RESEND_API_KEY) {
    console.log('\n──────── EMAIL (dev mode — not actually sent) ────────')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log('Body (html stripped):', html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
    console.log('──────────────────────────────────────────────────────\n')
    return { ok: true, dev: true }
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Resend failed (${res.status}): ${text}`)
  }
  return { ok: true }
}

/** Branded OTP email — coral/black to match the site. */
export function otpEmailHtml({ code, purpose }) {
  const heading =
    purpose === 'reset' ? 'Reset your password' : 'Verify your email'
  const intro =
    purpose === 'reset'
      ? 'Use the code below to reset your password on Pranav Murthy.'
      : 'Use the code below to finish creating your account on Pranav Murthy.'

  return `
  <div style="background:#000;padding:40px 20px;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#0a0a0a;border:1px solid #1f1f1f;border-radius:4px;overflow:hidden;">
      <div style="padding:32px 32px 0;">
        <div style="font-size:20px;font-weight:800;color:#fff;letter-spacing:-0.03em;">
          PRANAV<span style="color:#ff5722;">.COM</span>
        </div>
        <div style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#ff5722;margin-top:4px;">
          Relativity OpenSource
        </div>
      </div>
      <div style="padding:24px 32px 32px;">
        <h1 style="font-size:24px;color:#fff;margin:24px 0 8px;font-weight:700;">${heading}</h1>
        <p style="font-size:14px;color:#a3a3a3;line-height:1.6;margin:0 0 24px;">${intro}</p>
        <div style="background:#000;border:1px solid #ff5722;border-radius:4px;padding:20px;text-align:center;margin-bottom:24px;">
          <div style="font-size:36px;font-weight:800;letter-spacing:0.3em;color:#ff5722;font-family:'JetBrains Mono',monospace;">
            ${code}
          </div>
        </div>
        <p style="font-size:12px;color:#737373;line-height:1.6;margin:0;">
          This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.
        </p>
      </div>
      <div style="padding:16px 32px;border-top:1px solid #1f1f1f;">
        <p style="font-size:11px;color:#525252;margin:0;">
          All rights Reserved 2026 By Pranav Murthy And Relativity
        </p>
      </div>
    </div>
  </div>`
}
