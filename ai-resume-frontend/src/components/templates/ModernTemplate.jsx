export default function ModernTemplate({ data }) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications, extras } = data

  return (
    <div className="font-['Inter'] text-[#0F172A] bg-white w-full h-full" style={{ fontSize: '11px', lineHeight: '1.6' }}>

      {/* Header */}
      <div className="bg-[#2563EB] text-white px-6 py-5">
        <h1 className="text-[26px] font-bold tracking-wide uppercase leading-tight">{p.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-blue-100 text-[11px]">
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>✆ {p.phone}</span>}
          {p.location && <span>⌖ {p.location}</span>}
          {p.linkedin && <span>in {p.linkedin}</span>}
          {p.website && <span>⊕ {p.website}</span>}
        </div>
      </div>

      <div className="px-6 py-4 space-y-4">

        {/* Summary */}
        {summary && (
          <div>
            <h2 className="text-[#2563EB] font-bold uppercase tracking-widest text-[12px] border-b-2 border-[#2563EB] pb-0.5 mb-1.5">
              Professional Summary
            </h2>
            <p className="text-[#475569] text-[11px]">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <div>
            <h2 className="text-[#2563EB] font-bold uppercase tracking-widest text-[12px] border-b-2 border-[#2563EB] pb-0.5 mb-2">
              Experience
            </h2>
            <div className="space-y-2.5">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-[#0F172A] text-[11px]">{exp.jobTitle}</p>
                      <p className="text-[#2563EB] text-[11px] font-semibold">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                    </div>
                    <p className="text-[#94A3B8] text-[11px] whitespace-nowrap ml-2 font-medium">
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

        {/* Education */}
        {education?.length > 0 && (
          <div>
            <h2 className="text-[#2563EB] font-bold uppercase tracking-widest text-[12px] border-b-2 border-[#2563EB] pb-0.5 mb-2">
              Education
            </h2>
            {education.map((edu, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-[11px]">{edu.school}</p>
                  <p className="text-[#2563EB] font-semibold text-[11px] mt-0.5">{edu.degree}</p>
                  {edu.field && <p className="text-[#475569] text-[11px] mt-0.5">{edu.field}</p>}
                  {edu.gpa && <p className="text-[#475569] text-[11px] mt-0.5">GPA: {edu.gpa}</p>}
                </div>
                <p className="text-[#94A3B8] text-[11px] ml-2">{edu.startDate} — {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <div>
            <h2 className="text-[#2563EB] font-bold uppercase tracking-widest text-[12px] border-b-2 border-[#2563EB] pb-0.5 mb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, i) => (
                <span key={i} className="bg-[#EFF6FF] text-[#2563EB] px-2 py-0.5 rounded-full text-[11px] font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <div>
            <h2 className="text-[#2563EB] font-bold uppercase tracking-widest text-[12px] border-b-2 border-[#2563EB] pb-0.5 mb-2">
              Projects
            </h2>
            {projects.map((p, i) => (
              <div key={i} className="mb-1.5">
                <p className="font-bold text-[11px]">{p.name}</p>
                {p.tech && <p className="text-[#2563EB] font-semibold text-[11px]">{p.tech}</p>}
                {p.description && <p className="text-[#475569] text-[11px]">{p.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <div>
            <h2 className="text-[#2563EB] font-bold uppercase tracking-widest text-[12px] border-b-2 border-[#2563EB] pb-0.5 mb-2">
              Certifications
            </h2>
            {certifications.map((c, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <p className="font-bold text-[11px]">{c.name}</p>
                  <p className="text-[#2563EB]  font-semibold text-[11px]">{c.issuer}</p>
                  {c.link && (
                    <a href={c.link} className="text-[#475569] text-[11px] break-all">{c.link}</a>
                  )}
                </div>
                {c.date && <p className="text-[#94A3B8] text-[11px]">{c.date}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Extras */}
        {extras?.length > 0 && extras.map((x, i) => (
          <div key={i}>
            <h2 className="text-[#2563EB] font-bold uppercase tracking-widest text-[12px] border-b-2 border-[#2563EB] pb-0.5 mb-1.5">
              {x.title}
            </h2>
            {x.description && <p className="text-[#475569] whitespace-pre-line text-[11px]">{x.description}</p>}
          </div>
        ))}

      </div>
    </div>
  )
}