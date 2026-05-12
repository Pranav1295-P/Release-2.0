import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogIn, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/blogs', label: 'Free-Conversations' },
  { to: '/reports', label: 'Reports' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 4.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-2xl bg-ink-950/70 border-b border-gold-500/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gold-500/30 blur-md group-hover:bg-gold-500/50 transition-all" />
            <div className="relative w-10 h-10 rounded-full border border-gold-500/40 bg-ink-900 flex items-center justify-center font-display text-xl text-gradient-gold">
              P
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="font-display text-lg leading-none text-white">Pranav Murthy</div>
            <div className="text-[0.6rem] tracking-[0.3em] uppercase text-gold-500/70 mt-1">
              Relativity OpenSource
            </div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `relative px-5 py-2 text-sm tracking-wider transition-colors ${
                  isActive ? 'text-gold-400' : 'text-white/70 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute left-1/2 -translate-x-1/2 bottom-0 h-px w-8 bg-gradient-to-r from-transparent via-gold-500 to-transparent"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass">
                <User size={14} className="text-gold-400" />
                <span className="text-xs text-white/80">{user.username}</span>
              </div>
              {user.isAdmin && (
                <Link to="/admin/blog" className="btn-ghost !py-1.5 !px-3 text-xs">
                  Write
                </Link>
              )}
              <button onClick={() => { logout(); navigate('/') }} className="text-white/60 hover:text-gold-400 transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-ghost !py-1.5 !px-4 text-xs">
              <LogIn size={14} />
              <span>Sign in</span>
            </Link>
          )}
        </div>

        <button onClick={() => setOpen(true)} className="lg:hidden text-white">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-ink-950/95 backdrop-blur-xl lg:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-72 bg-ink-900 border-l border-gold-500/20 p-8"
            >
              <button onClick={() => setOpen(false)} className="absolute top-6 right-6 text-white/60">
                <X size={22} />
              </button>
              <div className="mt-12 flex flex-col gap-5">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `text-lg font-display ${isActive ? 'text-gradient-gold' : 'text-white/80'}`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
                <div className="h-px bg-white/10 my-2" />
                {user ? (
                  <>
                    <div className="text-xs text-gold-400">@{user.username}</div>
                    {user.isAdmin && <Link to="/admin/blog" onClick={() => setOpen(false)} className="text-white/80">Write Post</Link>}
                    <button onClick={() => { logout(); setOpen(false); navigate('/') }} className="text-left text-white/80">
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setOpen(false)} className="text-gold-400">
                    Sign in / Register
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
