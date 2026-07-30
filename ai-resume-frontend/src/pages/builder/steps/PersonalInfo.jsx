import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import useResumeStore from '../../../store/resumeStore'

// Resize + compress an image file into a small base64 JPEG data URL,
// so profile photos don't bloat MongoDB documents or the generated PDF.
const MAX_DIMENSION = 400
const JPEG_QUALITY = 0.85

function fileToCompressedDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not load image'))
      img.onload = () => {
        let { width, height } = img
        if (width > height && width > MAX_DIMENSION) {
          height = Math.round((height * MAX_DIMENSION) / width)
          width = MAX_DIMENSION
        } else if (height > MAX_DIMENSION) {
          width = Math.round((width * MAX_DIMENSION) / height)
          height = MAX_DIMENSION
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default function PersonalInfo() {
  const personalInfo = useResumeStore((s) => s.resumeData.personalInfo)
  const templateId = useResumeStore((s) => s.resumeData.templateId)
  const updatePersonalInfo = useResumeStore((s) => s.updatePersonalInfo)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const fileInputRef = useRef(null)
  const supportsPhoto = templateId === 'executive'

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

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image is too large (max 8MB)')
      return
    }

    setUploadingPhoto(true)
    try {
      const dataUrl = await fileToCompressedDataUrl(file)
      updatePersonalInfo('photo', dataUrl)
      toast.success('Photo uploaded')
    } catch (err) {
      toast.error('Could not process that image. Try a different file.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleRemovePhoto = () => {
    updatePersonalInfo('photo', '')
  }

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

      {/* Profile Photo — only shown for templates that support one (e.g. Executive) */}
      {supportsPhoto && (
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center shrink-0">
          {personalInfo.photo ? (
            <img src={personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[#94A3B8] text-xs">No photo</span>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-[#0F172A] mb-1.5">Profile Photo</p>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium border
                border-[#2563EB] text-[#2563EB] hover:bg-blue-50 transition-all
                ${uploadingPhoto ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {uploadingPhoto ? 'Uploading...' : personalInfo.photo ? 'Change Photo' : 'Upload Photo'}
            </label>
            {personalInfo.photo && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9] transition-all"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
      )}

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