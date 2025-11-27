# Deployment Guide for Ард-Жамп

## Overview

Your project has two parts:
1. **Landing Page** (`index.html`) - Static website
2. **Game** (`game/`) - FastAPI Python application

Since the game requires a Python backend, we'll deploy them separately.

---

## Option 1: Free Deployment with Render + Cloudflare Pages (Recommended)

### Part A: Deploy the Game (FastAPI) on Render

**Render** offers free hosting for Python web apps.

#### Steps:

1. **Prepare the game for deployment**

   First, update `game/main.py` to add CORS support:

   ```python
   from fastapi import FastAPI
   from fastapi.responses import FileResponse
   from fastapi.staticfiles import StaticFiles
   from fastapi.middleware.cors import CORSMiddleware

   app = FastAPI()

   # Add CORS middleware to allow iframe embedding
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],  # In production, specify your domain
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )

   # Serve static files (JS, CSS) under /static
   app.mount("/static", StaticFiles(directory="static"), name="static")

   @app.get("/")
   async def root():
       """Serve the main game page."""
       return FileResponse("index.html")
   ```

2. **Create a new file `game/render.yaml`:**

   ```yaml
   services:
     - type: web
       name: ard-jump-game
       env: python
       buildCommand: pip install -r requirements.txt
       startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

3. **Push your game folder to GitHub:**
   - Create a new GitHub repository
   - Push only the `game/` folder contents

4. **Deploy on Render:**
   - Go to [render.com](https://render.com) and sign up (free)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Choose the `game` folder
   - Render will auto-detect Python
   - Click "Create Web Service"
   - Your game will be deployed at: `https://your-app-name.onrender.com`

5. **Note the URL** - You'll need it for the next step

### Part B: Deploy Landing Page on Cloudflare Pages

1. **Update the iframe URL in `index.html`:**

   Replace line 1679:
   ```html
   <iframe src="https://your-app-name.onrender.com" title="Ард Жамп Game"></iframe>
   ```

2. **Deploy to Cloudflare Pages:**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Select "Workers & Pages" → "Create application" → "Pages"
   - Connect your GitHub repository
   - Root directory: `/` (leave empty)
   - Build command: (leave empty - it's static)
   - Build output directory: (leave empty)
   - Click "Save and Deploy"

3. **Your site will be live at:** `https://your-project.pages.dev`

---

## Option 2: Deploy Everything on Vercel

Vercel supports Python serverless functions!

### Steps:

1. **Restructure for Vercel:**

   Create `vercel.json` in the root:
   ```json
   {
     "builds": [
       {
         "src": "game/main.py",
         "use": "@vercel/python"
       }
     ],
     "routes": [
       {
         "src": "/game/(.*)",
         "dest": "game/main.py"
       },
       {
         "src": "/(.*)",
         "dest": "/$1"
       }
     ]
   }
   ```

2. **Update `index.html`:**

   Change iframe URL to:
   ```html
   <iframe src="/game" title="Ард Жамп Game"></iframe>
   ```

3. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign up
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect settings
   - Click "Deploy"

4. **Your site will be live at:** `https://your-project.vercel.app`

**Note:** Vercel's free tier has serverless function limits (10 seconds execution time).

---

## Option 3: Deploy on Railway (Easiest for FastAPI)

**Railway** is perfect for FastAPI apps and has a generous free tier.

### Steps:

1. **Add `Procfile` to your project root:**
   ```
   web: cd game && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

2. **Deploy on Railway:**
   - Go to [railway.app](https://railway.app) and sign up
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Python
   - Click "Deploy"

3. **Configure environment:**
   - Railway will automatically set PORT
   - No additional config needed

4. **Get your URL:**
   - Click "Settings" → "Generate Domain"
   - You'll get: `https://your-app.railway.app`

5. **Update `index.html`:**
   ```html
   <iframe src="https://your-app.railway.app" title="Ард Жамп Game"></iframe>
   ```

6. **Deploy the landing page:**
   - Use Cloudflare Pages (free) for `index.html`
   - Or use Vercel/Netlify for static hosting

---

## Option 4: PythonAnywhere (Simplest, No Git Required)

**PythonAnywhere** offers free Python web hosting.

### Steps:

1. **Sign up at [pythonanywhere.com](https://www.pythonanywhere.com)** (free tier)

2. **Upload your game files:**
   - Use the "Files" tab
   - Upload all files from `game/` folder

3. **Open a Bash console:**
   - Install dependencies: `pip install -r requirements.txt`

4. **Create a Web App:**
   - Go to "Web" tab → "Add a new web app"
   - Choose "Manual configuration" → Python 3.10
   - Set working directory to your game folder

5. **Configure WSGI file:**
   - Edit `/var/www/yourusername_pythonanywhere_com_wsgi.py`
   - Add:
   ```python
   from main import app as application
   ```

6. **Your game will be at:** `https://yourusername.pythonanywhere.com`

7. **Deploy landing page separately** on Cloudflare Pages

---

## Quick Comparison

| Platform | Game Backend | Landing Page | Setup Difficulty | Best For |
|----------|-------------|--------------|------------------|----------|
| **Render + Cloudflare** | ✅ Free | ✅ Free | Medium | Best overall |
| **Vercel** | ✅ Free (limited) | ✅ Free | Easy | Quick setup |
| **Railway** | ✅ Free | Separate | Easy | FastAPI focus |
| **PythonAnywhere** | ✅ Free | Separate | Very Easy | No Git/CLI |

---

## Recommended: Render + Cloudflare Pages

**Advantages:**
- ✅ Completely free
- ✅ Unlimited bandwidth
- ✅ Auto-deploys from Git
- ✅ Custom domains
- ✅ SSL certificates
- ✅ Best performance

**Steps Summary:**
1. Deploy game to Render (Python backend)
2. Deploy landing page to Cloudflare Pages (static)
3. Update iframe URL to point to Render URL
4. Done! 🎉

---

## Important Files to Update Before Deployment

### 1. Update CORS in `game/main.py`
Replace with the version that includes CORS middleware (shown in Option 1)

### 2. Update iframe URL in `index.html`
Replace `http://127.0.0.1:8000` with your deployed game URL

### 3. Create `.gitignore` in root:
```
__pycache__/
*.pyc
.env
venv/
.DS_Store
```

---

## Need Help?

- **Render Docs:** https://render.com/docs
- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages/
- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app/

Good luck with your deployment! 🚀
