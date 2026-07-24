import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { getTemplate } from '../components/templates'

// Bare, unstyled page (no AppLayout/nav/sidebar) that Puppeteer navigates
// to on the backend to generate the PDF. It fetches the resume using a
// short-lived print token (query param, not localStorage) and renders the
// SAME template component used in PDFPreview.jsx, so the PDF always
// matches whatever the live preview shows — no separate HTML copy to
// maintain in the backend.
export default function PrintResume() {
  const { resumeId } = useParams()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [resumeData, setResumeData] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    api
      .get(`/resume/print/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (!cancelled) setResumeData(res.data)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })

    return () => {
      cancelled = true
    }
  }, [resumeId, token])

  if (error) {
    return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>Failed to load resume.</div>
  }

  if (!resumeData) {
    // Deliberately blank (no spinner/text) — Puppeteer waits for
    // #print-ready below, so this state is never actually captured.
    return <div />
  }

  const TemplateComponent = getTemplate(resumeData.templateId)

  return (
    <div style={{ width: '210mm', minHeight: '297mm', margin: '0 auto', background: '#fff' }}>
      <TemplateComponent data={resumeData} />
      {/* Signals to Puppeteer (page.waitForSelector) that the template has
          fully rendered and it's safe to print. */}
      <div id="print-ready" style={{ display: 'none' }} />
    </div>
  )
}