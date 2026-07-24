import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useResumeStore from '../../../store/resumeStore'

export default function PersonalInfo() {
  const personalInfo = useResumeStore((s) => s.resumeData.personalInfo)
  const updatePersonalInfo = useResumeStore((s) => s.updatePersonalInfo)

  const { register, watch, formState: { errors } } = useForm({
    defaultValues: personalInfo,
    mode: 'onBlur',
  })
  const watched = watch()

  useEffect(() => {
    const subscription = Object.keys(watched).forEach((key) => {
      if (watched[key] !== personalInfo[key]) {
        updatePersonalInfo(key, watched[key])
      }
    })
    return subscription
  }, [JSON.stringify(watched)])

  const fields = [
    { name: 'fullName', label: 'Full Name', placeholder: 'John Doe', type: 'text', required: true },
    { name: 'email', label: 'Email Address', placeholder: 'john@example.com', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', placeholder: '+1 (555) 000-0000', type: 'tel' },
    { name: 'location', label: 'Location', placeholder: 'New York, NY', type: 'text' },
    { name: 'linkedin', label: 'LinkedIn URL', placeholder: 'linkedin.com/in/johndoe', type: 'text' },
    { name: 'website', label: 'Website / Portfolio', placeholder: 'johndoe.com', type: 'text' },
  ]

  const getValidationRules = (field) => {
    if (!field.required) return {}
    return field.type === 'email'
      ? {
          required: 'Email is required',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
        }
      : { required: `${field.label} is required` }
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-[#0F172A]">Personal Information</h3>
        <p className="text-sm text-[#475569] mt-0.5">This appears at the top of your resume</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.name} className={field.name === 'fullName' ? 'sm:col-span-2' : ''}>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
              {field.label}
              {field.required && <span className="text-[#EF4444] ml-1">*</span>}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              {...register(field.name, getValidationRules(field))}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm
                text-[#0F172A] placeholder-[#94A3B8] outline-none transition-all
                focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white
                ${errors[field.name] ? 'border-[#EF4444]' : 'border-[#E2E8F0]'}`}
            />
            {errors[field.name] && (
              <p className="text-xs text-[#EF4444] mt-1">{errors[field.name].message}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}