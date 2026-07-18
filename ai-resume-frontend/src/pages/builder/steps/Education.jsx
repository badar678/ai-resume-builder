import { useState } from 'react'
import useResumeStore from '../../../store/resumeStore'
import Button from '../../../components/ui/Button'
import SortableList from '../../../components/ui/SortableList'

const empty = { school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }

export default function Education() {
  const education = useResumeStore((s) => s.resumeData.education)
  const updateSection = useResumeStore((s) => s.updateSection)
  const [editIndex, setEditIndex] = useState(null)
  const [form, setForm] = useState(empty)

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleAdd = () => {
    if (!form.school || !form.degree) return
    if (editIndex !== null) {
      const updated = [...education]
      updated[editIndex] = { ...form, id: education[editIndex].id }
      updateSection('education', updated)
      setEditIndex(null)
    } else {
      updateSection('education', [...education, { ...form, id: Date.now().toString() }])
    }
    setForm(empty)
  }

  const handleEdit = (index) => { setForm(education[index]); setEditIndex(index) }

  const handleDelete = (index) => {
    updateSection('education', education.filter((_, i) => i !== index))
    if (editIndex === index) { setForm(empty); setEditIndex(null) }
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-[#0F172A]">Education</h3>
        <p className="text-sm text-[#475569] mt-0.5">
          Add your educational background — drag ⠿ to reorder
        </p>
      </div>

      <SortableList
        items={education}
        onReorder={(reordered) => updateSection('education', reordered)}
        renderItem={(edu) => {
          const index = education.findIndex((e) => e.id === edu.id)
          return (
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#0F172A] truncate">
                    {edu.degree} in {edu.field}
                  </p>
                  <p className="text-xs text-[#475569]">{edu.school}</p>
                  <p className="text-xs text-[#94A3B8]">{edu.startDate} — {edu.endDate}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleEdit(index)}
                    className="text-xs text-[#2563EB] hover:bg-blue-50 px-2 py-1 rounded-lg cursor-pointer">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(index)}
                    className="text-xs text-[#EF4444] hover:bg-red-50 px-2 py-1 rounded-lg cursor-pointer">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          )
        }}
      />

      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 space-y-4">
        <p className="text-sm font-semibold text-[#0F172A]">
          {editIndex !== null ? '✏️ Edit Entry' : '+ Add Education'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'school', label: 'School / University', placeholder: 'MIT' },
            { name: 'degree', label: 'Degree', placeholder: 'Bachelor of Science' },
            { name: 'field', label: 'Field of Study', placeholder: 'Computer Science' },
            { name: 'gpa', label: 'GPA (Optional)', placeholder: '3.8' },
            { name: 'startDate', label: 'Start Date', type: 'month' },
            { name: 'endDate', label: 'End Date', type: 'month' },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-xs font-medium text-[#475569] mb-1">{f.label}</label>
              <input
                type={f.type || 'text'}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm
                  text-[#0F172A] placeholder-[#94A3B8] outline-none
                  focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button onClick={handleAdd} size="sm">
            {editIndex !== null ? 'Update Entry' : '+ Add Entry'}
          </Button>
          {editIndex !== null && (
            <Button variant="ghost" size="sm"
              onClick={() => { setForm(empty); setEditIndex(null) }}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}