import { useState } from 'react'
import useResumeStore from '../../../store/resumeStore'
import Button from '../../../components/ui/Button'
import SortableList from '../../../components/ui/SortableList'

const empty = {
  company: '', jobTitle: '', location: '',
  startDate: '', endDate: '', current: false, description: '',
}

export default function Experience() {
  const experience = useResumeStore((s) => s.resumeData.experience)
  const updateSection = useResumeStore((s) => s.updateSection)
  const [editIndex, setEditIndex] = useState(null)
  const [form, setForm] = useState(empty)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleAdd = () => {
    if (!form.company || !form.jobTitle) return
    if (editIndex !== null) {
      const updated = [...experience]
      updated[editIndex] = { ...form, id: experience[editIndex].id }
      updateSection('experience', updated)
      setEditIndex(null)
    } else {
      updateSection('experience', [
        ...experience,
        { ...form, id: Date.now().toString() },
      ])
    }
    setForm(empty)
  }

  const handleEdit = (index) => {
    setForm(experience[index])
    setEditIndex(index)
  }

  const handleDelete = (index) => {
    updateSection('experience', experience.filter((_, i) => i !== index))
    if (editIndex === index) { setForm(empty); setEditIndex(null) }
  }

  const handleReorder = (reordered) => {
    updateSection('experience', reordered)
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-[#0F172A]">Work Experience</h3>
        <p className="text-sm text-[#475569] mt-0.5">
          Add your work history — drag ⠿ to reorder
        </p>
      </div>

      {/* Sortable Entries */}
      <SortableList
        items={experience}
        onReorder={handleReorder}
        renderItem={(exp) => {
          const index = experience.findIndex((e) => e.id === exp.id)
          return (
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#0F172A] truncate">{exp.jobTitle}</p>
                  <p className="text-xs text-[#475569] truncate">{exp.company} • {exp.location}</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-xs text-[#2563EB] hover:bg-blue-50 px-2 py-1 rounded-lg cursor-pointer"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-xs text-[#EF4444] hover:bg-red-50 px-2 py-1 rounded-lg cursor-pointer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          )
        }}
      />

      {/* Form */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 space-y-4">
        <p className="text-sm font-semibold text-[#0F172A]">
          {editIndex !== null ? '✏️ Edit Entry' : '+ Add Experience'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'jobTitle', label: 'Job Title', placeholder: 'Software Engineer' },
            { name: 'company', label: 'Company', placeholder: 'Google' },
            { name: 'location', label: 'Location', placeholder: 'New York, NY' },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-xs font-medium text-[#475569] mb-1">{f.label}</label>
              <input
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

          <div>
            <label className="block text-xs font-medium text-[#475569] mb-1">Start Date</label>
            <input
              type="month"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm
                text-[#0F172A] outline-none focus:ring-2 focus:ring-[#2563EB]
                focus:border-transparent bg-white"
            />
          </div>

          {!form.current && (
            <div>
              <label className="block text-xs font-medium text-[#475569] mb-1">End Date</label>
              <input
                type="month"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm
                  text-[#0F172A] outline-none focus:ring-2 focus:ring-[#2563EB]
                  focus:border-transparent bg-white"
              />
            </div>
          )}
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="current"
            checked={form.current}
            onChange={handleChange}
            className="w-4 h-4 accent-[#2563EB]"
          />
          <span className="text-sm text-[#475569]">I currently work here</span>
        </label>

        <div>
          <label className="block text-xs font-medium text-[#475569] mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="• Led development of key features that increased user retention by 30%"
            className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm
              text-[#0F172A] placeholder-[#94A3B8] outline-none resize-none
              focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white"
          />
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