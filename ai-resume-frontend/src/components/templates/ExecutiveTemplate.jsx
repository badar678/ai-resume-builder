export default function ExecutiveTemplate({ data }) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data
  const initials = (p.fullName || 'Y N')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

  return (
    <div className="font-['Inter'] text-[#0F172A] bg-white w-full h-full relative overflow-hidden" style={{ fontSize: '11px', lineHeight: '1.6' }}>

      {/* Decorative header band with wave */}
      <div className="relative bg-[#16A34A] px-8 pt-7 pb-10 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute top-8 right-24 w-16 h-16 rounded-full bg-white/10" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-extrabold tracking-wide text-white uppercase leading-tight">
              {p.fullName || 'Your Name'}
            </h1>
            {p.title && (
              <p className="text-[12px] font-semibold text-[#DCFCE7] mt-1 uppercase tracking-wide">{p.title}</p>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[#DCFCE7] text-[10px]">
              {p.phone && <span>📱 {p.phone}</span>}
              {p.email && <span>📧 {p.email}</span>}
              {p.website && <span>🌐 {p.website}</span>}
              {p.linkedin && <span>💼 {p.linkedin}</span>}
              {p.location && <span>📍 {p.location}</span>}
            </div>
          </div>

          {/* Avatar circle (initials placeholder, no photo field in data model) */}
          <div className="relative shrink-0 w-[76px] h-[76px] rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center">
            <span className="text-white text-xl font-bold">{initials}</span>
          </div>
        </div>

        {/* Wave divider */}
        <svg className="absolute bottom-0 left-0 w-full h-6" viewBox="0 0 400 24" preserveAspectRatio="none">
          <path d="M0,24 C100,0 300,24 400,4 L400,24 L0,24 Z" fill="white" />
        </svg>
      </div>

      <div className="px-8 py-5 space-y-4">

        {summary && (
          <div>
            <h2 className="text-[#16A34A] font-bold uppercase tracking-widest text-[12px] mb-1.5">Summary</h2>
            <p className="text-[#475569] text-[11px]">{summary}</p>
          </div>
        )}

        {experience?.length > 0 && (
          <div>
            <h2 className="text-[#16A34A] font-bold uppercase tracking-widest text-[12px] mb-2">Experience</h2>
            <div className="space-y-3">
              {experience.map((exp, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-[#DCFCE7]">
                  <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#16A34A]" />
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-bold text-[#0F172A] text-[11px]">{exp.jobTitle}</p>
                      <p className="text-[#16A34A] text-[11px] font-semibold">{exp.company}</p>
                      {exp.location && (
                        <p className="text-[#94A3B8] text-[11px] mt-0.5">{exp.location}</p>
                      )}
                    </div>
                    <p className="text-[#94A3B8] text-[11px] whitespace-nowrap font-medium">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  {exp.description && (
                    <p className="text-[#475569] mt-1 whitespace-pre-line text-[11px]">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {education?.length > 0 && (
          <div>
            <h2 className="text-[#16A34A] font-bold uppercase tracking-widest text-[12px] mb-2">Education</h2>
            <div className="space-y-2">
              {education.map((edu, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-[#DCFCE7]">
                  <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#16A34A]" />
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-bold text-[#0F172A] text-[11px]">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                      <p className="text-[#16A34A] text-[11px] font-semibold">{edu.school}</p>
                      {edu.gpa && <p className="text-[#475569] text-[11px]">GPA: {edu.gpa}</p>}
                    </div>
                    <p className="text-[#94A3B8] text-[11px] whitespace-nowrap font-medium">
                      {edu.startDate} — {edu.endDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills?.length > 0 && (
          <div>
            <h2 className="text-[#16A34A] font-bold uppercase tracking-widest text-[12px] mb-2">Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, i) => (
                <span key={i} className="bg-[#DCFCE7] text-[#15803D] px-2.5 py-1 rounded-md text-[11px] font-semibold">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {projects?.length > 0 && (
          <div>
            <h2 className="text-[#16A34A] font-bold uppercase tracking-widest text-[12px] mb-2">Projects</h2>
            <div className="space-y-1.5">
              {projects.map((proj, i) => (
                <div key={i}>
                  <p className="font-bold text-[#0F172A] text-[11px]">{proj.name}</p>
                  {proj.tech && <p className="text-[#16A34A] text-[11px] font-medium">{proj.tech}</p>}
                  {proj.description && <p className="text-[#475569] text-[11px]">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications?.length > 0 && (
          <div>
            <h2 className="text-[#16A34A] font-bold uppercase tracking-widest text-[12px] mb-2">Certifications</h2>
            <div className="space-y-1">
              {certifications.map((c, i) => (
                <div key={i} className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-bold text-[#0F172A] text-[11px]">{c.name}</p>
                    <p className="text-[#475569] text-[11px]">{c.issuer}</p>
                  </div>
                  {c.date && <p className="text-[#94A3B8] text-[11px] whitespace-nowrap">{c.date}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}