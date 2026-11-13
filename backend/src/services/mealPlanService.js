const prisma = require('../utils/prismaClient');

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];

/**
 * Scores recipes based on how many of their growable ingredients
 * match the user's actively growing garden crops.
 * Uses gardenCropName for exact matching (case-insensitive).
 */
const scoreRecipes = (recipes, activeCropTitles) => {
  return recipes.map(recipe => {
    let score = 0;
    recipe.ingredients.forEach(ing => {
      if (
        ing.isGrowable &&
        ing.gardenCropName &&
        activeCropTitles.some(
          cropTitle => cropTitle.toLowerCase() === ing.gardenCropName.toLowerCase()
        )
      ) {
        score += 10; // Boost for each garden-matched ingredient
      }
    });
    return { ...recipe, score };
  }).sort((a, b) => b.score - a.score);
};

/**
 * Generates a fresh 7-day meal plan for the given userId.
 * Prioritises recipes with ingredients the user is actively growing.
 * Uses round-robin rotation per meal slot (breakfast/lunch/dinner) 
 * for variety across the week.
 */
const generateWeeklyMealPlan = async (userId) => {
  let user = await prisma.user.findUnique({
    where: { id: userId },
    include: { userGardenCrops: { include: { gardenGuide: true } } }
  });

  // If user not found (e.g. guest request), fall back to default patient
  if (!user) {
    user = await prisma.user.findFirst({
      where: { role: 'PATIENT' },
      include: { userGardenCrops: { include: { gardenGuide: true } } }
    });
  }

  if (!user) throw new Error('User not found. Please ensure database is seeded.');

  // Extract crop titles from the join table via gardenGuide relation
  const activeCropTitles = user.userGardenCrops.map(crop => crop.gardenGuide.title);

  let recipes = await prisma.recipe.findMany({
    where: { allowedPhase: user.currentPhase || 'PHASE_1' },
    include: { ingredients: true }
  });

  // Fallback if phase recipes are empty
  if (recipes.length === 0) {
    recipes = await prisma.recipe.findMany({
      include: { ingredients: true }
    });
  }

  if (recipes.length === 0) {
    throw new Error(`No recipes found in database. Please run the seed script.`);
  }

  const scoredRecipes = scoreRecipes(recipes, activeCropTitles);

  // Clear existing meal plan for a clean slate
  await prisma.mealPlan.deleteMany({ where: { userId } });

  const newMealPlan = [];

  // Separate indices per meal type for variety across the week
  const indices = { Breakfast: 0, Lunch: 0, Dinner: 0 };

  for (const dayOfWeek of DAYS) {
    for (const mealType of MEAL_TYPES) {
      // Offset lunch and dinner by position to avoid same recipe all day
      const baseOffset = mealType === 'Breakfast' ? 0
        : mealType === 'Lunch' ? 1
        : 2;
      const recipeIndex = (indices[mealType] + baseOffset) % scoredRecipes.length;
      const selectedRecipe = scoredRecipes[recipeIndex];

      const meal = await prisma.mealPlan.create({
        data: { userId, recipeId: selectedRecipe.id, dayOfWeek, mealType },
        include: {
          recipe: { include: { ingredients: true } }
        }
      });

      newMealPlan.push(meal);
      indices[mealType]++;
    }
  }

  // Attach garden-match metadata to each ingredient for the frontend
  return enrichWithGardenMatches(newMealPlan, activeCropTitles);
};

/**
 * Retrieves the existing weekly meal plan for the given userId.
 */
const getWeeklyMealPlan = async (userId) => {
  let user = await prisma.user.findUnique({
    where: { id: userId },
    include: { userGardenCrops: { include: { gardenGuide: true } } }
  });

  if (!user) {
    user = await prisma.user.findFirst({
      where: { role: 'PATIENT' },
      include: { userGardenCrops: { include: { gardenGuide: true } } }
    });
  }

  if (!user) return [];

  const activeCropTitles = user.userGardenCrops.map(crop => crop.gardenGuide.title);

  const mealPlan = await prisma.mealPlan.findMany({
    where: { userId: user.id },
    include: {
      recipe: { include: { ingredients: true } }
    },
    orderBy: [{ dayOfWeek: 'asc' }, { mealType: 'asc' }]
  });

  return enrichWithGardenMatches(mealPlan, activeCropTitles);
};

/**
 * Adds an `isActiveGardenCrop` boolean to each ingredient
 * so the frontend knows to highlight it with a leaf icon.
 */
const enrichWithGardenMatches = (mealPlan, activeCropTitles) => {
  return mealPlan.map(meal => ({
    ...meal,
    recipe: {
      ...meal.recipe,
      ingredients: meal.recipe.ingredients.map(ing => ({
        ...ing,
        isActiveGardenCrop:
          ing.isGrowable &&
          ing.gardenCropName &&
          activeCropTitles.some(
            cropTitle => cropTitle.toLowerCase() === ing.gardenCropName.toLowerCase()
          )
      }))
    }
  }));
};

module.exports = {
  generateWeeklyMealPlan,
  getWeeklyMealPlan
};
