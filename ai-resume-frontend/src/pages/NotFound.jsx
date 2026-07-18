import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-['Inter']">
      <h1 className="text-8xl font-bold text-[#2563EB]">404</h1>
      <p className="text-2xl font-semibold text-[#0F172A] mt-4">Page Not Found</p>
      <p className="text-[#475569] mt-2 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Button onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </Button>
    </div>
  )
}