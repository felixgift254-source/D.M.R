const mealPlanService = require('../services/mealPlanService');

/**
 * GET /api/meal-plan/:userId
 * Returns the existing weekly meal plan. If none exists, generates one automatically.
 */
const getWeeklyMealPlan = async (req, res) => {
  try {
    const { userId } = req.params;

    // Patients can only access their own meal plan; admins can see any
    if (req.user.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized to access this meal plan' });
    }

    let mealPlan = await mealPlanService.getWeeklyMealPlan(userId);

    // Auto-generate if no plan exists yet
    if (!mealPlan || mealPlan.length === 0) {
      mealPlan = await mealPlanService.generateWeeklyMealPlan(userId);
    }

    res.status(200).json({ mealPlan });
  } catch (error) {
    console.error('Error in getWeeklyMealPlan:', error);
    const statusCode = error.message.includes('No recipes found') ? 404 : 500;
    res.status(statusCode).json({ error: error.message || 'Failed to fetch meal plan' });
  }
};

/**
 * POST /api/meal-plan/:userId/generate
 * Explicitly triggers a fresh meal plan generation, replacing any existing plan.
 * Separated from GET so the service worker can cache GET without caching generate calls.
 */
const generateMealPlan = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.userId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized to generate this meal plan' });
    }

    const mealPlan = await mealPlanService.generateWeeklyMealPlan(userId);
    res.status(201).json({ mealPlan, message: 'New 7-day meal plan generated successfully!' });
  } catch (error) {
    console.error('Error in generateMealPlan:', error);
    const statusCode = error.message.includes('No recipes found') ? 404 : 500;
    res.status(statusCode).json({ error: error.message || 'Failed to generate meal plan' });
  }
};

module.exports = {
  getWeeklyMealPlan,
  generateMealPlan
};
