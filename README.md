# 🍳 Smart Recipe Generator

**Developed by Master Badrish © 2026**

A professional full-stack web application that helps users discover delicious recipes based on their available ingredients. Features intelligent recipe matching, advanced filters, and a beautiful food-themed UI.

---

## 🌟 Live Demo

🔗 **Repository**: https://github.com/YOUR_USERNAME/smart-recipe-generator  
🚀 **Live Demo**: [Deploy to Vercel/Netlify for live URL]

---

## ✨ Key Features

### Core Functionality
- **🔍 Intelligent Recipe Search** - Enter ingredients and get matching recipes
- **🥘 Recipe Database** - 21+ curated recipes with detailed information
- **🎯 Smart Filtering** - Filter by cuisine, difficulty, cooking time, and dietary preferences
- **📸 Image Upload Ready** - Upload food images to detect ingredients (API ready)

### Advanced Features  
- **⭐ Recipe Rating System** - Rate recipes 1-5 stars with persistent storage
- **❤️ Favorites Management** - Save favorite recipes with localStorage persistence
- **🛒 Shopping List Generator** - Auto-generate shopping lists from recipes
- **🖨️ Print Recipe** - Print-friendly recipe format
- **🌟 Recipe of the Day** - Daily featured recipe that rotates automatically
- **🧮 Nutrition Calculator** - Adjust servings with real-time nutrition updates
- **🌙 Dark Mode** - Beautiful dark theme with smooth transitions
- **💾 Data Persistence** - All user preferences saved locally

### UI/UX Excellence
- **🎨 Food-Themed Design** - Vibrant red/orange/green color palette
- **📱 Fully Responsive** - Perfect on mobile, tablet, and desktop
- **✨ Smooth Animations** - Professional transitions and hover effects
- **🎭 Interactive Components** - Engaging UI with instant feedback

---

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern UI library
- **Vite 4.5.14** - Lightning-fast build tool
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with gradients and animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **CORS** - Cross-origin resource sharing
- **JSON Database** - Lightweight data storage (21 recipes)

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/smart-recipe-generator.git
   cd smart-recipe-generator
   ```

2. **Install all dependencies**
   ```bash
   npm install
   cd client && npm install && cd ..
   cd server && npm install && cd ..
   ```

3. **Start the application**
   ```bash
   npm start
   ```
   This runs both frontend and backend simultaneously!

4. **Access the application**
   - 🌐 Frontend: http://localhost:3000
   - 🔌 Backend API: http://localhost:5000

### Alternative - Run Separately

**Terminal 1 (Backend):**
```bash
cd server
npm start
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

---

## 📁 Project Structure

```
smart-recipe-generator/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/
│   │   │   └── RecipeCard.jsx    # Reusable recipe card component
│   │   ├── App.jsx                # Main application component
│   │   ├── index.css              # Global styles (1500+ lines)
│   │   └── main.jsx               # Entry point
│   ├── package.json               # Frontend dependencies
│   └── vite.config.js             # Vite configuration
│
├── server/                    # Backend Express application
│   ├── server.js              # API routes & server setup (400+ lines)
│   └── package.json           # Backend dependencies
│
├── database/                  # Data storage
│   └── recipes.json           # 21 curated recipes
│
├── README.md                  # This file
├── package.json               # Root package (runs both servers)
└── .gitignore                 # Git ignore rules
```

---

## 🎯 API Endpoints

### Recipe Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipes` | Get all recipes (21 recipes) |
| GET | `/api/recipes/:id` | Get single recipe by ID |
| POST | `/api/recipes/generate` | Generate recipes based on ingredients |
| POST | `/api/recipes/substitutions` | Get ingredient substitutions |
| POST | `/api/analyze-image` | Analyze food image (API ready) |

### Configuration Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/preferences` | Get user preferences |
| POST | `/api/user/favorites` | Save favorite recipe |
| GET | `/api/dietary-options` | Get dietary filters |
| GET | `/api/cuisines` | Get available cuisines |

---

## 💡 Usage Guide

### 1. Finding Recipes by Ingredients
1. Go to **"Search & Generate"** tab
2. Enter ingredients (e.g., "chicken, tomato, garlic")
3. Add multiple ingredients by clicking "Add Ingredient"
4. Apply filters (optional): dietary, difficulty, time
5. Click **"Generate Recipes"**
6. Browse results sorted by match score

### 2. Saving Favorite Recipes
1. Click the **heart icon (🤍)** on any recipe card
2. Heart turns red **(❤️)** when saved
3. View all saved recipes in **"Saved"** tab
4. Click again to remove from favorites
5. Favorites persist even after closing browser

### 3. Creating Shopping Lists
1. Open any recipe details
2. Click **"Add to Shopping List"** button
3. Navigate to **"Shopping List"** tab
4. Check off items as you shop
5. Print shopping list with print button
6. Clear all when done shopping

### 4. Rating Recipes
1. Find the star rating on recipe cards
2. Click stars to rate 1-5 (☆ → ⭐)
3. Rating saves automatically
4. View your ratings on all recipe views

### 5. Using Dark Mode
1. Click the **moon icon (🌙)** in top-right header
2. Theme switches to elegant dark mode
3. Click **sun icon (☀️)** to return to light mode
4. Preference saves automatically

---

## 🎨 Features in Detail

### Recipe Search Algorithm
- Matches ingredients against recipe database
- Calculates match percentage
- Sorts by relevance score
- Shows matching ingredients count
- Requires only 1 matching ingredient (flexible!)

### Smart Filters
- **Dietary**: Vegetarian, Vegan, Gluten-free
- **Difficulty**: Easy, Medium, Hard
- **Cooking Time**: 5-120 minutes slider
- **Cuisine**: Italian, Indian, Asian, Mediterranean, Mexican, American, Thai, Dessert

### Recipe Cards Display
- Professional food photography
- Quick info: time, servings, calories
- Interactive star ratings
- Quick action buttons: Save, Shop, Print
- Ingredient preview (first 5)
- Nutrition breakdown
- Dietary tags

### Recipe Details Modal
- Full-screen high-quality image
- Complete ingredient list with checkboxes
- Step-by-step cooking instructions
- **Serving size adjuster** (0.5x to 5x)
- Real-time nutrition calculation
- Multiple save options
- Print-friendly format

### Shopping List Features
- Groups ingredients by recipe
- Checkbox to mark items purchased
- Shows recipe source for each item
- Print shopping list function
- Clear all items button
- Persistent storage

### Recipe of the Day
- Changes daily automatically
- Featured in eye-catching card
- Quick save and view buttons
- Random selection from database

---

## 🎨 UI Design Highlights

### Color Palette
- **Primary**: `#E74C3C` (Vibrant Red)
- **Secondary**: `#27AE60` (Fresh Green)
- **Accent**: `#F39C12` (Warm Gold)
- **Background**: Warm cream gradients
- **Dark Mode**: Deep grays with red accents

### Design Elements
- Food emoji decorations (🍽️ 🥘 🍳 🥗 🍲)
- Gradient backgrounds
- Smooth box shadows
- Rounded corners (8-20px)
- Hover animations (translateY, scale)
- Professional transitions (0.3s ease)

---

## 🚀 Deployment Guide

### Option 1: Vercel (Recommended)

1. **Push to GitHub** (see below)

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure Settings**
   ```
   Framework Preset: Vite
   Root Directory: ./client
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Deploy!**
   - Click Deploy
   - Get live URL instantly

### Option 2: Netlify

1. **Build for production**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy**
   - Go to https://netlify.com
   - Drag `client/dist` folder
   - Or use Netlify CLI

**Note**: Backend needs separate deployment (use Render, Railway, or Heroku)

---

## 📊 Database Schema

### Recipe Object

```json
{
  "id": 1,
  "name": "Chicken Tikka Masala",
  "cuisine": "Indian",
  "difficulty": "Medium",
  "cookingTime": 40,
  "servings": 4,
  "ingredients": ["chicken", "yogurt", "cream", "tomato", "onion", "spices"],
  "instructions": [
    "Marinate chicken in yogurt and spices",
    "Cook chicken until tender",
    "Prepare sauce with tomato and cream"
  ],
  "nutrition": {
    "calories": 380,
    "protein": 35,
    "carbs": 12,
    "fat": 22,
    "fiber": 2
  },
  "dietary": ["gluten-free"],
  "imageUrl": "https://images.unsplash.com/...",
  "tags": ["Indian", "chicken", "spiced"]
}
```

---

## 🧪 Testing Checklist

Before submission, verify:

- ✅ Search with single ingredient works
- ✅ Search with multiple ingredients works
- ✅ All filters apply correctly
- ✅ Save/unsave recipes persists
- ✅ Rating system works and saves
- ✅ Shopping list adds/removes items
- ✅ Dark mode toggles correctly
- ✅ Recipe of the day changes daily
- ✅ Print recipe opens print dialog
- ✅ Serving adjuster updates nutrition
- ✅ Responsive on mobile devices
- ✅ Data persists after page refresh

---

## 📝 Assignment Compliance

This project follows all submission guidelines:

✅ **GitHub Repository**
- Main branch
- Public/open-source
- Fully downloadable
- Within size limits

✅ **Clean Code Structure**
- No `node_modules` committed
- No `.env` files
- No build artifacts (`dist/`, `.next/`)
- No editor files (`.vscode/`, `.idea/`)
- Proper `.gitignore`

✅ **Minimal Dependencies**
- Only required packages
- No unnecessary modules
- Standard industry packages

✅ **Documentation**
- Comprehensive README
- Code comments where needed
- Clear structure
- Usage instructions

---

## 📦 Dependencies

### Client Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "axios": "^1.6.2",
  "vite": "^4.5.14"
}
```

### Server Dependencies
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "axios": "^1.6.2"
}
```

---

## 🎓 Academic Information

**Project Title**: Smart Recipe Generator  
**Developer**: Master Badrish  
**Year**: 2026  
**Type**: Full-Stack Web Application  
**Purpose**: Assignment/Project Submission

---

## 📞 Support & Contact

For questions or issues with this project, please:
- Open an issue on GitHub
- Contact the project maintainer
- Review the documentation

---

## 📄 License

© 2026 Master Badrish. All Rights Reserved.

This project is developed for educational purposes as part of an academic assignment.

---

## 🙏 Acknowledgments

- Recipe data curated from various culinary sources
- Food images from Unsplash and Pexels
- UI/UX inspiration from modern recipe apps
- Icons and emojis for visual enhancement

---

## ⭐ Project Highlights

- **1500+ lines** of custom CSS
- **400+ lines** of backend API code
- **800+ lines** of React components
- **21 recipes** with complete data
- **12 API endpoints**
- **8 advanced features** (rating, favorites, shopping, etc.)
- **100% responsive** design
- **Dark mode** implementation
- **localStorage** integration
- **Professional UI/UX**

---

**⭐ If you found this project impressive, please give it a star on GitHub!**

---

*Built with ❤️ by Master Badrish*  
*Powered by React + Node.js + Express*
