import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Target, Sparkles, Palette } from 'lucide-react'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/ats-analyzer', icon: Target, label: 'ATS' },
  { path: '/ai-suggestions', icon: Sparkles, label: 'AI Suggestion' },
  { path: '/templates', icon: Palette, label: 'Templates' },
]

const renderNavIcon = (icon) => {
  if (typeof icon === 'string') {
    return <span className="text-lg leading-none">{icon}</span>
  }

  if (icon) {
    const IconComponent = icon
    return <IconComponent size={18} className="shrink-0" />
  }

  return null
}

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E2E8F0] pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4 gap-1.5 px-2 py-2">

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl transition-all text-[11px] font-medium min-w-0
              ${isActive ? 'text-[#2563EB]' : 'text-[#94A3B8]'}`
            }
          >
            {renderNavIcon(item.icon)}
            <span className="truncate text-center leading-none">{item.label}</span>
          </NavLink>
        ))}

      </div>
    </nav>
  )
}