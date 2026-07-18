import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import Button from '../components/ui/Button'
import api from '../services/api'
import toast from 'react-hot-toast'

function ScoreRing({ score }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444'
  const label = score >= 70 ? 'Great Match' : score >= 40 ? 'Fair Match' : 'Poor Match'
  const bg = score >= 70 ? 'bg-green-50' : score >= 40 ? 'bg-yellow-50' : 'bg-red-50'

  return (
    <div className={`flex flex-col items-center gap-3 p-6 rounded-2xl ${bg}`}>
      <div className="relative w-36 h-36">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius}
            fill="none" stroke="#E2E8F0" strokeWidth="12" />
          <circle cx="60" cy="60" r={radius}
            fill="none" stroke={color} strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-[#0F172A]">{score}%</span>
          <span className="text-xs font-medium" style={{ color }}>{label}</span>
        </div>
      </div>
      <p className="text-sm text-[#475569] text-center">
        {score >= 70
          ? '🎉 Your resume is a strong match for this job!'
          : score >= 40
          ? '⚠️ Some improvements needed to pass ATS filters.'
          : '❌ Resume needs significant work for this role.'}
      </p>
    </div>
  )
}

function KeywordBadge({ word, matched }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
      ${matched
        ? 'bg-green-50 text-[#10B981] border border-green-100'
        : 'bg-red-50 text-[#EF4444] border border-red-100'
      }`}>
      {matched ? '✓' : '✗'} {word}
    </span>
  )
}

function SectionScore({ label, score, icon }) {
  const color = score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444'
  return (
    <div className="flex items-center gap-3">
      <span className="text-base">{icon}</span>
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-[#475569]">{label}</span>
          <span className="text-xs font-bold" style={{ color }}>{score}%</span>
        </div>
        <div className="w-full bg-[#E2E8F0] rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${score}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  )
}

export default function ATSAnalyzer() {
  const navigate = useNavigate()
  const [resumes, setResumes] = useState([])
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [loadingResumes, setLoadingResumes] = useState(true)

  // Fetch user resumes
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await api.get('/resume')
        setResumes(res.data)
        if (res.data.length > 0) setSelectedResumeId(res.data[0]._id)
      } catch (err) {
        toast.error('Failed to load resumes.')
      } finally {
        setLoadingResumes(false)
      }
    }
    fetchResumes()
  }, [])

  const handleAnalyze = async () => {
    if (!selectedResumeId) {
      toast.error('Please select a resume first.')
      return
    }
    if (jobDescription.trim().length < 50) {
      toast.error('Please paste a full job description (at least 50 characters).')
      return
    }

    setLoading(true)
    setResult(null)
    const toastId = toast.loading('Analyzing your resume...')

    try {
      const res = await api.post('/analyze', {
        resumeId: selectedResumeId,
        jobDescription,
      })
      setResult(res.data)
      setHistory((prev) => [res.data, ...prev].slice(0, 5))
      toast.success('Analysis complete!', { id: toastId })
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Analysis failed. Try again.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const wordCount = jobDescription.trim().split(/\s+/).filter(Boolean).length
  const charCount = jobDescription.length

  return (
    <AppLayout title="ATS Analyzer">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A]">ATS Score Analyzer</h2>
            <p className="text-sm text-[#475569] mt-0.5">
              Paste a job description to see how well your resume matches
            </p>
          </div>
          {resumes.length === 0 && !loadingResumes && (
            <Button onClick={() => navigate('/builder/new')}>
              + Create a Resume First
            </Button>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-[#EFF6FF] border border-blue-100 rounded-[12px] p-4 flex gap-3">
          <span className="text-xl shrink-0">💡</span>
          <div>
            <p className="text-sm font-semibold text-[#2563EB]">How ATS works</p>
            <p className="text-xs text-[#475569] mt-0.5">
              Applicant Tracking Systems scan resumes for keywords from the job description.
              A score above 70% means your resume will likely pass the ATS filter and reach a human recruiter.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left — Input Panel */}
          <div className="space-y-4">

            {/* Resume Selector */}
            <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-5 space-y-3">
              <h3 className="text-sm font-semibold text-[#0F172A]">1. Select Your Resume</h3>
              {loadingResumes ? (
                <div className="h-10 bg-[#F1F5F9] rounded-xl animate-pulse" />
              ) : resumes.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-[#475569]">No resumes found.</p>
                  <button
                    onClick={() => navigate('/builder/new')}
                    className="text-sm text-[#2563EB] hover:underline mt-1 cursor-pointer"
                  >
                    Create your first resume →
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {resumes.map((resume) => (
                    <label
                      key={resume._id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                        ${selectedResumeId === resume._id
                          ? 'border-[#2563EB] bg-[#EFF6FF]'
                          : 'border-[#E2E8F0] hover:border-[#2563EB]/50'
                        }`}
                    >
                      <input
                        type="radio"
                        name="resume"
                        value={resume._id}
                        checked={selectedResumeId === resume._id}
                        onChange={() => setSelectedResumeId(resume._id)}
                        className="accent-[#2563EB]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0F172A] truncate">
                          {resume.title || 'Untitled Resume'}
                        </p>
                        {resume.atsScore !== undefined && (
                          <p className="text-xs text-[#94A3B8]">
                            Last ATS score: {resume.atsScore}%
                          </p>
                        )}
                      </div>
                      {selectedResumeId === resume._id && (
                        <span className="text-[#2563EB] text-xs font-bold shrink-0">✓</span>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Job Description Input */}
            <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#0F172A]">2. Paste Job Description</h3>
                <span className="text-xs text-[#94A3B8]">
                  {wordCount} words · {charCount} chars
                </span>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={12}
                placeholder="Paste the full job description here...

Example:
We are looking for a Senior React Developer with 3+ years of experience in JavaScript, TypeScript, and Node.js. The ideal candidate will have experience with REST APIs, MongoDB, and AWS..."
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm
                  text-[#0F172A] placeholder-[#94A3B8] outline-none resize-none
                  focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white"
              />
              {jobDescription.length > 0 && jobDescription.length < 50 && (
                <p className="text-xs text-[#F59E0B]">
                  ⚠️ Job description is too short. Paste the full description for accurate results.
                </p>
              )}
            </div>

            {/* Analyze Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleAnalyze}
              disabled={loading || !selectedResumeId || jobDescription.trim().length < 50}
            >
              {loading ? '🔍 Analyzing...' : '🎯 Analyze ATS Score'}
            </Button>

          </div>

          {/* Right — Results Panel */}
          <div className="space-y-4">

            {!result && !loading && (
              <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-8 text-center space-y-3 h-full flex flex-col items-center justify-center">
                <span className="text-5xl">🎯</span>
                <h3 className="text-lg font-semibold text-[#0F172A]">
                  Ready to Analyze
                </h3>
                <p className="text-sm text-[#475569] max-w-xs">
                  Select a resume, paste a job description, and click Analyze to get your ATS match score.
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-8 text-center space-y-4">
                <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-medium text-[#475569]">Analyzing your resume...</p>
                <p className="text-xs text-[#94A3B8]">Extracting keywords and calculating match score</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">

                {/* Score Ring */}
                <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-5">
                  <h3 className="text-sm font-semibold text-[#0F172A] mb-4">Overall ATS Score</h3>
                  <ScoreRing score={result.score} />
                </div>

                {/* Section Breakdown */}
                <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-[#0F172A]">Keyword Summary</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-[#10B981]">
                        {result.matchedKeywords?.length || 0}
                      </p>
                      <p className="text-xs text-[#475569] mt-0.5">Keywords Matched</p>
                    </div>
                    <div className="bg-red-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-bold text-[#EF4444]">
                        {result.missingKeywords?.length || 0}
                      </p>
                      <p className="text-xs text-[#475569] mt-0.5">Keywords Missing</p>
                    </div>
                  </div>
                </div>

                {/* Matched Keywords */}
                {result.matchedKeywords?.length > 0 && (
                  <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-5 space-y-3">
                    <h3 className="text-sm font-semibold text-[#0F172A]">
                      ✅ Matched Keywords
                      <span className="ml-2 text-xs font-normal text-[#94A3B8]">
                        ({result.matchedKeywords.length})
                      </span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.matchedKeywords.map((word, i) => (
                        <KeywordBadge key={i} word={word} matched={true} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Keywords */}
                {result.missingKeywords?.length > 0 && (
                  <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-5 space-y-3">
                    <h3 className="text-sm font-semibold text-[#0F172A]">
                      ❌ Missing Keywords
                      <span className="ml-2 text-xs font-normal text-[#94A3B8]">
                        ({result.missingKeywords.length})
                      </span>
                    </h3>
                    <p className="text-xs text-[#475569]">
                      Add these keywords to your resume to improve your ATS score:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.map((word, i) => (
                        <KeywordBadge key={i} word={word} matched={false} />
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        const resume = resumes.find(r => r._id === selectedResumeId)
                        if (resume) navigate(`/builder/${resume._id}`)
                      }}
                    >
                      ✏️ Edit Resume to Add Missing Keywords
                    </Button>
                  </div>
                )}

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-100 rounded-[12px] p-4 space-y-2">
                  <p className="text-xs font-semibold text-[#2563EB]">
                    💡 Tips to improve your score
                  </p>
                  <ul className="text-xs text-[#475569] space-y-1">
                    <li>• Add missing keywords naturally to your experience or skills</li>
                    <li>• Mirror the exact phrasing used in the job description</li>
                    <li>• Include both acronyms and full terms (e.g. "AI" and "Artificial Intelligence")</li>
                    <li>• Use standard section headings ATS systems recognize</li>
                  </ul>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* Analysis History */}
        {history.length > 1 && (
          <div className="bg-white rounded-[12px] border border-[#E2E8F0] p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[#0F172A]">Recent Analyses</h3>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {history.map((h, i) => (
                <div
                  key={i}
                  onClick={() => setResult(h)}
                  className="shrink-0 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3
                    cursor-pointer hover:border-[#2563EB] transition-all min-w-[120px] text-center"
                >
                  <p className={`text-xl font-bold
                    ${h.score >= 70 ? 'text-[#10B981]' : h.score >= 40 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                    {h.score}%
                  </p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">Analysis {history.length - i}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  )
}