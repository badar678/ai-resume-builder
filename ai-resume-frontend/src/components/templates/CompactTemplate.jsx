export default function CompactTemplate({ data }) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications } = data

  return (
    <div className="font-['Inter'] text-[#0F172A] bg-white w-full h-full flex" style={{ fontSize: '10px', lineHeight: '1.5' }}>

      {/* Left Column */}
      <div className="w-[35%] bg-[#0891B2] text-white px-3 py-5 space-y-4">

        <div>
          <h1 className="text-sm font-bold leading-tight">{p.fullName || 'Your Name'}</h1>
          <div className="w-8 h-0.5 bg-cyan-300 my-1.5" />
        </div>

        <div>
          <h2 className="text-[8px] font-bold uppercase tracking-widest text-cyan-200 mb-1">Contact</h2>
          <div className="space-y-0.5 text-cyan-100 text-[8px]">
            {p.email && <p>{p.email}</p>}
            {p.phone && <p>{p.phone}</p>}
            {p.location && <p>{p.location}</p>}
            {p.linkedin && <p>{p.linkedin}</p>}
          </div>
        </div>

        {skills?.length > 0 && (
          <div>
            <h2 className="text-[8px] font-bold uppercase tracking-widest text-cyan-200 mb-1">Skills</h2>
            <div className="space-y-0.5">
              {skills.map((s, i) => (
                <p key={i} className="text-cyan-100 text-[8px]">— {s}</p>
              ))}
            </div>
          </div>
        )}

        {education?.length > 0 && (
          <div>
            <h2 className="text-[8px] font-bold uppercase tracking-widest text-cyan-200 mb-1">Education</h2>
            {education.map((edu, i) => (
              <div key={i} className="mb-1.5">
                <p className="font-bold text-[8px]">{edu.degree}</p>
                {edu.field && <p className="text-cyan-200 text-[8px]">{edu.field}</p>}
                <p className="text-cyan-300 text-[8px]">{edu.school}</p>
                <p className="text-cyan-400 text-[8px]">{edu.endDate}</p>
              </div>
            ))}
          </div>
        )}

        {certifications?.length > 0 && (
          <div>
            <h2 className="text-[8px] font-bold uppercase tracking-widest text-cyan-200 mb-1">Certifications</h2>
            {certifications.map((c, i) => (
              <div key={i} className="mb-1">
                <p className="font-bold text-[8px] text-white">{c.name}</p>
                <p className="text-cyan-300 text-[8px]">{c.issuer}</p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Right Column */}
      <div className="flex-1 px-4 py-5 space-y-3">

        {summary && (
          <div>
            <h2 className="text-[#0891B2] font-bold uppercase tracking-widest text-[8px] border-b border-[#E2E8F0] pb-0.5 mb-1">
              Profile
            </h2>
            <p className="text-[#475569]">{summary}</p>
          </div>
        )}

        {experience?.length > 0 && (
          <div>
            <h2 className="text-[#0891B2] font-bold uppercase tracking-widest text-[8px] border-b border-[#E2E8F0] pb-0.5 mb-1.5">
              Experience
            </h2>
            <div className="space-y-2">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between">
                    <p className="font-bold">{exp.jobTitle}</p>
                    <p className="text-[#94A3B8] text-[8px]">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</p>
                  </div>
                  <p className="text-[#0891B2] text-[8px]">{exp.company}</p>
                  {exp.description && <p className="text-[#475569] mt-0.5 whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {projects?.length > 0 && (
          <div>
            <h2 className="text-[#0891B2] font-bold uppercase tracking-widest text-[8px] border-b border-[#E2E8F0] pb-0.5 mb-1.5">
              Projects
            </h2>
            {projects.map((p, i) => (
              <div key={i} className="mb-1">
                <p className="font-bold">{p.name} {p.tech && <span className="text-[#0891B2] font-normal">· {p.tech}</span>}</p>
                {p.description && <p className="text-[#475569]">{p.description}</p>}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}