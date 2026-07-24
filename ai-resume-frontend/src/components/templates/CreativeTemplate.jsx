export default function CreativeTemplate({ data }) {
  const { personalInfo: p, summary, experience, education, skills, projects, certifications, extras } = data

  return (
    <div className="font-['Inter'] bg-white w-full h-full flex" style={{ fontSize: '11px', lineHeight: '1.5' }}>

      {/* Left Sidebar */}
      <div className="w-2/5 bg-[#7C3AED] text-white px-4 py-6 space-y-4">

        {/* Avatar / Initials */}
        <div className="flex flex-col items-center text-center mb-2">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2">
            <span className="text-white text-xl font-bold">
              {p.fullName ? p.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'YN'}
            </span>
          </div>
          <h1 className="text-base font-bold leading-tight">{p.fullName || 'Your Name'}</h1>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-[9px] font-bold uppercase tracking-widest text-purple-200 mb-1.5">Contact</h2>
          <div className="space-y-1 text-purple-100 text-[9px]">
            {p.email && <p>✉ {p.email}</p>}
            {p.phone && <p>✆ {p.phone}</p>}
            {p.location && <p>⌖ {p.location}</p>}
            {p.linkedin && <p>in {p.linkedin}</p>}
            {p.website && <p>⊕ {p.website}</p>}
          </div>
        </div>

        {/* Skills */}
        {skills?.length > 0 && (
          <div>
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-purple-200 mb-1.5">Skills</h2>
            <div className="space-y-1">
              {skills.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-white rounded-full shrink-0" />
                  <span className="text-purple-100 text-[9px]">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <div>
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-purple-200 mb-1.5">Education</h2>
            {education.map((edu, i) => (
              <div key={i} className="mb-1.5">
                <p className="font-bold text-[9px] text-white">{edu.degree}</p>
                {edu.field && <p className="text-purple-200 text-[9px]">{edu.field}</p>}
                <p className="text-purple-300 text-[9px]">{edu.school}</p>
                <p className="text-purple-400 text-[9px]">{edu.endDate}</p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Right Content */}
      <div className="flex-1 px-5 py-6 space-y-4">

        {summary && (
          <div>
            <h2 className="text-[#7C3AED] font-bold uppercase tracking-widest text-[9px] mb-1.5">
              About Me
            </h2>
            <p className="text-[#475569]">{summary}</p>
          </div>
        )}

        {experience?.length > 0 && (
          <div>
            <h2 className="text-[#7C3AED] font-bold uppercase tracking-widest text-[9px] border-b border-[#E9D5FF] pb-0.5 mb-2">
              Experience
            </h2>
            <div className="space-y-2.5">
              {experience.map((exp, i) => (
                <div key={i} className="border-l-2 border-[#E9D5FF] pl-3">
                  <p className="font-bold text-[#0F172A]">{exp.jobTitle}</p>
                  <p className="text-[#7C3AED] text-[9px]">{exp.company} · {exp.startDate} — {exp.current ? 'Present' : exp.endDate}</p>
                  {exp.description && <p className="text-[#475569] mt-0.5 whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {projects?.length > 0 && (
          <div>
            <h2 className="text-[#7C3AED] font-bold uppercase tracking-widest text-[9px] border-b border-[#E9D5FF] pb-0.5 mb-2">
              Projects
            </h2>
            {projects.map((p, i) => (
              <div key={i} className="mb-1.5">
                <p className="font-bold">{p.name}</p>
                {p.tech && <p className="text-[#7C3AED] text-[9px]">{p.tech}</p>}
                {p.description && <p className="text-[#475569]">{p.description}</p>}
              </div>
            ))}
          </div>
        )}

        {certifications?.length > 0 && (
          <div>
            <h2 className="text-[#7C3AED] font-bold uppercase tracking-widest text-[9px] border-b border-[#E9D5FF] pb-0.5 mb-2">
              Certifications
            </h2>
            {certifications.map((c, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <p className="font-bold">{c.name}</p>
                  <p className="text-[#475569]">{c.issuer}</p>
                </div>
                {c.date && <p className="text-[#94A3B8] text-[9px]">{c.date}</p>}
              </div>
            ))}
          </div>
        )}

        {extras?.length > 0 && extras.map((x, i) => (
          <div key={i}>
            <h2 className="text-[#7C3AED] font-bold uppercase tracking-widest text-[9px] border-b border-[#E9D5FF] pb-0.5 mb-1.5">
              {x.title}
            </h2>
            {x.description && <p className="text-[#475569] whitespace-pre-line">{x.description}</p>}
          </div>
        ))}

      </div>
    </div>
  )
}