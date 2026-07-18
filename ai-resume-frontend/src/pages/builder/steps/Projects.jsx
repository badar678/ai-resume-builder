import { useState } from 'react'
import useResumeStore from '../../../store/resumeStore'
import Button from '../../../components/ui/Button'
import SortableList from '../../../components/ui/SortableList'

const empty = { name: '', description: '', tech: '', link: '' }

export default function Projects() {
  const projects = useResumeStore((s) => s.resumeData.projects)
  const updateSection = useResumeStore((s) => s.updateSection)
  const [editIndex, setEditIndex] = useState(null)
  const [form, setForm] = useState(empty)

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleAdd = () => {
    if (!form.name) return
    if (editIndex !== null) {
      const updated = [...projects]
      updated[editIndex] = { ...form, id: projects[editIndex].id }
      updateSection('projects', updated)
      setEditIndex(null)
    } else {
      updateSection('projects', [...projects, { ...form, id: Date.now().toString() }])
    }
    setForm(empty)
  }

  const handleEdit = (i) => { setForm(projects[i]); setEditIndex(i) }

  const handleDelete = (i) => {
    updateSection('projects', projects.filter((_, idx) => idx !== i))
    if (editIndex === i) { setForm(empty); setEditIndex(null) }
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-[#0F172A]">Projects</h3>
        <p className="text-sm text-[#475569] mt-0.5">
          Showcase your best work — drag ⠿ to reorder
        </p>
      </div>

      <SortableList
        items={projects}
        onReorder={(reordered) => updateSection('projects', reordered)}
        renderItem={(p) => {
          const i = projects.findIndex((x) => x.id === p.id)
          return (
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#0F172A]">{p.name}</p>
                  {p.tech && <p className="text-xs text-[#2563EB] mt-0.5">{p.tech}</p>}
                  {p.description && (
                    <p className="text-xs text-[#475569] mt-1 line-clamp-2">{p.description}</p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleEdit(i)}
                    className="text-xs text-[#2563EB] hover:bg-blue-50 px-2 py-1 rounded-lg cursor-pointer">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(i)}
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
          {editIndex !== null ? '✏️ Edit Project' : '+ Add Project'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'name', label: 'Project Name', placeholder: 'AI Resume Builder' },
            { name: 'tech', label: 'Technologies Used', placeholder: 'React, Node.js, MongoDB' },
            { name: 'link', label: 'Project Link', placeholder: 'github.com/you/project' },
          ].map((f) => (
            <div key={f.name} className={f.name === 'name' ? 'sm:col-span-2' : ''}>
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
        </div>

        <div>
          <label className="block text-xs font-medium text-[#475569] mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe what the project does and your role..."
            className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm
              text-[#0F172A] placeholder-[#94A3B8] outline-none resize-none
              focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleAdd} size="sm">
            {editIndex !== null ? 'Update Project' : '+ Add Project'}
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