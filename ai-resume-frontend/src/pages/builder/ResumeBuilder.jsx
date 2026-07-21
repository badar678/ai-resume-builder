import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useResumeStore from '../../store/resumeStore'
import useAuthStore from '../../store/authStore'
import PersonalInfo from './steps/PersonalInfo'
import Summary from './steps/Summary'
import Experience from './steps/Experience'
import Education from './steps/Education'
import Skills from './steps/Skills'
import Projects from './steps/Projects'
import Certifications from './steps/Certifications'
import LivePreview from './LivePreview'
import Button from '../../components/ui/Button'
import api from '../../services/api'
import toast from 'react-hot-toast'

const STEPS = [
  { label: 'Personal Info', icon: '👤', component: PersonalInfo },
  { label: 'Summary', icon: '📝', component: Summary },
  { label: 'Experience', icon: '💼', component: Experience },
  { label: 'Education', icon: '🎓', component: Education },
  { label: 'Skills', icon: '⚡', component: Skills },
  { label: 'Projects', icon: '🚀', component: Projects },
  { label: 'Certifications', icon: '🏆', component: Certifications },
]

function UserMenu() {
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
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#F1F5F9] transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>
        <span className="hidden md:block text-sm font-medium text-[#0F172A]">
          {user?.name || '...'}
        </span>
        <span className="text-[#94A3B8] text-xs">▾</span>
      </button>

      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 top-12 w-52 bg-white rounded-[12px] shadow-lg border border-[#E2E8F0] z-20 overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E2E8F0]">
              <p className="text-sm font-semibold text-[#0F172A]">
                {user?.name || '...'}
              </p>
              <p className="text-xs text-[#94A3B8] truncate">
                {user?.email || '...'}
              </p>
            </div>
            <div className="p-2">
              <button
                onClick={() => { setDropdownOpen(false); handleLogout() }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#EF4444]
                  hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function ResumeBuilder() {
  const { resumeId } = useParams()
  const navigate = useNavigate()

  const {
    currentStep,
    setCurrentStep,
    resumeData,
    isSaving,
    setIsSaving,
    saveResumeToList,
    resetResume,
    loadResumeById,
    updateSection,
  } = useResumeStore()

  const [previewOpen, setPreviewOpen] = useState(false)
  const StepComponent = STEPS[currentStep].component

  // Load correct resume when entering builder
  useEffect(() => {
    if (resumeId === 'new') {
      // Only reset if the store is still holding a *previously loaded*
      // resume (has an _id). TemplateSelection already prepares a fresh,
      // unsaved resume (resetResume + templateId) before navigating here —
      // resetting again would wipe out the templateId the user just picked
      // and the Live Preview would silently fall back to "Modern".
      if (useResumeStore.getState().resumeData._id) {
        resetResume()
      }
    } else {
      loadResumeById(resumeId)
    }
  }, [resumeId])

  // Auto save to backend + local cache
  useEffect(() => {
    if (resumeId === 'new') return
    const timer = setTimeout(async () => {
      setIsSaving(true)
      try {
        await api.put(`/resume/${resumeId}`, resumeData)
        saveResumeToList()
      } catch (err) {
        toast.error('Auto-save failed — check your connection.')
      } finally {
        setIsSaving(false)
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [resumeData])

  // In handleNext — replace the finally block toast:
const handleNext = async () => {
  if (currentStep < STEPS.length - 1) {
    setCurrentStep(currentStep + 1)
    return
  }

  setIsSaving(true)
  try {
    if (resumeId === 'new') {
      const res = await api.post('/resume', resumeData)
      saveResumeToList(res.data)
      toast.success('Resume saved!')
      navigate(`/preview/${res.data._id}`)
    } else {
      await api.put(`/resume/${resumeId}`, resumeData)
      saveResumeToList()
      toast.success('Resume saved!')
      navigate(`/preview/${resumeId}`)
    }
  } catch (err) {
    // Don't silently fabricate a fake local resume and pretend it saved —
    // that's what was causing resumes to "disappear" from the Dashboard
    // count after a failed save. Tell the user it actually failed instead.
    const message = err.response?.data?.msg || 'Could not reach the server. Your changes were not saved.'
    toast.error(message)
  } finally {
    setIsSaving(false)
  }
}

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-['Inter']">

      {/* Top Navbar */}
      <div className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">

        {/* Left — Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-[#0F172A] text-lg">ResumeAI</span>
        </div>

        {/* Center — Resume Title */}
        <p className="hidden sm:block text-sm font-medium text-[#475569] absolute left-1/2 -translate-x-1/2">
          {resumeData.title || 'Resume Builder'}
        </p>

        {/* Right — Actions + User */}
        <div className="flex items-center gap-3">
          {isSaving && (
            <span className="text-xs text-[#94A3B8]">💾 Saving...</span>
          )}
          <UserMenu />
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        {/* Resume Title Input */}
        <div className="mb-4">
          <input
            type="text"
            value={resumeData.title}
            onChange={(e) => updateSection('title', e.target.value)}
            placeholder="Give your resume a title e.g. Software Engineer Resume"
            className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm
              font-medium text-[#0F172A] placeholder-[#94A3B8] outline-none
              focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white"
          />
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-[#475569]">
              Step {currentStep + 1} of {STEPS.length} — {STEPS[currentStep].label}
            </p>
            <div className="flex items-center gap-2">
              {isSaving && (
                <span className="text-xs text-[#94A3B8]">💾 Saving...</span>
              )}
              {/* Mobile Preview Toggle */}
              <button
                onClick={() => setPreviewOpen(!previewOpen)}
                className="lg:hidden text-xs bg-[#EFF6FF] text-[#2563EB] px-3 py-1.5
                  rounded-lg font-medium cursor-pointer"
              >
                {previewOpen ? '✏️ Edit' : '👁️ Preview'}
              </button>
            </div>
          </div>
          {/* Progress Track */}
          <div className="w-full bg-[#E2E8F0] rounded-full h-2">
            <div
              className="bg-[#2563EB] h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {STEPS.map((step, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs
                font-medium whitespace-nowrap transition-all cursor-pointer shrink-0
                ${index === currentStep
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : index < currentStep
                  ? 'bg-[#DBEAFE] text-[#2563EB]'
                  : 'bg-white text-[#94A3B8] border border-[#E2E8F0]'
                }`}
            >
              <span>{step.icon}</span>
              <span>{step.label}</span>
              {index < currentStep && <span>✓</span>}
            </button>
          ))}
        </div>

        {/* Main Layout — Form + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left — Step Form */}
          <div className={`${previewOpen ? 'hidden' : 'block'} lg:block`}>
            <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-6 shadow-sm">
              <StepComponent />

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-5 border-t border-[#E2E8F0]">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  ← Back
                </Button>
                <Button onClick={handleNext}>
                  {currentStep === STEPS.length - 1 ? '🎉 Finish & Save' : 'Next →'}
                </Button>
              </div>
            </div>
          </div>

          {/* Right — Live Preview */}
          <div className={`${previewOpen ? 'block' : 'hidden'} lg:block lg:sticky lg:top-24 lg:self-start`}>
            <LivePreview />
          </div>

        </div>
      </div>
    </div>
  )
}