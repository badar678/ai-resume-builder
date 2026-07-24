import { useState } from 'react'
import useResumeStore from '../../../store/resumeStore'
import Button from '../../../components/ui/Button'
import SortableList from '../../../components/ui/SortableList'

const empty = { title: '', description: '' }

export default function Extras() {
  const extras = useResumeStore((s) => s.resumeData.extras)
  const updateSection = useResumeStore((s) => s.updateSection)
  const [editIndex, setEditIndex] = useState(null)
  const [form, setForm] = useState(empty)

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleAdd = () => {
    if (!form.title) return
    if (editIndex !== null) {
      const updated = [...extras]
      updated[editIndex] = { ...form, id: extras[editIndex].id }
      updateSection('extras', updated)
      setEditIndex(null)
    } else {
      updateSection('extras', [...extras, { ...form, id: Date.now().toString() }])
    }
    setForm(empty)
  }

  const handleEdit = (i) => { setForm(extras[i]); setEditIndex(i) }

  const handleDelete = (i) => {
    updateSection('extras', extras.filter((_, idx) => idx !== i))
    if (editIndex === i) { setForm(empty); setEditIndex(null) }
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-[#0F172A]">Additional Information</h3>
        <p className="text-sm text-[#475569] mt-0.5">
          Add anything else worth including — languages, volunteer work, awards, hobbies — drag ⠿ to reorder
        </p>
      </div>

      <SortableList
        items={extras}
        onReorder={(reordered) => updateSection('extras', reordered)}
        renderItem={(x) => {
          const i = extras.findIndex((item) => item.id === x.id)
          return (
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#0F172A]">{x.title}</p>
                  {x.description && (
                    <p className="text-xs text-[#475569] mt-0.5 whitespace-pre-line">{x.description}</p>
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
          {editIndex !== null ? '✏️ Edit Entry' : '+ Add Entry'}
        </p>

        <div>
          <label className="block text-xs font-medium text-[#475569] mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Languages, Volunteering, Awards"
            className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-sm
              text-[#0F172A] placeholder-[#94A3B8] outline-none
              focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#475569] mb-1">Details (Optional)</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="e.g. English (Native), Spanish (Fluent), French (Basic)"
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