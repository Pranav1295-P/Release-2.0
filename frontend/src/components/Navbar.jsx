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
      transition={{ delay: 4.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-2xl bg-ink-950/70 border-b border-cream-200/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-sm border border-lime-400/40 bg-ink-900 flex items-center justify-center font-display italic text-2xl text-lime-400 leading-none">
              P
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="font-display italic text-lg leading-none text-cream-50">Pranav Murthy</div>
            <div className="font-mono text-[0.55rem] tracking-[0.3em] uppercase text-lime-400/80 mt-1">
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
                `relative px-5 py-2 text-sm font-sans tracking-wide transition-colors ${
                  isActive ? 'text-lime-400' : 'text-cream-100/70 hover:text-cream-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-px w-8 bg-lime-400"
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
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cream-200/10 bg-cream-50/[0.02]">
                <User size={14} className="text-lime-400" />
                <span className="font-sans text-xs text-cream-100/80">{user.username}</span>
              </div>
              {user.isAdmin && (
                <Link to="/admin/blog" className="btn-ghost !py-1.5 !px-3 text-xs">
                  Write
                </Link>
              )}
              <button onClick={() => { logout(); navigate('/') }} className="text-cream-100/60 hover:text-lime-400 transition-colors">
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

        <button onClick={() => setOpen(true)} className="lg:hidden text-cream-50">
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
              className="absolute right-0 top-0 h-full w-72 bg-ink-900 border-l border-cream-200/10 p-8"
            >
              <button onClick={() => setOpen(false)} className="absolute top-6 right-6 text-cream-100/60">
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
                      `font-display text-2xl ${isActive ? 'italic text-lime-400' : 'text-cream-50'}`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
                <div className="h-px bg-cream-200/10 my-2" />
                {user ? (
                  <>
                    <div className="font-mono text-xs text-lime-400">@{user.username}</div>
                    {user.isAdmin && <Link to="/admin/blog" onClick={() => setOpen(false)} className="text-cream-50">Write Post</Link>}
                    <button onClick={() => { logout(); setOpen(false); navigate('/') }} className="text-left text-cream-50">
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setOpen(false)} className="text-lime-400">
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
