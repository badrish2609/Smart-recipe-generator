# 🍳 Smart Recipe Generator - Quick Start Guide

## ⚡ Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd "Smart Receipe Generator"
npm install
```

This installs dependencies for the entire project (root + server + client).

### Step 2: Start Backend Server
```bash
cd server
npm start
```
✅ Backend running on http://localhost:5000

### Step 3: Start Frontend (in new terminal)
```bash
cd client
npm run dev
```
✅ Frontend running on http://localhost:3000

### Step 4: Open in Browser
Visit: **http://localhost:3000** 🎉

---

## 🎯 Quick Features Demo

### 1. **Generate Recipes by Ingredients**
   - Enter: `chicken`, `tomato`, `onion`
   - Select filters (optional)
   - Click "Generate Recipes"
   - See matching recipes!

### 2. **Save Favorites**
   - Click ❤️ on any recipe
   - View in "Saved" tab
   
### 3. **Find Substitutions**
   - Go to "Tools" tab
   - Enter: `butter`
   - Get alternatives

### 4. **Upload Image**
   - Click 📷 icon
   - Upload food photo
   - Ingredients auto-detected

---

## 📝 Available Ingredients (for testing)

```
chicken    salmon      beef       bacon
tomato     onion       garlic     carrot
broccoli   pasta       rice       bread
eggs       milk        cheese     butter
oil        salt        pepper     herbs
```

---

## 🛠️ Development Commands

### Run Both Frontend & Backend Together
```bash
npm run dev
```

### Run Just Backend
```bash
cd server && npm start
```

### Build for Production
```bash
cd client && npm run build
```

---

## 🔗 API Base URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **API Documentation**: See README.md for all endpoints

---

## 📱 Mobile Testing

The app works great on mobile! Try:
- Resize browser to mobile size
- Test on actual mobile device on same network
- All features work on mobile

---

## 🐛 Troubleshooting

### Port 5000 already in use?
```bash
# Try different port
PORT=5001 npm start
```

### Port 3000 already in use?
```bash
# Vite will auto-use next available port
npm run dev
```

### Dependencies not installing?
```bash
# Clear and reinstall
rm -rf node_modules
npm install
```

---

## 📚 Project Structure Quick Reference

```
Smart Receipe Generator/
├── server/           # Express API
│   └── server.js    # Main server file
├── client/          # React app
│   ├── src/
│   │   ├── App.jsx  # Main component
│   │   └── index.css # Styles
│   └── vite.config.js
├── database/
│   └── recipes.json # 20+ Recipes
├── README.md        # Full documentation
└── APPROACH.md      # Technical approach
```

---

## ✨ Key Features at a Glance

| Feature | Status | How to Use |
|---------|--------|-----------|
| Generate by Ingredients | ✅ | Add ingredients → Generate |
| Save Favorites | ✅ | Click ❤️ on recipe |
| Filter by Diet | ✅ | Select checkboxes |
| Filter by Time | ✅ | Slide to set time |
| Find Substitutions | ✅ | Tools tab → Enter ingredient |
| Image Upload | ✅ | Click 📷 icon |
| View Nutrition | ✅ | Click recipe → See details |
| Search by Name | ✅ | Quick search box |

---

## 🎨 Customization Tips

### Change Colors
Edit `client/src/index.css` - Look for `:root` variables:
```css
:root {
  --primary: #FF6B6B;        /* Main color */
  --secondary: #4ECDC4;      /* Accent color */
  --accent: #FFE66D;         /* Highlight color */
}
```

### Add More Recipes
Edit `database/recipes.json` - Copy an existing recipe and modify:
```json
{
  "id": 21,
  "name": "Your Recipe",
  "cuisine": "Your Cuisine",
  ...
}
```

### Change API Port
In `server/server.js`, change:
```javascript
const PORT = process.env.PORT || 5001;  // Change 5000 to your port
```

---

## 🚀 Deployment Quick Links

### Deploy Frontend (Choose One)
- **Vercel**: `npm i -g vercel && vercel`
- **Netlify**: `npm i -g netlify-cli && netlify deploy`
- **GitHub Pages**: Follow [this guide](https://vitejs.dev/guide/static-deploy.html)

### Deploy Backend (Choose One)
- **Heroku**: `heroku create && git push heroku main`
- **Render**: Connect GitHub repo to [render.com](https://render.com)
- **Railway**: Connect GitHub repo to [railway.app](https://railway.app)

---

## 📞 Need Help?

1. Check **README.md** for complete documentation
2. Review **APPROACH.md** for technical details
3. Check **server.js** and **App.jsx** comments for code explanation

---

## ✅ Pre-Submission Checklist

Before submitting:
- [ ] App runs without errors
- [ ] All features work
- [ ] Mobile responsive (test on phone)
- [ ] No console errors
- [ ] README is clear
- [ ] Code is clean
- [ ] No `node_modules` in git
- [ ] GitHub repo is public
- [ ] Deployment link works

---

**Happy Cooking! 👨‍🍳** 

Start with: `npm run dev`
