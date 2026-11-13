const mealPlanService = require('../services/mealPlanService');

/**
 * Resolves the appropriate target user ID based on authentication status and request parameters.
 */
const resolveTargetUserId = (req) => {
  const paramId = req.params?.userId;

  if (req.user) {
    // Authenticated: map 'me', 'mock-user-id' (guest fallback), or empty param to the user's own ID
    if (!paramId || paramId === 'me' || paramId === 'mock-user-id') {
      return { targetUserId: req.user.userId, isAuthorized: true };
    }
    // Authenticated user accessing another user's plan: only ADMIN permitted
    if (req.user.userId !== paramId && req.user.role !== 'ADMIN') {
      return { targetUserId: paramId, isAuthorized: false };
    }
    return { targetUserId: paramId, isAuthorized: true };
  }

  // Guest / unauthenticated: allow sample plan preview via 'mock-user-id' or 'guest'
  const guestId = paramId && paramId !== 'me' ? paramId : 'mock-user-id';
  return { targetUserId: guestId, isAuthorized: true };
};

/**
 * GET /api/meal-plan or /api/meal-plan/:userId
 * Returns the existing weekly meal plan. If none exists, generates one automatically.
 */
const getWeeklyMealPlan = async (req, res) => {
  try {
    const { targetUserId, isAuthorized } = resolveTargetUserId(req);

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Unauthorized to access this meal plan' });
    }

    let mealPlan = await mealPlanService.getWeeklyMealPlan(targetUserId);

    // Auto-generate if no plan exists yet
    if (!mealPlan || mealPlan.length === 0) {
      mealPlan = await mealPlanService.generateWeeklyMealPlan(targetUserId);
    }

    res.status(200).json({ mealPlan });
  } catch (error) {
    console.error('Error in getWeeklyMealPlan:', error);
    const statusCode = error.message.includes('No recipes found') ? 404 : 500;
    res.status(statusCode).json({ error: error.message || 'Failed to fetch meal plan' });
  }
};

/**
 * POST /api/meal-plan/generate or /api/meal-plan/:userId/generate
 * Explicitly triggers a fresh meal plan generation, replacing any existing plan.
 */
const generateMealPlan = async (req, res) => {
  try {
    const { targetUserId, isAuthorized } = resolveTargetUserId(req);

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Unauthorized to generate this meal plan' });
    }

    const mealPlan = await mealPlanService.generateWeeklyMealPlan(targetUserId);
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
