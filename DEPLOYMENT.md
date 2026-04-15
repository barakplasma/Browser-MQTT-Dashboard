# Deployment Guide

Deploy the Browser MQTT Dashboard to various hosting platforms.

## 🚀 Vercel (Recommended - Zero Configuration)

### Option 1: Deploy with Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from project directory
vercel

# Follow the prompts to connect your GitHub account
# Select "." as the root directory
```

### Option 2: Deploy from GitHub (Automatic)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Vercel auto-detects it's a static site
6. Click "Deploy"

**Result:** Live at `https://your-project-name.vercel.app`

### Get Preview URLs for Pull Requests

Once connected to Vercel, every pull request automatically gets:
- **Preview URL** like `https://your-project-name-pr-1.vercel.app`
- **Automatic deployments** when you push changes
- **Production deployments** when you merge to main/master

## 🌍 GitHub Pages

### Setup

1. Go to repository Settings → Pages
2. Under "Build and deployment":
   - Source: Deploy from a branch
   - Branch: `main` (or `master`)
   - Folder: `/ (root)`
3. Save

### Deploy

```bash
# Push to main/master branch
git push origin main
```

**Result:** Live at `https://yourusername.github.io/Browser-MQTT-Dashboard/`

## 🔧 Netlify

### Option 1: CLI Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=.
```

### Option 2: GitHub Integration

1. Go to [Netlify](https://app.netlify.com)
2. Click "New site from Git"
3. Select GitHub and your repository
4. Build command: (leave empty)
5. Publish directory: `.`
6. Deploy

**Result:** Live at `https://your-site-name.netlify.app`

## 📦 Self-Hosted (Apache, Nginx, etc.)

### Copy all files to your web root:

```bash
# Copy entire directory to web server
cp -r /path/to/Browser-MQTT-Dashboard /var/www/html/mqtt-dashboard

# Or with rsync to remote server
rsync -avz --delete ./ user@server:/var/www/html/mqtt-dashboard/
```

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name mqtt-dashboard.example.com;

    root /var/www/html/mqtt-dashboard;
    index index.html;

    # Force HTTPS if serving over internet (for WebSocket)
    if ($scheme != "https") {
        return 301 https://$server_name$request_uri;
    }

    # Cache busting for assets
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Don't cache index.html
    location = /index.html {
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }
}
```

### Apache Configuration Example

```apache
<VirtualHost *:443>
    ServerName mqtt-dashboard.example.com
    DocumentRoot /var/www/html/mqtt-dashboard

    <Directory /var/www/html/mqtt-dashboard>
        Options -MultiViews
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.html [QSA,L]
    </Directory>

    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem
</VirtualHost>
```

## 🔐 HTTPS Requirement

**Important:** If accessing from a different domain than your MQTT broker, you **must use HTTPS** and your broker must support WebSocket Secure (WSS).

For local/internal use:
- HTTP + WS is fine on `localhost` or internal IPs
- Use `ws://192.168.1.x:8080` in configuration

For public/internet use:
- Must use HTTPS (for MQTT WSS support)
- Vercel, GitHub Pages, and Netlify all provide free HTTPS

## 📋 Pre-Deployment Checklist

- [ ] MQTT broker URL is correct
- [ ] Topic name is correct
- [ ] Using WSS for public deployments, WS for local
- [ ] Browser console shows no errors
- [ ] Test with sample data before deploying
- [ ] Update README with your broker details if custom

## 🔧 Environment Variables (Optional)

For sensitive configurations, you can use environment variables in Vercel:

1. Go to Vercel Project Settings → Environment Variables
2. Add variables like:
   - `MQTT_BROKER_URL`
   - `MQTT_TOPIC`
3. In your JavaScript, access them via:
   ```javascript
   const brokerUrl = process.env.MQTT_BROKER_URL
   const topic = process.env.MQTT_TOPIC
   ```

However, since this is a client-side app, these would still be visible in the browser. For truly sensitive credentials, consider a separate backend service.

## 📊 Monitoring & Analytics (Optional)

### Add Vercel Analytics

In `index.html`, add after the closing `</script>` tag:

```html
<script>
  // Vercel Web Analytics (optional)
  if (window.location.hostname !== 'localhost') {
    const script = document.createElement('script');
    script.src = 'https://cdn.vercel-analytics.com/v1/web.js';
    script.defer = true;
    document.head.appendChild(script);
  }
</script>
```

## 🆘 Troubleshooting

### CORS / Mixed Content Errors?
- Ensure MQTT broker uses WSS (not WS) for HTTPS sites
- Check browser console (F12) for specific errors

### 404 on Refresh?
- Single-page apps need proper redirect configuration
- Vercel handles this automatically
- GitHub Pages requires `/404.html` redirect

### WebSocket Connection Fails?
- Check broker URL format (wss:// vs ws://)
- Verify firewall allows WebSocket connections
- Test broker is accessible from your region

---

**Quick Start:** `vercel` in the project directory and follow the prompts!
