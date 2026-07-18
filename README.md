# ResumeAI

AI-powered resume builder and ATS optimizer. Build a resume, pick a professional template, get AI-driven suggestions and ATS match scoring against a job description, then export a polished PDF.

Inspired by Resume.io/Enhancv, with a sharper focus on **ATS optimization + AI suggestions + a clean, fast UX**.

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

## 📁 Project Structure

```
resumeai/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/      # Zustand stores
│   │   └── services/    # API client
│   └── package.json
├── backend/            # Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── services/    # ATS, keyword, PDF, AI services
│   │   └── server.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- A MongoDB Atlas connection string (or local MongoDB)
- A Groq API key
- A Paddle sandbox account (API key, client token, webhook secret, Pro price ID)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values below
npm run dev
```

Create `backend/.env`:
```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
PADDLE_API_KEY=your_paddle_api_key
PADDLE_WEBHOOK_SECRET=your_paddle_webhook_secret
PADDLE_PRO_PRICE_ID=your_paddle_pro_price_id
PADDLE_ENV=sandbox
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # then fill in the values below
npm run dev
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_PADDLE_ENV=sandbox
VITE_PADDLE_CLIENT_TOKEN=your_paddle_client_token
VITE_PADDLE_PRO_PRICE_ID=your_paddle_pro_price_id
```

The frontend runs on `http://localhost:5173`, the backend on `http://localhost:5000`.

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

### After deploying
1. Update the Paddle webhook destination URL to point at your live backend.
2. (Optional but recommended) Lock down backend CORS to your deployed frontend origin instead of allowing all origins.

## 💳 Plans

| | Free | Pro |
|---|---|---|
| Resumes | 1 | Unlimited |
| Templates | Modern, Minimal, Creative | + Executive, Compact, Classic |
| AI Suggestions | ❌ | ✅ |
| ATS Check | Limited | Advanced |
| PDF Downloads | Limited | Unlimited |

## 📄 License

Private project — all rights reserved.
