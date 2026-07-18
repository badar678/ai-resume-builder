export default function MinimalTemplate({ data }) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data

  return (
    <div className="font-['Inter'] text-[#0F172A] bg-white w-full h-full px-8 py-6" style={{ fontSize: '11px', lineHeight: '1.6' }}>

      {/* Header */}
      <div className="border-b-2 border-[#0F172A] pb-3 mb-4">
        <h1 className="text-2xl font-bold tracking-tight">{p.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-x-3 mt-1 text-[#475569] text-[10px]">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>| {p.phone}</span>}
          {p.location && <span>| {p.location}</span>}
          {p.linkedin && <span>| {p.linkedin}</span>}
        </div>
      </div>

      <div className="space-y-3">

        {summary && (
          <div>
            <h2 className="font-bold uppercase tracking-widest text-[9px] mb-1">Summary</h2>
            <p className="text-[#475569]">{summary}</p>
          </div>
        )}

        {experience?.length > 0 && (
          <div>
            <h2 className="font-bold uppercase tracking-widest text-[9px] border-b border-[#E2E8F0] pb-0.5 mb-2">
              Experience
            </h2>
            <div className="space-y-2">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between">
                    <p className="font-bold">{exp.jobTitle} — {exp.company}</p>
                    <p className="text-[#94A3B8] text-[9px]">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  {exp.location && <p className="text-[#94A3B8] text-[9px]">{exp.location}</p>}
                  {exp.description && <p className="text-[#475569] mt-0.5 whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {education?.length > 0 && (
          <div>
            <h2 className="font-bold uppercase tracking-widest text-[9px] border-b border-[#E2E8F0] pb-0.5 mb-2">
              Education
            </h2>
            {education.map((edu, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <p className="font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p className="text-[#475569]">{edu.school}</p>
                </div>
                <p className="text-[#94A3B8] text-[9px]">{edu.startDate} – {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}

        {skills?.length > 0 && (
          <div>
            <h2 className="font-bold uppercase tracking-widest text-[9px] border-b border-[#E2E8F0] pb-0.5 mb-2">
              Skills
            </h2>
            <p className="text-[#475569]">{skills.join(' · ')}</p>
          </div>
        )}

        {projects?.length > 0 && (
          <div>
            <h2 className="font-bold uppercase tracking-widest text-[9px] border-b border-[#E2E8F0] pb-0.5 mb-2">
              Projects
            </h2>
            {projects.map((p, i) => (
              <div key={i} className="mb-1">
                <p className="font-bold">{p.name} {p.tech && <span className="font-normal text-[#475569]">— {p.tech}</span>}</p>
                {p.description && <p className="text-[#475569]">{p.description}</p>}
              </div>
            ))}
          </div>
        )}

        {certifications?.length > 0 && (
          <div>
            <h2 className="font-bold uppercase tracking-widest text-[9px] border-b border-[#E2E8F0] pb-0.5 mb-2">
              Certifications
            </h2>
            {certifications.map((c, i) => (
              <div key={i} className="flex justify-between">
                <p className="font-bold">{c.name} — <span className="font-normal">{c.issuer}</span></p>
                {c.date && <p className="text-[#94A3B8] text-[9px]">{c.date}</p>}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}