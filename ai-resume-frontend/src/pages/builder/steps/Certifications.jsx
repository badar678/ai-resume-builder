import { useState } from 'react'
import useResumeStore from '../../../store/resumeStore'
import Button from '../../../components/ui/Button'
import SortableList from '../../../components/ui/SortableList'

const empty = { name: '', issuer: '', date: '', link: '' }

export default function Certifications() {
  const certifications = useResumeStore((s) => s.resumeData.certifications)
  const updateSection = useResumeStore((s) => s.updateSection)
  const [editIndex, setEditIndex] = useState(null)
  const [form, setForm] = useState(empty)

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleAdd = () => {
    if (!form.name) return
    if (editIndex !== null) {
      const updated = [...certifications]
      updated[editIndex] = { ...form, id: certifications[editIndex].id }
      updateSection('certifications', updated)
      setEditIndex(null)
    } else {
      updateSection('certifications', [...certifications, { ...form, id: Date.now().toString() }])
    }
    setForm(empty)
  }

  const handleEdit = (i) => { setForm(certifications[i]); setEditIndex(i) }

  const handleDelete = (i) => {
    updateSection('certifications', certifications.filter((_, idx) => idx !== i))
    if (editIndex === i) { setForm(empty); setEditIndex(null) }
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-[#0F172A]">Certifications</h3>
        <p className="text-sm text-[#475569] mt-0.5">
          Add your certifications — drag ⠿ to reorder
        </p>
      </div>

      <SortableList
        items={certifications}
        onReorder={(reordered) => updateSection('certifications', reordered)}
        renderItem={(c) => {
          const i = certifications.findIndex((x) => x.id === c.id)
          return (
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#0F172A]">{c.name}</p>
                  <p className="text-xs text-[#475569]">
                    {c.issuer} {c.date && `• ${c.date}`}
                  </p>
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
          {editIndex !== null ? '✏️ Edit Certification' : '+ Add Certification'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'name', label: 'Certification Name', placeholder: 'AWS Solutions Architect' },
            { name: 'issuer', label: 'Issuing Organization', placeholder: 'Amazon Web Services' },
            { name: 'date', label: 'Date Earned', type: 'month' },
            { name: 'link', label: 'Credential URL (Optional)', placeholder: 'credential.net/...' },
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