import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import Button from '../components/ui/Button'
import useResumeStore from '../store/resumeStore'
import useSubscriptionStore from '../store/subscriptionStore'
import api from '../services/api'
import toast from 'react-hot-toast'
import { getTemplate } from '../components/templates'

function ScoreRing({ score }) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444'
  const label = score >= 70 ? 'Great' : score >= 40 ? 'Fair' : 'Needs Work'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius}
            fill="none" stroke="#E2E8F0" strokeWidth="10" />
          <circle cx="50" cy="50" r={radius}
            fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[#0F172A]">{score}%</span>
          <span className="text-xs font-medium" style={{ color }}>{label}</span>
        </div>
      </div>
    </div>
  )
}

export default function PDFPreview() {
  const navigate = useNavigate()
  const { resumeId } = useParams()
  const resumeData = useResumeStore((s) => s.resumeData)
  const allResumes = useResumeStore((s) => s.allResumes)
  const { personalInfo, summary, experience, education, skills, projects, certifications } = resumeData
  const [downloading, setDownloading] = useState(false)

  const { subscription, fetchSubscription } = useSubscriptionStore()
  const isPro = subscription?.plan === 'pro'
  const TemplateComponent = getTemplate(resumeData.templateId)

  useEffect(() => {
    fetchSubscription()
  }, [])

  // Mock ATS score based on filled sections
  const filledSections = [
    personalInfo.fullName,
    summary,
    experience.length > 0,
    education.length > 0,
    skills.length > 0,
  ].filter(Boolean).length
  const atsScore = Math.min(Math.round((filledSections / 5) * 100), 95)

  const handleDownload = async () => {
  if (!isPro && allResumes.length > 1) {
    toast.error('Free plan allows only 1 resume. Upgrade to Pro to download unlimited resumes.')
    navigate('/pricing')
    return
  }
  setDownloading(true)
  const toastId = toast.loading('Generating PDF...')
  try {
    const response = await api.post(
      '/generate-pdf',
      { resumeId },
      { responseType: 'blob' }
    )
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${resumeData.title || 'resume'}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    toast.success('PDF downloaded!', { id: toastId })
  } catch (err) {
    let message = 'PDF download failed.'
    if (err.response?.data instanceof Blob) {
      try {
        const text = await err.response.data.text()
        const parsed = JSON.parse(text)
        message = parsed.msg || message
      } catch {}
    }
    toast.error(message, { id: toastId })
  } finally {
    setDownloading(false)
  }
}

  const scoreItems = [
    { label: 'Personal Info', done: !!personalInfo.fullName },
    { label: 'Summary', done: !!summary },
    { label: 'Experience', done: experience.length > 0 },
    { label: 'Education', done: education.length > 0 },
    { label: 'Skills', done: skills.length > 0 },
    { label: 'Projects', done: projects.length > 0 },
    { label: 'Certifications', done: certifications.length > 0 },
  ]

  return (
    <AppLayout title="PDF Preview">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A]">Resume Preview</h2>
            <p className="text-sm text-[#475569] mt-0.5">
              Review your resume before downloading
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(`/builder/${resumeId}`)}
            >
              ✏️ Edit Resume
            </Button>
            <Button onClick={handleDownload} disabled={downloading}>
              {downloading ? '⏳ Generating...' : '⬇️ Download PDF'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — ATS Score + Checklist */}
          <div className="space-y-4">

            {/* ATS Score Card */}
            <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-6 text-center space-y-4">
              <h3 className="font-semibold text-[#0F172A]">ATS Score</h3>
              <ScoreRing score={atsScore} />
              <p className="text-xs text-[#475569]">
                {atsScore >= 70
                  ? '🎉 Your resume is well-optimized for ATS systems!'
                  : atsScore >= 40
                  ? '⚠️ Fill in more sections to improve your score.'
                  : '❌ Complete more sections to pass ATS filters.'}
              </p>
            </div>

            {/* Completion Checklist */}
            <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-5 space-y-3">
              <h3 className="font-semibold text-[#0F172A] text-sm">Resume Checklist</h3>
              {scoreItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0
                    ${item.done ? 'bg-[#10B981]' : 'bg-[#E2E8F0]'}`}>
                    {item.done
                      ? <span className="text-white text-xs">✓</span>
                      : <span className="text-[#94A3B8] text-xs">○</span>}
                  </div>
                  <span className={`text-sm ${item.done ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>
                    {item.label}
                  </span>
                  {!item.done && (
                    <button
                      onClick={() => navigate(`/builder/${resumeId}`)}
                      className="ml-auto text-xs text-[#2563EB] hover:underline cursor-pointer"
                    >
                      Add
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Tips Card */}
            <div className="bg-blue-50 border border-blue-100 rounded-[12px] p-4 space-y-2">
              <p className="text-xs font-semibold text-[#2563EB]">💡 Boost your ATS Score</p>
              <ul className="text-xs text-[#475569] space-y-1">
                <li>• Add relevant keywords from job descriptions</li>
                <li>• Keep formatting simple and clean</li>
                <li>• Include measurable achievements</li>
                <li>• Use standard section headings</li>
              </ul>
            </div>

          </div>

          {/* Right — Resume Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-sm overflow-hidden">

              {/* Preview Toolbar */}
              <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]
                flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                </div>
                <span className="text-xs text-[#94A3B8]">
                  {resumeData.title || 'Resume'}.pdf
                </span>
                <Button size="sm" onClick={handleDownload} disabled={downloading}>
                  ⬇️ Download
                </Button>
              </div>

              {/* Resume Content — renders the actual selected template, same as
                  LivePreview and the backend PDF generator, so this preview
                  matches what gets downloaded */}
              <div className="overflow-y-auto max-h-[75vh]">
                {!personalInfo.fullName ? (
                  <div className="text-center py-16 text-[#94A3B8]">
                    <p className="text-4xl mb-3">📄</p>
                    <p className="font-medium">No resume data yet</p>
                    <p className="text-xs mt-1">Go back to the builder and fill in your details</p>
                    <button
                      onClick={() => navigate(`/builder/${resumeId}`)}
                      className="mt-4 text-sm text-[#2563EB] hover:underline cursor-pointer"
                    >
                      ← Go to Builder
                    </button>
                  </div>
                ) : (
                  <TemplateComponent data={resumeData} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}