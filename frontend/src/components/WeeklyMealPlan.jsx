import React, { useState, useEffect, useCallback } from 'react';
import { Leaf, RefreshCw, ChevronLeft, ChevronRight, Utensils, AlertCircle } from 'lucide-react';
import ShoppingList from './ShoppingList';
import { useAuth } from '../context/AuthContext';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];
const MEAL_ICONS = { Breakfast: '🌅', Lunch: '☀️', Dinner: '🌙' };
const CARB_BADGE_COLOR = (carbs) => {
  if (carbs <= 10) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (carbs <= 25) return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-rose-100 text-rose-700 border-rose-200';
};

const WeeklyMealPlan = () => {
  const { user, authFetch } = useAuth();
  const [mealPlan, setMealPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState(0);

  const targetUserId = user?.id || 'mock-user-id';

  const fetchMealPlan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch(`/api/meal-plan/${targetUserId}`);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to fetch meal plan. Is the backend running?');
      }
      const data = await response.json();
      setMealPlan(data.mealPlan || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [targetUserId, authFetch]);

  const generatePlan = async () => {
    setGenerating(true);
    setError(null);
    try {
      const response = await authFetch(`/api/meal-plan/${targetUserId}/generate`, {
        method: 'POST'
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate meal plan');
      }
      const data = await response.json();
      setMealPlan(data.mealPlan || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchMealPlan();
  }, [fetchMealPlan]);

  const mealsByDay = DAYS.reduce((acc, day) => {
    acc[day] = mealPlan.filter(m => m.dayOfWeek === day);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="bg-white/80 backdrop-blur-sm border border-surface-200 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-accent to-brand"></div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Weekly Meal Plan</h2>
            <p className="text-slate-500 text-sm mt-1">Phase-aware, garden-to-plate meals for your week</p>
          </div>
          <button
            onClick={generatePlan}
            disabled={generating || loading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand to-brand-dark text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
          >
            <RefreshCw size={18} className={generating ? 'animate-spin' : ''} />
            {generating ? 'Generating…' : 'Regenerate Plan'}
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !error && (
        <div className="bg-white/80 backdrop-blur-sm border border-surface-200 rounded-2xl p-6 shadow-sm animate-pulse">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {DAYS.map((_, i) => (
              <div key={i} className="h-10 w-24 bg-surface-200 rounded-xl flex-shrink-0"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="border border-surface-200 rounded-xl p-5 bg-surface-50">
                <div className="h-5 bg-surface-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-surface-200 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-surface-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && mealPlan.length === 0 && (
        <div className="bg-white/80 backdrop-blur-sm border border-surface-200 rounded-2xl p-12 shadow-sm text-center">
          <Utensils size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg font-medium mb-2">No meal plan yet</p>
          <p className="text-slate-400 text-sm mb-6">Click "Regenerate Plan" to create your personalized 7-day schedule</p>
          <button
            onClick={generatePlan}
            disabled={generating}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand to-brand-dark text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
          >
            <RefreshCw size={18} className={generating ? 'animate-spin' : ''} />
            Create My Plan
          </button>
        </div>
      )}

      {/* 7-Day Calendar View */}
      {!loading && !error && mealPlan.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm border border-surface-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Day Tab Navigation */}
          <div className="border-b border-surface-200 px-4 pt-4">
            <div className="flex gap-1 overflow-x-auto pb-0 scrollbar-hide">
              {DAYS.map((day, index) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(index)}
                  className={`flex-shrink-0 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all duration-200 border-b-2 ${
                    activeDay === index
                      ? 'border-brand text-brand bg-brand-light/50'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-surface-50'
                  }`}
                >
                  <span className="hidden sm:block">{day}</span>
                  <span className="sm:hidden">{day.slice(0, 3)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Day Navigation Arrows + Content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setActiveDay(d => (d - 1 + DAYS.length) % DAYS.length)}
                className="p-2 rounded-xl border border-surface-200 hover:bg-surface-100 hover:border-brand/30 transition-all duration-200"
                aria-label="Previous day"
              >
                <ChevronLeft size={18} className="text-slate-500" />
              </button>
              <h3 className="text-xl font-bold text-slate-800">{DAYS[activeDay]}</h3>
              <button
                onClick={() => setActiveDay(d => (d + 1) % DAYS.length)}
                className="p-2 rounded-xl border border-surface-200 hover:bg-surface-100 hover:border-brand/30 transition-all duration-200"
                aria-label="Next day"
              >
                <ChevronRight size={18} className="text-slate-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {MEAL_TYPES.map(mealType => {
                const meal = mealsByDay[DAYS[activeDay]]?.find(m => m.mealType === mealType);
                const recipe = meal?.recipe;
                return (
                  <div
                    key={mealType}
                    className="border border-surface-200 rounded-xl p-5 bg-white hover:shadow-md hover:border-brand/20 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{MEAL_ICONS[mealType]}</span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">{mealType}</h4>
                      </div>
                      {recipe && (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${CARB_BADGE_COLOR(recipe.carbsPerServing)}`}>
                          {recipe.carbsPerServing}g carbs
                        </span>
                      )}
                    </div>

                    {recipe ? (
                      <>
                        <p className="font-bold text-slate-800 text-base mb-1 group-hover:text-brand transition-colors">{recipe.name}</p>
                        <p className="text-slate-500 text-xs mb-4 leading-relaxed line-clamp-2">{recipe.description}</p>
                        <ul className="space-y-1.5">
                          {recipe.ingredients.map(ing => (
                            <li
                              key={ing.id}
                              className={`flex items-center text-sm gap-2 py-0.5 ${ing.isActiveGardenCrop ? 'text-brand-dark font-semibold' : 'text-slate-600'}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ing.isActiveGardenCrop ? 'bg-brand' : 'bg-slate-300'}`}></span>
                              {ing.name}
                              {ing.isActiveGardenCrop && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-brand bg-brand-light px-1.5 py-0.5 rounded-full border border-brand/20 ml-auto flex-shrink-0">
                                  <Leaf size={11} />
                                  Growing
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p className="text-sm text-slate-400 italic mt-2">No meal assigned</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Day Progress Dots */}
          <div className="flex justify-center gap-1.5 pb-4">
            {DAYS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${i === activeDay ? 'bg-brand w-4' : 'bg-surface-300 hover:bg-surface-400'}`}
                aria-label={`Go to ${DAYS[i]}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Shopping List Below */}
      {!loading && mealPlan.length > 0 && <ShoppingList mealPlan={mealPlan} />}
    </div>
  );
};

export default WeeklyMealPlan;
