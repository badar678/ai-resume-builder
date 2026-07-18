import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router doesn't reset scroll position on navigation by default.
// This mounts once at the app root and scrolls to top on every route change
// (e.g. Finish & Save -> PDF Preview, or any other page-to-page navigation).
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}