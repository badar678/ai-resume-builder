import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from './Card'
import useResumeStore from '../../store/resumeStore'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { Pencil, Copy, Trash2, Check, X } from 'lucide-react'

export default function ResumeCard({ resume, onDelete, onDuplicate }) {
  const navigate = useNavigate()
  const { saveResumeToList } = useResumeStore()
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [draftTitle, setDraftTitle] = useState(resume.title || 'Untitled Resume')

  useEffect(() => {
    setDraftTitle(resume.title || 'Untitled Resume')
  }, [resume.title])

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleSaveTitle = async () => {
    const nextTitle = draftTitle.trim() || 'Untitled Resume'

    if (nextTitle === (resume.title || 'Untitled Resume')) {
      setIsEditingTitle(false)
      setDraftTitle(nextTitle)
      return
    }

    try {
      const res = await api.put(`/resume/${resume._id}`, {
        ...resume,
        title: nextTitle,
      })
      saveResumeToList(res.data)
      toast.success('Resume title updated.')
      setIsEditingTitle(false)
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not update resume title.')
      setDraftTitle(resume.title || 'Untitled Resume')
    }
  }

  return (
    <Card className="p-0 overflow-hidden group">

      {/* Preview Area */}
      <div
        onClick={() => navigate(`/builder/${resume._id}`)}
        className="h-44 bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] flex items-center
          justify-center cursor-pointer relative overflow-hidden"
      >
        {/* Resume Icon */}
        <div className="text-center">
          <div className="w-16 h-20 bg-white rounded-lg shadow-md flex flex-col
            items-center justify-center mx-auto border border-[#E2E8F0]">
            <div className="w-8 h-1.5 bg-[#2563EB] rounded mb-1.5" />
            <div className="w-10 h-1 bg-[#E2E8F0] rounded mb-1" />
            <div className="w-10 h-1 bg-[#E2E8F0] rounded mb-1" />
            <div className="w-8 h-1 bg-[#E2E8F0] rounded mb-2" />
            <div className="w-10 h-1 bg-[#E2E8F0] rounded mb-1" />
            <div className="w-10 h-1 bg-[#E2E8F0] rounded" />
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[#2563EB]/80 opacity-0 group-hover:opacity-100
          transition-opacity duration-200 flex items-center justify-center">
          <span className="text-white text-sm font-semibold flex items-center">
            <Pencil size={14} className="inline mr-1" />Edit Resume
          </span>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <input
              autoFocus
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle()
                if (e.key === 'Escape') {
                  setDraftTitle(resume.title || 'Untitled Resume')
                  setIsEditingTitle(false)
                }
              }}
              className="w-full min-w-0 font-semibold text-[#0F172A] text-sm bg-transparent border border-[#CBD5E1] rounded-lg px-2 py-1 outline-none focus:border-[#2563EB]"
            />
          ) : (
            <h3 className="flex-1 font-semibold text-[#0F172A] text-sm truncate">
              {resume.title || 'Untitled Resume'}
            </h3>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsEditingTitle(true)
            }}
            className="shrink-0 text-[#94A3B8] hover:text-[#2563EB] transition-colors cursor-pointer"
            aria-label="Edit resume title"
            title="Edit title"
          >
            <Pencil size={13} />
          </button>
          {isEditingTitle && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleSaveTitle()
                }}
                className="text-[#10B981] hover:text-emerald-600 transition-colors cursor-pointer"
                aria-label="Save title"
              >
                <Check size={13} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDraftTitle(resume.title || 'Untitled Resume')
                  setIsEditingTitle(false)
                }}
                className="text-[#94A3B8] hover:text-[#EF4444] transition-colors cursor-pointer"
                aria-label="Cancel title edit"
              >
                <X size={13} />
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-[#94A3B8] mt-0.5">
          Updated {formatDate(resume.updatedAt || resume.createdAt)}
        </p>

        {/* ATS Score Badge */}
        {resume.atsScore !== undefined && (
          <div className="mt-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full
              ${resume.atsScore >= 70
                ? 'bg-green-50 text-[#10B981]'
                : resume.atsScore >= 40
                ? 'bg-yellow-50 text-yellow-600'
                : 'bg-red-50 text-[#EF4444]'
              }`}>
              ATS Score: {resume.atsScore}%
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E2E8F0]">
          <button
            onClick={() => navigate(`/builder/${resume._id}`)}
            className="flex-1 text-xs font-medium text-[#2563EB] hover:bg-blue-50
              py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Pencil size={14} className="inline mr-1" />Edit
          </button>
          <button
            onClick={() => onDuplicate(resume._id)}
            className="flex-1 text-xs font-medium text-[#475569] hover:bg-[#F1F5F9]
              py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Copy size={14} className="inline mr-1" />Duplicate
          </button>
          <button
            onClick={() => onDelete(resume._id)}
            className="flex-1 text-xs font-medium text-[#EF4444] hover:bg-red-50
              py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 size={14} className="inline mr-1" />Delete
          </button>
        </div>
      </div>

    </Card>
  )
}