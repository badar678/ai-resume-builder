import useResumeStore from '../../store/resumeStore'
import { getTemplate } from '../../components/templates'

export default function LivePreview() {
  const resumeData = useResumeStore((s) => s.resumeData)
  const templateId = resumeData.templateId || 'modern'
  const TemplateComponent = getTemplate(templateId)

  const isEmpty =
    !resumeData.personalInfo?.fullName &&
    !resumeData.summary &&
    resumeData.experience?.length === 0

  return (
    <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-sm overflow-hidden">

      {/* Preview Header */}
      <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
        <span className="text-xs font-semibold text-[#475569] uppercase tracking-wider">
          Live Preview
        </span>
        <span className="hidden sm:block text-xs text-[#94A3B8] capitalize">
          {templateId} template • updates as you type
        </span>
      </div>

      {/* Template Render */}
      <div className="overflow-y-auto max-h-[calc(100vh-220px)]">
        {isEmpty ? (
          <div className="text-center py-16 text-[#94A3B8]">
            <p className="text-3xl mb-2">📄</p>
            <p className="text-sm">Start filling in your details to see the preview</p>
          </div>
        ) : (
          <TemplateComponent data={resumeData} />
        )}
      </div>

    </div>
  )
}