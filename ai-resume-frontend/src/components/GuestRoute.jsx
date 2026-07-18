// This prevents logged-in users from going back to login/register pages.
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function GuestRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}