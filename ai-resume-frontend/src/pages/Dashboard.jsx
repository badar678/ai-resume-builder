import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import ResumeCard from '../components/ui/ResumeCard'
import ConfirmModal from '../components/ui/ConfirmModal'
import Button from '../components/ui/Button'
import useResumeStore from '../store/resumeStore'
import useSubscriptionStore from '../store/subscriptionStore'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const navigate = useNavigate()
  const {
    allResumes,
    setAllResumes,
    deleteResumeFromList,
    resetResume,
  } = useResumeStore()

  const { subscription, fetchSubscription } = useSubscriptionStore()
  const isPro = subscription?.plan === 'pro'

  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Fetch resumes from backend, fallback to localStorage
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get('/resume')
        setAllResumes(res.data)
      } catch (err) {
        toast.error('Could not load your resumes from the server — showing the last saved copy.')
      } finally {
        setLoading(false)
      }
    }
    fetchResumes()
    fetchSubscription()
  }, [])

  const handleCreate = () => {
    resetResume()
    navigate('/builder/new')
  }

const handleDelete = async () => {
  setDeleteLoading(true)
  try {
    await api.delete(`/resume/${deleteId}`)
    deleteResumeFromList(deleteId)
    toast.success('Resume deleted.')
  } catch (err) {
    // Don't remove it locally and claim success if the backend delete
    // actually failed — it would just reappear on the next fetch, looking
    // like a random bug instead of the real network/server error it is.
    toast.error(err.response?.data?.msg || 'Could not delete resume. Please try again.')
  } finally {
    setDeleteLoading(false)
    setDeleteId(null)
  }
}

  const handleDuplicate = async (id) => {
    try {
      const res = await api.post(`/resume/${id}/duplicate`)
      setAllResumes([res.data, ...allResumes])
      toast.success('Resume duplicated!')
    } catch (err) {
      toast.error('Failed to duplicate resume.')
    }
  }

  return (
    <AppLayout title="Dashboard">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A]">My Resumes</h2>
            <p className="text-sm text-[#475569] mt-0.5">
              {allResumes.length} resume{allResumes.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <Button onClick={handleCreate} size="md">
            + Create New Resume
          </Button>
        </div>

        <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] rounded-[12px] p-5
          flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-white/70 text-xs font-medium uppercase tracking-wider">
              Current Plan
            </p>
            <p className="text-white font-bold text-lg mt-0.5">
              {isPro ? 'Pro Plan' : 'Free Plan'}
            </p>
            <p className="text-white/60 text-xs mt-1">
              {isPro
                ? 'Unlimited resumes • AI suggestions unlocked'
                : `${allResumes.length} of 1 resume used • Upgrade for unlimited resumes`}
            </p>
          </div>
          <button
            onClick={() => navigate('/pricing')}
            className="bg-white text-[#2563EB] text-sm font-semibold px-5 py-2.5
            rounded-xl hover:bg-blue-50 transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            {isPro ? '💎 Manage Plan' : '⚡ Upgrade to Pro'}
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[12px] border border-[#E2E8F0] overflow-hidden animate-pulse">
                <div className="h-44 bg-[#F1F5F9]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-[#F1F5F9] rounded w-3/4" />
                  <div className="h-3 bg-[#F1F5F9] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : allResumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">📄</span>
            </div>
            <h3 className="text-lg font-semibold text-[#0F172A]">No resumes yet</h3>
            <p className="text-sm text-[#475569] mt-1 mb-6">
              Create your first resume and land your dream job!
            </p>
            <Button onClick={handleCreate}>
              + Create Your First Resume
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allResumes.map((resume) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                onDelete={(id) => setDeleteId(id)}
                onDuplicate={handleDuplicate}
              />
            ))}

            <button
              onClick={handleCreate}
              className="h-full min-h-[220px] rounded-[12px] border-2 border-dashed
                border-[#E2E8F0] hover:border-[#2563EB] hover:bg-blue-50/50
                flex flex-col items-center justify-center gap-2
                transition-all duration-200 cursor-pointer group"
            >
              <div className="w-12 h-12 bg-[#F1F5F9] group-hover:bg-[#DBEAFE]
                rounded-full flex items-center justify-center transition-colors">
                <span className="text-2xl">+</span>
              </div>
              <p className="text-sm font-medium text-[#475569] group-hover:text-[#2563EB] transition-colors">
                Create New Resume
              </p>
            </button>
          </div>
        )}

      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Resume"
        message="Are you sure you want to delete this resume? This action cannot be undone."
        confirmText="Delete Resume"
        loading={deleteLoading}
      />

    </AppLayout>
  )
}