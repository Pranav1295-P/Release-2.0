# Pranav Murthy — Official WebPage

Premium dark portfolio site for **Pranav Murthy** & **Relativity OpenSource**.
Full-stack: animated React frontend + Node/Express/MongoDB backend with auth, blog comments, and PDF report uploads.

## What's inside

- **Welcome animation** — cinematic intro on first load each session
- **Home** — hero, portrait, about, company section
- **Projects** — live GitHub repo feed from `@Pranav1295-P`
- **Free-Conversations** (Blogs) — only Pranav can publish; any registered user can comment
- **Reports** — any registered user can publish PDF reports
- **Auth** — username + password, JWT, bcrypt

## Stack

| Layer    | Tech                                                |
|----------|-----------------------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Axios  |
| Backend  | Node.js, Express, Mongoose, JWT, bcryptjs, Multer   |
| Database | MongoDB (Atlas in prod, local in dev)               |
| Hosting  | Vercel (frontend) + Render (backend) + Atlas (DB)   |

## Local quickstart

```bash
# 1. Backend
cd backend
cp .env.example .env       # edit MONGO_URI, JWT_SECRET, ADMIN_USERNAME
npm install
npm run dev                # http://localhost:5000

# 2. Frontend (in a new terminal)
cd frontend
npm install
npm run dev                # http://localhost:5173
```

Open http://localhost:5173 and register with the username you set as `ADMIN_USERNAME` — that account gets blog-publishing rights.

## Add your photo

Drop your portrait at:

```
frontend/public/pranav.jpg
```

It will appear in the framed portrait on the Home page. If the file is missing, the page falls back to a gold "P" monogram automatically.

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for step-by-step instructions to deploy to Vercel + Render + MongoDB Atlas (all free tier).

## Footer

> All rights Reserved 2026 By Pranav Murthy And Relativity
