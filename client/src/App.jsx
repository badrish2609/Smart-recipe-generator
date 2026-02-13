import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'
import RecipeCard from './components/RecipeCard'

const API_BASE = import.meta.env.VITE_API_BASE || ''
const USE_REMOTE_API = Boolean(API_BASE)

function App() {
  const [recipes, setRecipes] = useState([])
  const [filteredRecipes, setFilteredRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('search')

  // Filter state
  const [ingredients, setIngredients] = useState([])
  const [ingredientInput, setIngredientInput] = useState('')
  const [selectedDietary, setSelectedDietary] = useState([])
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [maxCookingTime, setMaxCookingTime] = useState(60)
  const [searchQuery, setSearchQuery] = useState('')

  // Recipe state
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [savedRecipes, setSavedRecipes] = useState([])
  const [recipeRatings, setRecipeRatings] = useState({})
  const [shoppingList, setShoppingList] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const [recipeOfTheDay, setRecipeOfTheDay] = useState(null)
  const [servingMultiplier, setServingMultiplier] = useState(1)

  // Dietary options
  const [dietaryOptions, setDietaryOptions] = useState([])
  const [cuisines, setCuisines] = useState([])

  // Substitutions
  const [substitutionInput, setSubstitutionInput] = useState('')
  const [substitutions, setSubstitutions] = useState(null)

  // Image upload
  const [imageFile, setImageFile] = useState(null)
  const [detectedIngredients, setDetectedIngredients] = useState([])

  // Load initial data and localStorage
  useEffect(() => {
    // Load saved data from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('savedRecipes') || '[]')
    const savedRatings = JSON.parse(localStorage.getItem('recipeRatings') || '{}')
    const savedDarkMode = JSON.parse(localStorage.getItem('darkMode') || 'false')
    const savedShoppingList = JSON.parse(localStorage.getItem('shoppingList') || '[]')
    
    setSavedRecipes(savedFavorites)
    setRecipeRatings(savedRatings)
    setDarkMode(savedDarkMode)
    setShoppingList(savedShoppingList)
    
    if (savedDarkMode) {
      document.body.classList.add('dark-mode')
    }

    const applyRecipeOfTheDay = (data) => {
      const today = new Date().toDateString()
      const savedRotd = localStorage.getItem('recipeOfTheDayDate')
      if (savedRotd !== today) {
        const randomRecipe = data[Math.floor(Math.random() * data.length)]
        setRecipeOfTheDay(randomRecipe)
        localStorage.setItem('recipeOfTheDayDate', today)
        localStorage.setItem('recipeOfTheDay', JSON.stringify(randomRecipe))
      } else {
        const saved = JSON.parse(localStorage.getItem('recipeOfTheDay') || 'null')
        setRecipeOfTheDay(saved)
      }
    }

    const deriveDietaryOptions = (data) => {
      const all = data.flatMap((recipe) => recipe.dietary || [])
      return Array.from(new Set(all)).sort()
    }

    const deriveCuisines = (data) => {
      const all = data.map((recipe) => recipe.cuisine).filter(Boolean)
      return Array.from(new Set(all)).sort()
    }

    const loadLocalData = async () => {
      const response = await fetch('/recipes.json')
      if (!response.ok) {
        throw new Error('Failed to load local recipes')
      }
      const data = await response.json()
      setRecipes(data)
      setFilteredRecipes(data)
      applyRecipeOfTheDay(data)
      setDietaryOptions(deriveDietaryOptions(data))
      setCuisines(deriveCuisines(data))
      return data
    }

    const loadData = async () => {
      try {
        setLoading(true)

        if (USE_REMOTE_API) {
          const [recipesRes, dietaryRes, cuisinesRes] = await Promise.all([
            axios.get(`${API_BASE}/api/recipes`),
            axios.get(`${API_BASE}/api/dietary-options`),
            axios.get(`${API_BASE}/api/cuisines`)
          ])

          setRecipes(recipesRes.data.data)
          setFilteredRecipes(recipesRes.data.data)
          applyRecipeOfTheDay(recipesRes.data.data)
          setDietaryOptions(dietaryRes.data.options)
          setCuisines(cuisinesRes.data.cuisines)

          const preferencesRes = await axios.get(`${API_BASE}/api/user/preferences`)
          setSavedRecipes(preferencesRes.data.savedRecipes.map(r => r.id))
        } else {
          await loadLocalData()
        }
      } catch (error) {
        if (USE_REMOTE_API) {
          try {
            await loadLocalData()
          } catch (localError) {
            console.error('Error loading local data:', localError)
          }
        } else {
          console.error('Error loading data:', error)
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Add ingredient
  const addIngredient = () => {
    if (ingredientInput.trim() && !ingredients.includes(ingredientInput.trim())) {
      setIngredients([...ingredients, ingredientInput.trim()])
      setIngredientInput('')
    }
  }

  // Remove ingredient
  const removeIngredient = (ing) => {
    setIngredients(ingredients.filter(i => i !== ing))
  }

  // Toggle dietary
  const toggleDietary = (diet) => {
    setSelectedDietary(
      selectedDietary.includes(diet)
        ? selectedDietary.filter(d => d !== diet)
        : [...selectedDietary, diet]
    )
  }

  // Generate recipes
  const generateRecipes = async () => {
    if (ingredients.length === 0) {
      alert('Please add at least one ingredient')
      return
    }

    try {
      setLoading(true)
      if (USE_REMOTE_API) {
        const response = await axios.post(`${API_BASE}/api/recipes/generate`, {
          ingredients,
          dietary: selectedDietary,
          difficulty: selectedDifficulty || null,
          maxCookingTime: maxCookingTime || null
        })
        setFilteredRecipes(response.data.data)
      } else {
        const normalizedIngredients = ingredients.map((ing) => ing.toLowerCase())
        const results = recipes
          .map((recipe) => {
            const recipeIngredients = (recipe.ingredients || []).map((ing) => ing.toLowerCase())
            const matchCount = normalizedIngredients.filter((ing) =>
              recipeIngredients.some((rIng) => rIng.includes(ing))
            ).length
            return { recipe, matchCount }
          })
          .filter(({ recipe, matchCount }) => {
            if (matchCount === 0) return false
            if (selectedDietary.length > 0) {
              const recipeDietary = recipe.dietary || []
              const matchesAll = selectedDietary.every((diet) => recipeDietary.includes(diet))
              if (!matchesAll) return false
            }
            if (selectedDifficulty && recipe.difficulty !== selectedDifficulty) return false
            if (maxCookingTime && recipe.cookingTime > maxCookingTime) return false
            return true
          })
          .sort((a, b) => b.matchCount - a.matchCount)
          .map(({ recipe }) => recipe)

        setFilteredRecipes(results)
      }
    } catch (error) {
      alert('Error generating recipes: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Search recipes
  const searchRecipes = () => {
    const query = searchQuery.toLowerCase()
    const results = recipes.filter(
      recipe =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.cuisine.toLowerCase().includes(query) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(query))
    )
    setFilteredRecipes(results)
  }

  // Get substitutions
  const getSubstitutions = async () => {
    if (!substitutionInput.trim()) return

    try {
      if (!USE_REMOTE_API) {
        setSubstitutions({
          ingredient: substitutionInput,
          substitutions: ['This feature needs the backend. Use the live API for real substitutions.']
        })
        return
      }
      const response = await axios.post(`${API_BASE}/api/recipes/substitutions`, {
        ingredient: substitutionInput
      })
      setSubstitutions(response.data)
    } catch (error) {
      alert('Error fetching substitutions: ' + error.message)
    }
  }

  // Analyze image
  const handleImageUpload = async (file) => {
    // For demo: use local file URL
    // In production: upload to server and use Clarifai/Google Vision API
    if (!USE_REMOTE_API) {
      alert('Image analysis is not available in demo mode. Please use manual ingredients.')
      return
    }
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        setLoading(true)
        const response = await axios.post(`${API_BASE}/api/analyze-image`, {
          imageUrl: e.target.result
        })
        setDetectedIngredients(response.data.ingredients)

        // Auto-add detected ingredients
        response.data.ingredients.forEach(ing => {
          if (!ingredients.includes(ing)) {
            setIngredients(prev => [...prev, ing])
          }
        })
      } catch (error) {
        alert('Error analyzing image: ' + error.message)
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  // Save recipe with localStorage persistence
  const saveRecipe = async (recipeId) => {
    try {
      const newSaved = savedRecipes.includes(recipeId)
        ? savedRecipes.filter(id => id !== recipeId)
        : [...savedRecipes, recipeId]
      
      setSavedRecipes(newSaved)
      localStorage.setItem('savedRecipes', JSON.stringify(newSaved))
      
      if (USE_REMOTE_API) {
        await axios.post(`${API_BASE}/api/user/favorites`, {
          recipeId,
          rating: 5
        })
      }
    } catch (error) {
      console.error('Error saving recipe:', error)
    }
  }

  // Rate recipe
  const rateRecipe = (recipeId, rating) => {
    const newRatings = { ...recipeRatings, [recipeId]: rating }
    setRecipeRatings(newRatings)
    localStorage.setItem('recipeRatings', JSON.stringify(newRatings))
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', JSON.stringify(newMode))
    document.body.classList.toggle('dark-mode', newMode)
  }

  // Add to shopping list
  const addToShoppingList = (recipe) => {
    const newItems = recipe.ingredients.map(ing => ({
      id: Date.now() + Math.random(),
      ingredient: ing,
      recipe: recipe.name,
      checked: false
    }))
    const updated = [...shoppingList, ...newItems]
    setShoppingList(updated)
    localStorage.setItem('shoppingList', JSON.stringify(updated))
    alert(`Added ${recipe.name} ingredients to shopping list!`)
  }

  // Toggle shopping list item
  const toggleShoppingItem = (itemId) => {
    const updated = shoppingList.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    )
    setShoppingList(updated)
    localStorage.setItem('shoppingList', JSON.stringify(updated))
  }

  // Clear shopping list
  const clearShoppingList = () => {
    setShoppingList([])
    localStorage.setItem('shoppingList', JSON.stringify([]))
  }

  // Print recipe
  const printRecipe = (recipe) => {
    const printWindow = window.open('', '', 'width=800,height=600')
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Recipe - ${recipe.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            h1 { color: #E74C3C; border-bottom: 3px solid #E74C3C; padding-bottom: 10px; }
            h2 { color: #27AE60; margin-top: 20px; }
            .info { display: flex; gap: 20px; margin: 15px 0; }
            .info-item { background: #f5f5f5; padding: 10px; border-radius: 5px; }
            ul { line-height: 1.8; }
            li { margin-bottom: 8px; }
            .nutrition { background: #fff5e6; padding: 15px; border-radius: 8px; margin: 15px 0; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <h1>${recipe.name}</h1>
          <div class=\"info\">
            <div class=\"info-item\"><strong>Cuisine:</strong> ${recipe.cuisine}</div>
            <div class=\"info-item\"><strong>Difficulty:</strong> ${recipe.difficulty}</div>
            <div class=\"info-item\"><strong>Time:</strong> ${recipe.cookingTime} min</div>
            <div class=\"info-item\"><strong>Servings:</strong> ${recipe.servings}</div>
          </div>
          
          <h2>Ingredients</h2>
          <ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
          
          <h2>Instructions</h2>
          <ol>${recipe.instructions.map(step => `<li>${step}</li>`).join('')}</ol>
          
          <div class=\"nutrition\">
            <h2>Nutrition Information (per serving)</h2>
            <ul>
              <li><strong>Calories:</strong> ${recipe.nutrition.calories} kcal</li>
              <li><strong>Protein:</strong> ${recipe.nutrition.protein}g</li>
              <li><strong>Carbs:</strong> ${recipe.nutrition.carbs}g</li>
              <li><strong>Fat:</strong> ${recipe.nutrition.fat}g</li>
              <li><strong>Fiber:</strong> ${recipe.nutrition.fiber}g</li>
            </ul>
          </div>
          
          <button onclick=\"window.print()\" style=\"background: #E74C3C; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-top: 20px;\">Print Recipe</button>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  // View recipe details
  const viewRecipe = (recipe) => {
    setSelectedRecipe(recipe)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="copyright-banner">
          © 2026 Developed by Master Badrish | All Rights Reserved
        </div>
        <div className="header-content">
          <h1>🍳 Smart Recipe Generator</h1>
          <p>Discover delicious recipes based on your ingredients</p>
          <button className="dark-mode-toggle" onClick={toggleDarkMode} title="Toggle Dark Mode">
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <nav className="tabs">
        <button
          className={`tab ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          🔍 Search & Generate
        </button>
        <button
          className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          ❤️ Saved ({savedRecipes.length})
        </button>
        <button
          className={`tab ${activeTab === 'shopping' ? 'active' : ''}`}
          onClick={() => setActiveTab('shopping')}
        >
          🛒 Shopping List ({shoppingList.length})
        </button>
        <button
          className={`tab ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          🛠️ Tools
        </button>
      </nav>

      <main className="container">
        {/* Search & Generate Tab */}
        {activeTab === 'search' && (
          <>
            {/* Recipe of the Day */}
            {recipeOfTheDay && (
              <section className="recipe-of-day">
                <h2>🌟 Recipe of the Day</h2>
                <div className="rotd-card">
                  <div className="rotd-content">
                    <img src={recipeOfTheDay.imageUrl} alt={recipeOfTheDay.name} className="rotd-image" />
                    <div className="rotd-details">
                      <h3>{recipeOfTheDay.name}</h3>
                      <p className="rotd-cuisine">{recipeOfTheDay.cuisine} • {recipeOfTheDay.difficulty} • {recipeOfTheDay.cookingTime} min</p>
                      <p className="rotd-description">Try this amazing {recipeOfTheDay.cuisine.toLowerCase()} dish today!</p>
                      <div className="rotd-actions">
                        <button onClick={() => viewRecipe(recipeOfTheDay)} className="btn-primary">
                          View Recipe
                        </button>
                        <button 
                          onClick={() => saveRecipe(recipeOfTheDay.id)} 
                          className={`btn-icon ${savedRecipes.includes(recipeOfTheDay.id) ? 'saved' : ''}`}
                          title="Save to favorites"
                        >
                          {savedRecipes.includes(recipeOfTheDay.id) ? '❤️' : '🤍'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="search-section">\
              <div className="ingredient-input-group">
                <input
                  type="text"
                  placeholder="Enter ingredient (e.g., chicken, tomato)..."
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                  className="ingredient-input"
                />
                <button onClick={addIngredient} className="btn-primary">
                  Add Ingredient
                </button>

                <div className="upload-group">
                  <label htmlFor="image-upload" className="btn-secondary">
                    📷 Upload Image
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleImageUpload(e.target.files[0])
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              {/* Selected Ingredients */}
              {ingredients.length > 0 && (
                <div className="ingredients-list">
                  <h3>Selected Ingredients ({ingredients.length})</h3>
                  <div className="tags">
                    {ingredients.map((ing, idx) => (
                      <span key={idx} className="ingredient-tag">
                        {ing}
                        <button
                          onClick={() => removeIngredient(ing)}
                          className="tag-remove"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Filters */}
              <div className="filters-section">
                <div className="filter-group">
                  <label>Dietary Preferences:</label>
                  <div className="checkbox-group">
                    {dietaryOptions.map((diet) => (
                      <label key={diet} className="checkbox">
                        <input
                          type="checkbox"
                          checked={selectedDietary.includes(diet)}
                          onChange={() => toggleDietary(diet)}
                        />
                        <span>{diet}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label>Difficulty Level:</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="select"
                  >
                    <option value="">All Levels</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Max Cooking Time: {maxCookingTime} min</label>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    value={maxCookingTime}
                    onChange={(e) => setMaxCookingTime(parseInt(e.target.value))}
                    className="slider"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <div className="button-group">
                <button
                  onClick={generateRecipes}
                  disabled={loading || ingredients.length === 0}
                  className="btn-generate"
                >
                  {loading ? '⏳ Generating...' : '🚀 Generate Recipes'}
                </button>
              </div>
            </section>

            {/* Quick Search */}
            <section className="quick-search">
              <input
                type="text"
                placeholder="Quick search recipes by name or cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchRecipes()}
                className="search-input"
              />
              <button onClick={searchRecipes} className="btn-primary">
                Search
              </button>
            </section>

            {/* Recipes Grid */}
            <section className="recipes-section">
              <h2>
                Found {filteredRecipes.length} Recipe{filteredRecipes.length !== 1 ? 's' : ''}
              </h2>

              {loading ? (
                <div className="loading">🔄 Loading recipes...</div>
              ) : filteredRecipes.length > 0 ? (
                <div className="recipes-grid">
                  {filteredRecipes.map((recipe) => (
                    <div key={recipe.id}>
                      <RecipeCard
                        recipe={recipe}
                        onSave={saveRecipe}
                        onRate={rateRecipe}
                        onAddToShoppingList={addToShoppingList}
                        onPrint={printRecipe}
                        onClick={() => viewRecipe(recipe)}
                        isSaved={savedRecipes.includes(recipe.id)}
                        rating={recipeRatings[recipe.id] || 0}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <p>No recipes found. Try different ingredients or filters!</p>
                </div>
              )}
            </section>
          </>
        )}

        {/* Saved Recipes Tab */}
        {activeTab === 'saved' && (
          <section className="saved-section">
            <h2>❤️ Saved Recipes</h2>
            {savedRecipes.length > 0 ? (
              <div className="recipes-grid">
                {recipes
                  .filter((r) => savedRecipes.includes(r.id))
                  .map((recipe) => (
                    <div key={recipe.id}>
                      <RecipeCard
                        recipe={recipe}
                        onSave={saveRecipe}
                        onRate={rateRecipe}
                        onAddToShoppingList={addToShoppingList}
                        onPrint={printRecipe}
                        onClick={() => viewRecipe(recipe)}
                        isSaved={savedRecipes.includes(recipe.id)}
                        rating={recipeRatings[recipe.id] || 0}
                      />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="no-results">
                <p>No saved recipes yet. Find recipes and save your favorites!</p>
              </div>
            )}
          </section>
        )}

        {/* Shopping List Tab */}
        {activeTab === 'shopping' && (
          <section className="shopping-section">
            <div className="shopping-header">
              <h2>🛒 Shopping List</h2>
              {shoppingList.length > 0 && (
                <button onClick={clearShoppingList} className="btn-secondary">
                  Clear All
                </button>
              )}
            </div>
            
            {shoppingList.length > 0 ? (
              <div className="shopping-list">
                {shoppingList.map((item) => (
                  <div key={item.id} className={`shopping-item ${item.checked ? 'checked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleShoppingItem(item.id)}
                      className="shopping-checkbox"
                    />
                    <div className="shopping-item-content">
                      <span className="shopping-ingredient">{item.ingredient}</span>
                      <span className="shopping-recipe">from {item.recipe}</span>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => window.print()} 
                  className="btn-primary"
                  style={{ marginTop: '20px' }}
                >
                  🖨️ Print Shopping List
                </button>
              </div>
            ) : (
              <div className="no-results">
                <p>Your shopping list is empty. Add ingredients from recipes!</p>
              </div>
            )}
          </section>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <section className="tools-section">
            <div className="tool-card">
              <h3>🔄 Ingredient Substitutions</h3>
              <p>Find alternatives for ingredients</p>

              <div className="tool-input-group">
                <input
                  type="text"
                  placeholder="Enter ingredient (e.g., butter, milk)..."
                  value={substitutionInput}
                  onChange={(e) => setSubstitutionInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && getSubstitutions()}
                  className="ingredient-input"
                />
                <button onClick={getSubstitutions} className="btn-primary">
                  Get Substitutions
                </button>
              </div>

              {substitutions && (
                <div className="substitutions-result">
                  <h4>Substitutes for "{substitutions.ingredient}":</h4>
                  <ul>
                    {substitutions.substitutions.map((sub, idx) => (
                      <li key={idx}>{sub}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="tool-card">
              <h3>🖼️ Image Recognition</h3>
              <p>Upload a food image to detect ingredients</p>

              <label className="upload-box">
                📸 Click to upload image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      handleImageUpload(e.target.files[0])
                    }
                  }}
                  style={{ display: 'none' }}
                />
              </label>

              {detectedIngredients.length > 0 && (
                <div className="detected-ingredients">
                  <h4>Detected Ingredients:</h4>
                  <div className="tags">
                    {detectedIngredients.map((ing, idx) => (
                      <span key={idx} className="detected-tag">{ing}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Recipe Details Modal */}
      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedRecipe(null)}
            >
              ✕
            </button>

            <div className="modal-header">
              <h2>{selectedRecipe.name}</h2>
              <div className="recipe-badges">
                <span className="badge">{selectedRecipe.cuisine}</span>
                <span className="badge">{selectedRecipe.difficulty}</span>
                <span className="badge">⏱️ {selectedRecipe.cookingTime} min</span>
              </div>
            </div>

            {/* Rating Section */}
            <div className="modal-rating">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= (recipeRatings[selectedRecipe.id] || 0) ? 'filled' : ''}`}
                    onClick={() => rateRecipe(selectedRecipe.id, star)}
                    style={{ cursor: 'pointer', fontSize: '24px' }}
                  >
                    {star <= (recipeRatings[selectedRecipe.id] || 0) ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
              <span className="rating-text">
                {recipeRatings[selectedRecipe.id] ? 
                  `Your rating: ${recipeRatings[selectedRecipe.id]}/5` : 
                  'Click to rate this recipe'}
              </span>
            </div>

            {selectedRecipe.imageUrl ? (
              <img
                src={selectedRecipe.imageUrl}
                alt={selectedRecipe.name}
                className="modal-image"
              />
            ) : (
              <div className="modal-image-placeholder">🍳 No Image Available</div>
            )}

            <div className="modal-body">
              {/* Serving Adjuster */}
              <div className="section serving-adjuster">
                <h3>Adjust Servings</h3>
                <div className="serving-controls">
                  <button 
                    onClick={() => setServingMultiplier(Math.max(0.5, servingMultiplier - 0.5))}
                    className="btn-secondary"
                  >
                    -
                  </button>
                  <span className="serving-display">
                    {selectedRecipe.servings * servingMultiplier} servings 
                    {servingMultiplier !== 1 && ` (${servingMultiplier}x)`}
                  </span>
                  <button 
                    onClick={() => setServingMultiplier(servingMultiplier + 0.5)}
                    className="btn-secondary"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => setServingMultiplier(1)}
                    className="btn-secondary"
                    style={{ marginLeft: '1rem' }}
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="section">
                <h3>Ingredients ({selectedRecipe.ingredients.length})</h3>
                <ul className="ingredients">
                  {selectedRecipe.ingredients.map((ing, idx) => (
                    <li key={idx}>
                      <input type="checkbox" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="section">
                <h3>Instructions</h3>
                <ol className="instructions">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="section">
                <h3>Nutrition Information (per serving)</h3>
                {servingMultiplier !== 1 && (
                  <p style={{ color: '#7F8C8D', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    ✨ Showing adjusted values for {servingMultiplier}x servings
                  </p>
                )}
                <div className="nutrition-grid">
                  <div className="nutrition-box">
                    <span className="label">Calories</span>
                    <span className="value">{Math.round(selectedRecipe.nutrition.calories * servingMultiplier)}</span>
                  </div>
                  <div className="nutrition-box">
                    <span className="label">Protein</span>
                    <span className="value">{Math.round(selectedRecipe.nutrition.protein * servingMultiplier)}g</span>
                  </div>
                  <div className="nutrition-box">
                    <span className="label">Carbs</span>
                    <span className="value">{Math.round(selectedRecipe.nutrition.carbs * servingMultiplier)}g</span>
                  </div>
                  <div className="nutrition-box">
                    <span className="label">Fat</span>
                    <span className="value">{Math.round(selectedRecipe.nutrition.fat * servingMultiplier)}g</span>
                  </div>
                  <div className="nutrition-box">
                    <span className="label">Fiber</span>
                    <span className="value">{Math.round(selectedRecipe.nutrition.fiber * servingMultiplier)}g</span>
                  </div>
                </div>
              </div>

              {selectedRecipe.dietary.length > 0 && (
                <div className="section">
                  <h3>Dietary Information</h3>
                  <div className="dietary-tags">
                    {selectedRecipe.dietary.map((diet, idx) => (
                      <span key={idx} className="tag">{diet}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                onClick={() => {
                  saveRecipe(selectedRecipe.id)
                }}
                className={`btn-save-modal ${savedRecipes.includes(selectedRecipe.id) ? 'saved' : ''}`}
              >
                {savedRecipes.includes(selectedRecipe.id) ? '❤️ Saved' : '🤍 Save Recipe'}
              </button>
              <button
                onClick={() => addToShoppingList(selectedRecipe)}
                className="btn-secondary"
              >
                🛒 Add to Shopping List
              </button>
              <button
                onClick={() => printRecipe(selectedRecipe)}
                className="btn-secondary"
              >
                🖨️ Print Recipe
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>© 2025 Smart Recipe Generator | Created to help you discover delicious recipes</p>
      </footer>
    </div>
  )
}

export default App
