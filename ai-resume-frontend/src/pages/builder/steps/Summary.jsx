import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import useResumeStore from '../../../store/resumeStore'
import Button from '../../../components/ui/Button'
import api from '../../../services/api'
import toast from 'react-hot-toast'

export default function Summary() {
  const summary = useResumeStore((s) => s.resumeData.summary)
  const resumeData = useResumeStore((s) => s.resumeData)
  const updateSection = useResumeStore((s) => s.updateSection)
  const [generating, setGenerating] = useState(false)

  const { register, watch, setValue } = useForm({ defaultValues: { summary } })
  const watched = watch('summary')

  useEffect(() => {
    updateSection('summary', watched)
  }, [watched])

  const handleGenerate = async () => {
    setGenerating(true)
    const toastId = toast.loading('Generating summary with AI...')
    try {
      const res = await api.post('/ai/summary', { resumeData })
      setValue('summary', res.data.summary)
      updateSection('summary', res.data.summary)
      toast.success('Summary generated!', { id: toastId })
    } catch (err) {
      toast.error(err.response?.data?.msg || 'AI generation failed.', { id: toastId })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-[#0F172A]">Professional Summary</h3>
        <p className="text-sm text-[#475569] mt-0.5">
          A brief overview of your experience and goals (2-4 sentences)
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-[#0F172A]">
            Summary
          </label>
          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? '⏳ Generating...' : '✨ Generate with AI'}
          </Button>
        </div>
        <textarea
          rows={6}
          placeholder="Experienced software engineer with 5+ years building scalable web applications..."
          {...register('summary')}
          className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm
            text-[#0F172A] placeholder-[#94A3B8] outline-none transition-all resize-none
            focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white"
        />
        <p className="text-xs text-[#94A3B8] mt-1 text-right">
          {watched?.length || 0} characters
        </p>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
        <p className="text-xs font-semibold text-[#2563EB]">💡 Tips for a great summary:</p>
        <ul className="text-xs text-[#475569] space-y-1">
          <li>• Start with your job title and years of experience</li>
          <li>• Mention your top 2-3 skills or specializations</li>
          <li>• Include a career goal or what value you bring</li>
          <li>• Keep it between 50-200 characters for best ATS results</li>
        </ul>
      </div>
    </div>
  )
}