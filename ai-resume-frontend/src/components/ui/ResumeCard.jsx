import { useNavigate } from 'react-router-dom'
import Card from './Card'

export default function ResumeCard({ resume, onDelete, onDuplicate }) {
  const navigate = useNavigate()

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
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
          <span className="text-white text-sm font-semibold">✏️ Edit Resume</span>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4">
        <h3 className="font-semibold text-[#0F172A] text-sm truncate">
          {resume.title || 'Untitled Resume'}
        </h3>
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
            ✏️ Edit
          </button>
          <button
            onClick={() => onDuplicate(resume._id)}
            className="flex-1 text-xs font-medium text-[#475569] hover:bg-[#F1F5F9]
              py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            📋 Duplicate
          </button>
          <button
            onClick={() => onDelete(resume._id)}
            className="flex-1 text-xs font-medium text-[#EF4444] hover:bg-red-50
              py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

    </Card>
  )
}