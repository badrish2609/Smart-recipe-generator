# Smart Recipe Generator - API Documentation

Complete REST API reference for the Smart Recipe Generator backend.

**Base URL**: `http://localhost:5000` (development) or your deployed backend URL

---

## Health Check

### Get Server Status
```
GET /api/health
```

**Response**:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## Recipes Endpoints

### Get All Recipes
```
GET /api/recipes
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Classic Spaghetti Carbonara",
      "cuisine": "Italian",
      "difficulty": "Medium",
      "cookingTime": 20,
      "servings": 4,
      "ingredients": ["pasta", "eggs", "bacon", "parmesan", "salt", "pepper"],
      "instructions": ["Cook pasta...", "Fry bacon..."],
      "nutrition": {
        "calories": 450,
        "protein": 18,
        "carbs": 55,
        "fat": 16,
        "fiber": 2
      },
      "dietary": [],
      "imageUrl": "https://...",
      "tags": ["pasta", "Italian", "quick"]
    }
  ],
  "total": 20
}
```

---

### Get Single Recipe
```
GET /api/recipes/:id
```

**Parameters**:
- `id` (number, required) - Recipe ID

**Example**: `GET /api/recipes/1`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Classic Spaghetti Carbonara",
    ...
  }
}
```

**Error Response** (Recipe not found):
```json
{
  "success": false,
  "error": "Recipe not found"
}
```

---

### Generate Recipes Based on Ingredients
```
POST /api/recipes/generate
```

**Request Body**:
```json
{
  "ingredients": ["chicken", "tomato", "onion"],
  "dietary": ["vegetarian"],
  "difficulty": "Medium",
  "maxCookingTime": 30
}
```

**Parameters**:
- `ingredients` (array, **required**) - List of available ingredients
- `dietary` (array, optional) - Dietary restrictions: `["vegetarian", "vegan", "gluten-free"]`
- `difficulty` (string, optional) - One of: `"Easy"`, `"Medium"`, `"Hard"`
- `maxCookingTime` (number, optional) - Maximum cooking time in minutes

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "name": "Chicken Tikka Masala",
      "matchScore": 66.67,
      "matchingIngredients": ["chicken", "tomato", "onion"],
      ...
    }
  ],
  "total": 5,
  "query": {
    "ingredients": ["chicken", "tomato", "onion"],
    "dietary": ["vegetarian"],
    "difficulty": "Medium",
    "maxCookingTime": 30
  }
}
```

**Error Response** (No ingredients provided):
```json
{
  "success": false,
  "error": "Ingredients required"
}
```

---

### Filter Recipes
```
POST /api/recipes/filter
```

**Request Body**:
```json
{
  "cuisine": "Italian",
  "difficulty": "Easy",
  "maxCookingTime": 20,
  "dietary": ["vegetarian"],
  "maxCalories": 400
}
```

**Parameters** (all optional):
- `cuisine` (string) - Any cuisine from available recipes
- `difficulty` (string) - `"Easy"`, `"Medium"`, `"Hard"`
- `maxCookingTime` (number) - Maximum minutes
- `dietary` (array) - Any dietary restrictions
- `maxCalories` (number) - Maximum calories per serving

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "Vegetable Stir Fry",
      ...
    }
  ],
  "total": 3,
  "filters": {
    "cuisine": "Italian",
    "difficulty": "Easy",
    "maxCookingTime": 20,
    "dietary": ["vegetarian"],
    "maxCalories": 400
  }
}
```

---

### Get Ingredient Substitutions
```
POST /api/recipes/substitutions
```

**Request Body**:
```json
{
  "ingredient": "butter"
}
```

**Parameters**:
- `ingredient` (string, **required**) - Ingredient to find substitutes for

**Response**:
```json
{
  "success": true,
  "ingredient": "butter",
  "substitutions": ["oil", "coconut oil", "applesauce"]
}
```

**Available Substitutions** (examples):
- `butter` → `["oil", "coconut oil", "applesauce"]`
- `milk` → `["almond milk", "coconut milk", "oat milk"]`
- `eggs` → `["flax eggs", "chia eggs", "applesauce"]`
- `sugar` → `["honey", "agave", "stevia"]`
- `chicken` → `["tofu", "tempeh", "seitan", "beans"]`

---

## User Preferences Endpoints

### Get User Preferences
```
GET /api/user/preferences
```

**Response**:
```json
{
  "success": true,
  "dietary": ["vegetarian"],
  "savedRecipes": [
    {
      "id": 1,
      "name": "Classic Spaghetti Carbonara",
      ...
    }
  ],
  "ratings": {
    "1": 5,
    "5": 4
  }
}
```

---

### Save/Rate a Recipe
```
POST /api/user/favorites
```

**Request Body**:
```json
{
  "recipeId": 1,
  "rating": 5
}
```

**Parameters**:
- `recipeId` (number, **required**) - Recipe ID to save
- `rating` (number, optional) - Rating from 1-5

**Response**:
```json
{
  "success": true,
  "message": "Recipe saved",
  "saved": [1, 5, 10],
  "ratings": {
    "1": 5,
    "5": 4,
    "10": 3
  }
}
```

---

### Update Dietary Preferences
```
POST /api/user/dietary
```

**Request Body**:
```json
{
  "dietary": ["vegetarian", "gluten-free"]
}
```

**Parameters**:
- `dietary` (array, **required**) - Array of dietary preferences

**Response**:
```json
{
  "success": true,
  "message": "Dietary preferences updated",
  "dietary": ["vegetarian", "gluten-free"]
}
```

---

## Image Analysis Endpoints

### Analyze Food Image
```
POST /api/analyze-image
```

**Request Body**:
```json
{
  "imageUrl": "https://example.com/food.jpg"
}
```

**Parameters**:
- `imageUrl` (string, **required**) - URL or base64 of food image

**Response**:
```json
{
  "success": true,
  "ingredients": ["tomato", "onion", "garlic"],
  "confidence": 0.85
}
```

**Note**: Currently returns simulated results. Can be integrated with:
- Clarifai API
- Google Vision API
- TensorFlow.js
- Custom ML model

---

## Utility Endpoints

### Get All Cuisines
```
GET /api/cuisines
```

**Response**:
```json
{
  "success": true,
  "cuisines": ["American", "Asian", "Italian", "Mexican", "Thai", ...]
}
```

---

### Get Dietary Options
```
GET /api/dietary-options
```

**Response**:
```json
{
  "success": true,
  "options": ["gluten-free", "vegan", "vegetarian", ...]
}
```

---

### Get Nutrition Information
```
POST /api/nutrition
```

**Request Body**:
```json
{
  "recipeIds": [1, 2, 5]
}
```

**Parameters**:
- `recipeIds` (array, **required**) - Array of recipe IDs

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Classic Spaghetti Carbonara",
      "nutrition": {
        "calories": 450,
        "protein": 18,
        "carbs": 55,
        "fat": 16,
        "fiber": 2
      },
      "servings": 4
    }
  ]
}
```

---

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

### Common Error Codes

| Error | Status | Cause |
|-------|--------|-------|
| "Ingredients required" | 400 | No ingredients provided in POST body |
| "Recipe not found" | 404 | Invalid recipe ID |
| "Recipe ID required" | 400 | Missing recipeId in request |
| "Internal server error" | 500 | Unexpected server error |

---

## Rate Limiting

Currently no rate limiting. In production, consider adding:
- 100 requests per minute per IP
- 1000 requests per hour per IP

---

## CORS Headers

The API sends these headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type
```

---

## Request/Response Examples

### Example: Generate Recipes with Multiple Filters
```bash
curl -X POST http://localhost:5000/api/recipes/generate \
  -H "Content-Type: application/json" \
  -d '{
    "ingredients": ["chicken", "bell pepper", "onion"],
    "dietary": ["gluten-free"],
    "difficulty": "Easy",
    "maxCookingTime": 30
  }'
```

### Example: Filter Recipes by Cuisine
```bash
curl -X POST http://localhost:5000/api/recipes/filter \
  -H "Content-Type: application/json" \
  -d '{
    "cuisine": "Mediterranean",
    "maxCalories": 350
  }'
```

### Example: Save Multiple Recipes
```bash
curl -X POST http://localhost:5000/api/user/favorites \
  -H "Content-Type: application/json" \
  -d '{
    "recipeId": 1,
    "rating": 5
  }'
```

---

## JavaScript/Fetch Examples

### Generate Recipes
```javascript
const response = await fetch('http://localhost:5000/api/recipes/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ingredients: ['chicken', 'tomato'],
    dietary: ['vegetarian'],
    maxCookingTime: 30
  })
});
const data = await response.json();
console.log(data.data); // Array of recipes
```

### Get Substitutions
```javascript
const response = await fetch('http://localhost:5000/api/recipes/substitutions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ingredient: 'butter'
  })
});
const data = await response.json();
console.log(data.substitutions); // ["oil", "coconut oil", ...]
```

---

## Testing API Endpoints

### Using Postman
1. Import endpoints into Postman
2. Set base URL to `http://localhost:5000`
3. Test each endpoint with different parameters
4. Save tests for future reference

### Using cURL
```bash
# Test health
curl http://localhost:5000/api/health

# Get all recipes
curl http://localhost:5000/api/recipes

# Generate recipes
curl -X POST http://localhost:5000/api/recipes/generate \
  -H "Content-Type: application/json" \
  -d '{"ingredients":["chicken"]}'
```

---

## API Response Time

Typical response times:
- Get all recipes: ~10ms
- Generate recipes: ~50ms
- Filter recipes: ~30ms
- Get substitutions: ~5ms

---

## API Limits (Current)

- No maximum payload size
- No authentication required
- No rate limiting
- No API key required

**Future security**: Add authentication, rate limiting, request validation

---

## Schema Definitions

### Recipe Object
```typescript
{
  id: number,
  name: string,
  cuisine: string,
  difficulty: "Easy" | "Medium" | "Hard",
  cookingTime: number,
  servings: number,
  ingredients: string[],
  instructions: string[],
  nutrition: {
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
    fiber: number
  },
  dietary: string[],
  imageUrl: string,
  tags: string[]
}
```

### User Preferences Object
```typescript
{
  dietary: string[],
  savedRecipes: Recipe[],
  ratings: { [recipeId: string]: number }
}
```

---

## Changelog

### Version 1.0.0
- Initial release
- 20 recipes included
- Core features (generate, filter, save, etc.)
- Substitution suggestions
- Image analysis (simulated)

---

## Support

For API issues:
1. Check this documentation
2. Review error messages
3. Check server logs: `npm start`
4. Verify JSON request format

---

**API Documentation Complete!** 🎉

For more info, see README.md and APPROACH.md
