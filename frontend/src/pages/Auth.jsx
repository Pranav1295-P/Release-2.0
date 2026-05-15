import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react'
import PageTransition from '../components/PageTransition.jsx'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Multi-step auth.
 *  mode = 'login'    → username + password
 *  mode = 'register' → email → OTP+username+password
 *  mode = 'forgot'   → email → OTP+new password
 *
 * Each mode has a `step` (1 or 2).
 */
export default function Auth() {
  const {
    login,
    requestRegisterOtp,
    verifyRegister,
    requestPasswordReset,
    resetPassword,
  } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login')
  const [step, setStep] = useState(1)

  // shared fields
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  const reset = (nextMode) => {
    setMode(nextMode)
    setStep(1)
    setError('')
    setNotice('')
    setCode('')
    setPassword('')
    setUsername('')
  }

  const handle = async (fn) => {
    setError('')
    setNotice('')
    setLoading(true)
    try {
      await fn()
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  /* ── LOGIN ── */
  const doLogin = (e) => {
    e.preventDefault()
    handle(async () => {
      await login(username, password)
      navigate('/blogs')
    })
  }

  /* ── REGISTER step 1: send OTP ── */
  const doRegisterRequestOtp = (e) => {
    e.preventDefault()
    handle(async () => {
      await requestRegisterOtp(email)
      setNotice('Code sent. Check your inbox (and spam).')
      setStep(2)
    })
  }

  /* ── REGISTER step 2: verify + create ── */
  const doRegisterVerify = (e) => {
    e.preventDefault()
    handle(async () => {
      await verifyRegister({ email, code, username, password })
      navigate('/blogs')
    })
  }

  /* ── FORGOT step 1: send reset OTP ── */
  const doForgotRequest = (e) => {
    e.preventDefault()
    handle(async () => {
      await requestPasswordReset(email)
      setNotice('If that email is registered, a reset code is on its way.')
      setStep(2)
    })
  }

  /* ── FORGOT step 2: verify + set new password ── */
  const doForgotReset = (e) => {
    e.preventDefault()
    handle(async () => {
      await resetPassword({ email, code, password })
      navigate('/blogs')
    })
  }

  const inputClass =
    'w-full bg-transparent border border-white/15 px-4 py-3 outline-none focus:border-coral-500 transition-colors text-white placeholder-white/30 text-sm'
  const labelClass =
    'text-[0.65rem] uppercase tracking-[0.2em] text-white/45 mb-2 flex items-center gap-1.5'

  const titleFor = () => {
    if (mode === 'login') return ['Welcome', 'back.']
    if (mode === 'register') return step === 1 ? ['Create', 'account.'] : ['Verify', 'email.']
    return step === 1 ? ['Forgot', 'password?'] : ['Reset', 'password.']
  }
  const [t1, t2] = titleFor()

  return (
    <PageTransition>
      <section className="min-h-[80vh] flex items-center py-20">
        <div className="max-w-md w-full mx-auto px-6">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <span className="section-eyebrow">Account</span>
            <h1 className="mt-5 font-display text-5xl md:text-6xl leading-[0.9] tracking-tightest">
              <span className="text-white">{t1}</span>{' '}
              <span className="text-coral-500">{t2}</span>
            </h1>
          </motion.div>

          {/* Mode tabs (only on step 1) */}
          {step === 1 && (
            <div className="flex border border-white/15 mb-8">
              {[
                ['login', 'Sign in'],
                ['register', 'Register'],
              ].map(([m, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => reset(m)}
                  className={`flex-1 py-2.5 text-xs uppercase tracking-[0.15em] font-medium transition-colors ${
                    mode === m
                      ? 'bg-coral-500 text-white'
                      : 'text-white/55 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Step indicator for multi-step modes */}
          {(mode === 'register' || mode === 'forgot') && (
            <div className="flex items-center gap-2 mb-6 font-mono text-[0.6rem] tracking-[0.2em] uppercase text-white/40">
              <span className={step === 1 ? 'text-coral-500' : ''}>01 — Email</span>
              <span className="flex-1 h-px bg-white/15" />
              <span className={step === 2 ? 'text-coral-500' : ''}>
                02 — {mode === 'register' ? 'Verify & set up' : 'Reset'}
              </span>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.form
              key={`${mode}-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={
                mode === 'login'
                  ? doLogin
                  : mode === 'register'
                  ? step === 1
                    ? doRegisterRequestOtp
                    : doRegisterVerify
                  : step === 1
                  ? doForgotRequest
                  : doForgotReset
              }
              className="space-y-5"
            >
              {/* ───── LOGIN ───── */}
              {mode === 'login' && (
                <>
                  <div>
                    <div className={labelClass}>
                      <User size={11} /> Username
                    </div>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder="your_username"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <div className={labelClass}>
                      <Lock size={11} /> Password
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => reset('forgot')}
                    className="text-xs text-white/45 hover:text-coral-500 transition-colors"
                  >
                    Forgot username or password?
                  </button>
                </>
              )}

              {/* ───── REGISTER / FORGOT — step 1: email ───── */}
              {(mode === 'register' || mode === 'forgot') && step === 1 && (
                <div>
                  <div className={labelClass}>
                    <Mail size={11} /> Email address
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                  <p className="mt-2 text-[0.7rem] text-white/40 leading-relaxed">
                    {mode === 'register'
                      ? "We'll send a 6-digit code to confirm it's you."
                      : "We'll send a reset code if an account exists for this email."}
                  </p>
                </div>
              )}

              {/* ───── REGISTER — step 2: code + username + password ───── */}
              {mode === 'register' && step === 2 && (
                <>
                  <div>
                    <div className={labelClass}>
                      <KeyRound size={11} /> 6-digit code sent to {email}
                    </div>
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      inputMode="numeric"
                      placeholder="000000"
                      className={`${inputClass} font-mono tracking-[0.5em] text-center text-lg`}
                    />
                  </div>
                  <div>
                    <div className={labelClass}>
                      <User size={11} /> Choose a username
                    </div>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      minLength={3}
                      maxLength={32}
                      pattern="[a-zA-Z0-9_]+"
                      title="Letters, numbers, underscore only"
                      placeholder="your_username"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <div className={labelClass}>
                      <Lock size={11} /> Choose a password
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="At least 6 characters"
                      className={inputClass}
                    />
                  </div>
                </>
              )}

              {/* ───── FORGOT — step 2: code + new password ───── */}
              {mode === 'forgot' && step === 2 && (
                <>
                  <div>
                    <div className={labelClass}>
                      <KeyRound size={11} /> 6-digit code sent to {email}
                    </div>
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      inputMode="numeric"
                      placeholder="000000"
                      className={`${inputClass} font-mono tracking-[0.5em] text-center text-lg`}
                    />
                  </div>
                  <div>
                    <div className={labelClass}>
                      <Lock size={11} /> New password
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="At least 6 characters"
                      className={inputClass}
                    />
                  </div>
                </>
              )}

              {/* messages */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-coral-400 text-xs border-l-2 border-coral-500 pl-3 py-1"
                  >
                    {error}
                  </motion.p>
                )}
                {notice && !error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-white/60 text-xs border-l-2 border-white/30 pl-3 py-1"
                  >
                    {notice}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-premium w-full justify-center disabled:opacity-50"
              >
                {loading
                  ? 'Please wait…'
                  : mode === 'login'
                  ? 'Sign in'
                  : mode === 'register'
                  ? step === 1
                    ? 'Send code'
                    : 'Create account'
                  : step === 1
                  ? 'Send reset code'
                  : 'Reset password'}
                {!loading && <ArrowRight size={14} />}
              </button>

              {/* step-back / mode-switch helpers */}
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => {
                    setStep(1)
                    setError('')
                    setNotice('')
                  }}
                  className="flex items-center gap-1.5 text-xs text-white/45 hover:text-white transition-colors mx-auto"
                >
                  <ArrowLeft size={12} /> Use a different email
                </button>
              )}

              {mode === 'forgot' && step === 1 && (
                <button
                  type="button"
                  onClick={() => reset('login')}
                  className="flex items-center gap-1.5 text-xs text-white/45 hover:text-white transition-colors mx-auto"
                >
                  <ArrowLeft size={12} /> Back to sign in
                </button>
              )}
            </motion.form>
          </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  )
}
