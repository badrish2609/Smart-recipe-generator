# 🚀 Deployment Guide

Complete guide for deploying the Smart Recipe Generator to production.

## Frontend Deployment Options

### Option 1: Vercel (Recommended for React/Vite)

**Easiest option - takes 2 minutes!**

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy
```bash
cd client
vercel
```

#### Step 3: Follow prompts
- Confirm project settings
- Choose production environment
- Done! Your app is live 🎉

**Live URL**: `https://your-project.vercel.app`

---

### Option 2: Netlify

#### Step 1: Build the project
```bash
cd client
npm run build
```

#### Step 2: Using Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Step 3: Via GitHub (Recommended)
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect your GitHub repo
4. Set build command: `npm run build`
5. Set publish directory: `client/dist`
6. Auto-deploys on every push!

**Live URL**: `https://your-site.netlify.app`

---

### Option 3: GitHub Pages

#### Step 1: Update vite.config.js
```javascript
export default defineConfig({
  base: '/smart-recipe-generator/',  // Your repo name
  // ... rest of config
})
```

#### Step 2: Build and deploy
```bash
cd client
npm run build
npm run gh-pages  // or manually push dist/ to gh-pages branch
```

**Live URL**: `https://yourusername.github.io/smart-recipe-generator/`

---

## Backend Deployment Options

### Option 1: Render (Easiest)

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Settings:
   - Runtime: Node
   - Build command: `npm install`
   - Start command: `npm start`
5. Deploy!

**API URL**: `https://your-api.onrender.com`

---

### Option 2: Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Connect GitHub
4. Select server folder
5. Auto-detects Node.js → deploys automatically

**API URL**: `https://your-project.railway.app`

---

### Option 3: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set PORT=5000

# Deploy
git push heroku main
```

**API URL**: `https://your-app-name.herokuapp.com`

---

### Option 4: AWS Lambda (Serverless)

#### Setup with Serverless Framework
```bash
npm install -g serverless
serverless create --template aws-nodejs
```

[Full guide here](https://www.serverless.com/framework/docs/getting-started/)

---

## Full Stack Deployment

### Combined Deployment (Frontend + Backend on Same Platform)

#### Using Vercel with Serverless API
```
Project Structure:
├── api/           (becomes serverless functions)
│   └── index.js
└── public/        (static frontend)
    └── (build output from client)
```

---

## Environment Variables

### Frontend (.env.local)
```
VITE_API_URL=https://your-api.com
```

### Backend (.env)
```
PORT=5000
NODE_ENV=production
```

---

## Database Migration (Future)

When ready to upgrade from JSON to MongoDB/Firebase:

1. **MongoDB Atlas** (Free tier available)
   - Easy migration from JSON
   - Hosted solution
   - Connection string: `mongodb+srv://user:pass@cluster.mongodb.net/`

2. **Firebase Realtime Database**
   - Real-time sync
   - Easy authentication
   - Free tier: 100 concurrent connections

---

## Pre-Deployment Checklist

### Code Quality
- [ ] No console.errors or warnings
- [ ] Remove all `console.log()` statements
- [ ] Test all features work
- [ ] Mobile responsive verified

### Files to Exclude
- [ ] node_modules/ (add to .gitignore)
- [ ] .env (add to .gitignore)
- [ ] dist/ (frontend)
- [ ] .idea/, .vscode/

### Performance
- [ ] Images optimized
- [ ] Build completes without errors
- [ ] Bundle size acceptable
- [ ] Load times < 3 seconds

### Documentation
- [ ] README.md is complete
- [ ] API docs are accurate
- [ ] Approach documentation written
- [ ] Quick start guide included

---

## Post-Deployment

### Monitoring
- Check error logs regularly
- Monitor API response times
- Track user interactions
- Monitor database usage

### Updates
- Push fixes to GitHub
- Vercel/Netlify auto-redeploys
- Update version in package.json
- Keep dependencies updated

### Performance Optimization
```bash
# Check bundle size
cd client
npm run build -- --analyze

# Lighthouse audit
# Chrome DevTools > Lighthouse tab
```

---

## Troubleshooting Deployment

### Frontend won't build
```bash
cd client
npm install
npm run build
# Check for errors in output
```

### API returns 404
- Verify API URL is correct
- Check CORS settings in server
- Verify all API endpoints work locally first

### Port conflicts
```bash
# Check what's using the port
lsof -i :5000

# Use different port
PORT=5001 npm start
```

### Environment variables not loading
```bash
# Vercel: Set in project settings
# Netlify: Set in Build & deploy → Environment
# Railway: Set in Variables tab
```

---

## Cost Estimation

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | Yes | $0-20/mo |
| Netlify | Yes | $0-19/mo |
| Render | Yes (limited) | $7+/mo |
| Railway | Yes ($5/mo) | $5-100+/mo |
| AWS Lambda | Yes | $0.20 per 1M calls |

---

## Domain Setup

### Connect Custom Domain

#### For Vercel
1. Go to Project Settings
2. Domains → Add Domain
3. Follow DNS instructions
4. Usually available in 1-2 minutes

#### For Netlify
1. Domain settings → Add custom domain
2. Update DNS at registrar
3. Automatic SSL certificate

---

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v2
        with:
          name: build
          path: client/dist/
```

---

## Mobile App Distribution (Future)

- Wrap with Capacitor for iOS/Android
- Publish to App Store and Google Play
- Use Flutter for native performance

---

## Success! 🎉

Your app is deployed! Share the link:
- **Frontend**: `https://your-frontend.vercel.app`
- **Backend**: `https://your-api.onrender.com`

Next steps:
1. Test all features
2. Share with friends
3. Collect feedback
4. Iterate and improve

---

**Questions?** Check the main README.md or APPROACH.md for more details!
