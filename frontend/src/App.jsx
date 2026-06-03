import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import IntroOverlay from './components/IntroOverlay.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Projects from './pages/Projects.jsx'
import Blogs from './pages/Blogs.jsx'
import BlogDetail from './pages/BlogDetail.jsx'
import Reports from './pages/Reports.jsx'
import Auth from './pages/Auth.jsx'
import AdminBlog from './pages/AdminBlog.jsx'
import Verify from './pages/Verify.jsx'

export default function App() {
  const location = useLocation()
  const [introDone, setIntroDone] = useState(false)

  useEffect(() => {
    // Allow intro to play only on first load of a session
    const seen = sessionStorage.getItem('intro-seen')
    if (seen) setIntroDone(true)
  }, [])

  const finishIntro = () => {
    sessionStorage.setItem('intro-seen', '1')
    setIntroDone(true)
  }

  return (
    <>
      <div className="aurora" />
      <div className="noise" />

      <AnimatePresence mode="wait">
        {!introDone && <IntroOverlay key="intro" onDone={finishIntro} />}
      </AnimatePresence>

      <Navbar />
      <main className="relative z-10 pt-24">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  )
}
