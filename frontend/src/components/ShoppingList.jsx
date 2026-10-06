import React, { useMemo, useState } from 'react';
import { Leaf, ShoppingBag, CheckCircle2, Circle, Sprout } from 'lucide-react';

const ShoppingList = ({ mealPlan = [] }) => {
  const [checkedItems, setCheckedItems] = useState(new Set());

  const { harvestFromGarden, buyAtSoko } = useMemo(() => {
    const seen = new Set();
    const harvestFromGarden = [];
    const buyAtSoko = [];

    mealPlan.forEach(meal => {
      if (!meal.recipe?.ingredients) return;
      meal.recipe.ingredients.forEach(ing => {
        const key = ing.name.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          if (ing.isGrowable) {
            harvestFromGarden.push(ing);
          } else {
            buyAtSoko.push(ing);
          }
        }
      });
    });

    return { harvestFromGarden, buyAtSoko };
  }, [mealPlan]);

  const toggleCheck = (name) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const totalItems = harvestFromGarden.length + buyAtSoko.length;
  const checkedCount = checkedItems.size;

  if (mealPlan.length === 0) return null;

  const IngredientRow = ({ ing, accentColor }) => {
    const key = ing.name.toLowerCase();
    const isChecked = checkedItems.has(key);
    return (
      <li>
        <button
          onClick={() => toggleCheck(key)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
            isChecked
              ? 'bg-surface-50 opacity-60'
              : accentColor === 'garden'
                ? 'bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100'
                : 'bg-slate-50/50 hover:bg-slate-50 border border-surface-200'
          }`}
        >
          <span className="flex-shrink-0 text-slate-400 group-hover:text-slate-600 transition-colors">
            {isChecked
              ? <CheckCircle2 size={20} className={accentColor === 'garden' ? 'text-emerald-500' : 'text-brand'} />
              : <Circle size={20} />
            }
          </span>
          <span className={`flex-1 text-sm font-medium ${isChecked ? 'line-through text-slate-400' : accentColor === 'garden' ? 'text-emerald-800' : 'text-slate-700'}`}>
            {ing.name}
          </span>
          {ing.isActiveGardenCrop && !isChecked && (
            <span className="text-xs font-bold text-brand bg-brand-light px-2 py-0.5 rounded-full border border-brand/20 flex items-center gap-1 flex-shrink-0">
              <Sprout size={11} /> Active
            </span>
          )}
          {ing.isGrowable && !ing.isActiveGardenCrop && !isChecked && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
              <Leaf size={11} /> Growable
            </span>
          )}
        </button>
      </li>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-surface-200 rounded-2xl p-6 md:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Weekly Shopping List</h2>
          <p className="text-slate-500 text-sm mt-1">Tap items to check them off as you gather them</p>
        </div>
        {/* Progress pill */}
        <div className="flex items-center gap-2 bg-surface-50 border border-surface-200 px-4 py-2 rounded-xl">
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="#0d9488" strokeWidth="3.5"
                strokeDasharray={`${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0} 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-600">
              {checkedCount}/{totalItems}
            </span>
          </div>
          <span className="text-sm font-semibold text-slate-600">
            {checkedCount === totalItems && totalItems > 0 ? '🎉 All done!' : 'Collected'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Harvest from Garden */}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-emerald-700 mb-4">
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <Leaf size={18} />
            </div>
            Harvest from Garden
            <span className="ml-auto text-sm font-normal text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
              {harvestFromGarden.length}
            </span>
          </h3>
          {harvestFromGarden.length > 0 ? (
            <ul className="space-y-2">
              {harvestFromGarden.map((ing) => (
                <IngredientRow key={ing.name} ing={ing} accentColor="garden" />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-emerald-50/30 rounded-xl border border-dashed border-emerald-100">
              <Leaf size={32} className="text-emerald-200 mb-2" />
              <p className="text-sm text-slate-400 italic">Nothing to harvest this week.</p>
            </div>
          )}
        </div>

        {/* Buy at the Soko/Market */}
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-700 mb-4">
            <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
              <ShoppingBag size={18} />
            </div>
            Buy at the Soko/Market
            <span className="ml-auto text-sm font-normal text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
              {buyAtSoko.length}
            </span>
          </h3>
          {buyAtSoko.length > 0 ? (
            <ul className="space-y-2">
              {buyAtSoko.map((ing) => (
                <IngredientRow key={ing.name} ing={ing} accentColor="market" />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-xl border border-dashed border-surface-300">
              <ShoppingBag size={32} className="text-slate-200 mb-2" />
              <p className="text-sm text-slate-400 italic">Nothing to buy — your garden covers everything! 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;
