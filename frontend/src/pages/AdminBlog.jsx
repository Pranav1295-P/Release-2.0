import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * The old admin-only composer page is retired — Free-Conversations now has an
 * inline composer that any signed-in user can use. This route just redirects
 * to the feed so old links/bookmarks still work.
 */
export default function AdminBlog() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('/blogs', { replace: true })
  }, [navigate])
  return null
}
