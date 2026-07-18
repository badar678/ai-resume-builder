# ResumeAI

AI-powered resume builder and ATS optimizer. Build a resume, pick a professional template, get AI-driven suggestions and ATS match scoring against a job description, then export a polished PDF.

Live: https://ai-resume-builder-eta-lilac.vercel.app/

## ✨ Features

- **Resume Builder** — multi-step editor (Personal Info → Summary → Experience → Education → Skills → Projects → Certifications) with live preview, drag-and-drop reordering, and autosave
- **6 professional templates** — Modern, Minimal, Creative (Free) · Executive, Compact, Classic (Pro)
- **ATS Analyzer** — paste a job description, get a match score, matched/missing keywords, and improvement suggestions
- **AI Suggestions** — AI-rewritten summaries and bullet points via Groq (Llama 3.3 70B)
- **PDF Export** — server-side PDF generation via Puppeteer, matching the selected template exactly
- **Subscription (Free / Pro)** — Paddle-powered checkout, webhook-driven plan sync
- **Admin Panel** — user list, template usage analytics, subscription overview

## 🧱 Tech Stack

**Frontend** (`/frontend`)
- React 19 + Vite
- Tailwind CSS
- Zustand (state management)
- React Router
- React Hook Form
- @dnd-kit (drag & drop)
- Axios
- @paddle/paddle-js

**Backend** (`/backend`)
- Node.js + Express 5
- MongoDB + Mongoose
- Puppeteer (PDF generation)
- Groq SDK (AI suggestions)
- @paddle/paddle-node-sdk (payments + webhooks)
- JWT authentication + bcrypt


## ☁️ Deployment

This is a monorepo — deploy each half separately, pointing each platform's **Root Directory** at the right folder.

### Backend → [Render](https://render.com)
- New Web Service → connect this repo → **Root Directory: `backend`**
- Build Command: `npm install`
- Start Command: `npm start`
- Add the same environment variables listed above (Environment tab)

### Frontend → [Vercel](https://vercel.com)
- New Project → import this repo → **Root Directory: `frontend`**
- Framework: Vite (auto-detected) · Build Command: `vite build` · Output Directory: `dist`
- Add the frontend environment variables above, with `VITE_API_URL` set to your deployed Render backend URL + `/api`


## 💳 Plans

| | Free | Pro |
|---|---|---|
| Resumes | 1 | Unlimited |
| Templates | Modern, Minimal, Creative | + Executive, Compact, Classic |
| AI Suggestions | ❌ | ✅ |
| ATS Check | Limited | Advanced |
| PDF Downloads | Limited | Unlimited |

