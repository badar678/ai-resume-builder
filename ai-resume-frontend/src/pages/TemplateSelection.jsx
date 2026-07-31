import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import useResumeStore from '../store/resumeStore'
import useSubscriptionStore from '../store/subscriptionStore'
import { getTemplate } from '../components/templates'
import { sampleData } from '../components/templates/sampleData'
import { Eye, Check, Lock, Gem } from 'lucide-react'

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    tag: 'Most Popular',
    tagColor: 'bg-[#EFF6FF] text-[#2563EB]',
    description: 'Clean and professional layout perfect for tech roles',
    plan: 'free',
  },
  {
    id: 'executive',
    name: 'Executive',
    tag: 'Premium',
    tagColor: 'bg-[#FFF7ED] text-[#F97316]',
    description: 'Sophisticated layout for senior and executive roles',
    plan: 'pro',
  },
]

function TemplateCard({ template, onPreview, isSelected, locked, onLockedClick }) {
  const TemplateComponent = getTemplate(template.id)

  return (
    <div className={`bg-white rounded-[12px] border-2 transition-all duration-200 overflow-hidden
      ${isSelected
        ? 'border-[#2563EB] shadow-md'
        : 'border-[#E2E8F0] hover:border-[#2563EB]/50 hover:shadow-md'
      }`}>

      {/* Real Template Preview — scaled down */}
      <div
        className="relative h-56 overflow-hidden cursor-pointer group bg-white"
        onClick={() => onPreview(template)}
      >
        <div
          className="absolute inset-0 origin-top-left pointer-events-none"
          style={{ transform: 'scale(0.38)', width: '263%', height: '263%' }}
        >
          <TemplateComponent data={sampleData} />
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[#2563EB]/80 opacity-0 group-hover:opacity-100
          transition-opacity duration-200 flex items-center justify-center">
          <span className="text-white text-sm font-semibold flex items-center">
            <Eye size={14} className="inline mr-1" />Preview
          </span>
        </div>

        {/* Selected Badge */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-[#2563EB] text-white text-xs
            font-bold px-2 py-0.5 rounded-full z-10">
            <Check size={14} className="inline mr-1" />Selected
          </div>
        )}

        {/* Locked Badge */}
        {locked && (
          <div className="absolute top-2 right-2 bg-[#0F172A]/85 text-white text-xs
            font-bold px-2 py-0.5 rounded-full z-10 flex items-center gap-1">
            <Lock size={12} className="inline mr-1" />Pro
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-[#0F172A] text-sm">{template.name}</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${template.tagColor}`}>
            {template.tag}
          </span>
        </div>
        <p className="text-xs text-[#475569] mb-4">{template.description}</p>

        <div className="flex gap-2">
          {locked ? (
            <Button
              size="sm"
              className="w-full"
              variant="primary"
              onClick={() => onLockedClick(template)}
            >
              <Lock size={12} className="inline mr-1" />Upgrade to Use
            </Button>
          ) : (
            <Button
              size="sm"
              className="w-full"
              variant={isSelected ? 'secondary' : 'primary'}
              onClick={() => onPreview(template)}
            >
              {isSelected ? <><Check size={14} className="inline mr-1" />Selected</> : 'Use This'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TemplateSelection() {
  const navigate = useNavigate()
const updateSection = useResumeStore((s) => s.updateSection)
const resetResume = useResumeStore((s) => s.resetResume)
const currentTemplateId = useResumeStore((s) => s.resumeData.templateId)
const resumeData = useResumeStore((s) => s.resumeData)

  const [previewTemplate, setPreviewTemplate] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')

  const { subscription, fetchSubscription } = useSubscriptionStore()
  const isPro = subscription?.plan === 'pro'

  useEffect(() => {
    fetchSubscription()
  }, [])

  const freeTemplates = TEMPLATES.filter((t) => t.plan === 'free')
  const proTemplates = TEMPLATES.filter((t) => t.plan === 'pro')
  const showFree = activeFilter === 'All' || activeFilter === 'Free'
  const showPro = activeFilter === 'All' || activeFilter === 'Pro'

  // "Upgrade to Use" now sends the user straight to the Pricing page
  // instead of opening the in-page UpgradeModal, so they see the full
  // plan comparison before paying rather than a bare checkout popup.
  const handleLockedClick = () => {
    setPreviewTemplate(null)
    navigate('/pricing')
  }

  const handleUseTemplate = (template) => {
  setPreviewTemplate(null)
  // The Templates page is only ever reached via the Sidebar/BottomNav nav
  // link — a generic entry point with no way to say "I'm intentionally
  // changing the template of my currently-open resume." Because of that,
  // resumeData._id in the store can easily be a *leftover* from an earlier
  // resume you viewed/edited this session, not something the user meant to
  // target here. Trusting it caused "Use This" to silently PUT-overwrite
  // an existing resume instead of creating a new one. Until there's an
  // explicit "Change template" action inside the builder itself that can
  // pass real intent, this page always starts a brand-new resume.
  resetResume()
  updateSection('templateId', template.id)
  navigate('/builder/new')
}

  const PreviewTemplateComponent = previewTemplate ? getTemplate(previewTemplate.id) : null

  return (
    <AppLayout title="Templates">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A]">Choose a Template</h2>
            <p className="text-sm text-[#475569] mt-0.5">
              Select a design that best represents your professional style
            </p>
          </div>
          {currentTemplateId && (() => {
            const currentTemplate = TEMPLATES.find(t => t.id === currentTemplateId)
            const currentLocked = currentTemplate?.plan === 'pro' && !isPro
            return (
              <Button onClick={() => currentLocked ? handleLockedClick(currentTemplate) : handleUseTemplate(currentTemplate)}>
                {currentLocked ? <><Lock size={12} className="inline mr-1" />Upgrade to keep {currentTemplate?.name}</> : `Continue with ${currentTemplate?.name} →`}
              </Button>
            )
          })()}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['All', 'Free', 'Pro'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                transition-all cursor-pointer border
                ${activeFilter === tab
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB]'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Free Templates */}
        {showFree && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#0F172A]">Free</h3>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#10B981]">
                {freeTemplates.length} templates
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {freeTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onPreview={setPreviewTemplate}
                  isSelected={currentTemplateId === template.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pro Templates */}
        {showPro && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#0F172A]">Pro</h3>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#FFF7ED] text-[#F97316]">
                <Gem size={14} className="inline mr-1" />{proTemplates.length} templates
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {proTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onPreview={setPreviewTemplate}
                  isSelected={currentTemplateId === template.id}
                  locked={!isPro}
                  onLockedClick={handleLockedClick}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Preview Modal — full template render */}
      <Modal
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        title={`${previewTemplate?.name} Template`}
      >
        {previewTemplate && PreviewTemplateComponent && (
          <div className="space-y-4">

            {/* Full Template Preview */}
            <div className="relative h-80 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
              <div
                className="absolute inset-0 origin-top-left pointer-events-none"
                style={{ transform: 'scale(0.5)', width: '200%', height: '200%' }}
              >
                <PreviewTemplateComponent data={sampleData} />
              </div>
            </div>

            {/* Template Info */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#0F172A]">{previewTemplate.name}</p>
                <p className="text-sm text-[#475569]">{previewTemplate.description}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${previewTemplate.tagColor}`}>
                {previewTemplate.tag}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPreviewTemplate(null)}
              >
                Cancel
              </Button>
              {previewTemplate.plan === 'pro' && !isPro ? (
                <Button
                  className="flex-1"
                  onClick={() => handleLockedClick(previewTemplate)}
                >
                  <Lock size={12} className="inline mr-1" />Upgrade to Use
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  onClick={() => handleUseTemplate(previewTemplate)}
                >
                  Use This Template →
                </Button>
              )}
            </div>

          </div>
        )}
      </Modal>

    </AppLayout>
  )
}