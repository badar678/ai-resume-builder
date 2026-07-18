import { useState } from 'react'
import useResumeStore from '../../../store/resumeStore'
import Button from '../../../components/ui/Button'

export default function Skills() {
  const skills = useResumeStore((s) => s.resumeData.skills)
  const updateSection = useResumeStore((s) => s.updateSection)
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const trimmed = input.trim()
    if (!trimmed || skills.includes(trimmed)) return
    updateSection('skills', [...skills, trimmed])
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd() }
  }

  const handleDelete = (skill) => {
    updateSection('skills', skills.filter((s) => s !== skill))
  }

  const suggestions = ['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript',
    'CSS', 'HTML', 'Git', 'MongoDB', 'SQL', 'AWS', 'Docker']

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-[#0F172A]">Skills</h3>
        <p className="text-sm text-[#475569] mt-0.5">Add your technical and soft skills</p>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm
            text-[#0F172A] placeholder-[#94A3B8] outline-none
            focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white"
        />
        <Button onClick={handleAdd} size="md">Add</Button>
      </div>

      {/* Added Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 bg-[#EFF6FF] text-[#2563EB]
                text-sm font-medium px-3 py-1.5 rounded-full"
            >
              {skill}
              <button
                onClick={() => handleDelete(skill)}
                className="text-[#2563EB] hover:text-[#EF4444] transition-colors cursor-pointer text-xs font-bold"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Suggestions */}
      <div>
        <p className="text-xs font-medium text-[#475569] mb-2">Quick add suggestions:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.filter((s) => !skills.includes(s)).map((s) => (
            <button
              key={s}
              onClick={() => updateSection('skills', [...skills, s])}
              className="text-xs bg-[#F1F5F9] text-[#475569] hover:bg-[#EFF6FF]
                hover:text-[#2563EB] px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}