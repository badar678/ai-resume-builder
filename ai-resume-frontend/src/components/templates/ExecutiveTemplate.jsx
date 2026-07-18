export default function ExecutiveTemplate({ data }) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data

  return (
    <div className="font-['Inter'] text-[#0F172A] bg-white w-full h-full" style={{ fontSize: '11px', lineHeight: '1.6' }}>

      {/* Gold Header */}
      <div className="bg-[#92400E] text-white px-8 py-5">
        <h1 className="text-2xl font-bold tracking-widest uppercase">{p.fullName || 'Your Name'}</h1>
        <div className="w-12 h-0.5 bg-yellow-400 my-2" />
        <div className="flex flex-wrap gap-x-4 text-amber-200 text-[9px]">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
        </div>
      </div>

      <div className="px-8 py-5 space-y-4">

        {summary && (
          <div className="border-l-4 border-[#92400E] pl-3">
            <p className="text-[#475569] italic">{summary}</p>
          </div>
        )}

        {experience?.length > 0 && (
          <div>
            <h2 className="text-[#92400E] font-bold uppercase tracking-widest text-[9px] mb-2">
              Professional Experience
            </h2>
            <div className="space-y-3">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start border-b border-[#FEF3C7] pb-1">
                    <div>
                      <p className="font-bold text-[#0F172A]">{exp.jobTitle}</p>
                      <p className="text-[#92400E] text-[10px] font-medium">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                    </div>
                    <p className="text-[#94A3B8] text-[9px] whitespace-nowrap ml-2">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  {exp.description && <p className="text-[#475569] mt-1 whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {education?.length > 0 && (
            <div>
              <h2 className="text-[#92400E] font-bold uppercase tracking-widest text-[9px] mb-2">Education</h2>
              {education.map((edu, i) => (
                <div key={i}>
                  <p className="font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p className="text-[#475569]">{edu.school}</p>
                  <p className="text-[#94A3B8] text-[9px]">{edu.endDate}</p>
                </div>
              ))}
            </div>
          )}

          {skills?.length > 0 && (
            <div>
              <h2 className="text-[#92400E] font-bold uppercase tracking-widest text-[9px] mb-2">Core Competencies</h2>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                {skills.map((s, i) => (
                  <p key={i} className="text-[#475569] text-[9px]">▪ {s}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {certifications?.length > 0 && (
          <div>
            <h2 className="text-[#92400E] font-bold uppercase tracking-widest text-[9px] mb-2">Certifications</h2>
            {certifications.map((c, i) => (
              <p key={i} className="text-[#475569]">▪ {c.name} — {c.issuer} {c.date && `(${c.date})`}</p>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}