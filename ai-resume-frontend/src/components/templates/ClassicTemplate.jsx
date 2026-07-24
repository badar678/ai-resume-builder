export default function ClassicTemplate({ data }) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications, extras } = data

  return (
    <div className="font-['Inter'] text-[#0F172A] bg-white w-full h-full px-8 py-6" style={{ fontSize: '11px', lineHeight: '1.6' }}>

      {/* Header */}
      <div className="text-center border-b-2 border-[#1E293B] pb-3 mb-4">
        <h1 className="text-xl font-bold uppercase tracking-widest">{p.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap items-center justify-center gap-x-3 mt-1 text-[#475569] text-[9px]">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>| {p.phone}</span>}
          {p.location && <span>| {p.location}</span>}
          {p.linkedin && <span>| {p.linkedin}</span>}
          {p.website && <span>| {p.website}</span>}
        </div>
      </div>

      <div className="space-y-3">

        {summary && (
          <div>
            <h2 className="text-center font-bold uppercase tracking-widest text-[9px] bg-[#1E293B] text-white py-0.5 mb-1.5">
              Objective
            </h2>
            <p className="text-[#475569] text-center">{summary}</p>
          </div>
        )}

        {experience?.length > 0 && (
          <div>
            <h2 className="text-center font-bold uppercase tracking-widest text-[9px] bg-[#1E293B] text-white py-0.5 mb-2">
              Professional Experience
            </h2>
            <div className="space-y-2">
              {experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold uppercase text-[10px]">{exp.jobTitle}</p>
                      <p className="text-[#475569]">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                    </div>
                    <p className="text-[#94A3B8] text-[9px] whitespace-nowrap ml-2">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </p>
                  </div>
                  {exp.description && <p className="text-[#475569] mt-0.5 whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {education?.length > 0 && (
          <div>
            <h2 className="text-center font-bold uppercase tracking-widest text-[9px] bg-[#1E293B] text-white py-0.5 mb-2">
              Education
            </h2>
            {education.map((edu, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <p className="font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                  <p className="text-[#475569]">{edu.school}{edu.gpa ? ` — GPA: ${edu.gpa}` : ''}</p>
                </div>
                <p className="text-[#94A3B8] text-[9px]">{edu.startDate} — {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}

        {skills?.length > 0 && (
          <div>
            <h2 className="text-center font-bold uppercase tracking-widest text-[9px] bg-[#1E293B] text-white py-0.5 mb-2">
              Skills
            </h2>
            <p className="text-[#475569] text-center">{skills.join(' • ')}</p>
          </div>
        )}

        {projects?.length > 0 && (
          <div>
            <h2 className="text-center font-bold uppercase tracking-widest text-[9px] bg-[#1E293B] text-white py-0.5 mb-2">
              Projects
            </h2>
            {projects.map((p, i) => (
              <div key={i} className="mb-1.5">
                <p className="font-bold uppercase text-[10px]">{p.name}</p>
                {p.tech && <p className="text-[#475569] text-[9px]">{p.tech}</p>}
                {p.description && <p className="text-[#475569]">{p.description}</p>}
              </div>
            ))}
          </div>
        )}

        {certifications?.length > 0 && (
          <div>
            <h2 className="text-center font-bold uppercase tracking-widest text-[9px] bg-[#1E293B] text-white py-0.5 mb-2">
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

        {extras?.length > 0 && extras.map((x, i) => (
          <div key={i}>
            <h2 className="text-center font-bold uppercase tracking-widest text-[9px] bg-[#1E293B] text-white py-0.5 mb-1.5">
              {x.title}
            </h2>
            {x.description && <p className="text-[#475569] text-center whitespace-pre-line">{x.description}</p>}
          </div>
        ))}

      </div>
    </div>
  )
}