import React from 'react'

const cuisineEmojis = {
  'Italian': '🇮🇹',
  'Asian': '🥢',
  'Indian': '🌶️',
  'Mexican': '🌮',
  'Mediterranean': '🫒',
  'American': '🍔',
  'Thai': '🍛',
  'Dessert': '🍰',
  'French': '🥐',
  'Chinese': '🥡',
  'Japanese': '🍱',
  'Spanish': '🥘',
  'Greek': '🫒',
  'Turkish': '🥙',
  'Korean': '🍜'
};

const difficultyEmojis = {
  'Easy': '⭐',
  'Medium': '⭐⭐',
  'Hard': '⭐⭐⭐'
};

export default function RecipeCard({ 
  recipe, 
  onSave, 
  onRate, 
  onAddToShoppingList, 
  onPrint, 
  onClick, 
  isSaved = false, 
  rating = 0 
}) {
  const renderStars = (currentRating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`star ${star <= currentRating ? 'filled' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          onRate(recipe.id, star)
        }}
        style={{ cursor: 'pointer', fontSize: '18px' }}
      >
        {star <= currentRating ? '⭐' : '☆'}
      </span>
    ))
  }

  return (
    <div className="recipe-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="recipe-header">
        <h3>{recipe.name}</h3>
        <div className="recipe-badges">
          <span className="badge cuisine">{cuisineEmojis[recipe.cuisine] || '🍽️'} {recipe.cuisine}</span>
          <span className="badge difficulty">{difficultyEmojis[recipe.difficulty] || '⭐'} {recipe.difficulty}</span>
        </div>
      </div>

      {recipe.imageUrl ? (
        <img src={recipe.imageUrl} alt={recipe.name} className="recipe-image" />
      ) : (
        <div className="recipe-image-placeholder">🍳</div>
      )}

      {/* Rating Section */}
      <div className="recipe-rating" onClick={(e) => e.stopPropagation()}>
        <div className="stars">
          {renderStars(rating)}
        </div>
        <span className="rating-text">
          {rating > 0 ? `${rating}/5` : 'Rate this recipe'}
        </span>
      </div>

      <div className="recipe-info">
        <div className="info-item">
          <i>⏱️</i> {recipe.cookingTime} min
        </div>
        <div className="info-item">
          <i>🍽️</i> {recipe.servings} servings
        </div>
        <div className="info-item">
          <i>🔥</i> {recipe.nutrition.calories} cal
        </div>
      </div>

      <div className="recipe-ingredients">
        <h4>Ingredients:</h4>
        <ul>
          {recipe.ingredients.slice(0, 5).map((ing, idx) => (
            <li key={idx}>✓ {ing}</li>
          ))}
          {recipe.ingredients.length > 5 && (
            <li className="more">+{recipe.ingredients.length - 5} more</li>
          )}
        </ul>
      </div>

      <div className="recipe-nutrition">
        <div className="nutrition-item">
          <span className="label">Protein</span>
          <span className="value">{recipe.nutrition.protein}g</span>
        </div>
        <div className="nutrition-item">
          <span className="label">Carbs</span>
          <span className="value">{recipe.nutrition.carbs}g</span>
        </div>
        <div className="nutrition-item">
          <span className="label">Fat</span>
          <span className="value">{recipe.nutrition.fat}g</span>
        </div>
      </div>

      <div className="recipe-dietary">
        {recipe.dietary.length > 0 && (
          <>
            <h4>Dietary:</h4>
            <div className="dietary-tags">
              {recipe.dietary.map((diet, idx) => (
                <span key={idx} className="tag">{diet}</span>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="recipe-actions">
        <button 
          className={`btn-icon ${isSaved ? 'saved' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onSave(recipe.id)
          }}
          title={isSaved ? "Remove from favorites" : "Save to favorites"}
        >
          {isSaved ? '❤️' : '🤍'}
        </button>
        <button 
          className="btn-icon"
          onClick={(e) => {
            e.stopPropagation()
            onAddToShoppingList(recipe)
          }}
          title="Add to shopping list"
        >
          🛒
        </button>
        <button 
          className="btn-icon"
          onClick={(e) => {
            e.stopPropagation()
            onPrint(recipe)
          }}
          title="Print recipe"
        >
          🖨️
        </button>
      </div>
    </div>
  )
}
