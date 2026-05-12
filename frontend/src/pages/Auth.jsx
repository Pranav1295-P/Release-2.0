import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { LogIn, UserPlus, Lock, User } from 'lucide-react'
import PageTransition from '../components/PageTransition.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Auth() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') await login(username, password)
      else await register(username, password)
      navigate('/blogs')
    } catch (err) {
      setError(err?.response?.data?.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <section className="min-h-[70vh] flex items-center py-16">
        <div className="max-w-md w-full mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <span className="section-eyebrow">— Account —</span>
            <h1 className="mt-5 font-display text-4xl md:text-5xl">
              {mode === 'login' ? (
                <><span className="text-white/90">Welcome </span><span className="italic text-gradient-gold">Back</span></>
              ) : (
                <><span className="text-white/90">Create </span><span className="italic text-gradient-gold">Account</span></>
              )}
            </h1>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={submit}
            className="glass rounded-3xl p-8"
          >
            <div className="flex bg-white/5 rounded-full p-1 mb-8">
              {['login', 'register'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`relative flex-1 py-2 text-xs uppercase tracking-wider rounded-full transition-colors ${
                    mode === m ? 'text-ink-950' : 'text-white/60'
                  }`}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="auth-pill"
                      className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
                    />
                  )}
                  <span className="relative">{m === 'login' ? 'Sign in' : 'Register'}</span>
                </button>
              ))}
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="text-xs uppercase tracking-wider text-white/50 mb-2 block flex items-center gap-1.5">
                  <User size={11} /> Username
                </span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  maxLength={32}
                  pattern="[a-zA-Z0-9_]+"
                  title="Letters, numbers, underscore only"
                  placeholder="your_username"
                  className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-gold-500/50 transition-colors text-white placeholder-white/30"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-wider text-white/50 mb-2 block flex items-center gap-1.5">
                  <Lock size={11} /> Password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-gold-500/50 transition-colors text-white placeholder-white/30"
                />
              </label>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-xs mt-4"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button type="submit" disabled={loading} className="btn-premium w-full justify-center mt-6 disabled:opacity-50">
              {mode === 'login' ? <LogIn size={14} /> : <UserPlus size={14} />}
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </motion.form>
        </div>
      </section>
    </PageTransition>
  )
}
