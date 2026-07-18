import { create } from 'zustand'

const defaultResume = {
  title: 'Untitled Resume',
  templateId: 'modern',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
}

// Helper to load resumes from localStorage
const loadResumes = () => {
  try {
    const saved = localStorage.getItem('resumes')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// Helper to save resumes to localStorage
const saveResumes = (resumes) => {
  localStorage.setItem('resumes', JSON.stringify(resumes))
}

const useResumeStore = create((set, get) => ({
  resumeData: { ...defaultResume },
  currentStep: 0,
  isSaving: false,
  allResumes: loadResumes(),

  setResume: (resume) => set({ resumeData: resume }),

  updateSection: (section, data) =>
    set((state) => ({
      resumeData: { ...state.resumeData, [section]: data },
    })),

  updatePersonalInfo: (field, value) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        personalInfo: { ...state.resumeData.personalInfo, [field]: value },
      },
    })),

  // Save current resume to localStorage list
  saveResumeToList: (backendResume) => {
  const { resumeData, allResumes } = get()
  const dataToSave = backendResume || resumeData
  const existing = allResumes.find((r) => r._id === dataToSave._id)
  let updated

  if (existing) {
    updated = allResumes.map((r) =>
      r._id === dataToSave._id ? { ...dataToSave, updatedAt: new Date().toISOString() } : r
    )
  } else {
    const newResume = {
      ...dataToSave,
      _id: dataToSave._id || Date.now().toString(),
      createdAt: dataToSave.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    set({ resumeData: newResume })
    updated = [...allResumes, newResume]
  }

  saveResumes(updated)
  set({ allResumes: updated })
},

  deleteResumeFromList: (id) => {
    const updated = get().allResumes.filter((r) => r._id !== id)
    saveResumes(updated)
    set({ allResumes: updated })
  },

  duplicateResumeInList: (id) => {
    const original = get().allResumes.find((r) => r._id === id)
    if (!original) return
    const duplicate = {
      ...original,
      _id: Date.now().toString(),
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updated = [...get().allResumes, duplicate]
    saveResumes(updated)
    set({ allResumes: updated })
  },

  loadResumeById: (id) => {
    const found = get().allResumes.find((r) => r._id === id)
    if (found) set({ resumeData: found })
  },

  setCurrentStep: (step) => set({ currentStep: step }),
  setIsSaving: (val) => set({ isSaving: val }),

  resetResume: () =>
    set({ resumeData: { ...defaultResume }, currentStep: 0 }),

  setAllResumes: (resumes) => {
  saveResumes(resumes)
  set({ allResumes: resumes })
},

}))



export default useResumeStore