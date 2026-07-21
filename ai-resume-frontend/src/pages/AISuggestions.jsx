import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import Button from '../components/ui/Button'
import api from '../services/api'
import useSubscriptionStore from '../store/subscriptionStore'
import toast from 'react-hot-toast'

const SECTIONS = [
  { id: 'experience', label: '💼 Experience' },
  { id: 'projects', label: '📁 Projects' },
]

export default function AISuggestions() {
  const navigate = useNavigate()
  const [resumes, setResumes] = useState([])
  const [selectedResume, setSelectedResume] = useState(null)
  const [selectedTone, setSelectedTone] = useState('professional')
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [improving, setImproving] = useState(null) // key of item being improved
  const [results, setResults] = useState({}) // { "exp-0": improvedText, "proj-0": improvedText }
  const [activeSection, setActiveSection] = useState('experience')
  const [activeExpIndex, setActiveExpIndex] = useState(0)
  const [activeProjIndex, setActiveProjIndex] = useState(0)

  const { subscription, fetchSubscription } = useSubscriptionStore()
  const isPro = subscription?.plan === 'pro'

  useEffect(() => {
    fetchSubscription()
  }, [])

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get('/resume')
        setResumes(res.data)
        if (res.data.length > 0) setSelectedResume(res.data[0])
      } catch (err) {
        toast.error('Failed to load resumes.')
      } finally {
        setLoadingResumes(false)
      }
    }
    fetchResumes()
  }, [])

  const handleImprove = async (text, key) => {
    if (!isPro) {
      toast.error('AI Suggestions is a Pro feature. Upgrade to unlock it.')
      navigate('/pricing')
      return
    }
    if (!text?.trim()) {
      toast.error('No description to improve.')
      return
    }
    setImproving(key)
    const toastId = toast.loading('AI is improving your text...')
    try {
      const res = await api.post('/ai/improve', { text, tone: selectedTone })
      setResults((prev) => ({ ...prev, [key]: res.data.improved }))
      toast.success('Improved!', { id: toastId })
    } catch (err) {
      toast.error(err.response?.data?.msg || 'AI failed. Try again.', { id: toastId })
    } finally {
      setImproving(null)
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const handleApplyExperience = async (expIndex, improvedText) => {
    if (!selectedResume) return
    const updated = { ...selectedResume }
    updated.experience = [...(selectedResume.experience || [])]
    updated.experience[expIndex] = {
      ...updated.experience[expIndex],
      description: improvedText,
    }
    try {
      await api.put(`/resume/${selectedResume._id}`, updated)
      setSelectedResume(updated)
      setResumes((prev) => prev.map((r) => r._id === updated._id ? updated : r))
      toast.success('Applied to resume!')
    } catch (err) {
      toast.error('Failed to save. Try again.')
    }
  }

  const handleApplyProject = async (projIndex, improvedText) => {
    if (!selectedResume) return
    const updated = { ...selectedResume }
    updated.projects = [...(selectedResume.projects || [])]
    updated.projects[projIndex] = {
      ...updated.projects[projIndex],
      description: improvedText,
    }
    try {
      await api.put(`/resume/${selectedResume._id}`, updated)
      setSelectedResume(updated)
      setResumes((prev) => prev.map((r) => r._id === updated._id ? updated : r))
      toast.success('Applied to resume!')
    } catch (err) {
      toast.error('Failed to save. Try again.')
    }
  }

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId)
    setResults({})
  }

  return (
    <AppLayout title="AI Suggestions">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">✨ AI Suggestions</h2>
          <p className="text-sm text-[#475569] mt-0.5">
            Let AI rewrite your resume content to be more impactful and ATS-friendly
          </p>
        </div>

        {/* Info Banner */}
        {isPro ? (
          <div className="bg-gradient-to-r from-[#7C3AED]/10 to-[#2563EB]/10 border border-purple-100 rounded-[12px] p-4 flex gap-3">
            <span className="text-xl shrink-0">🤖</span>
            <div>
              <p className="text-sm font-semibold text-[#7C3AED]">Powered by Llama 3.3</p>
              <p className="text-xs text-[#475569] mt-0.5">
                Our AI rewrites your descriptions using proven resume writing techniques —
                strong action verbs, specific impact, and ATS-friendly language.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-[#7C3AED]/10 to-[#2563EB]/10 border border-purple-100 rounded-[12px] p-4 flex items-center justify-between gap-3">
            <div className="flex gap-3">
              <span className="text-xl shrink-0">🔒</span>
              <div>
                <p className="text-sm font-semibold text-[#7C3AED]">AI Suggestions is a Pro feature</p>
                <p className="text-xs text-[#475569] mt-0.5">
                  Upgrade to Pro to let AI rewrite your bullets and project descriptions.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/pricing')}
              className="bg-[#7C3AED] text-white text-xs font-semibold px-4 py-2
                rounded-xl hover:bg-purple-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              💎 Upgrade
            </button>
          </div>
        )}

        {/* Section Switcher */}
        <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-1.5 flex gap-1.5 w-fit">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionChange(section.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer
                ${activeSection === section.id
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#475569] hover:bg-[#F1F5F9]'
                }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Controls */}
          <div className="space-y-4">

            {/* Resume Selector */}
            <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-4 space-y-3">
              <h3 className="text-sm font-semibold text-[#0F172A]">Select Resume</h3>
              {loadingResumes ? (
                <div className="space-y-2">
                  {[1, 2].map(i => (
                    <div key={i} className="h-10 bg-[#F1F5F9] rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : resumes.length === 0 ? (
                <div className="text-center py-3">
                  <p className="text-xs text-[#475569]">No resumes found.</p>
                  <button
                    onClick={() => navigate('/builder/new')}
                    className="text-xs text-[#2563EB] hover:underline mt-1 cursor-pointer"
                  >
                    Create one →
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {resumes.map((resume) => (
                    <button
                      key={resume._id}
                      onClick={() => { setSelectedResume(resume); setResults({}) }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm
                        transition-all cursor-pointer
                        ${selectedResume?._id === resume._id
                          ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-medium'
                          : 'border-[#E2E8F0] text-[#475569] hover:border-[#2563EB]/50'
                        }`}
                    >
                      {resume.title || 'Untitled Resume'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-purple-50 border border-purple-100 rounded-[12px] p-4 space-y-2">
              <p className="text-xs font-semibold text-[#7C3AED]">💡 How to use</p>
              <ul className="text-xs text-[#475569] space-y-1">
                <li>1. Pick Experience or Projects</li>
                <li>2. Select your resume</li>
                <li>3. Click ✨ Improve</li>
                <li>4. Apply or copy to your resume</li>
              </ul>
            </div>

          </div>

          {/* Right — Content */}
          <div className="lg:col-span-2 space-y-4">

            {!selectedResume && (
              <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-12 text-center">
                <span className="text-4xl">✨</span>
                <p className="text-lg font-semibold text-[#0F172A] mt-3">Select a resume</p>
                <p className="text-sm text-[#475569] mt-1">Choose a resume from the left to get AI suggestions</p>
              </div>
            )}

            {/* ===== EXPERIENCE SECTION ===== */}
            {selectedResume && activeSection === 'experience' && (selectedResume.experience || []).length === 0 && (
              <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-12 text-center">
                <span className="text-4xl">💼</span>
                <p className="text-lg font-semibold text-[#0F172A] mt-3">No experience entries</p>
                <p className="text-sm text-[#475569] mt-1 mb-4">Add work experience to your resume first</p>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/builder/${selectedResume._id}`)}
                >
                  Add Experience →
                </Button>
              </div>
            )}

            {selectedResume && activeSection === 'experience' && (selectedResume.experience || []).length > 0 && (
              <div className="space-y-4">

                {/* Experience Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {selectedResume.experience.map((exp, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveExpIndex(i)}
                      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium
                        whitespace-nowrap transition-all cursor-pointer border
                        ${activeExpIndex === i
                          ? 'bg-[#2563EB] text-white border-[#2563EB]'
                          : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#2563EB]'
                        }`}
                    >
                      {exp.jobTitle || `Job ${i + 1}`}
                    </button>
                  ))}
                </div>

                {/* Active Experience */}
                {selectedResume.experience.map((exp, expIndex) => {
                  if (expIndex !== activeExpIndex) return null
                  const bullets = (exp.description || '').split('\n').filter(b => b.trim())
                  const key = `exp-${expIndex}`

                  return (
                    <div key={expIndex} className="space-y-4">

                      {/* Job Header */}
                      <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-[#0F172A]">{exp.jobTitle}</p>
                            <p className="text-sm text-[#2563EB]">{exp.company}</p>
                            <p className="text-xs text-[#94A3B8]">
                              {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleImprove(exp.description, key)}
                            disabled={improving === key}
                          >
                            {improving === key ? '⏳ Improving...' : '✨ Improve All'}
                          </Button>
                        </div>
                      </div>

                      {/* Original Bullets */}
                      <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-4 space-y-3">
                        <h4 className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
                          Original Description
                        </h4>
                        {bullets.length > 0 ? (
                          <div className="space-y-2">
                            {bullets.map((bullet, bi) => (
                              <div key={bi} className="flex items-start gap-2 p-3 bg-[#F8FAFC] rounded-xl">
                                <span className="text-[#94A3B8] mt-0.5 shrink-0">•</span>
                                <p className="text-sm text-[#475569] flex-1">{bullet.replace(/^[•\-\*]\s*/, '')}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-[#94A3B8] italic">No description added yet.</p>
                        )}
                      </div>

                      {/* AI Improved Result */}
                      {results[key] && (
                        <div className="bg-white rounded-[12px] border-2 border-[#7C3AED] p-4 space-y-3">
                          <h4 className="text-xs font-semibold text-[#7C3AED] uppercase tracking-wider">
                            ✨ AI Improved Version
                          </h4>


                          <div className="space-y-2">
                            {results[key].split('\n').filter(b => b.trim()).map((bullet, bi) => (
                              <div key={bi} className="flex items-start gap-2 p-3 bg-purple-50 rounded-xl">
                                <span className="text-[#7C3AED] mt-0.5 shrink-0">•</span>
                                <p className="text-sm text-[#0F172A] flex-1">{bullet.replace(/^[•\-\*]\s*/, '')}</p>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2 pt-1">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => handleApplyExperience(expIndex, results[key])}
                            >
                              ✅ Apply to Resume
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleCopy(results[key])}
                            >
                              📋 Copy
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleImprove(exp.description, key)}
                              disabled={improving === key}
                            >
                              🔄 Retry
                            </Button>
                          </div>
                        </div>
                      )}

                    </div>
                  )
                })}

              </div>
            )}

            {/* ===== PROJECTS SECTION ===== */}
            {selectedResume && activeSection === 'projects' && (selectedResume.projects || []).length === 0 && (
              <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-12 text-center">
                <span className="text-4xl">📁</span>
                <p className="text-lg font-semibold text-[#0F172A] mt-3">No project entries</p>
                <p className="text-sm text-[#475569] mt-1 mb-4">Add a project to your resume first</p>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/builder/${selectedResume._id}`)}
                >
                  Add Project →
                </Button>
              </div>
            )}

            {selectedResume && activeSection === 'projects' && (selectedResume.projects || []).length > 0 && (
              <div className="space-y-4">

                {/* Project Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {selectedResume.projects.map((proj, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveProjIndex(i)}
                      className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium
                        whitespace-nowrap transition-all cursor-pointer border
                        ${activeProjIndex === i
                          ? 'bg-[#2563EB] text-white border-[#2563EB]'
                          : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#2563EB]'
                        }`}
                    >
                      {proj.name || `Project ${i + 1}`}
                    </button>
                  ))}
                </div>

                {/* Active Project */}
                {selectedResume.projects.map((proj, projIndex) => {
                  if (projIndex !== activeProjIndex) return null
                  const bullets = (proj.description || '').split('\n').filter(b => b.trim())
                  const key = `proj-${projIndex}`

                  return (
                    <div key={projIndex} className="space-y-4">

                      {/* Project Header */}
                      <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-[#0F172A]">{proj.name}</p>
                            {proj.tech && <p className="text-sm text-[#2563EB]">{proj.tech}</p>}
                            {proj.link && (
                              <p className="text-xs text-[#94A3B8] truncate max-w-xs">{proj.link}</p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleImprove(proj.description, key)}
                            disabled={improving === key}
                          >
                            {improving === key ? '⏳ Improving...' : '✨ Improve All'}
                          </Button>
                        </div>
                      </div>

                      {/* Original Description */}
                      <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-4 space-y-3">
                        <h4 className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
                          Original Description
                        </h4>
                        {bullets.length > 0 ? (
                          <div className="space-y-2">
                            {bullets.map((bullet, bi) => (
                              <div key={bi} className="flex items-start gap-2 p-3 bg-[#F8FAFC] rounded-xl">
                                <span className="text-[#94A3B8] mt-0.5 shrink-0">•</span>
                                <p className="text-sm text-[#475569] flex-1">{bullet.replace(/^[•\-\*]\s*/, '')}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-[#94A3B8] italic">No description added yet.</p>
                        )}
                      </div>

                      {/* AI Improved Result */}
                      {results[key] && (
                        <div className="bg-white rounded-[12px] border-2 border-[#7C3AED] p-4 space-y-3">
                          <h4 className="text-xs font-semibold text-[#7C3AED] uppercase tracking-wider">
                            ✨ AI Improved Version
                          </h4>


                          <div className="space-y-2">
                            {results[key].split('\n').filter(b => b.trim()).map((bullet, bi) => (
                              <div key={bi} className="flex items-start gap-2 p-3 bg-purple-50 rounded-xl">
                                <span className="text-[#7C3AED] mt-0.5 shrink-0">•</span>
                                <p className="text-sm text-[#0F172A] flex-1">{bullet.replace(/^[•\-\*]\s*/, '')}</p>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2 pt-1">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => handleApplyProject(projIndex, results[key])}
                            >
                              ✅ Apply to Resume
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleCopy(results[key])}
                            >
                              📋 Copy
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleImprove(proj.description, key)}
                              disabled={improving === key}
                            >
                              🔄 Retry
                            </Button>
                          </div>
                        </div>
                      )}

                    </div>
                  )
                })}

              </div>
            )}

          </div>
        </div>

      </div>
    </AppLayout>
  )
}