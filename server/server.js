const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Load recipes database
const recipesPath = path.join(__dirname, '../database/recipes.json');
let recipes = [];

try {
  recipes = JSON.parse(fs.readFileSync(recipesPath, 'utf8'));
} catch (error) {
  console.error('Error loading recipes:', error);
  recipes = [];
}

// User data storage (in-memory for demo)
let userPreferences = {
  dietary: [],
  savedRecipes: [],
  ratings: {}
};

// ============ ROUTES ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Get all recipes
app.get('/api/recipes', (req, res) => {
  try {
    res.json({
      success: true,
      data: recipes,
      total: recipes.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single recipe
app.get('/api/recipes/:id', (req, res) => {
  try {
    const recipe = recipes.find(r => r.id === parseInt(req.params.id));
    if (!recipe) {
      return res.status(404).json({ success: false, error: 'Recipe not found' });
    }
    res.json({ success: true, data: recipe });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate recipes based on ingredients
app.post('/api/recipes/generate', (req, res) => {
  try {
    const { ingredients, dietary, difficulty, maxCookingTime } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ success: false, error: 'Ingredients required' });
    }

    // Filter recipes based on criteria
    let filtered = recipes.filter(recipe => {
      // Check ingredient match (at least 1 ingredient should match)
      const matchingIngredients = recipe.ingredients.filter(ing =>
        ingredients.some(userIng =>
          userIng.toLowerCase().includes(ing.toLowerCase()) ||
          ing.toLowerCase().includes(userIng.toLowerCase())
        )
      );
      
      // Require at least one matching ingredient
      if (matchingIngredients.length === 0) return false;

      // Check dietary restrictions
      if (dietary && dietary.length > 0) {
        const hasAllDietary = dietary.every(diet =>
          recipe.dietary.includes(diet)
        );
        if (!hasAllDietary) return false;
      }

      // Check difficulty
      if (difficulty && recipe.difficulty !== difficulty) return false;

      // Check cooking time
      if (maxCookingTime && recipe.cookingTime > maxCookingTime) return false;

      return true;
    });

    // Score recipes by ingredient match percentage
    const scored = filtered.map(recipe => {
      const matchingIngredients = recipe.ingredients.filter(ing =>
        ingredients.some(userIng =>
          userIng.toLowerCase().includes(ing.toLowerCase()) ||
          ing.toLowerCase().includes(userIng.toLowerCase())
        )
      );
      const matchScore = (matchingIngredients.length / recipe.ingredients.length) * 100;
      return { ...recipe, matchScore, matchingIngredients };
    });

    // Sort by match score
    scored.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      data: scored,
      total: scored.length,
      query: { ingredients, dietary, difficulty, maxCookingTime }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get recipe substitutions
app.post('/api/recipes/substitutions', (req, res) => {
  try {
    const { ingredient } = req.body;

    if (!ingredient) {
      return res.status(400).json({ success: false, error: 'Ingredient required' });
    }

    const substitutions = {
      'butter': ['oil', 'coconut oil', 'applesauce'],
      'milk': ['almond milk', 'coconut milk', 'oat milk'],
      'eggs': ['flax eggs', 'chia eggs', 'applesauce'],
      'sugar': ['honey', 'agave', 'stevia'],
      'wheat flour': ['almond flour', 'coconut flour', 'rice flour'],
      'chicken': ['tofu', 'tempeh', 'seitan', 'beans'],
      'beef': ['turkey', 'lamb', 'plant-based meat'],
      'cheese': ['nutritional yeast', 'cashew cheese'],
      'sour cream': ['greek yogurt', 'coconut cream'],
      'salt': ['low-sodium salt', 'herbs', 'spices']
    };

    const found = Object.keys(substitutions).find(key =>
      key.toLowerCase().includes(ingredient.toLowerCase()) ||
      ingredient.toLowerCase().includes(key.toLowerCase())
    );

    if (found) {
      res.json({
        success: true,
        ingredient: found,
        substitutions: substitutions[found]
      });
    } else {
      res.json({
        success: true,
        ingredient: ingredient,
        substitutions: ['Consider alternatives based on dietary needs']
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Filter recipes
app.post('/api/recipes/filter', (req, res) => {
  try {
    const { cuisine, difficulty, maxCookingTime, dietary, maxCalories } = req.body;

    let filtered = recipes;

    if (cuisine) {
      filtered = filtered.filter(r => r.cuisine.toLowerCase() === cuisine.toLowerCase());
    }

    if (difficulty) {
      filtered = filtered.filter(r => r.difficulty === difficulty);
    }

    if (maxCookingTime) {
      filtered = filtered.filter(r => r.cookingTime <= maxCookingTime);
    }

    if (dietary && dietary.length > 0) {
      filtered = filtered.filter(r =>
        dietary.some(diet => r.dietary.includes(diet))
      );
    }

    if (maxCalories) {
      filtered = filtered.filter(r => r.nutrition.calories <= maxCalories);
    }

    res.json({
      success: true,
      data: filtered,
      total: filtered.length,
      filters: { cuisine, difficulty, maxCookingTime, dietary, maxCalories }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save favorite recipe
app.post('/api/user/favorites', (req, res) => {
  try {
    const { recipeId, rating } = req.body;

    if (!recipeId) {
      return res.status(400).json({ success: false, error: 'Recipe ID required' });
    }

    // Check if recipe exists
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, error: 'Recipe not found' });
    }

    // Save favorite
    if (!userPreferences.savedRecipes.includes(recipeId)) {
      userPreferences.savedRecipes.push(recipeId);
    }

    // Save rating
    if (rating) {
      userPreferences.ratings[recipeId] = rating;
    }

    res.json({
      success: true,
      message: 'Recipe saved',
      saved: userPreferences.savedRecipes,
      ratings: userPreferences.ratings
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user preferences
app.get('/api/user/preferences', (req, res) => {
  try {
    const favorites = recipes.filter(r => userPreferences.savedRecipes.includes(r.id));
    res.json({
      success: true,
      dietary: userPreferences.dietary,
      savedRecipes: favorites,
      ratings: userPreferences.ratings
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update dietary preferences
app.post('/api/user/dietary', (req, res) => {
  try {
    const { dietary } = req.body;

    if (!dietary || !Array.isArray(dietary)) {
      return res.status(400).json({ success: false, error: 'Dietary array required' });
    }

    userPreferences.dietary = dietary;

    res.json({
      success: true,
      message: 'Dietary preferences updated',
      dietary: userPreferences.dietary
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analyze image with AI (using free Clarifai API or similar)
app.post('/api/analyze-image', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ success: false, error: 'Image URL required' });
    }

    // Simulated AI response - In production, integrate with Clarifai/TensorFlow/etc
    const detectedIngredients = await detectIngredientsFromImage(imageUrl);

    res.json({
      success: true,
      ingredients: detectedIngredients,
      confidence: 0.85
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Simulate ingredient detection
async function detectIngredientsFromImage(imageUrl) {
  // In production, integrate with:
  // - Clarifai API (free tier available)
  // - Google Vision API (free tier)
  // - TensorFlow.js (client-side)
  // - Custom ML model

  // Simulated response for demo
  const commonIngredients = [
    'tomato', 'onion', 'garlic', 'potato', 'carrot',
    'chicken', 'beef', 'fish', 'pasta', 'rice',
    'eggs', 'cheese', 'milk', 'butter', 'oil'
  ];

  // Return random ingredients for demo
  const count = Math.floor(Math.random() * 3) + 2;
  const detected = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * commonIngredients.length);
    const ingredient = commonIngredients[randomIndex];
    if (!detected.includes(ingredient)) {
      detected.push(ingredient);
    }
  }

  return detected;
}

// Get nutrition info for recipes
app.post('/api/nutrition', (req, res) => {
  try {
    const { recipeIds } = req.body;

    if (!recipeIds || !Array.isArray(recipeIds)) {
      return res.status(400).json({ success: false, error: 'Recipe IDs array required' });
    }

    const nutritionData = recipes
      .filter(r => recipeIds.includes(r.id))
      .map(r => ({
        id: r.id,
        name: r.name,
        nutrition: r.nutrition,
        servings: r.servings
      }));

    res.json({
      success: true,
      data: nutritionData
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get cuisine suggestions
app.get('/api/cuisines', (req, res) => {
  try {
    const cuisines = [...new Set(recipes.map(r => r.cuisine))];
    res.json({
      success: true,
      cuisines: cuisines.sort()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get dietary options
app.get('/api/dietary-options', (req, res) => {
  try {
    const dietary = [...new Set(recipes.flatMap(r => r.dietary))];
    res.json({
      success: true,
      options: dietary.sort()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🍳 Smart Recipe Generator API running on http://localhost:${PORT}`);
  console.log(`📝 Total recipes loaded: ${recipes.length}`);
});
