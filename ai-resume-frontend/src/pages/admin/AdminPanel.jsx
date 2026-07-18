import { useState, useEffect } from 'react'
import AppLayout from '../../components/layout/AppLayout'
import Card from '../../components/ui/Card'
import api from '../../services/api'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'users', label: '👥 Users' },
  { id: 'templates', label: '🎨 Templates' },
  { id: 'subscriptions', label: '💳 Subscriptions' },
]

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users')

  const [users, setUsers] = useState([])
  const [templates, setTemplates] = useState([])
  const [overview, setOverview] = useState(null)

  const [loadingUsers, setLoadingUsers] = useState(true)
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  const [loadingOverview, setLoadingOverview] = useState(true)

  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.get('/admin/users')
        setUsers(res.data)
      } catch (err) {
        toast.error('Failed to load users.')
      } finally {
        setLoadingUsers(false)
      }

      try {
        const res = await api.get('/admin/templates')
        setTemplates(res.data)
      } catch (err) {
        toast.error('Failed to load templates.')
      } finally {
        setLoadingTemplates(false)
      }

      try {
        const res = await api.get('/admin/subscriptions')
        setOverview(res.data)
      } catch (err) {
        toast.error('Failed to load subscription overview.')
      } finally {
        setLoadingOverview(false)
      }
    }

    fetchAll()
  }, [])

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase()
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    )
  })

  const maxUsage = Math.max(1, ...templates.map((t) => t.usageCount))

  return (
    <AppLayout title="Admin Panel">
      <div className="max-w-6xl mx-auto space-y-6">

        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">🛡️ Admin Panel</h2>
          <p className="text-sm text-[#475569] mt-0.5">
            Manage users, monitor template usage, and track subscriptions
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-1.5 flex gap-1.5 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer
                ${activeTab === tab.id
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#475569] hover:bg-[#F1F5F9]'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== USERS TAB ===== */}
        {activeTab === 'users' && (
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-[#0F172A]">All Users</h3>
                <p className="text-xs text-[#475569] mt-0.5">{users.length} total</p>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email..."
                className="px-3 py-2 text-sm border border-[#E2E8F0] rounded-xl w-64
                  focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            {loadingUsers ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-[#F1F5F9] rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-sm text-[#475569]">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F8FAFC] text-left text-xs font-semibold text-[#475569] uppercase tracking-wider">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Plan</th>
                      <th className="px-4 py-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC]">
                        <td className="px-4 py-3 font-medium text-[#0F172A]">{u.name}</td>
                        <td className="px-4 py-3 text-[#475569]">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                            ${u.role === 'admin' ? 'bg-purple-50 text-[#7C3AED]' : 'bg-[#F1F5F9] text-[#475569]'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                            ${u.subscriptionPlan === 'pro' ? 'bg-green-50 text-[#10B981]' : 'bg-[#F1F5F9] text-[#475569]'}`}>
                            {u.subscriptionPlan === 'pro' ? 'Pro' : 'Free'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#94A3B8]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* ===== TEMPLATES TAB ===== */}
        {activeTab === 'templates' && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-[#0F172A] mb-1">Template Usage</h3>
            <p className="text-xs text-[#475569] mb-4">How many resumes use each template</p>

            {loadingTemplates ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-[#F1F5F9] rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {templates.map((t) => (
                  <div key={t.id}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium text-[#0F172A]">{t.name}</span>
                      <span className="text-[#475569]">{t.usageCount} resume{t.usageCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2563EB] rounded-full transition-all"
                        style={{ width: `${(t.usageCount / maxUsage) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* ===== SUBSCRIPTIONS TAB ===== */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-4">
            {loadingOverview ? (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-[#F1F5F9] rounded-[12px] animate-pulse" />
                ))}
              </div>
            ) : overview ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <p className="text-xs text-[#475569] font-medium uppercase tracking-wider">Total Users</p>
                    <p className="text-2xl font-bold text-[#0F172A] mt-1">{overview.totalUsers}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs text-[#475569] font-medium uppercase tracking-wider">Pro Users</p>
                    <p className="text-2xl font-bold text-[#10B981] mt-1">{overview.proUsers}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs text-[#475569] font-medium uppercase tracking-wider">Free Users</p>
                    <p className="text-2xl font-bold text-[#0F172A] mt-1">{overview.freeUsers}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs text-[#475569] font-medium uppercase tracking-wider">Est. MRR</p>
                    <p className="text-2xl font-bold text-[#2563EB] mt-1">${overview.estimatedMRR}</p>
                  </Card>
                </div>

                <Card className="overflow-hidden">
                  <div className="p-4 border-b border-[#E2E8F0]">
                    <h3 className="text-sm font-semibold text-[#0F172A]">Recent Pro Subscriptions</h3>
                  </div>

                  {overview.recentSubscriptions.length === 0 ? (
                    <div className="p-8 text-center text-sm text-[#475569]">No Pro subscriptions yet.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-[#F8FAFC] text-left text-xs font-semibold text-[#475569] uppercase tracking-wider">
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Started</th>
                            <th className="px-4 py-3">Expires</th>
                            <th className="px-4 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {overview.recentSubscriptions.map((s) => (
                            <tr key={s._id} className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC]">
                              <td className="px-4 py-3">
                                <p className="font-medium text-[#0F172A]">{s.userId?.name || 'Unknown'}</p>
                                <p className="text-xs text-[#94A3B8]">{s.userId?.email}</p>
                              </td>
                              <td className="px-4 py-3 text-[#475569]">
                                {s.startDate ? new Date(s.startDate).toLocaleDateString() : '—'}
                              </td>
                              <td className="px-4 py-3 text-[#475569]">
                                {s.expiryDate ? new Date(s.expiryDate).toLocaleDateString() : '—'}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                                  ${s.status === 'active' ? 'bg-green-50 text-[#10B981]' : 'bg-red-50 text-[#EF4444]'}`}>
                                  {s.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </>
            ) : (
              <div className="p-12 text-center text-sm text-[#475569]">Failed to load subscription data.</div>
            )}
          </div>
        )}

      </div>
    </AppLayout>
  )
}