import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'
import Logo from '../ui/Logo'
import { LayoutDashboard, Target, Sparkles, Palette, Gem, LogOut, ShieldCheck } from 'lucide-react'

const renderNavIcon = (icon) => {
  if (typeof icon === 'string') {
    return <span className="text-base leading-none">{icon}</span>
  }

  if (icon) {
    const IconComponent = icon
    return <IconComponent size={18} className="shrink-0" />
  }

  return null
}

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/ats-analyzer', icon: Target, label: 'ATS Analyzer' },
  { path: '/ai-suggestions', icon: Sparkles, label: 'AI Suggestions' },
  { path: '/templates', icon: Palette, label: 'Templates' },
  { path: '/pricing', icon: Gem, label: 'Pricing' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === 'admin'

  const handleLogout = () => {
  logout()
  toast.success('Logged out successfully.')
  navigate('/login')
}

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#0F172A] text-white fixed left-0 top-0 z-40">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Logo iconSize={36} showText={false} />
          <div>
            <p className="font-bold text-white text-base leading-tight">ResumeAI</p>
            <p className="text-white/40 text-xs">Resume Builder</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <p className="text-white/30 text-xs font-semibold uppercase tracking-wider px-3 mb-3">
          Main Menu
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-[#2563EB] text-white'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {renderNavIcon(item.icon)}
            {item.label}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <p className="text-white/30 text-xs font-semibold uppercase tracking-wider px-3 mb-3 mt-6">
              Admin
            </p>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-[#7C3AED] text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <ShieldCheck size={18} className="shrink-0" />
              Admin Panel
            </NavLink>
          </>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="px-4 py-6 border-t border-white/10 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer"
        >
          <LogOut size={18} className="shrink-0" />
          Logout
        </button>
      </div>

    </aside>
  )
}