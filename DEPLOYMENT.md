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

   | Key                     | Value                                                        |
   |-------------------------|--------------------------------------------------------------|
   | `MONGO_URI`             | the Atlas string from Step 1                                 |
   | `JWT_SECRET`            | a long random string (e.g. `openssl rand -hex 48`)           |
   | `ADMIN_USERNAME`        | `pranav` (the username you'll register with)                 |
   | `CORS_ORIGIN`           | `https://your-frontend.vercel.app` (set after Step 3)        |
   | `PUBLIC_URL`            | the Render URL Render gives you                              |
   | `PORT`                  | `10000` (Render's default)                                   |
   | `RESEND_API_KEY`        | from Step 2b below (OTP emails)                              |
   | `EMAIL_FROM`            | from Step 2b below                                           |
   | `CLOUDINARY_CLOUD_NAME` | from Step 2c below (image/video uploads)                     |
   | `CLOUDINARY_API_KEY`    | from Step 2c below                                           |
   | `CLOUDINARY_API_SECRET` | from Step 2c below                                           |
   | `GOLD_VERIFIED_EMAILS`  | comma-separated emails that get the gold tick (e.g. `murthypranav662@gmail.com`) |
   | `RAZORPAY_KEY_ID`       | from Step 2d below (blue-tick payments)                      |
   | `RAZORPAY_KEY_SECRET`   | from Step 2d below                                           |
   | `RAZORPAY_WEBHOOK_SECRET` | from Step 2d below (optional)                              |

5. Click **Create Web Service**. Wait for the first deploy (~3 min).
6. When you see `✓ API listening` in the logs, copy the URL — that's your backend.

> The site runs without `RESEND_*` and `CLOUDINARY_*` set — but OTP codes will only print to the Render logs (not emailed), and media uploads on blog posts will be rejected. Set them up below to make those features work for real.

---

## Step 2b — Resend (OTP emails)

OTP codes for registration and password reset are sent via Resend.

1. Go to **https://resend.com** and sign up (free tier: 3,000 emails/month).
2. **API Keys** → **Create API Key** → name it `pranav-portfolio` → copy the key (starts with `re_`).
3. In Render → **Environment**, set:
   - `RESEND_API_KEY` = the key you copied
   - `EMAIL_FROM` = `Pranav Murthy <onboarding@resend.dev>`
     - `onboarding@resend.dev` works immediately for testing.
     - To send from your own domain (e.g. `noreply@murthy.sbs`), go to Resend → **Domains** → add and verify your domain via DNS records, then use `Pranav Murthy <noreply@murthy.sbs>`.
4. Save → Render redeploys.

---

## Step 2c — Cloudinary (image/video uploads)

Blog posts on Free-Conversations can attach images and videos. These are hosted on Cloudinary.

1. Go to **https://cloudinary.com** and sign up (free tier: 25 GB storage + bandwidth).
2. On the **Dashboard**, you'll see your account credentials. Copy three values:
   - **Cloud name**
   - **API Key**
   - **API Secret** (click to reveal)
3. In Render → **Environment**, set:
   - `CLOUDINARY_CLOUD_NAME` = your cloud name
   - `CLOUDINARY_API_KEY` = your API key
   - `CLOUDINARY_API_SECRET` = your API secret
4. Save → Render redeploys.

> Unlike Render's ephemeral disk, Cloudinary-hosted media survives every redeploy — this is why blog uploads use it instead of local disk.

---

## Step 2d — Razorpay (₹99/month blue-tick payments)

The blue verified tick is a ₹99/month subscription paid via Razorpay.

1. Go to **https://dashboard.razorpay.com** and sign up.
2. **Stay in Test Mode** for now — there's a toggle at the top of the dashboard. Test Mode needs no business KYC and accepts fake test cards. Switch to Live Mode later once your account is fully verified.
3. **Settings → API Keys → Generate Test Key**. You get:
   - **Key Id** — starts with `rzp_test_...`
   - **Key Secret** — shown once, copy it
4. In Render → **Environment**, set:
   - `RAZORPAY_KEY_ID` = the `rzp_test_...` key id
   - `RAZORPAY_KEY_SECRET` = the key secret
5. **(Optional but recommended) Webhook** — so payments still register even if the user closes the tab before the browser confirms:
   - Razorpay Dashboard → **Settings → Webhooks → Add New Webhook**
   - URL: `https://release-2-0.onrender.com/api/payments/webhook`
   - Active events: tick **`payment.captured`**
   - Set a **secret** → copy it → set `RAZORPAY_WEBHOOK_SECRET` in Render
6. Save → Render redeploys.

**Testing payments:** with Test Mode keys, on the Razorpay Checkout popup use card `4111 1111 1111 1111`, any future expiry, any CVV, any name. No real money moves. The blue tick will activate for 30 days.

> The gold tick (admin + `GOLD_VERIFIED_EMAILS`) is granted automatically at registration — no payment involved. Only the blue tick uses Razorpay.

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
2. Click **Sign in** → switch to the **Register** tab.
3. Enter your email → click **Send code**. A 6-digit code arrives by email (check spam).
4. Enter the code, choose username **`pranav`** (must match `ADMIN_USERNAME`), set a password ≥ 6 chars → **Create account**.
5. You're in. As the admin you can delete *any* post on Free-Conversations; regular users can delete only their own.

**How the auth flows work now:**

- **Register:** email → OTP code → pick username + password.
- **Login:** username + password.
- **Forgot password:** on the sign-in screen, "Forgot username or password?" → enter email → OTP code → set a new password.
- **Posting:** any signed-in user can post on Free-Conversations — text plus up to 4 images/videos — and delete their own posts. There's no separate "Write" page; the composer is inline at the top of the feed.
- **Verification:** the admin account and any email in `GOLD_VERIFIED_EMAILS` get a **gold tick** automatically on registration. Everyone else can buy a **blue tick** for ₹99/month from the `/verify` page (Razorpay). Both ticks show next to usernames on posts, comments, and the navbar.

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
