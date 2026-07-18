const puppeteer = require("puppeteer");

const generateTemplateHTML = (resume) => {
  const p = resume.personalInfo || {};
  const contact = [p.email, p.phone, p.location, p.linkedin, p.website]
    .filter(Boolean)
    .join(" • ");

  const templates = {
    modern: `
      <div style="font-family: Inter, sans-serif; color: #0F172A; background: white; min-height: 100vh;">
        <div style="background: #2563EB; color: white; padding: 28px 32px;">
          <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: 0.5px;">
            ${p.fullName || "Your Name"}
          </h1>
          <p style="font-size: 11px; color: #BFDBFE; margin: 0;">${contact}</p>
        </div>
        <div style="padding: 24px 32px;">
          ${resume.summary ? `
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 10px; font-weight: 700; color: #2563EB; letter-spacing: 2px; text-transform: uppercase; border-bottom: 2px solid #2563EB; padding-bottom: 4px; margin-bottom: 8px;">
                Professional Summary
              </h2>
              <p style="font-size: 12px; color: #475569; line-height: 1.6; margin: 0;">${resume.summary}</p>
            </div>` : ""}
          ${(resume.experience || []).length > 0 ? `
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 10px; font-weight: 700; color: #2563EB; letter-spacing: 2px; text-transform: uppercase; border-bottom: 2px solid #2563EB; padding-bottom: 4px; margin-bottom: 12px;">
                Work Experience
              </h2>
              ${resume.experience.map(exp => `
                <div style="margin-bottom: 14px;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                      <p style="font-size: 13px; font-weight: 700; margin: 0;">${exp.jobTitle || ""}</p>
                      <p style="font-size: 11px; color: #2563EB; margin: 2px 0;">${exp.company || ""}${exp.location ? ` · ${exp.location}` : ""}</p>
                    </div>
                    <p style="font-size: 10px; color: #94A3B8; margin: 0; white-space: nowrap; margin-left: 12px;">
                      ${exp.startDate || ""} — ${exp.current ? "Present" : exp.endDate || ""}
                    </p>
                  </div>
                  ${exp.description ? `<p style="font-size: 11px; color: #475569; margin: 6px 0 0 0; white-space: pre-line; line-height: 1.6;">${exp.description}</p>` : ""}
                </div>`).join("")}
            </div>` : ""}
          ${(resume.education || []).length > 0 ? `
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 10px; font-weight: 700; color: #2563EB; letter-spacing: 2px; text-transform: uppercase; border-bottom: 2px solid #2563EB; padding-bottom: 4px; margin-bottom: 12px;">
                Education
              </h2>
              ${resume.education.map(edu => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <div>
                    <p style="font-size: 13px; font-weight: 700; margin: 0;">${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}</p>
                    <p style="font-size: 11px; color: #475569; margin: 2px 0;">${edu.school || ""}${edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</p>
                  </div>
                  <p style="font-size: 10px; color: #94A3B8; margin: 0;">${edu.startDate || ""} — ${edu.endDate || ""}</p>
                </div>`).join("")}
            </div>` : ""}
          ${(resume.skills || []).length > 0 ? `
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 10px; font-weight: 700; color: #2563EB; letter-spacing: 2px; text-transform: uppercase; border-bottom: 2px solid #2563EB; padding-bottom: 4px; margin-bottom: 8px;">
                Skills
              </h2>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${resume.skills.map(s => `
                  <span style="background: #EFF6FF; color: #2563EB; padding: 3px 10px; border-radius: 999px; font-size: 10px; font-weight: 500;">
                    ${s}
                  </span>`).join("")}
              </div>
            </div>` : ""}
          ${(resume.projects || []).length > 0 ? `
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 10px; font-weight: 700; color: #2563EB; letter-spacing: 2px; text-transform: uppercase; border-bottom: 2px solid #2563EB; padding-bottom: 4px; margin-bottom: 12px;">
                Projects
              </h2>
              ${resume.projects.map(proj => `
                <div style="margin-bottom: 10px;">
                  <p style="font-size: 13px; font-weight: 700; margin: 0;">${proj.name || ""}</p>
                  ${proj.tech ? `<p style="font-size: 10px; color: #2563EB; margin: 2px 0;">${proj.tech}</p>` : ""}
                  ${proj.description ? `<p style="font-size: 11px; color: #475569; margin: 4px 0 0 0;">${proj.description}</p>` : ""}
                </div>`).join("")}
            </div>` : ""}
          ${(resume.certifications || []).length > 0 ? `
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 10px; font-weight: 700; color: #2563EB; letter-spacing: 2px; text-transform: uppercase; border-bottom: 2px solid #2563EB; padding-bottom: 4px; margin-bottom: 12px;">
                Certifications
              </h2>
              ${resume.certifications.map(c => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <div>
                    <p style="font-size: 13px; font-weight: 700; margin: 0;">${c.name || ""}</p>
                    <p style="font-size: 11px; color: #475569; margin: 2px 0;">${c.issuer || ""}</p>
                  </div>
                  ${c.date ? `<p style="font-size: 10px; color: #94A3B8; margin: 0;">${c.date}</p>` : ""}
                </div>`).join("")}
            </div>` : ""}
        </div>
      </div>`,

    minimal: `
      <div style="font-family: Inter, sans-serif; color: #0F172A; background: white; padding: 40px 48px; min-height: 100vh;">
        <div style="border-bottom: 2px solid #0F172A; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="font-size: 26px; font-weight: 700; margin: 0 0 6px 0;">${p.fullName || "Your Name"}</h1>
          <p style="font-size: 11px; color: #475569; margin: 0;">${contact}</p>
        </div>
        ${resume.summary ? `
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 6px 0;">Summary</h2>
            <p style="font-size: 12px; color: #475569; line-height: 1.6; margin: 0;">${resume.summary}</p>
          </div>` : ""}
        ${(resume.experience || []).length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 12px;">Experience</h2>
            ${resume.experience.map(exp => `
              <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between;">
                  <p style="font-size: 13px; font-weight: 700; margin: 0;">${exp.jobTitle || ""} — ${exp.company || ""}</p>
                  <p style="font-size: 10px; color: #94A3B8; margin: 0;">${exp.startDate || ""} – ${exp.current ? "Present" : exp.endDate || ""}</p>
                </div>
                ${exp.location ? `<p style="font-size: 10px; color: #94A3B8; margin: 2px 0;">${exp.location}</p>` : ""}
                ${exp.description ? `<p style="font-size: 11px; color: #475569; margin: 4px 0 0 0; white-space: pre-line; line-height: 1.6;">${exp.description}</p>` : ""}
              </div>`).join("")}
          </div>` : ""}
        ${(resume.education || []).length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 12px;">Education</h2>
            ${resume.education.map(edu => `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <div>
                  <p style="font-size: 13px; font-weight: 700; margin: 0;">${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}</p>
                  <p style="font-size: 11px; color: #475569; margin: 2px 0;">${edu.school || ""}</p>
                </div>
                <p style="font-size: 10px; color: #94A3B8; margin: 0;">${edu.startDate || ""} – ${edu.endDate || ""}</p>
              </div>`).join("")}
          </div>` : ""}
        ${(resume.skills || []).length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 8px;">Skills</h2>
            <p style="font-size: 12px; color: #475569; margin: 0;">${resume.skills.join(" · ")}</p>
          </div>` : ""}
        ${(resume.projects || []).length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 12px;">Projects</h2>
            ${resume.projects.map(proj => `
              <div style="margin-bottom: 10px;">
                <p style="font-size: 13px; font-weight: 700; margin: 0;">${proj.name || ""}${proj.tech ? ` <span style="font-weight: 400; color: #475569;">— ${proj.tech}</span>` : ""}</p>
                ${proj.description ? `<p style="font-size: 11px; color: #475569; margin: 4px 0 0 0;">${proj.description}</p>` : ""}
              </div>`).join("")}
          </div>` : ""}
        ${(resume.certifications || []).length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #E2E8F0; padding-bottom: 4px; margin-bottom: 12px;">Certifications</h2>
            ${resume.certifications.map(c => `
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <p style="font-size: 13px; font-weight: 700; margin: 0;">${c.name || ""} — <span style="font-weight: 400;">${c.issuer || ""}</span></p>
                ${c.date ? `<p style="font-size: 10px; color: #94A3B8; margin: 0;">${c.date}</p>` : ""}
              </div>`).join("")}
          </div>` : ""}
      </div>`,

    creative: `
      <div style="font-family: Inter, sans-serif; display: flex; min-height: 100vh; background: white;">
        <div style="width: 38%; background: #7C3AED; color: white; padding: 32px 20px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px auto; font-size: 22px; font-weight: 700;">
              ${p.fullName ? p.fullName.split(" ").map(n => n[0]).join("").slice(0, 2) : "YN"}
            </div>
            <h1 style="font-size: 18px; font-weight: 700; margin: 0; line-height: 1.3;">${p.fullName || "Your Name"}</h1>
          </div>
          <div style="margin-bottom: 20px;">
            <h2 style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #DDD6FE; margin: 0 0 8px 0;">Contact</h2>
            ${p.email ? `<p style="font-size: 10px; color: #EDE9FE; margin: 0 0 4px 0;">✉ ${p.email}</p>` : ""}
            ${p.phone ? `<p style="font-size: 10px; color: #EDE9FE; margin: 0 0 4px 0;">✆ ${p.phone}</p>` : ""}
            ${p.location ? `<p style="font-size: 10px; color: #EDE9FE; margin: 0 0 4px 0;">⌖ ${p.location}</p>` : ""}
            ${p.linkedin ? `<p style="font-size: 10px; color: #EDE9FE; margin: 0 0 4px 0;">in ${p.linkedin}</p>` : ""}
          </div>
          ${(resume.skills || []).length > 0 ? `
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #DDD6FE; margin: 0 0 8px 0;">Skills</h2>
              ${resume.skills.map(s => `
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                  <div style="width: 6px; height: 6px; background: white; border-radius: 50%; flex-shrink: 0;"></div>
                  <span style="font-size: 10px; color: #EDE9FE;">${s}</span>
                </div>`).join("")}
            </div>` : ""}
          ${(resume.education || []).length > 0 ? `
            <div>
              <h2 style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #DDD6FE; margin: 0 0 8px 0;">Education</h2>
              ${resume.education.map(edu => `
                <div style="margin-bottom: 10px;">
                  <p style="font-size: 11px; font-weight: 700; color: white; margin: 0;">${edu.degree || ""}</p>
                  ${edu.field ? `<p style="font-size: 10px; color: #DDD6FE; margin: 2px 0;">${edu.field}</p>` : ""}
                  <p style="font-size: 10px; color: #C4B5FD; margin: 2px 0;">${edu.school || ""}</p>
                  <p style="font-size: 9px; color: #A78BFA; margin: 0;">${edu.endDate || ""}</p>
                </div>`).join("")}
            </div>` : ""}
        </div>
        <div style="flex: 1; padding: 32px 24px;">
          ${resume.summary ? `
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 10px; font-weight: 700; color: #7C3AED; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 6px 0;">About Me</h2>
              <p style="font-size: 12px; color: #475569; line-height: 1.6; margin: 0;">${resume.summary}</p>
            </div>` : ""}
          ${(resume.experience || []).length > 0 ? `
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 10px; font-weight: 700; color: #7C3AED; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #EDE9FE; padding-bottom: 4px; margin-bottom: 12px;">Experience</h2>
              ${resume.experience.map(exp => `
                <div style="border-left: 2px solid #EDE9FE; padding-left: 12px; margin-bottom: 14px;">
                  <p style="font-size: 13px; font-weight: 700; margin: 0;">${exp.jobTitle || ""}</p>
                  <p style="font-size: 10px; color: #7C3AED; margin: 2px 0;">${exp.company || ""} · ${exp.startDate || ""} — ${exp.current ? "Present" : exp.endDate || ""}</p>
                  ${exp.description ? `<p style="font-size: 11px; color: #475569; margin: 4px 0 0 0; white-space: pre-line; line-height: 1.6;">${exp.description}</p>` : ""}
                </div>`).join("")}
            </div>` : ""}
          ${(resume.projects || []).length > 0 ? `
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 10px; font-weight: 700; color: #7C3AED; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #EDE9FE; padding-bottom: 4px; margin-bottom: 12px;">Projects</h2>
              ${resume.projects.map(proj => `
                <div style="margin-bottom: 10px;">
                  <p style="font-size: 13px; font-weight: 700; margin: 0;">${proj.name || ""}</p>
                  ${proj.tech ? `<p style="font-size: 10px; color: #7C3AED; margin: 2px 0;">${proj.tech}</p>` : ""}
                  ${proj.description ? `<p style="font-size: 11px; color: #475569; margin: 4px 0 0 0;">${proj.description}</p>` : ""}
                </div>`).join("")}
            </div>` : ""}
          ${(resume.certifications || []).length > 0 ? `
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 10px; font-weight: 700; color: #7C3AED; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #EDE9FE; padding-bottom: 4px; margin-bottom: 12px;">Certifications</h2>
              ${resume.certifications.map(c => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <div>
                    <p style="font-size: 13px; font-weight: 700; margin: 0;">${c.name || ""}</p>
                    <p style="font-size: 11px; color: #475569; margin: 2px 0;">${c.issuer || ""}</p>
                  </div>
                  ${c.date ? `<p style="font-size: 10px; color: #94A3B8; margin: 0;">${c.date}</p>` : ""}
                </div>`).join("")}
            </div>` : ""}
        </div>
      </div>`,

    executive: `
      <div style="font-family: Inter, sans-serif; color: #0F172A; background: white; min-height: 100vh;">
        <div style="background: #92400E; color: white; padding: 28px 40px;">
          <h1 style="font-size: 24px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 8px 0;">${p.fullName || "Your Name"}</h1>
          <div style="width: 48px; height: 2px; background: #FCD34D; margin-bottom: 8px;"></div>
          <p style="font-size: 10px; color: #FDE68A; margin: 0;">${contact}</p>
        </div>
        <div style="padding: 28px 40px;">
          ${resume.summary ? `
            <div style="border-left: 4px solid #92400E; padding-left: 12px; margin-bottom: 24px;">
              <p style="font-size: 12px; color: #475569; font-style: italic; line-height: 1.6; margin: 0;">${resume.summary}</p>
            </div>` : ""}
          ${(resume.experience || []).length > 0 ? `
            <div style="margin-bottom: 24px;">
              <h2 style="font-size: 10px; font-weight: 700; color: #92400E; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 12px 0;">Professional Experience</h2>
              ${resume.experience.map(exp => `
                <div style="margin-bottom: 16px;">
                  <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #FEF3C7; padding-bottom: 6px; margin-bottom: 6px;">
                    <div>
                      <p style="font-size: 13px; font-weight: 700; margin: 0;">${exp.jobTitle || ""}</p>
                      <p style="font-size: 11px; color: #92400E; font-weight: 600; margin: 2px 0;">${exp.company || ""}${exp.location ? `, ${exp.location}` : ""}</p>
                    </div>
                    <p style="font-size: 10px; color: #94A3B8; margin: 0; white-space: nowrap;">${exp.startDate || ""} — ${exp.current ? "Present" : exp.endDate || ""}</p>
                  </div>
                  ${exp.description ? `<p style="font-size: 11px; color: #475569; margin: 0; white-space: pre-line; line-height: 1.6;">${exp.description}</p>` : ""}
                </div>`).join("")}
            </div>` : ""}
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
            ${(resume.education || []).length > 0 ? `
              <div>
                <h2 style="font-size: 10px; font-weight: 700; color: #92400E; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0;">Education</h2>
                ${resume.education.map(edu => `
                  <div style="margin-bottom: 8px;">
                    <p style="font-size: 13px; font-weight: 700; margin: 0;">${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}</p>
                    <p style="font-size: 11px; color: #475569; margin: 2px 0;">${edu.school || ""}</p>
                    <p style="font-size: 10px; color: #94A3B8; margin: 0;">${edu.endDate || ""}</p>
                  </div>`).join("")}
              </div>` : ""}
            ${(resume.skills || []).length > 0 ? `
              <div>
                <h2 style="font-size: 10px; font-weight: 700; color: #92400E; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0;">Core Competencies</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                  ${resume.skills.map(s => `<p style="font-size: 10px; color: #475569; margin: 0;">▪ ${s}</p>`).join("")}
                </div>
              </div>` : ""}
          </div>
          ${(resume.certifications || []).length > 0 ? `
            <div>
              <h2 style="font-size: 10px; font-weight: 700; color: #92400E; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 10px 0;">Certifications</h2>
              ${resume.certifications.map(c => `
                <p style="font-size: 12px; color: #475569; margin: 0 0 4px 0;">▪ ${c.name || ""} — ${c.issuer || ""} ${c.date ? `(${c.date})` : ""}</p>`).join("")}
            </div>` : ""}
        </div>
      </div>`,

    compact: `
      <div style="font-family: Inter, sans-serif; display: flex; min-height: 100vh; background: white;">
        <div style="width: 35%; background: #0891B2; color: white; padding: 28px 16px;">
          <h1 style="font-size: 16px; font-weight: 700; margin: 0 0 8px 0; line-height: 1.3;">${p.fullName || "Your Name"}</h1>
          <div style="width: 32px; height: 2px; background: #67E8F9; margin-bottom: 20px;"></div>
          <div style="margin-bottom: 18px;">
            <h2 style="font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #A5F3FC; margin: 0 0 6px 0;">Contact</h2>
            ${p.email ? `<p style="font-size: 9px; color: #CFFAFE; margin: 0 0 3px 0;">${p.email}</p>` : ""}
            ${p.phone ? `<p style="font-size: 9px; color: #CFFAFE; margin: 0 0 3px 0;">${p.phone}</p>` : ""}
            ${p.location ? `<p style="font-size: 9px; color: #CFFAFE; margin: 0 0 3px 0;">${p.location}</p>` : ""}
            ${p.linkedin ? `<p style="font-size: 9px; color: #CFFAFE; margin: 0 0 3px 0;">${p.linkedin}</p>` : ""}
          </div>
          ${(resume.skills || []).length > 0 ? `
            <div style="margin-bottom: 18px;">
              <h2 style="font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #A5F3FC; margin: 0 0 6px 0;">Skills</h2>
              ${resume.skills.map(s => `<p style="font-size: 9px; color: #CFFAFE; margin: 0 0 3px 0;">— ${s}</p>`).join("")}
            </div>` : ""}
          ${(resume.education || []).length > 0 ? `
            <div style="margin-bottom: 18px;">
              <h2 style="font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #A5F3FC; margin: 0 0 6px 0;">Education</h2>
              ${resume.education.map(edu => `
                <div style="margin-bottom: 8px;">
                  <p style="font-size: 10px; font-weight: 700; color: white; margin: 0;">${edu.degree || ""}</p>
                  ${edu.field ? `<p style="font-size: 9px; color: #A5F3FC; margin: 1px 0;">${edu.field}</p>` : ""}
                  <p style="font-size: 9px; color: #67E8F9; margin: 1px 0;">${edu.school || ""}</p>
                  <p style="font-size: 8px; color: #22D3EE; margin: 0;">${edu.endDate || ""}</p>
                </div>`).join("")}
            </div>` : ""}
          ${(resume.certifications || []).length > 0 ? `
            <div>
              <h2 style="font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #A5F3FC; margin: 0 0 6px 0;">Certifications</h2>
              ${resume.certifications.map(c => `
                <div style="margin-bottom: 6px;">
                  <p style="font-size: 10px; font-weight: 700; color: white; margin: 0;">${c.name || ""}</p>
                  <p style="font-size: 9px; color: #67E8F9; margin: 1px 0;">${c.issuer || ""}</p>
                </div>`).join("")}
            </div>` : ""}
        </div>
        <div style="flex: 1; padding: 28px 20px;">
          ${resume.summary ? `
            <div style="margin-bottom: 18px;">
              <h2 style="font-size: 9px; font-weight: 700; color: #0891B2; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #E2E8F0; padding-bottom: 3px; margin-bottom: 6px;">Profile</h2>
              <p style="font-size: 11px; color: #475569; line-height: 1.6; margin: 0;">${resume.summary}</p>
            </div>` : ""}
          ${(resume.experience || []).length > 0 ? `
            <div style="margin-bottom: 18px;">
              <h2 style="font-size: 9px; font-weight: 700; color: #0891B2; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #E2E8F0; padding-bottom: 3px; margin-bottom: 10px;">Experience</h2>
              ${resume.experience.map(exp => `
                <div style="margin-bottom: 12px;">
                  <div style="display: flex; justify-content: space-between;">
                    <p style="font-size: 12px; font-weight: 700; margin: 0;">${exp.jobTitle || ""}</p>
                    <p style="font-size: 9px; color: #94A3B8; margin: 0;">${exp.startDate || ""} — ${exp.current ? "Present" : exp.endDate || ""}</p>
                  </div>
                  <p style="font-size: 10px; color: #0891B2; margin: 2px 0;">${exp.company || ""}</p>
                  ${exp.description ? `<p style="font-size: 10px; color: #475569; margin: 4px 0 0 0; white-space: pre-line; line-height: 1.6;">${exp.description}</p>` : ""}
                </div>`).join("")}
            </div>` : ""}
          ${(resume.projects || []).length > 0 ? `
            <div style="margin-bottom: 18px;">
              <h2 style="font-size: 9px; font-weight: 700; color: #0891B2; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #E2E8F0; padding-bottom: 3px; margin-bottom: 10px;">Projects</h2>
              ${resume.projects.map(proj => `
                <div style="margin-bottom: 8px;">
                  <p style="font-size: 12px; font-weight: 700; margin: 0;">${proj.name || ""}${proj.tech ? ` <span style="font-weight: 400; color: #0891B2; font-size: 10px;">· ${proj.tech}</span>` : ""}</p>
                  ${proj.description ? `<p style="font-size: 10px; color: #475569; margin: 3px 0 0 0;">${proj.description}</p>` : ""}
                </div>`).join("")}
            </div>` : ""}
        </div>
      </div>`,

    classic: `
      <div style="font-family: 'Times New Roman', serif; color: #0F172A; background: white; padding: 40px 48px; min-height: 100vh;">
        <div style="text-align: center; border-bottom: 2px solid #1E293B; padding-bottom: 16px; margin-bottom: 20px;">
          <h1 style="font-size: 22px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 8px 0;">${p.fullName || "Your Name"}</h1>
          <p style="font-size: 11px; color: #475569; margin: 0;">${contact}</p>
        </div>
        ${resume.summary ? `
          <div style="margin-bottom: 18px;">
            <h2 style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; background: #1E293B; color: white; padding: 3px 0; text-align: center; margin: 0 0 8px 0;">Objective</h2>
            <p style="font-size: 12px; color: #475569; text-align: center; line-height: 1.6; margin: 0;">${resume.summary}</p>
          </div>` : ""}
        ${(resume.experience || []).length > 0 ? `
          <div style="margin-bottom: 18px;">
            <h2 style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; background: #1E293B; color: white; padding: 3px 0; text-align: center; margin: 0 0 10px 0;">Professional Experience</h2>
            ${resume.experience.map(exp => `
              <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between;">
                  <p style="font-size: 12px; font-weight: 700; text-transform: uppercase; margin: 0;">${exp.jobTitle || ""}</p>
                  <p style="font-size: 10px; color: #94A3B8; margin: 0;">${exp.startDate || ""} — ${exp.current ? "Present" : exp.endDate || ""}</p>
                </div>
                <p style="font-size: 11px; color: #475569; margin: 2px 0;">${exp.company || ""}${exp.location ? `, ${exp.location}` : ""}</p>
                ${exp.description ? `<p style="font-size: 11px; color: #475569; margin: 4px 0 0 0; white-space: pre-line; line-height: 1.6;">${exp.description}</p>` : ""}
              </div>`).join("")}
          </div>` : ""}
        ${(resume.education || []).length > 0 ? `
          <div style="margin-bottom: 18px;">
            <h2 style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; background: #1E293B; color: white; padding: 3px 0; text-align: center; margin: 0 0 10px 0;">Education</h2>
            ${resume.education.map(edu => `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <div>
                  <p style="font-size: 13px; font-weight: 700; margin: 0;">${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}</p>
                  <p style="font-size: 11px; color: #475569; margin: 2px 0;">${edu.school || ""}${edu.gpa ? ` — GPA: ${edu.gpa}` : ""}</p>
                </div>
                <p style="font-size: 10px; color: #94A3B8; margin: 0;">${edu.startDate || ""} — ${edu.endDate || ""}</p>
              </div>`).join("")}
          </div>` : ""}
        ${(resume.skills || []).length > 0 ? `
          <div style="margin-bottom: 18px;">
            <h2 style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; background: #1E293B; color: white; padding: 3px 0; text-align: center; margin: 0 0 8px 0;">Skills</h2>
            <p style="font-size: 12px; color: #475569; text-align: center; margin: 0;">${resume.skills.join(" • ")}</p>
          </div>` : ""}
        ${(resume.projects || []).length > 0 ? `
          <div style="margin-bottom: 18px;">
            <h2 style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; background: #1E293B; color: white; padding: 3px 0; text-align: center; margin: 0 0 10px 0;">Projects</h2>
            ${resume.projects.map(proj => `
              <div style="margin-bottom: 10px;">
                <p style="font-size: 12px; font-weight: 700; text-transform: uppercase; margin: 0;">${proj.name || ""}</p>
                ${proj.tech ? `<p style="font-size: 10px; color: #475569; margin: 2px 0;">${proj.tech}</p>` : ""}
                ${proj.description ? `<p style="font-size: 11px; color: #475569; margin: 4px 0 0 0;">${proj.description}</p>` : ""}
              </div>`).join("")}
          </div>` : ""}
        ${(resume.certifications || []).length > 0 ? `
          <div style="margin-bottom: 18px;">
            <h2 style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; background: #1E293B; color: white; padding: 3px 0; text-align: center; margin: 0 0 10px 0;">Certifications</h2>
            ${resume.certifications.map(c => `
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <p style="font-size: 12px; font-weight: 700; margin: 0;">${c.name || ""} — <span style="font-weight: 400;">${c.issuer || ""}</span></p>
                ${c.date ? `<p style="font-size: 10px; color: #94A3B8; margin: 0;">${c.date}</p>` : ""}
              </div>`).join("")}
          </div>` : ""}
      </div>`,
  };

  const templateHTML = templates[resume.templateId] || templates.modern;

  return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; }
        </style>
      </head>
      <body>${templateHTML}</body>
    </html>`;
};

exports.generateResumePDF = async (resume, res) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    const html = generateTemplateHTML(resume);

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${(resume.title || "resume").replace(/[^a-z0-9\-_ ]/gi, "")}.pdf"`
    );
    res.send(pdf);
  } finally {
    await browser.close();
  }
};