import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

export default function Navbar({ title = 'Dashboard' }) {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
  logout()
  toast.success('Logged out successfully.')
  navigate('/login')
}

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">

      {/* Left — Page Title */}
      <div className="flex items-center gap-3">
        {/* Mobile Logo */}
        <div className="flex lg:hidden items-center gap-2">
          <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-[#0F172A] text-base">ResumeAI</span>
        </div>
        {/* Desktop Page Title */}
        <h1 className="hidden lg:block text-lg font-semibold text-[#0F172A]">
          {title}
        </h1>
      </div>

      {/* Right — User Menu */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#F1F5F9] transition-colors cursor-pointer"
        >
          {/* Avatar */}
          <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          {/* Name */}
          <span className="hidden md:block text-sm font-medium text-[#0F172A]">
            {user?.name || '...'}
          </span>
          <span className="text-[#94A3B8] text-xs">▾</span>
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 top-12 w-56 bg-white rounded-[12px] shadow-lg border border-[#E2E8F0] z-20 overflow-hidden">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-[#E2E8F0]">
                <p className="text-sm font-semibold text-[#0F172A]">
                  {user?.name || '...'}
                </p>
                <p className="text-xs text-[#94A3B8] truncate">
                  {user?.email || '...'}
                </p>
              </div>
              {/* Menu Items */}
              <div className="p-2">
                {/* Mobile only — desktop already has Pricing in the sidebar */}
                <button
                  onClick={() => { setDropdownOpen(false); navigate('/pricing') }}
                  className="lg:hidden w-full flex items-center gap-2 px-3 py-2 text-sm text-[#0F172A]
                    whitespace-nowrap hover:bg-[#F1F5F9] rounded-xl transition-colors cursor-pointer"
                >
                  <span className="w-4 text-center shrink-0">💎</span>
                  <span>Manage Plan</span>
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); handleLogout() }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#EF4444]
                    whitespace-nowrap hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  <span className="w-4 text-center shrink-0">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

    </header>
  )
}