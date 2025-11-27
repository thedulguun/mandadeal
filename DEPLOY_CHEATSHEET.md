# 📋 Deployment Cheat Sheet

## Quick Commands Reference

### 1️⃣ Push to GitHub
```bash
cd c:\Users\dulgu\Downloads\EXE\EXE
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/ard-jump-game.git
git push -u origin main
```

---

### 2️⃣ Render Configuration (Game Backend)

| Setting | Value |
|---------|-------|
| **Name** | `ard-jump-game` |
| **Root Directory** | `game` ⚠️ |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Plan** | Free |

**Your game URL:** `https://ard-jump-game.onrender.com`

---

### 3️⃣ Update index.html (Line 1679)

**Before:**
```html
<iframe src="http://127.0.0.1:8000" title="Ард Жамп Game"></iframe>
```

**After:**
```html
<iframe src="https://ard-jump-game.onrender.com" title="Ард Жамп Game"></iframe>
```

**Push update:**
```bash
git add index.html
git commit -m "Update game URL"
git push
```

---

### 4️⃣ Cloudflare Pages Configuration (Landing Page)

| Setting | Value |
|---------|-------|
| **Project name** | `ard-jump` |
| **Production branch** | `main` |
| **Build command** | *(empty)* |
| **Build output directory** | *(empty)* |
| **Root directory** | *(empty)* |

**Your site URL:** `https://ard-jump.pages.dev`

---

## 🔗 Important Links

| Service | URL | What For |
|---------|-----|----------|
| **GitHub** | [github.com](https://github.com) | Host your code |
| **Render** | [render.com](https://render.com) | Deploy game backend |
| **Cloudflare** | [dash.cloudflare.com](https://dash.cloudflare.com) | Deploy landing page |

---

## ⚡ Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Game doesn't load | Wait 30 seconds (Render wakes up) |
| Build failed on Render | Check Root Directory = `game` |
| Build failed on Cloudflare | Leave build commands EMPTY |
| Repo not found | Make sure repo is PUBLIC |
| CORS error | Already fixed in `main.py` |

---

## 🔄 How to Update

```bash
# Make changes to your code
git add .
git commit -m "Your change description"
git push
# Wait 2-3 minutes for auto-deploy
```

---

## 💰 Cost

- **Render:** FREE (750 hours/month)
- **Cloudflare Pages:** FREE (unlimited)
- **GitHub:** FREE (public repos)
- **TOTAL:** $0/month 🎉

---

## ✅ Success Checklist

- [ ] Code pushed to GitHub
- [ ] Render deployment successful
- [ ] Game loads at Render URL
- [ ] index.html updated with Render URL
- [ ] Cloudflare Pages deployed
- [ ] Landing page loads
- [ ] Game loads in modal
- [ ] Everything works!

---

**Full Guide:** See `STEP_BY_STEP_DEPLOY.md` for detailed instructions
