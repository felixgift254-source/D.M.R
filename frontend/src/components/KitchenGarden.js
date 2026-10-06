import React, { useState, useEffect } from 'react';
import { Sprout, Sun, Droplets, BookOpen, Calendar, Clock, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const KitchenGarden = () => {
  const [activeTab, setActiveTab] = useState('library'); // 'library' or 'my-garden'
  const [guides, setGuides] = useState([]);
  const [myCrops, setMyCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authFetch } = useAuth();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'library') {
        // Garden library is public — no auth needed
        const res = await fetch('/api/garden');
        const data = await res.json();
        setGuides(data);
      } else {
        const res = await authFetch('/api/garden/my-crops');
        if (res.ok) {
          const data = await res.json();
          setMyCrops(data);
        }
      }
    } catch (error) {
      console.error('Failed to load garden data', error);
    } finally {
      setLoading(false);
    }
  };

  const startGrowing = async (guideId) => {
    try {
      const res = await authFetch('/api/garden/plant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gardenGuideId: guideId, plantingDate: new Date() })
      });
      if (res.ok) {
        alert('Successfully added to your garden planner!');
        setActiveTab('my-garden');
      }
    } catch (error) {
      console.error('Failed to start growing', error);
    }
  };

  const calculateDaysRemaining = (expectedHarvestDate) => {
    if (!expectedHarvestDate) return 'Unknown';
    const today = new Date();
    const harvestDate = new Date(expectedHarvestDate);
    const diffTime = harvestDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Ready to harvest!';
    return `${diffDays} days remaining`;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-surface-200 p-6 md:p-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Sprout size={24} />
            </div>
            Garden Planner
          </h2>
          <p className="text-slate-500 mt-2 text-sm">Plan, plant, and track your low-carb veggies.</p>
        </div>

        <div className="flex bg-surface-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'library' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <BookOpen size={16} /> Guide Library
          </button>
          <button
            onClick={() => setActiveTab('my-garden')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'my-garden' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Calendar size={16} /> My Garden
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="grid gap-5 md:grid-cols-2">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="border border-surface-200 rounded-xl p-5 bg-surface-50 animate-pulse">
              <div className="h-6 bg-surface-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-surface-200 rounded w-full"></div>
                <div className="h-4 bg-surface-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'library' ? (
        <div className="grid gap-5 md:grid-cols-2">
          {guides.map(guide => (
            <div key={guide.id} className="group border border-emerald-100 rounded-xl p-6 bg-gradient-to-br from-white to-emerald-50/30 hover:shadow-md hover:border-emerald-300 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-4 -bottom-4 text-emerald-100 opacity-50 transform group-hover:scale-110 transition-transform duration-500">
                <Sprout size={100} />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{guide.title}</h3>
                <p className="text-slate-600 text-sm mb-4">{guide.description}</p>
                <div className="space-y-2 text-sm text-slate-600 bg-white/60 p-4 rounded-lg border border-emerald-50">
                  <p className="flex items-start gap-2"><Sun size={16} className="text-amber-500 mt-0.5 shrink-0"/> <span><strong>Conditions:</strong> {guide.growingConditions || 'Not specified'}</span></p>
                  <p className="flex items-start gap-2"><Sprout size={16} className="text-emerald-500 mt-0.5 shrink-0"/> <span><strong>Method:</strong> {guide.plantingMethods || 'Not specified'}</span></p>
                  <p className="flex items-start gap-2"><Heart size={16} className="text-rose-400 mt-0.5 shrink-0"/> <span><strong>Companions:</strong> {guide.companionPlants || 'Not specified'}</span></p>
                  <p className="flex items-start gap-2"><Clock size={16} className="text-blue-500 mt-0.5 shrink-0"/> <span><strong>Harvest in:</strong> {guide.timeToHarvest}</span></p>
                </div>
              </div>
              <button 
                onClick={() => startGrowing(guide.id)}
                className="mt-6 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors relative z-10 shadow-sm flex items-center justify-center gap-2"
              >
                <Sprout size={18} /> Start Growing
              </button>
            </div>
          ))}
          {guides.length === 0 && (
            <div className="col-span-full py-8 text-center text-slate-500 bg-surface-50 rounded-xl border border-dashed border-surface-300">
              No garden guides available.
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {myCrops.map(crop => (
            <div key={crop.id} className="border border-emerald-200 rounded-xl p-6 bg-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-800">{crop.gardenGuide.title}</h3>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wide">
                    {crop.status}
                  </span>
                </div>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between border-b border-surface-100 pb-2">
                    <span className="text-slate-500">Planted On</span>
                    <span className="font-medium text-slate-800">{new Date(crop.plantingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-surface-100 pb-2">
                    <span className="text-slate-500">Est. Harvest</span>
                    <span className="font-medium text-slate-800">{crop.expectedHarvestDate ? new Date(crop.expectedHarvestDate).toLocaleDateString() : 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500">Status</span>
                    <span className="font-bold text-emerald-600">{calculateDaysRemaining(crop.expectedHarvestDate)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-surface-100">
                 <p className="text-xs text-slate-500 italic flex items-center gap-2">
                    <Heart size={14} className="text-rose-400"/> Companions: {crop.gardenGuide.companionPlants || 'None listed'}
                 </p>
              </div>
            </div>
          ))}
          {myCrops.length === 0 && (
            <div className="col-span-full py-12 text-center flex flex-col items-center justify-center text-slate-500 bg-surface-50 rounded-xl border border-dashed border-surface-300">
              <Sprout size={48} className="text-emerald-200 mb-4" />
              <p className="text-lg font-medium text-slate-700">Your garden is empty</p>
              <p className="mt-1 mb-4">Head over to the Guide Library to start growing.</p>
              <button 
                onClick={() => setActiveTab('library')}
                className="px-6 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg font-medium transition-colors"
              >
                Browse Library
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KitchenGarden;
