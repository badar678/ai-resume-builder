# ResumeAI

AI-powered resume builder and ATS optimizer. Build a resume, pick a professional template, get AI-driven suggestions and ATS match scoring against a job description, then export a polished PDF.

**Live:** https://resumeai-builder-app.vercel.app

## ✨ Features

- **Resume Builder** — multi-step editor (Personal Info → Summary → Experience → Education → Skills → Projects → Certifications) with live preview, drag-and-drop reordering, and autosave
- **2 professional templates** — Free & Pro tiers
- **ATS Analyzer** — paste a job description, get a match score, matched/missing keywords, and improvement suggestions
- **AI Suggestions** — AI-rewritten summaries and bullet points via Groq (Llama 3.3 70B)
- **PDF Export** — server-side PDF generation via Puppeteer, matching the selected template exactly
- **Subscription (Free / Pro)** — Paddle-powered checkout, webhook-driven plan sync
- **Admin Panel** — user list, template usage, subscription overview

## 🧱 Tech Stack

**Frontend** (`/frontend`)
React (Vite) · Tailwind CSS · Zustand · React Router · React Hook Form · @dnd-kit · Axios · @paddle/paddle-js

**Backend** (`/backend`)
Node.js + Express · MongoDB + Mongoose · Puppeteer · Groq SDK · @paddle/paddle-node-sdk · JWT + bcrypt

## ☁️ Deployment

Monorepo — deploy each half separately, pointing each platform's Root Directory at the right folder.

- Backend → [Render](https://render.com/)
- Frontend → [Vercel](https://vercel.com/)
