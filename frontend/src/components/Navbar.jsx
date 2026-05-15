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
      transition={{ delay: 3.0, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-xl bg-black/80 border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="font-display font-bold text-xl text-white tracking-tighter leading-none">
            PRANAV<span className="text-coral-500">.COM</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `relative font-sans text-xs font-medium tracking-[0.15em] uppercase transition-colors ${
                  isActive ? 'text-coral-500' : 'text-white/65 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute left-0 right-0 -bottom-1.5 h-px bg-coral-500"
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
              <Link to="/blogs" className="flex items-center gap-2 px-3 py-1.5 border border-white/15 hover:border-coral-500 transition-colors">
                <User size={12} className="text-coral-500" />
                <span className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-white/80">{user.username}</span>
              </Link>
              <button onClick={() => { logout(); navigate('/') }} className="text-white/50 hover:text-coral-500 transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-premium !py-1.5 !px-4 !text-[0.65rem]">
              <LogIn size={12} />
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
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl lg:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-72 bg-black border-l border-white/10 p-8"
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
                      `font-display font-bold text-3xl tracking-tighter ${isActive ? 'text-coral-500' : 'text-white'}`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
                <div className="h-px bg-white/10 my-2" />
                {user ? (
                  <>
                    <div className="font-mono text-xs text-coral-500 uppercase tracking-widest">@{user.username}</div>
                    <button onClick={() => { logout(); setOpen(false); navigate('/') }} className="text-left text-white">
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setOpen(false)} className="text-coral-500 font-semibold">
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
