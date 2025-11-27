# 🚀 Step-by-Step Deployment Guide for Beginners

## Prerequisites Checklist

Before starting, make sure you have:
- [ ] A GitHub account (sign up at [github.com](https://github.com))
- [ ] Git installed on your computer
- [ ] Your code ready to push

---

## Part 1: Push Your Code to GitHub (10 minutes)

### Step 1.1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and log in
2. Click the **green "New"** button (top left, or the "+" icon → New repository)
3. Fill in the details:
   - **Repository name:** `ard-jump-game` (or any name you like)
   - **Description:** "Ард-Жамп game with FastAPI backend"
   - **Visibility:** Choose "Public" (free hosting requires public repos)
   - **DON'T** check "Initialize with README" (we already have files)
4. Click **"Create repository"**

### Step 1.2: Push Your Code to GitHub

Open Command Prompt/Terminal in your project folder:
```bash
cd c:\Users\dulgu\Downloads\EXE\EXE
```

Run these commands one by one:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit the files
git commit -m "Initial commit - Ард-Жамп game"

# Add your GitHub repo as remote (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/ard-jump-game.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Important:** Replace `YOUR-USERNAME` with your actual GitHub username!

**Example:**
If your username is "batbold123", the command would be:
```bash
git remote add origin https://github.com/batbold123/ard-jump-game.git
```

✅ **Your code is now on GitHub!** You can verify by visiting your repository URL.

---

## Part 2: Deploy the Game Backend on Render (15 minutes)

### Step 2.1: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click **"Get Started"** or **"Sign Up"**
3. Choose **"Sign up with GitHub"** (easiest option)
4. Authorize Render to access your GitHub account

### Step 2.2: Create a New Web Service

1. After logging in, you'll see the Render dashboard
2. Click the blue **"New +"** button (top right)
3. Select **"Web Service"** from the dropdown

### Step 2.3: Connect Your GitHub Repository

1. You'll see a list of your GitHub repositories
2. Find **"ard-jump-game"** (or whatever you named it)
3. Click **"Connect"** next to it

**Can't see your repo?** Click "Configure account" to give Render access to more repos.

### Step 2.4: Configure the Web Service

Fill in these settings:

| Field | What to Enter |
|-------|---------------|
| **Name** | `ard-jump-game` (or any unique name) |
| **Region** | Choose closest to you (e.g., Singapore, Oregon) |
| **Root Directory** | `game` ⚠️ **IMPORTANT!** |
| **Environment** | `Python 3` (auto-detected) |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Plan** | **Free** (should be selected by default) |

**Screenshot guide for Root Directory:**
- Look for a field labeled "Root Directory"
- Type: `game`
- This tells Render to deploy only the game folder

### Step 2.5: Deploy!

1. Scroll down and click the big blue **"Create Web Service"** button
2. Render will start deploying your game
3. You'll see a build log with lots of text scrolling
4. Wait 3-5 minutes for the deployment to complete
5. Look for a message saying **"Your service is live 🎉"**

### Step 2.6: Get Your Game URL

1. At the top of the page, you'll see your service URL
2. It will look like: `https://ard-jump-game.onrender.com`
3. **COPY THIS URL!** You'll need it in the next step

**Test it:** Click on the URL to open your game. You should see the game lobby!

---

## Part 3: Update Landing Page with Game URL (2 minutes)

### Step 3.1: Update index.html

1. Open `c:\Users\dulgu\Downloads\EXE\EXE\index.html` in your code editor
2. Find **line 1679** (use Ctrl+G to "Go to Line")
3. You'll see:
   ```html
   <iframe src="http://127.0.0.1:8000" title="Ард Жамп Game"></iframe>
   ```

4. Replace it with (use YOUR actual Render URL):
   ```html
   <iframe src="https://ard-jump-game.onrender.com" title="Ард Жамп Game"></iframe>
   ```

### Step 3.2: Push the Update to GitHub

```bash
cd c:\Users\dulgu\Downloads\EXE\EXE

git add index.html

git commit -m "Update game URL to Render deployment"

git push
```

✅ **Landing page updated!**

---

## Part 4: Deploy Landing Page on Cloudflare Pages (10 minutes)

### Step 4.1: Sign Up for Cloudflare

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click **"Sign Up"**
3. Enter your email and create a password
4. Verify your email (check your inbox)
5. Log in to Cloudflare

### Step 4.2: Go to Pages

1. In the Cloudflare dashboard, look at the left sidebar
2. Click **"Workers & Pages"**
3. Click the blue **"Create application"** button
4. Choose **"Pages"** tab
5. Click **"Connect to Git"**

### Step 4.3: Connect GitHub

1. Click **"Connect GitHub"**
2. A popup will ask you to authorize Cloudflare
3. Click **"Authorize"** or **"Install & Authorize"**
4. Choose whether to give access to:
   - **All repositories**, OR
   - **Only select repositories** (then select "ard-jump-game")
5. Click **"Install"** or **"Save"**

### Step 4.4: Select Your Repository

1. You'll be back in Cloudflare
2. Click **"Add account"** if needed to connect GitHub
3. You'll see a list of your repos
4. Find **"ard-jump-game"**
5. Click **"Begin setup"**

### Step 4.5: Configure Build Settings

Fill in these settings:

| Field | What to Enter |
|-------|---------------|
| **Project name** | `ard-jump` (or any name, will be in your URL) |
| **Production branch** | `main` |
| **Framework preset** | `None` |
| **Build command** | *Leave EMPTY* |
| **Build output directory** | *Leave EMPTY* |
| **Root directory** | *Leave EMPTY* (or `/`) |

**Why empty?** Your landing page is static HTML, no build needed!

### Step 4.6: Deploy!

1. Scroll down and click **"Save and Deploy"**
2. Cloudflare will start deploying (takes 1-2 minutes)
3. You'll see a progress indicator
4. When done, you'll see: **"Success! Your site is live!"**

### Step 4.7: Get Your Website URL

1. You'll see your site URL at the top:
   - Example: `https://ard-jump.pages.dev`
   - Or: `https://ard-jump-abc.pages.dev`
2. **Click on it to visit your site!**

---

## 🎉 You're Done! Testing Your Deployment

### Test Checklist:

1. **Visit your Cloudflare Pages URL**
   - Example: `https://ard-jump.pages.dev`

2. **You should see:**
   - ✅ The landing page with cyberpunk design
   - ✅ The "Тоглоом эхлэх" button

3. **Click "Тоглоом эхлэх":**
   - ✅ A phone-sized modal should appear
   - ✅ The game should load inside (may take 10-15 seconds on first load)
   - ✅ You can play the game!

4. **Click outside the modal:**
   - ✅ Modal should close

**If the game doesn't load:**
- Wait 30 seconds (Render free tier goes to sleep, first load is slow)
- Check that you updated the iframe URL in index.html
- Check browser console for errors (F12 → Console)

---

## 📱 Share Your Game!

Your game is now live at two URLs:

1. **Full Website (Landing Page + Game):**
   - `https://ard-jump.pages.dev` (or your custom URL)
   - Share this with friends!

2. **Game Only:**
   - `https://ard-jump-game.onrender.com`
   - Direct link to just the game

---

## 🔄 How to Update Your Game

When you make changes:

```bash
# Make your changes to the code
# Then push to GitHub:

git add .
git commit -m "Describe your changes here"
git push
```

**Auto-deploy:**
- Cloudflare Pages will automatically redeploy your landing page
- Render will automatically redeploy your game backend
- Wait 2-3 minutes for changes to go live

---

## ⚠️ Important Notes

### Render Free Tier Limitations:
- **Sleeps after 15 minutes of inactivity**
  - First load after sleep takes 10-15 seconds
  - Solution: Upgrade to paid plan ($7/month) for always-on
- **750 hours/month free**
  - More than enough for personal projects

### Cloudflare Pages:
- **Unlimited bandwidth** ✅
- **Unlimited requests** ✅
- **Completely free forever** ✅

---

## 🆘 Troubleshooting

### Problem: "Failed to deploy" on Render

**Solutions:**
1. Check that Root Directory is set to `game`
2. Verify `requirements.txt` exists in the game folder
3. Check build logs for specific error messages
4. Make sure `main.py` is in the game folder

### Problem: "Build failed" on Cloudflare

**Solutions:**
1. Leave build command EMPTY
2. Make sure `index.html` is in the root of your repo
3. Check that you pushed all files to GitHub

### Problem: Game doesn't load in iframe

**Solutions:**
1. Check that iframe URL matches your Render URL exactly
2. Wait 30 seconds for Render to wake up
3. Open browser console (F12) to see error messages
4. Make sure CORS is enabled in `game/main.py` (already done!)

### Problem: "Repository not found" on Render/Cloudflare

**Solutions:**
1. Make sure your repo is PUBLIC on GitHub
2. Re-authorize GitHub access
3. Check that you pushed code to GitHub successfully

---

## 💡 Pro Tips

1. **Custom Domain (Optional):**
   - Buy a domain (e.g., `ardjump.com`)
   - Add it in Cloudflare Pages settings
   - Free SSL certificate included!

2. **Keep Render Awake:**
   - Use a free service like [UptimeRobot](https://uptimerobot.com)
   - Ping your Render URL every 5 minutes
   - Prevents sleeping

3. **Check Deployment Status:**
   - Render: Check "Events" tab for deployment history
   - Cloudflare: Check "Deployments" tab

4. **Environment Variables:**
   - If you need API keys later, add them in:
     - Render: Settings → Environment
     - Cloudflare: Settings → Environment variables

---

## 📞 Need More Help?

- **Render Docs:** https://render.com/docs/web-services
- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages/
- **GitHub Help:** https://docs.github.com/en/get-started

**Still stuck?** Check the error messages carefully - they usually tell you exactly what's wrong!

---

## ✅ Final Checklist

Before you share your game:

- [ ] Game loads on Render URL
- [ ] Landing page loads on Cloudflare URL
- [ ] "Тоглоом эхлэх" button opens modal
- [ ] Game loads in modal (wait up to 30 seconds first time)
- [ ] Modal closes when clicking outside
- [ ] All images and assets load correctly
- [ ] Game is playable (controls work)

**All checked?** 🎉 **Congratulations! Your game is LIVE!**

Share your URL: `https://ard-jump.pages.dev` (or your custom URL)

---

Good luck! 🚀🎮
