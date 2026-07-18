import { Link } from 'react-router-dom'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-['Inter']">

      {/* Top Navbar */}
      <nav className="w-full px-6 py-4 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <span className="text-[#0F172A] font-bold text-lg">ResumeAI</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-[#475569]">
            <Link to="/login" className="hover:text-[#2563EB] transition-colors">Login</Link>
            <Link
              to="/register"
              className="bg-[#2563EB] text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-[12px] shadow-sm border border-[#E2E8F0] p-8">

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">R</span>
              </div>
              <h1 className="text-2xl font-bold text-[#0F172A]">{title}</h1>
              {subtitle && (
                <p className="text-[#475569] mt-2 text-sm">{subtitle}</p>
              )}
            </div>

            {/* Page Content */}
            {children}
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-[#94A3B8] mt-6">
            © 2025 ResumeAI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}