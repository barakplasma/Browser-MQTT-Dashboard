# Vercel Setup & Deployment Guide

Get your Browser MQTT Dashboard live on Vercel with automatic preview URLs for PRs.

## 🚀 Quick Setup (5 minutes)

### Step 1: Sign Up (First Time Only)
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign up"**
3. Choose **"GitHub"** (easiest option)
4. Authorize Vercel to access your GitHub account
5. Select **"Browser-MQTT-Dashboard"** repository to connect

### Step 2: Deploy
That's it! Vercel automatically:
- Detects the project is static (no build needed)
- Deploys to production
- Creates your live URL: `https://browser-mqtt-dashboard.vercel.app`

### Step 3: Get Preview URLs for PRs
Once deployed, every PR automatically gets:
- **Preview URL** like `https://browser-mqtt-dashboard-pr-3.vercel.app`
- **Automatic updates** when you push changes
- **Comments on PR** with the preview link

## 📋 Step-by-Step: GitHub to Vercel Connection

### Option A: Via GitHub (Recommended - Automatic)

**1. Go to Vercel Dashboard**
- Open [vercel.com/dashboard](https://vercel.com/dashboard)
- Sign in with your GitHub account

**2. Import Project**
- Click **"Add New"** → **"Project"**
- You should see "Browser-MQTT-Dashboard" in the list
- If not, click **"Import 3rd Party Git Repo"** and paste:
  ```
  https://github.com/barakplasma/Browser-MQTT-Dashboard
  ```

**3. Configure (Most settings auto-detected)**
- **Project Name:** `browser-mqtt-dashboard` (auto-filled)
- **Framework Preset:** `Other` (auto-detected as static)
- **Build Command:** Leave empty (no build needed)
- **Output Directory:** Leave empty or set to `.`
- **Environment Variables:** None needed for now

**4. Deploy**
- Click **"Deploy"**
- Wait 30-60 seconds for deployment
- You'll see your live URL!

### Option B: Via CLI (Command Line)

**1. Install Vercel CLI**
```bash
npm install -g vercel
```

**2. Deploy from Project Directory**
```bash
cd /path/to/Browser-MQTT-Dashboard
vercel
```

**3. Follow Prompts**
```
? Set up and deploy "~/Browser-MQTT-Dashboard"? [Y/n] y
? Which scope should contain your project? [your-username]
? Link to existing project? [y/N] N
? What's your project's name? browser-mqtt-dashboard
? In which directory is your code located? .
? Want to modify these settings? [y/N] N
```

**4. You're Live!**
After deployment, you'll see:
```
✓ Production: https://browser-mqtt-dashboard.vercel.app
```

## 🔗 What You Get

### Production URL
- Main deployment at `https://browser-mqtt-dashboard.vercel.app`
- Automatic updates when you merge to `master`/`main`

### Preview URLs for PRs
- Each PR gets its own unique preview URL
- Vercel posts a comment on the PR with the link
- Changes to the PR branch update the preview automatically
- Perfect for testing before merging!

### Example:
```
PR #3: Modern UI Redesign
Preview: https://browser-mqtt-dashboard-pr-3.vercel.app
```

## ⚙️ Configuration Details

Vercel uses `vercel.json` (already in your repo):

```json
{
  "buildCommand": "echo 'No build required'",
  "outputDirectory": ".",
  "framework": null,
  "installCommand": "echo 'No install required'"
}
```

This tells Vercel:
- ✅ No build step needed
- ✅ Serve files from root directory
- ✅ No dependencies to install
- ✅ No framework (just static files)

## 🎯 Verify It's Working

1. **Check Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)
   - Your project should appear in the list
   - Shows deployment history and status

2. **Test the Live URL**
   - Click the project in dashboard
   - Or visit `https://browser-mqtt-dashboard.vercel.app`
   - You should see the Dashboard UI load

3. **Test Preview URLs**
   - Create a test PR (or edit a file on `ui/modern-redesign`)
   - Wait 30 seconds for Vercel to build
   - Vercel will post a comment with preview URL
   - Click it to test your changes

## 🔐 HTTPS & WebSocket

Vercel provides **free HTTPS** for all deployments!

This means:
- ✅ WebSocket Secure (WSS) supported
- ✅ Can connect to public MQTT brokers (EMQX, etc.)
- ✅ No mixed content warnings
- ✅ Your dashboard works anywhere

## 📊 Monitoring Deployments

### In Vercel Dashboard:
- **Deployments** tab: See all versions
- **Activity** tab: View build logs
- **Settings**: Configure domain, environment variables, etc.

### In GitHub:
- Vercel comments on every PR with preview URL
- Status checks show if deployment succeeded
- Can click preview URL directly from PR

## 🆘 Troubleshooting

### "No build required" message keeps showing?
- That's normal! It just means Vercel recognizes your project is static

### Preview URL not working?
1. Wait 60 seconds (deployment can take a bit)
2. Hard refresh the page (Ctrl+Shift+R)
3. Check Vercel dashboard for build errors

### MQTT connection failing on Vercel?
- Make sure you're using `wss://` (secure WebSocket) for the broker URL
- Check your MQTT broker allows external connections
- Verify the broker domain/IP is accessible from internet
- Test at `http://localhost:8000` locally first

### Want to use a custom domain?
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records (Vercel will show instructions)

## 🔄 Continuous Deployment Workflow

Once set up, your workflow is:

```
1. Create feature branch
   git checkout -b feature/something

2. Make changes & commit
   git add .
   git commit -m "your changes"
   git push origin feature/something

3. Create Pull Request on GitHub
   - Vercel auto-builds preview
   - You get a preview URL in PR comments

4. Test the preview URL
   - Verify your changes work

5. Merge to master
   - Vercel auto-deploys to production
   - Your live site is updated!
```

## 💡 Pro Tips

1. **Environment Variables** (if needed later)
   - Settings → Environment Variables
   - Useful for sensitive configs
   - Note: Client-side app = values visible in browser

2. **Analytics** (optional)
   - Enable Web Analytics in Settings
   - See real usage stats

3. **Rollback** (if needed)
   - Deployments tab → Click past deployment → "Promote to Production"
   - Instant rollback to previous version

4. **Redeploy**
   - Click deployment → "Redeploy"
   - Useful if something went wrong

## 📚 Further Reading

- [Vercel Docs](https://vercel.com/docs)
- [Vercel Static Sites](https://vercel.com/docs/frameworks/static)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**You're all set!** Your dashboard is now live and you get automatic preview URLs for every PR. No more "works on my machine" - teammates can test changes instantly! 🎉
