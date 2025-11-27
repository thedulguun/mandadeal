# 🚀 Quick Deployment Checklist

## ✅ Step-by-Step Guide (Recommended: Render + Cloudflare)

### Step 1: Deploy Game Backend (5 minutes)

1. **Go to [render.com](https://render.com)** and sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Configure:
   - **Name:** `ard-jump-game`
   - **Root Directory:** `game`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click **"Create Web Service"**
6. Wait ~5 minutes for deployment
7. **Copy your URL:** `https://ard-jump-game.onrender.com` ⚠️ SAVE THIS!

---

### Step 2: Update Landing Page (1 minute)

1. Open `index.html`
2. Find line **1679** (the iframe)
3. Replace:
   ```html
   <iframe src="http://127.0.0.1:8000" title="Ård Жамп Game"></iframe>
   ```

   With:
   ```html
   <iframe src="https://YOUR-RENDER-URL.onrender.com" title="Ард Жамп Game"></iframe>
   ```

4. Save and commit to Git

---

### Step 3: Deploy Landing Page (3 minutes)

1. **Go to [dash.cloudflare.com](https://dash.cloudflare.com)** and sign up
2. Select **"Workers & Pages"** → **"Create application"** → **"Pages"**
3. Connect your GitHub repo
4. Configure:
   - **Project name:** `ard-jump`
   - **Production branch:** `main`
   - **Build command:** (leave empty)
   - **Build output directory:** (leave empty)
5. Click **"Save and Deploy"**
6. Your site will be live at: `https://ard-jump.pages.dev` 🎉

---

## Alternative: Deploy to Vercel (All-in-One)

### Single Platform Deployment (Easier but with limits)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Create `vercel.json` in root:**
   ```json
   {
     "functions": {
       "game/main.py": {
         "runtime": "python3.9"
       }
     },
     "rewrites": [
       { "source": "/game/(.*)", "destination": "/game/main.py" },
       { "source": "/game", "destination": "/game/main.py" }
     ]
   }
   ```

3. **Update `index.html` line 1679:**
   ```html
   <iframe src="/game" title="Ард Жамп Game"></iframe>
   ```

4. **Deploy:**
   ```bash
   cd c:\Users\dulgu\Downloads\EXE\EXE
   vercel
   ```

5. Follow prompts, your site will be at: `https://your-project.vercel.app`

---

## 🎯 Which Option Should You Choose?

| Choose This | If You Want |
|-------------|-------------|
| **Render + Cloudflare** | ✅ Best performance, unlimited, free forever |
| **Vercel** | ✅ Quickest setup, single command deployment |
| **Railway** | ✅ Great dashboard, easy Python deployment |

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- ✅ `game/main.py` has CORS middleware (already done!)
- ✅ `game/requirements.txt` exists (already done!)
- ✅ `.gitignore` is created (already done!)
- ✅ All files are committed to Git
- ✅ You have a GitHub account
- ✅ Repository is pushed to GitHub

---

## 🔧 Testing After Deployment

1. Open your deployed landing page URL
2. Click **"Тоглоом эхлэх"** button
3. The game modal should open
4. Game should load in phone-ratio view
5. Click outside to close modal ✨

---

## ⚠️ Common Issues & Fixes

### Issue: Game doesn't load in iframe
**Fix:** Check browser console for CORS errors. Make sure CORS is enabled in `game/main.py`

### Issue: 404 on Render
**Fix:** Make sure "Root Directory" is set to `game` in Render settings

### Issue: Cloudflare Pages build fails
**Fix:** It's a static site - make sure build command is empty

### Issue: Game shows "connection refused"
**Fix:** Wait 2-3 minutes after Render deployment, server needs to wake up

---

## 💰 Cost Breakdown (All FREE!)

- **Render:** Free tier includes 750 hours/month (enough!)
- **Cloudflare Pages:** Unlimited free static hosting
- **Vercel:** Free tier includes 100GB bandwidth/month
- **Total Cost:** $0/month 🎉

---

## 🌐 Custom Domain (Optional)

### Add Your Own Domain (Free!)

**On Cloudflare Pages:**
1. Go to your Pages project
2. Click "Custom domains"
3. Add your domain (e.g., `ardjump.com`)
4. Follow DNS setup instructions

**On Render:**
1. Go to your web service
2. Click "Settings" → "Custom Domain"
3. Add your domain for the game backend

---

## Need Help?

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guides
2. Visit platform documentation:
   - Render: https://render.com/docs
   - Cloudflare: https://developers.cloudflare.com/pages/
   - Vercel: https://vercel.com/docs

Good luck! 🚀🎮
