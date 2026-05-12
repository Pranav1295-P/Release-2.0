# Deployment Guide

We'll deploy three pieces, all on free tiers:

1. **MongoDB Atlas** — the database
2. **Render** — the Node/Express backend (also stores uploaded PDFs)
3. **Vercel** — the React frontend

Estimated time: ~30 minutes.

---

## Step 0 — Prerequisites

- A GitHub account
- Node.js 20+ installed locally (only needed if you want to test before deploying)
- The `pranav-portfolio/` folder pushed to a **GitHub repository** (private is fine).

```bash
cd pranav-portfolio
git init
git add .
git commit -m "Initial commit"
gh repo create pranav-portfolio --private --source=. --push
```

---

## Step 1 — MongoDB Atlas (Database)

1. Go to **https://www.mongodb.com/atlas** and sign up (free).
2. Click **Build a Database** → choose **M0 Free** → pick a region close to you → Create.
3. In **Security → Database Access**, create a database user:
   - Username: `pranav`
   - Password: generate a strong one and **save it**.
4. In **Security → Network Access**, click **Add IP Address** → choose **Allow access from anywhere** (`0.0.0.0/0`).
5. Back on **Database → Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://pranav:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Replace `<password>` with your real password and add the database name before the `?`:
   ```
   mongodb+srv://pranav:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/pranav-portfolio?retryWrites=true&w=majority
   ```
   **Save this string** — you'll paste it into Render in the next step.

---

## Step 2 — Render (Backend)

1. Go to **https://render.com** and sign in with GitHub.
2. Click **New → Web Service** and connect your `pranav-portfolio` repository.
3. Fill the form:
   - **Name:** `pranav-portfolio-api`
   - **Region:** closest to you
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** **Free**
4. Under **Environment → Add Environment Variable**, add:

   | Key              | Value                                                        |
   |------------------|--------------------------------------------------------------|
   | `MONGO_URI`      | the Atlas string from Step 1                                 |
   | `JWT_SECRET`     | a long random string (e.g. `openssl rand -hex 48`)           |
   | `ADMIN_USERNAME` | `pranav` (the username you'll register with)                 |
   | `CORS_ORIGIN`    | `https://your-frontend.vercel.app` (set after Step 3)        |
   | `PUBLIC_URL`     | the Render URL Render gives you (e.g. `https://pranav-portfolio-api.onrender.com`) |
   | `PORT`           | `10000` (Render's default)                                   |

5. Click **Create Web Service**. Wait for the first deploy (~3 min).
6. When you see `✓ API listening` in the logs, copy the URL — that's your backend.

> **Note on PDF uploads on Render free tier:** Render's free disks are ephemeral — files survive restarts but vanish on redeploy. For a real production setup, swap the local Multer disk storage for **Cloudinary** or **AWS S3**. For your portfolio MVP, the current setup is fine.

---

## Step 3 — Vercel (Frontend)

1. Go to **https://vercel.com** and sign in with GitHub.
2. Click **Add New → Project**, import your `pranav-portfolio` repo.
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)
4. Under **Environment Variables**:

   | Key            | Value                                              |
   |----------------|----------------------------------------------------|
   | `VITE_API_URL` | `https://pranav-portfolio-api.onrender.com/api`    |

5. Click **Deploy**. Wait ~1–2 min.
6. Copy the live URL (e.g. `https://pranav-portfolio.vercel.app`).

---

## Step 4 — Wire the two together

Go back to **Render → Environment** for your backend and update:

```
CORS_ORIGIN = https://pranav-portfolio.vercel.app
```

Click **Save Changes** — Render will redeploy automatically.

---

## Step 5 — First-run setup

1. Open your live frontend URL.
2. Click **Sign in** → switch to **Register** tab.
3. Register with username **`pranav`** (must match `ADMIN_USERNAME`) and any password ≥ 6 chars.
4. You'll see a **Write** button in the navbar — that's how you publish blog posts.

---

## Step 6 — Add your photo

Drop your portrait at `frontend/public/pranav.jpg`, then:

```bash
git add frontend/public/pranav.jpg
git commit -m "Add portrait"
git push
```

Vercel auto-redeploys in seconds.

---

## Updating the site

Any push to `main` triggers automatic redeploys on both Vercel and Render. That's it.

---

## Troubleshooting

| Symptom                                 | Fix                                                                 |
|-----------------------------------------|---------------------------------------------------------------------|
| Frontend can't reach the API            | Check `VITE_API_URL` on Vercel; check `CORS_ORIGIN` on Render       |
| `MongoNetworkError`                     | Atlas network access not opened (Step 1.4)                          |
| Render service sleeps after 15 min idle | Free tier limitation. Upgrade to paid, or use a cron-pinger         |
| PDFs disappear after deploy             | Migrate to Cloudinary / S3 (see note in Step 2)                     |
| Got admin role on wrong account         | Set the right `ADMIN_USERNAME` and re-register, or update directly in MongoDB Atlas (set `isAdmin: true` on the user) |

---

## Optional — Custom domain

In Vercel: **Settings → Domains → Add** → follow DNS instructions.
You can use anything like `pranavmurthy.com` once registered (e.g. through Namecheap or Cloudflare Registrar).
