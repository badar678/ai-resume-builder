import Sidebar from './Sidebar'
import Navbar from './Navbar'
import BottomNav from './BottomNav'

export default function AppLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Inter']">

      {/* Sidebar - Desktop Only */}
      <Sidebar />

      {/* Main Content - offset by sidebar on desktop */}
      <div className="lg:ml-64 flex flex-col min-h-screen">

        {/* Top Navbar */}
        <Navbar title={title} />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 pb-28 lg:pb-6">
          {children}
        </main>

      </div>

      {/* Bottom Nav - Mobile Only */}
      <BottomNav />

    </div>
  )
}