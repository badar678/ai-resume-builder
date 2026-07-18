import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/dashboard', icon: '🏠', label: 'Home' },
  { path: '/ats-analyzer', icon: '🎯', label: 'ATS' },
  { path: '/ai-suggestions', icon: '✨', label: 'AI Suggestion' },
  { path: '/templates', icon: '🎨', label: 'Templates' },
]

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
            <span className="text-lg leading-none">{item.icon}</span>
            <span className="truncate text-center leading-none">{item.label}</span>
          </NavLink>
        ))}

      </div>
    </nav>
  )
}