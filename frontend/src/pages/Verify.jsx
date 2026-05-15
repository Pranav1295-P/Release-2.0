import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BadgeCheck, Check, Sparkles } from 'lucide-react'
import PageTransition from '../components/PageTransition.jsx'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'

/** Load the Razorpay Checkout script once, on demand. */
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve(true)
    s.onerror = () => resolve(false)
    document.body.appendChild(s)
  })
}

export default function Verify() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    api.get('/payments/config').then(({ data }) => setConfig(data)).catch(() => {})
  }, [])

  const alreadyVerified = user?.verifiedType === 'gold' || user?.verifiedType === 'blue'

  const startPayment = async () => {
    setError('')
    if (!user) {
      navigate('/auth')
      return
    }
    setLoading(true)
    try {
      const ok = await loadRazorpayScript()
      if (!ok) throw new Error("Couldn't load the payment window. Check your connection.")

      // 1. Create an order on our backend
      const { data: order } = await api.post('/payments/create-order')

      // 2. Open Razorpay Checkout
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Pranav Murthy',
        description: 'Blue Tick — verified for 30 days',
        order_id: order.orderId,
        prefill: { email: user.email, name: user.username },
        theme: { color: '#4f6fff' },
        handler: async (response) => {
          // 3. Verify the payment on our backend
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            await refreshUser()
            setDone(true)
          } catch (e) {
            setError(
              e?.response?.data?.message ||
                'Payment received but verification failed. Contact support.'
            )
          } finally {
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      })
      rzp.open()
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Could not start payment.')
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <section className="min-h-[80vh] flex items-center py-20">
        <div className="max-w-lg w-full mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <span className="section-eyebrow">Verification</span>
            <h1 className="mt-5 font-display text-5xl md:text-6xl leading-[0.9] tracking-tightest">
              <span className="text-white">Get the </span>
              <span className="text-coral-500">blue tick.</span>
            </h1>
          </motion.div>

          {/* Already verified */}
          {alreadyVerified && (
            <div className="border border-white/12 p-8 text-center">
              <BadgeCheck
                size={40}
                className="mx-auto mb-4"
                style={{ color: user.verifiedType === 'gold' ? '#f5c542' : '#4f6fff' }}
              />
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                You're verified.
              </h2>
              <p className="text-white/55 text-sm">
                {user.verifiedType === 'gold'
                  ? 'Your account carries the gold tick — an official, reserved account.'
                  : 'Your blue tick is active. Thanks for supporting the site.'}
              </p>
              <Link to="/blogs" className="btn-premium mt-6 inline-flex">
                Back to Free-Conversations
              </Link>
            </div>
          )}

          {/* Success state */}
          {!alreadyVerified && done && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-coral-500/40 p-8 text-center"
            >
              <BadgeCheck size={40} className="mx-auto mb-4 text-coral-500" />
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                Payment successful — you're verified!
              </h2>
              <p className="text-white/55 text-sm">
                Your blue tick is now active for 30 days. It shows next to your
                username across the site.
              </p>
              <Link to="/blogs" className="btn-premium mt-6 inline-flex">
                See it on your posts
              </Link>
            </motion.div>
          )}

          {/* Purchase card */}
          {!alreadyVerified && !done && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border border-white/12 overflow-hidden"
            >
              {/* Price header */}
              <div
                className="p-8 text-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, rgba(79,111,255,0.12), rgba(139,92,246,0.12))' }}
              >
                <Sparkles size={20} className="mx-auto text-coral-400 mb-3" />
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-display text-6xl font-bold text-white">₹99</span>
                  <span className="font-mono text-sm text-white/50">/ month</span>
                </div>
                <p className="mt-2 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-white/45">
                  Blue Tick · 30 days
                </p>
              </div>

              {/* Perks */}
              <div className="p-8">
                <ul className="space-y-3 mb-8">
                  {[
                    'A blue verified tick next to your username',
                    'Shown on every post and comment you make',
                    'Supports the site and Relativity OpenSource',
                    'Renews only when you choose — no auto-charge',
                  ].map((perk) => (
                    <li key={perk} className="flex items-start gap-3 text-sm text-white/70">
                      <Check size={16} className="text-coral-500 mt-0.5 shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>

                {error && (
                  <p className="text-coral-400 text-xs mb-4 border-l-2 border-coral-500 pl-3 py-1">
                    {error}
                  </p>
                )}

                {config && !config.enabled && (
                  <p className="text-white/45 text-xs mb-4 border-l-2 border-white/20 pl-3 py-1">
                    Payments aren't switched on yet. Check back soon.
                  </p>
                )}

                {!user ? (
                  <Link to="/auth" className="btn-premium w-full justify-center">
                    Sign in to get verified
                  </Link>
                ) : (
                  <button
                    onClick={startPayment}
                    disabled={loading || (config && !config.enabled)}
                    className="btn-premium w-full justify-center disabled:opacity-50"
                  >
                    {loading ? 'Opening payment…' : 'Pay ₹99 & get verified'}
                  </button>
                )}

                <p className="mt-4 text-center font-mono text-[0.6rem] tracking-[0.15em] uppercase text-white/30">
                  Secured by Razorpay
                </p>
              </div>
            </motion.div>
          )}

          {/* Gold tick note */}
          <p className="mt-6 text-center text-xs text-white/35 leading-relaxed">
            The gold tick is reserved for official accounts and can't be purchased.
          </p>
        </div>
      </section>
    </PageTransition>
  )
}
